---
layout: post
title:  "Mazes for Programmers: 0.2 Setting Up the Repo"
categories: mazes-for-programmers
excerpt_separator: <!--more-->
---
Before I can write about carving mazes, the code needs somewhere to live.

No mazes this post, just the setup.

<!--more-->

{% include mazes-for-programmers/preamble.md %}

---

# 0.2 Setting Up the Repo

## Why a repo, and not just a folder

Tidiness isn't the main reason. History is.

A book doesn't present its code once. It builds it up a piece at a time, showing only what changed, and now and then it goes back and rewrites something. The `Grid` that was enough for chapter 2 gets reworked in chapter 3, when solving needs more from it. A folder only shows the final state of `grid.x`. I want the whole history of how it changed, and that's what version control is for.

So the repo follows one rule: every step in the book that changes the code is a commit, and the commit message records where in the book it came from. I'm using x-lang's commit convention — `type(scope): subject` — and adding the book's location as a footer:

```
feat(binary-tree): carve a passage north or east from each cell

Book: Algorithm 1.1.0, p.6#alg.0
```

The address has the book on the left and me on the right: `[book's convention], p.[page]#[my convention].[index]`. Every book labels things its own way — one has `Fig. 1.2`, another `Image 0.2`, some don't label at all — so the left half uses the book's own convention, and where the book has none I fill the gap: *Mazes* doesn't number its algorithms, so `Algorithm 1.1.0` is chapter 1's first, step zero. The right half is mine and never varies — `alg.0` is the first algorithm on page 6. Every commit points into the book, and the book points back.

Then `git log --follow maze/grid.x` replays how the `Grid` grew, and a post about a rewrite is a diff between two of those commits — the same "here's what changed" the book itself relies on.

> **Update (2026-08-11):** this mechanism got an upgrade after the post was written. Module files now wear their book chapter in the filename — `grid@1.2.x` is chapter 2's grid — so a chapter's rewrite lands *beside* its predecessor instead of over it: versions visible in the tree itself, no archaeology required. The commit convention above is unchanged. Details arrive with chapter 2's posts.

That's also why the repo starts empty. The tempting way to begin — write the code, commit it once it works — would throw the history away before it started: `grid.x` would enter the log complete, in one commit, final state. So the repo opens with no maze code at all, and each post brings code in as the book builds it.

## The shape of it

What the first commit does contain is structure:

```
mazes-for-programmers-x-lang/
├── maze/              # source, namespace maze/…
│   └── algorithm/     # the carvers, as the book adds them
├── tests/             # per-chapter checks
├── README.md
└── LICENSE            # MIT-0, same as x-lang
```

Two decisions are baked in here:

- **Modules are namespaced, not glued together with relative includes.** `grid.x` will provide `maze/grid` and be imported as `(import maze/grid)` — the same shape x-lang's own applications use.
- **The carvers get their own directory.** By the end of the book there are around a dozen of them; they live under `maze/algorithm/`, with hyphenated filenames (`binary-tree.x`, later `hunt-and-kill.x`) following the library's own naming.

## A home

The repo is public: [mazes-for-programmers-x-lang](https://github.com/jonruttan/mazes-for-programmers-x-lang), licensed [MIT No Attribution](https://github.com/jonruttan/mazes-for-programmers-x-lang/blob/main/LICENSE) to match x-lang. What's there today is the scaffold — the tree and the conventions — plus one more commit: the next post's subject.

## Next

The code that lands here will run on x-lang, and x-lang moves — the language itself, and the library modules the code will import. Before the first algorithm goes in, I want the floor it stands on frozen. Next post: pinning.

---
---
