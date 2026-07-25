---
layout: post
title:  "Turtle Geometry: 1.1.2 Drawing with the Turtle"
categories: turtle-geometry
excerpt_separator: <!--more-->
---
<Lead-in -- past tense>
<Intro -- future tense>

<!--more-->

{% include turtle-geometry/preamble.md %}

---

# 1.1.2 Drawing with the Turtle

> <Quote>

```scheme
;; Computation 1.1.2.0, p.7#comp.0
;; 
;; TO TRY.ANGLE SIZE
;;    REPEAT 3
;;       FORWARD SIZE
;;       RIGHT 60
;;
(define (try.angle size)
  (repeat 3
    (forward size)
    (right 90)))
```

> #### Figure 1.2a
Attempt to draw a triangle.
![Figure 1.2a](/assets/turtle-geometry/figure1.2a.png)
```scheme
;; Figure 1.2a, p.7#fig.0
;;
;; TO TRY.ANGLE
;;    REPEAT 3
;;       FORWARD 100
;;       RIGHT 60
;;
;; Example 1.1.2.0, p.7#ex.0
;; 
;; TRY.ANGLE 100
;;
(try.angle 100)
```
---

```scheme
;; Computation 1.1.2.1 (implied)
;; 
;; TO TRIANGLE SIZE
;;    REPEAT 3
;;       FORWARD SIZE
;;       RIGHT 120
;;
(define (triangle size)
  (repeat 3
    (forward size)
    (right 120)))
```

> #### Figure 1.2b
Attempt to draw a triangle.  
![Figure 1.2b](/assets/turtle-geometry/figure1.2b.png)
```scheme
;; Figure 1.2b, p.7#fig.1
;;
;; TO TRIANGLE
;;    REPEAT 3
;;       FORWARD 100
;;       RIGHT 120
;;
(triangle 100)
```
---

> #### Figure 1.3a
(a) Initial attempt to draw a house fails.  
![Figure 1.3a](/assets/turtle-geometry/figure1.3a.png)
```scheme
;; Figure 1.3a, p.8#fig.0
;;
;; TO HOUSE SIDE
;;    SQUARE SIDE
;;    TRIANGLE SIDE
;;
;; HOUSE 100 (implied)
;;
(define (house side)
  (square side)
  (triangle side))
(house 100)
```
---

> #### Figure 1.3b
(b) Interface steps are needed.  
![Figure 1.3b](/assets/turtle-geometry/figure1.3b.png)
```scheme
;; Figure 1.3b, p.8#fig.1
;;
;; TO HOUSE SIDE
;;    SQUARE SIDE
;;    FORWARD SIDE
;;    RIGHT 30
;;    TRIANGLE SIDE
;;
;; HOUSE 100 ;(implied)
;;
(define (house side)
  (square side)
  (forward side)
  (right 30)
  (triangle side))
(house 100)
```
---

> #### Figure 1.4a
![Figure 1.4a](/assets/turtle-geometry/figure1.4a.png)
```scheme
;; Figure 1.4a, p.9#fig.0
;;
;; TO THING
;;    FORWARD 100
;;    RIGHT 90
;;    FORWARD 100
;;    RIGHT 90
;;    FORWARD 50
;;    RIGHT 90
;;    FORWARD 50
;;    RIGHT 90
;;    FORWARD 100
;;    RIGHT 90
;;    FORWARD 25
;;    RIGHT 90
;;    FORWARD 25
;;    RIGHT 90
;;    FORWARD 50
;;
;; THING ;(implied)
;;
(define (thing)
  (forward 100)
  (right 90)
  (forward 100)
  (right 90)
  (forward 50)
  (right 90)
  (forward 50)
  (right 90)
  (forward 100)
  (right 90)
  (forward 25)
  (right 90)
  (forward 25)
  (right 90)
  (forward 50))
(thing)
```
---

> #### Figure 1.4b
Designs made by rotating a simple doodle.  
![Figure 1.4b](/assets/turtle-geometry/figure1.4b.png)
```scheme
;; Figure 1.4b, p.9#fig.1
;;
;; TO THING1
;;   REPEAT 4
;;      THING
;;
;; THING1 ;(implied)
;;
(define (thing1)
  (repeat 4 (thing)))
(thing1)
```
---

> #### Figure 1.4c
Designs made by rotating a simple doodle.  
![Figure 1.4c](/assets/turtle-geometry/figure1.4c.png)
```scheme
;; Figure 1.4c, p.9#fig.2
;;
;; TO THING2
;;   REPEAT 100
;;      THING
;;      RIGHT 10
;;      FORWARD 50
;;
;; THING2 ;(implied)
;;
(define (thing2)
  (repeat 100
          (thing)
          (right 10)
          (forward 50)))
(thing2)
```
---

> #### Figure 1.4d
Designs made by rotating a simple doodle.  
![Figure 1.4d](/assets/turtle-geometry/figure1.4d.png)
```scheme
;; Figure 1.4d, p.9#fig.3
;;
;; TO THING3
;;   REPEAT 100
;;      THING
;;      LEFT 45
;;      FORWARD 100
;;
;; THING3 ;(implied)
;;
(define (thing3)
  (repeat 100
          (thing)
          (left 45)
          (forward 100)))
(thing3)
```
---

> #### Figure 1.5
`FORWARD 1`, `RIGHT 1`, repeated draws a circular arc.  
![Figure 1.5](/assets/turtle-geometry/figure1.5-imp.png)
 ![Figure 1.5](/assets/turtle-geometry/figure1.5-lit.png)
```scheme
;; Figure 1.5, p.10#fig.0
;;
;; TO CIRCLE
;;   REPEAT FOREVER
;;      FORWARD 1
;;      RIGHT 1
;;
;; CIRCLE ;(implied)
;;
(define (circle)
  (repeat 360
          (forward 1)
          (right 1)))
(circle)
```
---

```scheme
;; Computation 1.1.2.0, p.10#comp.3
;; 
;; TO ARCR R DEG
;;    REPEAT DEG
;;       FORWARD R
;;       RIGHT 1
;;
(define (arcr r deg)
  (repeat deg
    (forward r)
    (right 1)))
```
---

```scheme
;; Computation 1.1.2.0, p.11#comp.0
;; 
;; TO ARCL R DEG
;;    REPEAT DEG
;;       FORWARD R
;;       LEFT 1
;;
(define (arcl r deg)
  (repeat deg
    (forward r)
    (left 1)))
```
---


# Reflections

<Reflections -- past tense>
<Link>
<Reflections -- future tense>

# Next Steps

<Summary -- past tense>

<Preview -- future tense>

---
---