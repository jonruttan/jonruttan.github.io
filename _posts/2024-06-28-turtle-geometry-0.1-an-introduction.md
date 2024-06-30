---
layout: post
title:  "Turtle Geometry: 0.1. An Introduction"
categories: turtle-geometry
excerpt_separator: <!--more-->
---
{% include turtle-geometry/preamble.md %}

<!--more-->

# 0.1. An Introduction

The *Turtle Geometry* book opens by saying:

> This is a book about exploring mathematics, and the most important thing about exploring mathematics is for you to do it rather than just passively read what we've written. Many of the sections…contain extended descriptions of computer projects for you to implement and investigate. Additional open-ended projects, indicated with \[P], are listed with the exercises at the end of each section.

In the spirit of the book, I'll tackle the additional projects to a degree that seems practical to explore the concepts presented.

## Technical Considerations

Following the preamble, the book addresses a few preliminary technical considerations we're to attend to before starting.

The first consideration is our computing environment:

> The computer used to undertake these projects must be capable of producing drawings in response to "turtle graphics" commands.

The second is the notation:

> In writing a book about computer graphics projects we had to select a notation in which to describe the algorithms. Our response was to choose a notation in which turtle algorithms can be expressed simply, and yet which is close enough to real programming languages so that you should have little troubling translating our programs into the language of your choice.

There are appendices to help us in this respect.

For the computing environment we're to refer to *Appendix B: Turtle Programs in Conventional Languages:*

> This appendix is an aid to adapting the programs in this book for work with computer systems and languages that are widely available.

It then describes some *General Considerations*, of which, for a modern computing environment, we only need to concern ourselves with the *Display:*

> In addition to a computer equipped with a suitable language, work with turtle geometry requires a graphic-output device capable of producing line drawings.

No problem.

## Choosing a Programming Language

Next, we're directed to *Programming Language* considerations:

> …essentially any programming language can do the same things as any other.…a computer language similar to the Turtle Procedure Notation used in this book can simplify the programming and allow you to concentrate on the mathematics, on inventing and exploring.

I'll be using a variety of operating systems and platforms while while working through the exercises in this book, including  MacOS (arm64), Ubuntu (x86_64 GNU/Linux), and Raspbian (aarch64 GNU/Linux), so I want something which runs on all of them.

> Except for minor variations of syntax, Logo is substantially the same as the Turtle Procedure Notation used in this book.

>Lisp is another language that is structurally very compatible with our criteria. In fact, Logo is a direct descendant of Lisp. 

I've decided to use [Racket](https://racket-lang.org), a dialect of Lisp, as my implementation language. It has a GUI, a [repl](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop), and a built-in Turtle Graphics package.

```scheme
#lang racket

(require graphics/turtles)

; Initialize.
(turtles #t)
```

![Screenshot 2024-06-27 at 17.00.17](/assets/turtle-geometry/Screenshot 2024-06-27 at 17.00.17.png)

## Reflections

So far so good, we've chosen a language, and we've got a turtle on the screen. That was pretty easy. I've looked ahead in the book, and (***spoiler alert***) the Turtle Graphics module we've chosen is missing some functionality we need. But for now this will do, we'll cross that bridge when we come to it.

## Next Steps

With the choice of language out of the way, it's time to turn to the Turtle Procedure Notation mentioned earlier.

I'll tackle that in the next post.

---
