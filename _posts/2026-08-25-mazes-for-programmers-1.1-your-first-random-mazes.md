---
layout: post
title:  "Mazes for Programmers: 1.1 Your First Random Mazes"
categories: mazes-for-programmers
excerpt_separator: <!--more-->
---
Two setup posts and no mazes yet. Chapter 1 is where they start, and it needs none of the setup: the book's first two algorithms can be run on paper, with a coin.

One piece of setup did land since last post: the repo is now pinned to an x-lang release — the language and the engine it runs on — so a clone keeps running the same code as x-lang moves. The details are in the [repo README](https://github.com/jonruttan/mazes-for-programmers-x-lang#requirements).

<!--more-->

{% include mazes-for-programmers/preamble.md %}

---

# 1.1 Your First Random Mazes

## The Grid

The book's mazes live on a rectangular grid: cells in rows and columns, each cell walled off from its four neighbours. A maze is made by knocking out walls — each removed wall is a *passage* linking two cells. The algorithms in the book carve *perfect* mazes, meaning there is exactly one path between any two cells: no loops, and no unreachable pockets. Here's the 4×4 grid both examples below start from, with all its walls up:

<!--check: illustrate "drawn by hand; regenerable once the grid can display itself" -->
```
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
```

Cell naming is by (row, column), counting from the top-left, with north pointing up the page.

## Binary Tree, by Hand

The first formula *(Formula 1.1.0, p.6#form.0)* is one sentence: **visit every cell, and carve a passage either north or east — flip a coin.** Cells on the east column can't go east, so they go north. Cells on the top row can't go north, so they go east. The northeast corner can't do either, and does nothing.

Heads is north, tails is east. The book starts its walk in the southwest corner — the algorithm doesn't care about visit order — so I'll start there too and work up, row by row. My flips:

- **Row 3:** (3,0) H → north. (3,1) T → east. (3,2) T → east. (3,3) north, forced.
- **Row 2:** (2,0) T → east. (2,1) H → north. (2,2) H → north. (2,3) north, forced.
- **Row 1:** (1,0) H → north. (1,1) T → east. (1,2) T → east. (1,3) north, forced.
- **Row 0:** east, east, east — no coin needed — and the corner sits out.

Two rows in it looks like this — the bottom half carved, and row 2's northward passages already broken through row 1's floor:

<!--check: illustrate "carved by hand with a coin (Binary Tree, bottom two rows); checkable when the carver is code" -->
```
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+   +   +   +
|       |   |   |
+   +---+---+   +
|   |           |
+---+---+---+---+
```

And after all sixteen cells:

<!--check: illustrate "carved by hand with a coin (Binary Tree, complete); checkable when the carver is code" -->
```
+---+---+---+---+
|               |
+   +---+---+   +
|   |           |
+---+   +   +   +
|       |   |   |
+   +---+---+   +
|   |           |
+---+---+---+---+
```

That's a real maze: sixteen cells, fifteen passages, every cell reachable, no loops. It's also biased, and the bias comes from the rules rather than from the flips. The east column is always a single corridor, because every cell in it was forced north. The top row is always a corridor too, forced east. And every path drifts northeast, because northeast is the only direction the algorithm ever carves. Run it a thousand times and every maze will have the same open roof and open right wall.

The name comes from the structure: every cell except the corner carves exactly one passage toward its "parent", which makes the maze one big binary tree rooted at the northeast corner.

## Sidewinder, by Hand

The second formula *(Formula 1.2.0, p.12#form.0)* works row by row, and fixes half of Binary Tree's problem. Walk each row west to east, gathering cells into a *run*. At each cell, flip: **tails, extend the run east; heads, close the run** — pick one cell from it at random and carve north from there. At the east wall you have to close; on the top row you have to extend, so the top row is one long run with nowhere to go but east.

Starting from the bottom row again, my flips:

- **Row 3:** (3,0) T, (3,1) T → run is {(3,0), (3,1), (3,2)}. (3,2) H → close; (3,1) picked at random, north. (3,3) east wall → close, north.
- **Row 2:** (2,0) H → close the one-cell run, north. (2,1) T, (2,2) T → run is {(2,1), (2,2), (2,3)}. (2,3) east wall → close; (2,1) picked at random, north.
- **Row 1:** (1,0) T → run is {(1,0), (1,1)}. (1,1) H → close; (1,0) picked at random, carve north. (1,2) T → run is {(1,2), (1,3)}. (1,3) east wall → close; (1,3) picked at random, north.
- **Row 0:** one corridor, by rule.

<!--check: illustrate "carved by hand with a coin (Sidewinder); checkable when the carver is code" -->
```
+---+---+---+---+
|               |
+   +---+---+   +
|       |       |
+   +   +---+---+
|   |           |
+---+   +---+   +
|           |   |
+---+---+---+---+
```

Fifteen passages again, still perfect. The difference is on the right-hand side: the east column is no longer a guaranteed corridor, because a run that reaches the east wall can send its northward passage up from any of its cells — here row 2's run did, from (2,1), two cells west of the wall. Runs spread the vertical passages around instead of stacking them against one edge.

The top row hasn't changed, though: heads is forbidden there, so it's one corridor, every time. And a south-to-north solution is never hard to find — every run has exactly one passage north — though it "may wind side-to-side a bit" on the way up, which the book notes is where the algorithm gets its name.

## Bias

Both algorithms are genuinely random, and both produce lopsided mazes anyway — the bias comes from the rules, not the coin. It's a deliberate trade: each cell (or run) decides locally, remembers nothing, and never looks at the rest of the maze, and that's exactly what makes them runnable on paper. Algorithms that carve unbiased mazes have to remember where they've been. Those come in a later chapter.

The book hands you the coin mid-walk — "grab your own coin" and finish the grid yourself. A maze takes about five minutes, and the bias shows up on your own page quickly.

## Next Steps

That's chapter 1: two algorithms and no code. Next post the code starts, with the book's `Cell` and `Grid` classes in x-lang.

---
---
