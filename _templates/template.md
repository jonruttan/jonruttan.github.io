---
layout: post
title:  "Turtle Geometry: <x.y.z> <Title>"
categories: turtle-geometry
excerpt_separator: <!--more-->
---
<Lead-in -- past tense>
<Intro -- future tense>

<!--more-->

{% include turtle-geometry/preamble.md %}

---

# <x.y.z> <Title>

> <Quote>

```logo
; <type> <type-x.y.z>, p.<page>#<type-abbr>.<page-type-#> [<book-label>]
<LOGO — the book's notation, verbatim, runnable>
```

{% include turtle-geometry/turtle.html src="/assets/turtle-geometry/bc/<name>.json" caption="<type> <x.y.z>, p.<page>#<type-abbr>.<page-type-#> — <description>" speed="20" %}

<!--
  Figure workflow:
    1. Program lives in the code repo as chapter-N/<name>.logo
    2. sh _tools/logo-bc.sh path/to/<name>.logo assets/turtle-geometry/bc/<name>.json
    3. Reference it with the include above.
  Short streams can be inlined instead of using src:
    {% include turtle-geometry/turtle.html bc='["F",100.0,"R",90.0]' caption="…" %}
-->

# Reflections

<Reflections -- past tense>
<Link to repo code>
<Reflections -- future tense>

# Next Steps

<Summary -- past tense>

<Preview -- future tense>

---
---
