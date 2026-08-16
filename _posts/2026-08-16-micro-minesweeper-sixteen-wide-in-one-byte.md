---
layout: post
title:  "Micro Minesweeper: Sixteen Wide in One Byte"
categories: [c, minesweeper]
excerpt_separator: <!--more-->
---
I wrote Micro Minesweeper with one rule: no multiplication, no division, and nothing wider than a byte.

In this post we'll look at how the board addressing and the scoring stay inside that, on boards up to 16x16.

<!--more-->

---

# Sixteen Wide in One Byte

## No Multiply, No Divide

The 6502 and the Z80 have no multiply instruction. No divide either. Both are subroutines rather than opcodes, and cost a great deal more than an add. Sixteen-bit values aren't much better: two registers, and you're carrying between them on every operation.

So we lean on shifts, masks and repeated addition, and keep what we can in single bytes.

## One Byte, 256 Cells

The board is one 256-byte array, and every index into it is a `uint8`. The stride is a constant 16, so a coordinate becomes an index with a shift and an or:

```c
i = (y << SHIFT) | x;
```

Sixteen being a power of two is the whole trick. Back the other way is just as cheap: `x` is `i & 0x0f`, `y` is `i >> 4`.

A byte indexes 256 cells. A 16x16 board is 256 cells. They line up exactly, so `rand() & 0xff` picks a random cell for us — a mask instead of a modulo, and a modulo would have meant a divide.

That exact fit is also the limit. Sixteen columns is as wide as a byte index goes: give each row a sentinel column and the stride becomes `width + 1`, which puts a sixteen-wide board at `16 * 17 = 272` cells, off the end of the array.

## The Border, and Where It Runs Out

A cell's value says what it is: 0 to 8 for the adjacent mine count, 9 for a mine, and higher numbers for cells already uncovered or flagged. The ordering is deliberate — anything dealt with sorts above anything still in play, so one `>=` test is enough to make a cell inert.

Cells off the edge of the active board hold 31, past the top of that range. Every operation skips them, so there's no bounds checking anywhere. And on a board narrower than sixteen, that dead region doubles as a border and does the edge work for us.

At a full sixteen there isn't one. Index 15 is `(f, 0)`. Index 16 is `(0, 1)`. Next door in memory, opposite ends of the board.

![A 16x16 intermediate board part way through a flood fill](/assets/minesweeper/16x16-mid-flood.png)
*One probe at `8 8`. The fill runs out to column `0` and down to row `f` — both edges — and stops where it should.*

Here's the nice part. The index is a byte, so running off the end of a row doesn't run off the array — we land in the row below. So the row number *is* the test, and the row is the top nibble.

This is the loop that walks three cells of a row, applying `fn` to each one that's actually on it:

```c
for (k = 0; k < 3; k++, j++) {
	if ((j & ROW) == row) {
		board[j] = fn(j, board[j]);
	}
}
```

`ROW` is `0xf0`. One mask, one compare, and neither end of the run is a special case.

## Counting Safe Cells

`score` is the number of safe cells still covered — `256 - mines` to start, which fits a byte on any board with a mine on it. Uncover a cell and it drops. Flag one and it doesn't. Zero means we've won.

Seeding it doesn't need a wider type either. The layout pass counts playable cells into `score` as it paints the board, and once the mines are placed we take them off the top:

```c
score -= m;
```

On a full board that count has already rolled over to zero. Doesn't matter — the subtraction still lands on the right number, because the difference fits even where the count doesn't.

# Reflections

516 bytes of game state: the board, a 256-byte stack for the flood fill, three bytes of geometry, and the score. Nothing wider than a byte anywhere, and no multiply or divide in the source.

The code is on GitHub as [microminesweeper](https://github.com/jonruttan/microminesweeper).

# Next Steps

The one thing we haven't got is the traditional expert board. That's 30x16, and thirty columns won't fit a byte index however we arrange them, so expert is squared off at 16x16 with the same 99 mines — a nastier game than the original.

Going wider means a 16-bit index and a rethink of everything above. We'll cross that bridge if we come to it.

---
---
