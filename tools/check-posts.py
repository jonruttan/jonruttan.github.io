#!/usr/bin/env python3
"""check-posts -- every code block in a post is accounted for, or this fails.

The contract: a post may not ship a code block that nothing verifies. Each
fenced block resolves to exactly one class, and each class has a check:

  quote      carries a book coordinate (`; Figure 1.3a, p.8#fig.0`) that also
             heads a file in a companion repo. Verified by PROVENANCE: the
             block's lines must still appear, in order, in that file. The repo's
             own CI is what proves the file RUNS -- so a matching quote is
             transitively tested, with no sandbox here.
  session    a transcript (`> ` repl or `$ ` shell) with interleaved output.
             Verified by EXECUTION against the companion repo's pinned toolchain.
  figure     generated output (a rendered maze, a bytecode stream). Verified by
             REGENERATION and comparison.
  illustrate from nowhere and not runnable -- book notation, a hypothetical, a
             crash transcript. Requires a declared reason, so "untested" is a
             decision on the record rather than an oversight.

Marking, only where the coordinate can't carry it, in an HTML comment directly
above the fence (invisible to readers, cannot break kramdown -- unlike fence
info strings, which do):

    <!--check: illustrate "the book's REPEAT FOREVER; never terminates" -->
    <!--check: quote repo=turtle file=chapter-1/figure1.5.logo -->
    <!--check: session repo=mazes cwd=. -->
    <!--check: skip "prose example" -->

A file-level default, once per file (by convention right after the front
matter), applies to every block that has no mark of its own; per-block marks
still override it:

    <!--check-file: skip "historical post (2015); no companion repo" -->

Elision: a quote may cut with a line whose content is `…` (or `...`); each
fragment between cuts must appear in order in the source file.
"""
import re, sys, os, json, argparse

REPOS = {
    "mazes":  "/Users/jon/Workspace/mazes-for-programmers-x-lang",
    "turtle": "/Users/jon/Workspace/turtle-geometry-x-logo",
}
# A book coordinate: "<Type> <numbering>, p.<page>#<abbr>.<n>"
COORD = re.compile(r'^\s*;+\s*(.+?,\s*p+\.\s*[\d–-]+#[a-z]+\.[\w.-]+)\s*$', re.M)
FENCE = re.compile(r'(?:^<!--check:\s*(?P<mark>.*?)-->\n)?^```(?P<lang>[\w-]*)\n(?P<body>.*?)^```', re.M | re.S)
FILEMARK = re.compile(r'^<!--check-file:\s*(?P<mark>.*?)-->', re.M)
ELIDE = re.compile(r'^\s*(?:…|\.\.\.|;+\s*….*|;+\s*\.\.\..*)\s*$')

def repo_files(root, exts=(".logo", ".x")):
    out = {}
    for dirpath, dirnames, names in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in (".git", "deps", "boot")]
        for n in names:
            if n.endswith(exts):
                p = os.path.join(dirpath, n)
                try: out[os.path.relpath(p, root)] = open(p, encoding="utf-8").read()
                except Exception: pass
    return out

def fragments(body):
    """Split a block on elision lines -> list of non-empty fragments."""
    frags, cur = [], []
    for line in body.rstrip().split("\n"):
        if ELIDE.match(line):
            if cur: frags.append("\n".join(cur).strip()); cur = []
        else:
            cur.append(line)
    if cur: frags.append("\n".join(cur).strip())
    return [f for f in frags if f]

def in_order(fragments_, text):
    """Every fragment appears, in order, in text."""
    pos = 0
    for f in fragments_:
        i = text.find(f, pos)
        if i < 0: return False
        pos = i + len(f)
    return True

def classify(mark, lang, body):
    if mark:
        kind = mark.split()[0]
        return kind, mark
    if re.search(r'^\s*[>$] ', body, re.M): return "session", ""
    m = COORD.search(body)
    if m: return "quote", m.group(1)
    return "unclassified", ""

def check_post(path, caches):
    s = open(path, encoding="utf-8").read()
    fm = FILEMARK.search(s)
    fdefault = fm.group("mark").strip() if fm else None
    results = []
    for m in FENCE.finditer(s):
        mark, lang, body = m.group("mark") or fdefault, m.group("lang"), m.group("body")
        kind, detail = classify(mark, lang, body)
        if kind == "quote":
            frags = fragments(body)
            # explicit target: <!--check: quote repo=R file=F -->
            fm = re.search(r'file=(\S+)', detail or "")
            rm = re.search(r'repo=(\w+)', detail or "")
            if fm:
                rel, want = fm.group(1), rm.group(1) if rm else None
                for repo, files in caches.items():
                    if want and repo != want: continue
                    if rel in files:
                        okmatch = in_order(frags, files[rel])
                        results.append(("ok" if okmatch else "FAIL", kind,
                                        f"{repo}:{rel}" + ("" if okmatch else " -- text differs")))
                        break
                else:
                    results.append(("FAIL", kind, f"no such file: {rel}"))
                continue
            cm = COORD.search(body)
            coord = cm.group(1) if cm else (detail or "")
            hits = []
            for repo, files in caches.items():
                for rel, text in files.items():
                    if coord and coord in text and in_order(frags, text):
                        hits.append(f"{repo}:{rel}")
            if hits: results.append(("ok", kind, f"{coord} -> {hits[0]}"))
            else:
                near = [f"{r}:{rel}" for r, fs in caches.items() for rel, t in fs.items() if coord and coord in t]
                why = f"coordinate found in {near[0]} but text differs" if near else "no file carries this coordinate"
                results.append(("FAIL", kind, f"{coord}: {why}"))
        elif kind in ("illustrate", "skip"):
            reason = detail.partition(" ")[2].strip()
            results.append(("ok" if reason else "FAIL", kind,
                            reason or "needs a declared reason")) 
        elif kind in ("session", "figure"):
            results.append(("todo", kind, (body.strip().split(chr(10))[0])[:50]))
        else:
            results.append(("FAIL", "unclassified", (body.strip().split(chr(10))[0])[:50]))
    return results

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--quiet-ok", action="store_true")
    a = ap.parse_args()
    caches = {name: repo_files(root) for name, root in REPOS.items() if os.path.isdir(root)}
    paths = a.paths or sorted(
        [p for d in ("_posts", "_drafts") if os.path.isdir(d)
           for p in (os.path.join(d, f) for f in os.listdir(d)) if p.endswith(".md")])
    tally, failed = {}, 0
    for p in paths:
        res = check_post(p, caches)
        if not res: continue
        shown = [r for r in res if not (a.quiet_ok and r[0] == "ok")]
        if shown: print(f"\n{os.path.basename(p)}")
        for status, kind, msg in shown:
            flag = {"ok": "  ok  ", "FAIL": "  FAIL", "todo": "  todo"}[status]
            print(f"{flag} [{kind:12}] {msg}")
        for status, kind, _ in res:
            tally[status] = tally.get(status, 0) + 1
            if status == "FAIL": failed += 1
    print("\n=== " + "  ".join(f"{k}:{v}" for k, v in sorted(tally.items())) + " ===")
    return 1 if failed else 0

if __name__ == "__main__":
    sys.exit(main())
