# Testing the code in a post

A post that shows code makes a promise: this ran. Nothing checked that promise,
and the two series have drifted from their repos before — a listing edited in
the post but not the repo reads as working code that nothing has ever run.

`tools/check-posts.py` is the gate. It runs on drafts as well as posts, so a
post is verified *before* it goes live rather than corrected after.

## The shape of the problem

An inventory of the two series (105 fenced blocks) says the hard case is rare:

| kind | count |
|---|---|
| code listings | 79 |
| excerpts with elisions | 10 |
| bare fences (file contents, rendered figures) | 6 |
| shell sessions | 5 |
| REPL transcripts | 4 |
| generated data (bytecode) | 1 |

The dominant case isn't "run this snippet." It's "this listing should still be
the file it came from."

## The core move: posts don't run code, repos do

Each series has a companion repo whose CI already installs a pinned toolchain
and runs everything in it. So a block that **provably still matches a repo file**
is transitively tested — by that repo's CI, on every push, on Linux — and this
checker never needs a sandbox for it.

That turns the expensive question ("does this code work?") into a cheap one
("is this still the code?"), for 79 of 105 blocks.

## The join key already exists

Every code block in these series carries a book coordinate, and so does every
file in the repos:

```
; Figure 1.3a, p.8#fig.0          <- in the post
; Figure 1.3a, p.8#fig.0          <- first line of chapter-1/figure1.3a.logo
```

The addressing scheme built for human cross-referencing doubles as a
machine-checkable provenance key. **No new syntax for the common case.**

## The four classes

Every block resolves to exactly one, and "unclassified" is a failure — the
point is that untested code cannot ship by accident.

- **quote** — carries a coordinate; must still appear, in order, in the file
  that carries that coordinate. Two distinct diagnoses when it doesn't:
  *coordinate found but text differs* (drift) vs *no file carries it* (the post
  is ahead of the repo, or the code lives nowhere).
- **session** — a `>` REPL or `$` shell transcript. Executed against the
  companion repo's pinned toolchain, output compared.
- **figure** — generated output (a rendered maze, a bytecode stream).
  Regenerated and compared.
- **illustrate** — from nowhere and not runnable: book notation the language
  can't execute, a hypothetical, a crash. Requires a stated reason, so
  "untested" is a recorded decision rather than an oversight.

## Marking, only where the coordinate can't carry it

An HTML comment directly above the fence — invisible to readers, and it cannot
break rendering:

```
<!--check: illustrate "the book's REPEAT FOREVER; never terminates" -->
<!--check: quote repo=turtle file=chapter-1/figure1.5.logo -->
<!--check: session repo=mazes -->
<!--check: skip "prose example" -->
```

Fence info strings (```` ```logo file=… ````) were tried and rejected: kramdown
stops recognizing the language and the block loses highlighting. Kramdown IALs
attach to the wrong element. The comment is the only form that survives.

## One convention, two jobs: `…`

The posts already write `…` where something is cut or volatile:

```
pinned: …/mazes-for-programmers-x-lang/pin.xon
  ; …south, east, west…
```

So `…` means the same thing to the checker in both roles: *something goes here
that I am not asserting*. In a **quote** it separates fragments, each of which
must appear in order in the source. In a **session** it masks a volatile span
of output — an absolute path, a truncated digest, a timing. Nothing new to
learn, and it's already what the prose does.

## Sessions: the remaining hard part

Nine blocks, and the only ones needing execution.

- **Chaining.** Sessions in a post share a working directory in order, so a
  post can build state across blocks. `session=NAME` starts a separate one.
- **Where.** In the companion repo at the commit and toolchain the post names —
  the same pin the post is usually *about*.
- **Expected failure is normal.** A block whose expected output is a refusal
  passes when it produces that refusal. The check is output, not exit status.
- **What stays out.** Reproducing a crash on purpose is not a build step; a
  segfault transcript is `illustrate`.

## Adoption

Do not retrofit 105 blocks. Gate the frontier and grandfather the past:

1. New and in-flight posts must be clean.
2. The 2024 Racket posts (`turtle-geometry-racket`) are a retired route — either
   add that repo to the scan or mark them `illustrate` as the historical record.
3. Unrelated posts (e.g. micro-minesweeper's C) get `skip` with a reason.

Then wire it ahead of deploy, so a red checker blocks publication the way a red
CI blocks a merge.

## Honest limits

- Provenance proves the code is *the repo's code*; the repo's CI is what proves
  it runs. Both halves are needed, and the second is not this tool's job.
- Prose claims around a block ("twenty seconds", "seventeen checks") are not
  checked. A number in prose is still a promise made on trust.
- Hand-made figures — the ASCII mazes carved by coin in 1.1 — assert what an
  algorithm *would* produce. They become checkable when the algorithm exists,
  by regenerating them; until then they are `illustrate`.
