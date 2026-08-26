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

## The Repo

The series' code lives in a public repo: [mazes-for-programmers-x-lang](https://github.com/jonruttan/mazes-for-programmers-x-lang), licensed [MIT No Attribution](https://github.com/jonruttan/mazes-for-programmers-x-lang/blob/main/LICENSE) to match x-lang. The first commit is just the directory structure:

<!--check: illustrate "a hand-drawn snapshot of the first commit's layout; the repo has since grown past it" -->
```
mazes-for-programmers-x-lang/
├── maze/              # source, namespace maze/…
│   └── algorithm/     # the carvers, as the book adds them
├── tests/             # per-chapter checks
├── README.md
└── LICENSE            # MIT-0, same as x-lang
```

The source goes under `maze/`, with the maze-generation algorithms in a directory of their own at `maze/algorithm/` — there are around a dozen of them by the end of the book. Each post adds code as the book introduces it.

## Chapter-Versioned Files

The book reworks its code as it goes — the `Grid` that's enough for chapter 2 gets rebuilt in chapter 3, when solving needs more from it. To keep every stage runnable, each version is its own file: the name carries the chapter, so `grid@1.2.x` is chapter 2's grid, providing `maze/grid`, and chapter 3's rebuild goes in beside it as `grid@1.3.x` rather than replacing it. Code imports the chapter it wants — `(import-version-once maze/grid "1.2.*")` — so old posts keep working as new ones land, and a rewrite can be read as a diff between the two files.

## Commit Addresses

Each commit records where in the book its change came from. The book doesn't label its algorithms, so I've settled on a simple address: the book's own name for the thing where it has one, the page number, and a counter for the position on the page. Here's the shape of a commit message, using the first algorithm in the book:

<!--check: illustrate "a mock commit message showing the convention; there is nothing to check it against" -->
```
feat(binary-tree): carve a passage north or east from each cell

Book: Algorithm 1.1.0, p.6#alg.0
```

`Algorithm 1.1.0` is chapter 1's first algorithm, and `p.6#alg.0` says it's the first algorithm on page 6. The posts cite the book with these same addresses, so a citation in a post can be matched to a commit, and a commit can be traced back to its page.

## Next Steps

The code that lands here will run on x-lang, and x-lang is still moving — the language and its library both. Before the first algorithm goes in, the repo gets pinned to a release so it keeps working while they change. Then the mazes start: the book's first chapter, it turns out, needs no code at all.

---
---
