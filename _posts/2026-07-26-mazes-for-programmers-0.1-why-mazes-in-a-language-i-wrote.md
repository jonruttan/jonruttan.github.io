---
layout: post
title:  "Mazes for Programmers: 0.1 Why Mazes, in a Language I Wrote?"
categories: mazes-for-programmers
excerpt_separator: <!--more-->
---
{% include mazes-for-programmers/blurb.md %}

<!--more-->

---

# 0.1 Why Mazes, in a Language I Wrote?

*Mazes for Programmers* is a book which started as a blog series — Jamis Buck writing up one maze algorithm at a time. I'm going to do that in reverse: take the book and turn it back into a blog series, one algorithm a post.

The difference is the language. The book's in Ruby. I'm doing it in [x-lang](https://github.com/jonruttan/x-lang), a language I've been building, and using the book to put it through its paces.

## A taste of the language

At startup x-lang code reads like a Lisp — parentheses, prefix notation — but that's only its default surface, and the surface isn't the language. Underneath is a small, type-agnostic interpreter, and a dialect reshapes that interpreter itself — new types, a new reader, new syntax — until it *is* the language you loaded. Give it the right dialect and the interpreter becomes Logo, or R5RS Scheme, or R7RS; not other languages running on top of x-lang, but x-lang morphed into them. The parentheses below are just the form I'm working in here.

```scheme
; a value dispatches to its class, subject-last — and a list is callable
("hello,world" split ",")       ; => ("hello" "world")
((List of "hello" "world") 1)   ; => "world" - indexing is zero-based
```

Everything above the core — the type system, the object system, the standard library, the toolchain — is written in x-lang itself. It's a research project about how far a minimal core can be pushed, which is why it's worth aiming at a real problem.

## Why do this

Four reasons, and they're also what I'll be paying attention to as I go:

- **Exercise the language.** Small snippets flatter a language. A book of steadily harder algorithms doesn't — it finds the corners.
- **Document and show it.** The clearest thing I can say about x-lang is readable code doing real work.
- **Find where it's weak.** Where the language or its tooling fights me, I'll say so, and — since it's mine — file it. The setup alone turned up five bugs.
- **Learn my own tools.** Writing a language and using one are different skills. This is me learning the second, in public.

## Why mazes

They suit this well. Each algorithm is small and self-contained, so a post can cover one idea. The output is visual, so you can see whether it worked. And the book builds a real progression: from a first random grid, through solving and colouring, out to masked, circular, hexagonal, weighted, and higher-dimensional mazes.

## What's coming

A short prelude — this post, then setting up a repo for the code, then pinning the language under it so the project stays reproducible. After that, the algorithms, chapter by chapter, starting with the simplest carver in the book. Near the end I'd like to compare the algorithms on the book's own metrics, but that's a long way off.

The appeal is straightforward: a well-built book, a language that needs exercising, and output you can look at. Whether x-lang turns out well or badly here, the mazes will show it.

## Next

Before any of that, the code needs a home. Next post: setting up the repo.

---
---
