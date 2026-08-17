---
layout: post
title:  "Micro Minesweeper"
categories: [c, minesweeper]
excerpt_separator: <!--more-->
---
[Micro Minesweeper](https://github.com/jonruttan/microminesweeper): minesweeper with no multiplication, no division, and nothing wider than a byte.

In this post we'll look at how the board addressing and the scoring stay inside that constraint, on boards up to 16x16.

<!--more-->

---

# Micro Minesweeper

## No Multiply, No Divide

Most 8-bit CPUs have no multiply or divide instruction. Both are subroutines rather than opcodes, and are incredibly expensive. This project uses shifts, masks and repeated addition instead.

## Two Facts

Everything after this follows from two facts:

  1. **8-bit math is modulo 256.** We're exploiting wrapping: go past 255 and land back at 0, perfect for this situation.

  2. **256 is 16 squared.** A 16x16 board fills a byte index exactly, and the two coordinates are the two nibbles — row on top, column underneath.

Between them, every multiply, divide and modulo in the program turns into a shift or a mask:

| What we want   | What we write   |
|:--------------:|:---------------:|
| `y * 16`       | `y << 4`        |
| `i / 16`       | `i >> 4`        |
| `i % 16`       | `i & 0x0f`      |
| `rand() % 256` | `rand() & 0xff` |

## The Board

The board is one 256-byte array, and a coordinate becomes an index with a shift and an or:

```c
i = (y << SHIFT) | x;
```

Coming back out is a shift and a mask. Mine placement gets the same treatment — `rand() & 0xff` lands on a cell without a modulo.

That exact fit is also the limit. Sixteen columns is as wide as a byte index goes.

## The Border, and Where It Runs Out

A cell's value says what it is: 0 to 8 for the adjacent mine count, 9 for a mine, and higher numbers for cells already uncovered or flagged. The ordering is deliberate — anything dealt with sorts above anything still in play, so one `>=` test is enough to make a cell inert.

Cells off the edge of the active board hold 31, past the top of that range. Every operation skips them, so there's no bounds checking anywhere. And on a board narrower than sixteen, that dead region doubles as a border and does the edge work for us.

At a full sixteen there isn't one. Index 15 is `(f, 0)`. Index 16 is `(0, 1)`. Next door in memory, opposite ends of the board.

![A 16x16 intermediate board part way through a flood fill](/assets/minesweeper/16x16-mid-flood.png)
*One probe at `8 8`. The fill runs out to column `0` and down to row `f` — both edges — and stops where it should.*

Here's where the first fact earns its keep. Running off the end of a row doesn't run off the array; it lands us in the row below. So the row number *is* the test, and by the second fact the row is the top nibble.

This is the loop that walks three cells of a row, applying `fn` to each one that's actually on it:

```c
for (k = 0; k < 3; k++, j++) {
	if ((j & ROW) == row) {
		board[j] = fn(j, board[j]);
	}
}
```

`ROW` is `0xf0`. One mask, one compare, and neither end of the run is a special case.

Rows that fall off the top or the bottom of the board are tested directly:

```c
int box(uint8 i, uint8 (*fn)(uint8, uint8))
{
	uint8 y = i >> SHIFT;

	if (y) {
		box_row(i - STRIDE - 1, (i - STRIDE) & ROW, fn);
	}

	box_row(i - 1, i & ROW, fn);

	if (y < MASK) {
		box_row(i + STRIDE - 1, (i + STRIDE) & ROW, fn);
	}

	return 0;
}
```

That's where `row` comes from: each call is handed the row it's meant to stay on — `(i - STRIDE) & ROW` above, `i & ROW` level, `(i + STRIDE) & ROW` below — and `box_row` holds it to that.

## Counting Safe Cells

`score` is the number of safe cells still covered — cells minus mines to start, which fits a byte on any board with a mine on it. Uncover a cell and it drops. Flag one and it doesn't. Zero means we've won.

Seeding it doesn't need a wider type either. The layout pass paints the board and counts the playable cells as it goes:

```c
for (y = 0, i = 0; y <= MASK; y++) {
	for (x = 0; x <= MASK; x++, i++) {
		if (x < width && y < height) {
			board[i] = 0;
			score++;
		} else {
			board[i] = INVALID;
		}
	}
}
```

On a full board that runs to 256 and rolls straight over to zero. Then the mines come off the top:

```c
score -= m;
```

First fact again, and this is the bit I like: the subtraction lands on the right answer even though the count didn't. On intermediate we want `256 - 40`, which is 216. What we compute is `0 - 40`, which in a byte is also 216. The total doesn't fit, the difference does, and only the difference is ever asked for.

# Reflections

516 bytes of game state: the board, a 256-byte stack for the flood fill, three bytes of geometry, and the score. Nothing wider than a byte anywhere, and no multiply or divide in the source.

The code is on GitHub as [microminesweeper](https://github.com/jonruttan/microminesweeper).

# Next Steps

The one thing we haven't got is the traditional expert board. That's 30x16, and thirty columns won't fit a byte index however we arrange them, so expert is squared off at 16x16 with the same 99 mines — a nastier game than the original.

Going wider means a 16-bit index and a rethink of everything above. We'll cross that bridge if we come to it.

---
---
