---
layout: page
title: x
permalink: /x/
---

x is a system that hosts languages. Scheme, Kernel, Logo, a POSIX shell,
Python, awk and C each load as a library over a small fexpr core that is
never modified to make room for them. The type system, numeric tower, JIT
compiler and toolchain above that core are written in x-lang.

- [x-lang](https://github.com/jonruttan/x-lang) — the language, and where to start
- [Documentation](https://jonruttan.github.io/x-lang/) — guides and the generated references
- [Releases](https://github.com/jonruttan/x-lang/releases) — prebuilt binaries
- [x-os](https://github.com/jonruttan/x-os) — the languages as a system: a container and a bootable image

The languages and tools hosted on it each have a repository of their own;
x-lang's README lists them.

Two series here are written in it:

- [Mazes for Programmers]({{ "/mazes-for-programmers/" | prepend: site.baseurl }}) — in x-lang
- [Turtle Geometry]({{ "/turtle-geometry/" | prepend: site.baseurl }}) — moving to x/Logo
