---
layout: post
title:  "Turtle Geometry: 0.2. Turtle Procedure Notation"
categories: turtle-geometry
excerpt_separator: <!--more-->
---
Having settled on using Racket as the implementation language, next I'll go through translating all the code in *Appendix A: Turtle Procedure Notation:*

> Turtle Procedure Notation is meant to be a consistent and readable way to describe turtle programs independent of the quirks, details, and limitations of common computer languages, yet in such a way that the programs can be readily translated into whatever computer language is available.

<!--more-->

{% include turtle-geometry/preamble.md %}

---

# Turtle Procedure Notation

The Turtle Procedure Notation consists of:
- a simple syntax,
- a handful of language constructs,
- a tiny library of math, printing, and turtle manipulation functions.

The syntax is _so_ simple that it requires almost no attention.

A few library functions are discussed in Appendix A, but most of it is focused on language constructs. The Racket counterparts need to be determined before tackling the rest of the book, so that is the aim of this section.

### Basic Operations and Data Types

> …addition, subtraction, multiplication, division (denoted `/`), and exponentiation (denoted `↑`). These obey the usual precedence conventions;

Unlike the Turtle Procedure Notation, Racket's order-of-operations is always explicit, so `5+2*3-7` is written as:

```scheme
;; Example A.1, p.393#ex.0
;;
;; 5+2*3-7
;; -> 4
;;
(- (+ 5 (* 2 3)) 7)
; -> 4
```

and `(5+2)*(3-7)` as:

```scheme
;; Example A.2, p.393#ex.1
;;
;; (5+2)*(3-7)
;; -> -28
;;
(* (+ 5 2) (- 3 7))
; -> -28
```


> In addition to the basic arithmetic operations, there are numerous other operations that take numbers as inputs. The `SQRT` operation, for example returns as its value the positive square root of its input (which must be a non-negative number). 

```scheme
;; Computation A.1, p.393#comp.0
;;
;; PRINT (SQRT 144) + (SQRT 144)
;; -> 24
;;
(println (+ (sqrt 144) (sqrt 144)))
; -> 24
```

> …we actually use two types of numbers: integers and real (or "floating point") numbers. Turtle Procedure Notation distinguishes real numbers from integers by including a decimal point in their printed notation. Arithmetic operation may combine integers and real numbers (for example, `3.45 + 2`). The kind of number returned is determined by the rule that the result of a division is always a real number, whereas the result of an addition, a subtraction, or a multiplication will be real if any of its inputs are real.

```scheme
;; Example A.3, p.394#ex.2
;;
;; 3.45 + 2
;;
(+ 3.45 2)
```

Racket has an advanced numerical tower which can handle integers, floating point, and rationals among others. It uses the same format for real numbers and integers as Turtle Procedure Notation. Likewise, conversion to a common numeric type is implicit when operations are supplied with parameters of differing numeric types.

> In addition to numeric data, Turtle Procedure Notation also makes use of character strings.

```scheme
;; Computation A.2, p.394#comp.0
;;
;; PRINT SQRT 144
;; -> 12
;;
(println (sqrt 144))
; -> 12

;; Computation A.3, p.394#comp.1
;;
;; PRINT "SQRT 144"
;; -> SQRT 144
;;
(println "(sqrt 144)")
; -> "(sqrt 144)"
```

As with Turtle Procedure Notation, Racket surrounds strings with quotation marks (`"`).

### Variables

> The assignment operator `←` is used to assign names to data objects. A name can be any non-numeric character string that does not contain a space.

```scheme
;; Computation A.4, p.394#comp.2
;;
;; BIG ← 10000
;; SMALL ← .005
;; CHEER ← "TURTLE, TURTLE, RAH RAH RAH"
;;
(define big 10000)
(define small 0.005)
(define cheer "Turtle, turtle, rah rah rah")

;; Computation A.5-1, p.394#comp.3-0
;;
;; PRINT BIG * SMALL
;; -> 50
;;
(println (* big small))
; -> 50

;; Computation A.5-2, p.394#comp.3-1
;;
;; PRINT CHEER
;; -> TURTLE, TURTLE, RAH, RAH, RAH
;;
(println cheer)
; -> "Turtle, turtle, rah rah rah"
```

Variables in Lisp are handled a bit differently. Although it's not shown in these particular examples, in Lisp there is a distinction between creating a variable, and changing its value. The Scheme dialect of Lisp, of which Racket is a descendant (but not a strict adherent), uses `define` to create variables, and `set!` to modify their values. Additionally there's (normally) a distinction between global variables created with `define`, and block-scoped variables created with `let`. Racket has opted to introduce a lexically scoped `define`, performing double-duties depending on where it is used. While I understand the rationale, I consider it an anti-pattern. Luckily the use of it is optional, so I'm going to use the Scheme approach here.

### Procedures

> Procedures provide a way to build complex operations by combining simpler ones. A procedure is simply a list of commands, which are executed in sequence whenever the procedure is invoked.

```scheme
;; Computation A.6, p.395#comp.0
;;
;; TO DASH
;;    FORWARD 20
;;    BACK 20
;;
(define (dash)
  (forward 20)
  (back 20))
```

> To invoke (or "call") a procedure, one simply uses the name of the procedure as a command in the language, either by typing it directly into the computer (at "top level") or by using it as one of the commands in another procedure. 

Named functions in Racket are closures bound to variables, so they too are created using `define`. When the expression supplied as the variable's name is a list, the first element in that list is taken as the function name. The expressions supplied as the variable's value become the function's body. To call the function, it is wrapped in parentheses (`()`).

> Procedures may also be defined to take inputs. These are specified by providing names for the inputs on the procedure's title line.

```scheme
;; Computation A.7, p.395#comp.1
;;
;; TO VARY.DASH DISTANCE
;;    FORWARD DISTANCE
;;    BACK DISTANCE
;;
(define (vary.dash distance)
  (forward distance)
  (back distance))
```

In Racket, additional symbols in the function name list are used as positional parameter names, available as local variables bound to the values supplied when the function is called.

> When a procedure is called, such as by typing `VARY.DASH 100`, the actual values of the parameters are substituted for the parameters' names throughout the procedure body.

```scheme
;; Example A.4, p.395#ex.0
;;
;; VARY.DASH 100
;;
(vary.dash 100)
```

To pass parameter values to a function in Racket, add an expression to the function call list for each parameter.

> In addition to accepting inputs, procedures may also return a value, or "output".

```scheme
;; Computation A.8, p.395#comp.2
;;
;; TO AVERAGE X Y
;;    RETURN (X + Y) / 2
;;
(define (average x y)
  (/ (+ x y) 2))
```

In Racket a function's final expression is returned implicitly.

> The procedure can now be used as a value in other statements.

```scheme
;; Computation A.9-1, p.396#comp.0-0
;;
;; PRINT AVERAGE 5 7
;; -> 6
;;
(println (average 5 7))
; -> 6

;; Computation A.9-2, p.396#comp.0-1
;;
;; AV ← (AVERAGE 5 7) - 6
;;
(define av (- (average 5 7) 6))
```

> When the `RETURN` command is executed, the procedure will terminate directly and not execute any further commands within it.

```scheme
;; Computation A.10, p.396#comp.1
;;
;; TO LAZY.FORWARD DISTANCE
;;    IF DISTANCE > 50 THEN RETURN
;;    FORWARD DISTANCE
;;
(define (lazy.forward distance)
  (let/cc return
    (when (> distance 50)
      (return))
    (forward distance)))
```

To leave early from a function in Racket we can use continuations with the `let/cc` construct.

### Parentheses, Commas, and Comments

> Complex expressions can often be made more legible through judicious use of parentheses.…In general, readability can be increased in a procedure call by enclosing the inputs to the procedure in parentheses, separated by commas.

```scheme
;; Computation A.11, p.396#comp.0
;;
;; AVERAGE X + 3 AVERAGE 3 * Y SQRT 5
;;

;; Computation A.12, p.396#comp.1
;;
;; AVERAGE (X + 3,  AVERAGE (3 * Y, SQRT 5))
;;
```

Since Racket’s order of operations is explicit, and function arguments are always enclosed within parentheses, this doesn't apply.

> Another way to increase program readability is to use comments. Anything that appears after a semicolon on a line will be ignored…

Racket and Turtle Procedure Notation share the same comment format.

### Conditional Expressions

> As in most languages, our notation for turtle programs makes use of an "if…then…else…" construction.

```scheme
;; Computation A.13, p.397#comp.0
;;
;; TO GREATER X Y
;;    IF X > Y THEN RETURN X ELSE RETURN Y
;;
(define (greater x y)
  (if (> x y) x y))
```

> As in many computer languages, the "else" part is optional.

This differs in Racket, the "else" part is required. Use `when` in place of an "if" with no "else". It has a counterpart `unless` which can simplify logic in some circumstances.

> The clauses governed by `THEN` and `ELSE` can consist of more than one command.
> (Other languages use line numbers or "begin…end" blocks to specify the scope of conditional clauses.)

Racket uses a block construct, expressed as `(begin expr ...)` to handle the case of multiple expressions in a clause.

In Racket the "else" part can be multiple expressions, but I prefer to explicitly use a `begin` block to specify the scope.

```scheme
;; Computation A.14, p.397#comp.1
;;
;; TO SOLVE.QUADRATIC.EQUATION (A, B, C)
;;      ; this procedure prints the real-number solutions to
;;      ; a quadratic equation, given the coefficients
;;      ; as inputs
;;    DISC ← SQRT ( B ↑ 2 - 4 * A * C)
;;    IF DISC < 0
;;       THEN
;;          PRINT "NO REAL SOLUTIONS"
;;       ELSE
;;          PRINT (- B + DISC) / (2 * A)
;;          PRINT (- B - DISC) / (2 * A)
;;
(define (solve.quadratic.equation a b c)
  ; this procedure prints the real-number solutions to
  ; a quadratic equation, given the coefficients
  ; as inputs
  (let ((disc (sqrt (- (expt b 2) (* 4 a c)))))
    (if (< disc 0)
        (println "No real solutions")
        (begin
          (println (/ (+ (- b) disc) (* 2 a)))
          (println (/ (- (- b) disc) (* 2 a)))))))
```

> The item that is tested by the `IF`, as in "`DISC < 0`" above, should be either true or false. An operation that outputs "true" or "false" is called a *predicate*. Turtle Procedure Notation uses the predicates `>`, `<`, and `=`. (`=` works for testing equality of all other data types as well as numbers.)

> In addition, one can define new predicates simply as procedures that return the character strings TRUE or FALSE. For example the following procedure tests whether its first input is within the range specified by its second and third:

```scheme
;; Computation A.15, p.397#comp.2
;;
;; TO BETWEEN (A, B, C)
;;    IF BOTH ( A > B, A < C)
;;       THEN RETURN "TRUE"
;;       ELSE RETURN "FALSE"
;;
(define (between a b c)
  (if (and (> a b) (< a c))
	  #t
	  #f))
```

In Racket, return `#t` or `#f`.

> (The `BOTH` operation outputs TRUE only if both its inputs are true. There is a corresponding `EITHER` operation.) 

In Racket the equivalents are `and` and `or`.

> The `BETWEEN` procedure could also be written as

```scheme
;; Computation A.16, p.398#comp.0
;;
;; TO BETWEEN (A, B, C)
;;    RETURN (BOTH (A > B, A < C))
;;
(define (between a b c)
  (and (> a b) (< a c)))
```

### Iteration Commands

> Another element of Turtle Procedure Notation is given by the iteration (or looping) constructs, signalled by the word `REPEAT`. For example, the form "`REPEAT <number> <commands>`" repeats the designated commands the specified number of times.

```scheme
;; Formula A.0, p.398#form.0
;;
;; REPEAT <number> <commands>
;;

;; Computation A.17, p.398#comp.0
;;
;; TO SQUARE SIZE
;;    REPEAT 4
;;       FORWARD SIZE
;;       LEFT 90
;;
;; Alternative 0: named let
;;
(define (square size)
  (let loop ([n 4])
    (when (> n 0)
      (forward size)
      (left 90)
      (loop (sub1 n)))))
```

For this construct a `for` loop with a range could be used, and that's what I originally was using, but I changed it to a named let, which I suspect has lower overhead. Then I hid the implementations details in this handy `repeat` macro:

```scheme
;; Prelude A.1, p.398#form.0
;;
;; REPEAT <number> <commands>
;;
(define-syntax repeat
  (syntax-rules ()
    [(repeat n expr ...)
     (let loop ([count n])
       (when (> count 0)
         expr ...
         (loop (sub1 count))))]))

;; Computation A.17, p.398#comp.0
;; TO SQUARE SIZE
;;    REPEAT 4
;;       FORWARD SIZE
;;       LEFT 90
;;
;; Alternative 1: repeat macro
;;
(define (square size)
  (repeat 4
    (forward size)
    (left 90)))
```

> Besides using `REPEAT` with a numeric input, one can also use the construct "`REPEAT FOREVER`," which will cause the designated section to be repeated until the user pushes the "stop" button (some special key on the keyboard).

```scheme
;; Formula A.2, p.398#form.1
;;
;; REPEAT FOREVER <commands>
;;
;; Alternative 0: do loop
;;
(do () (#f) (println 'forever))
```

I think the shortest translation might be the `do` loop. The named let is a bit longer, but a little clearer I think:

```scheme
;; Formula A.2, p.398#form.1
;;
;; REPEAT FOREVER <commands>
;;
;; Alternative 1: named let
;;
(let loop ()
  (println 'forever)
  (loop))
```

Alternatively `repeat n` with a very large value for `n` could be substituted.

I went the named let route, then went and hid the marginally clearer code inside a `forever` macro:

```scheme
;; Prelude A.2, p.398#form.1
;;
;; REPEAT FOREVER <commands>
;;
(define-syntax forever
  (syntax-rules ()
    [(forever expr ...)
     (let loop ()
       expr ...
       (loop))]))
```

> Another form of `REPEAT` is "`REPEAT UNTIL <condition> <commands>`," which keeps repeating the designated commands so long as the condition is false.

```scheme
;; Formula A.3, p.398#form.2
;;
;; REPEAT UNTIL <condition> <commands>
;;

;; Computation A.18, p.398#comp.1
;;
;; TO SQRT X
;;    GUESS ← 1
;;    REPEAT UNTIL ABS(X - GUESS ↑ 2) < .001
;;       GUESS ← (GUESS + (X / GUESS)) / 2
;;    RETURN GUESS
;;
;; Alternative 0: do loop
;;
(define (sqrt x)
  (let ((guess 1))
    (do () ((< (abs (- x (expt guess 2))) 0.001))
      (set! guess (/ (+ guess (/ x guess)) 2)))
    guess))
```

In Racket this construct again can be translated quite directly to a `do` loop, and that's what I did in this `until` macro:

```scheme
;; Prelude A.3, p.398#form.2
;;
;; REPEAT UNTIL <condition> <commands>
;;
(define-syntax until
  (syntax-rules ()
    [(until pred expr ...)
     (do ()
       (pred)
       expr ...)]))

;; Computation A.18, p.398#comp.1
;;
;; TO SQRT X
;;    GUESS ← 1
;;    REPEAT UNTIL ABS(X - GUESS ↑ 2) < .001
;;       GUESS ← (GUESS + (X / GUESS)) / 2
;;    RETURN GUESS
;;
;; Alternative 1: until macro
;;
(define (sqrt x)
  (let ((guess 1))
    (until (< (abs (- x (expt guess 2))) 0.001)
      (set! guess (/ (+ guess (/ x guess)) 2)))
    guess))
```

> A variant of this is "`REPEAT <commands> UNTIL <condition>`," which is almost the same except that it tests the condition *after* doing the commands, rather than before:

```scheme
;; Formula A.4, p.398#form.3
;;
;; REPEAT <commands> UNTIL <condition>
;;

;; Computation A.19, p.399#comp.0
;;
;; TO POLYSTOP SIDE ANGLE
;;    TURN ← 0
;;    REPEAT
;;       FORWARD SIDE
;;       LEFT ANGLE
;;       TURN ← TURN + ANGLE
;;    UNTIL REMAINDER (TURN, 360) = 0
;;
;; Alternative 0: named let
;;
(define (polystop side angle)
  (let ((turn 0))
    (let loop ()
      (forward side)
      (left angle)
      (set! turn (+ turn angle))
      (unless (= (remainder turn 360) 0) (loop)))))
```

For this case a `named let` will work, and I made this (potentially unwieldy) `do-until` macro:

```scheme
;; Prelude A.4, p.398#form.3
;;
;; REPEAT <commands> UNTIL <condition>
;;
(define-syntax do-until
  (syntax-rules ()
    [(repeat-until pred expr ...)
     (let loop ()
       expr ...
       (unless pred (loop)))]))

;; Computation A.19, p.399#comp.0
;;
;; TO POLYSTOP SIDE ANGLE
;;    TURN ← 0
;;    REPEAT
;;       FORWARD SIDE
;;       LEFT ANGLE
;;       TURN ← TURN + ANGLE
;;    UNTIL REMAINDER (TURN, 360) = 0
;;
;; Alternative 1: do-until macro
;;
(define (polystop side angle)
  (let ((turn 0))
    (do-until (= (remainder turn 360) 0)
      (forward side)
      (left angle)
      (set! turn (+ turn angle)))))
```
> This is useful in circumstances when the condition for termination is initially true. For instance, note that the following procedure will not perform any turtle moves at all:

```scheme
;; Computation A.20, p.399#comp.1
;;
;; TO POLYSTOP SIDE ANGLE
;;    TURN ← 0
;;    REPEAT UNTIL REMAINDER (TURN, 360) = 0
;;       FORWARD SIDE
;;       LEFT ANGLE
;;       TURN ← TURN + ANGLE
;;
(define (polystop side angle)
  (let ((turn 0))
    (until (= (remainder turn 360) 0)
      (forward side)
      (left angle)
      (set! turn (+ turn angle)))))
```

> A final version of `REPEAT` is "`REPEAT FOR <range> <commands>`," as in the following procedure, which prints all the integers between its two inputs:

```scheme
;; Formula A.5, p.399#form.0
;;
;; REPEAT FOR <range> <commands>
;;

;; Computation A.21, p.399#comp.2
;;
;; TO PRINT.SEQUENCE X Y
;;    REPEAT FOR I = X TO Y
;;       PRINT I
;;
(define (print.sequence x y)
  (for ([i (in-range x y)])
    (print i)))
```

This construct can be replaced with `for` loop over a range. From my interpretation of the wording I think the extent is inclusive, but we shall see.

> It is also possible to use `REPEAT FOR` in a slightly more general form in which the range is specified explicitly as a list of values. This form is "`REPEAT FOR <variable> IN <list of values>`,"…

```scheme
;; Formula A.6, p.399#form.1
;;
;; REPEAT FOR <variable> IN <list of values>
;;

;; Computation A.22, p.399#comp.3
;;
;; REPEAT FOR I IN [1 2 3 7 12]
;;
(for ([i '(1 2 3 7 12)]) )
```

This very directly translates to Racket's `for` loop.

### Recursion

> Although it is implicit in the description of procedures, we should point out explicitly that a procedure can include calls to *any* procedure, including itself. Here, for example, is a simple program from chapter 1:

```scheme
;; Computation A.23, p.399#comp.4
;;
;; TO POLYSPIRAL (SIDE, ANGLE)
;;    FORWARD SIDE
;;    LEFT ANGLE
;;    POLYSPIRAL (SIDE + 1, ANGLE)
;;
(define (polyspiral side angle)
  (forward side)
  (left angle)
  (polyspiral (add1 side) angle))
```

> One can have more complex recursive structures, such as when procedure 1 calls procedure 2 which calls procedure 1. This structure is used in the following alternative version of the `DUOPOLY` procedure (subsection 3.1.4):

```scheme
;; Computation A.24, p.400#comp.0
;;
;; TO DUOPOLY (SIDE1, ANGLE1, SIDE2, ANGLE2)
;;    POLY1 (SIDE1, ANGLE1, SIDE2, ANGLE2, 0, 0)
;;
(define (duopoly side1 angle1 side2 angle2)
  (poly1 side1 angle1 side2 angle2 0 0))

;; TO POLY1 (SIDE1, ANGLE1, SIDE2, ANGLE2, H1, H2)
;;    SETHEADING H1
;;    FORWARD SIDE1
;;    LEFT ANGLE1
;;    POLY2 (SIDE1, ANGLE1, SIDE2, ANGLE2, HEADING, H2)
;;
(define (poly1 side1 angle1 side2 angle2 h1 h2)
  (setheading h1)
  (forward side1)
  (left angle1)
  (poly2 side1 angle1 side2 angle2 heading h2))

;; TO POLY2 (SIDE1, ANGLE1, SIDE2, ANGLE2, HEADING, H2)
;;    SETHEADING H2
;;    FORWARD SIDE2
;;    LEFT ANGLE2
;;    POLY2 (SIDE1, ANGLE1, SIDE2, ANGLE2, H1, HEADING)
;;
(define (poly2 side1 angle1 side2 angle2 h1 h2)
  (setheading h2)
  (forward side2)
  (left angle2)
  (poly2 side1 angle1 side2 angle2 h1 heading))
```

Racket supports recursion, and does tail call elimination giving it support for infinite looping, since recursion is the main looping construct in the Scheme dialects of Lisp. 

### Lists

> One very important feature of Turtle Procedure Notation is the ability to combine the basic data objects—numbers and character strings—to form compound data objects.…In this book we've used only one kind of compound data object, the *list*. A list is simply a sequence of data objects. To specify a list in Turtle Procedure Notation, one lists the objects in sequence, surrounded by brackets. For example, `[1 (3+5) 7]` is a list of three numbers: `1`, `8`, and `7`. Lists may contain character strings as well as numbers.
> More significantly, lists may contain items that are themselves lists. For instance, `[1 2 [3 4 5]]` is a list of three items, the third of which is itself a list of three items. Consequently, lists can readily be used to represent *hierarchical structures,* that is structures consisting of parts which themselves consist of parts.

```scheme
;; Example A.5, p.400#ex.0
;;
;; [1 (3+5) 7]
;;
(list 1 (+ 3 5) 7)

;; Example A.6, p.400#ex.1
;;
;; [1 2 [3 4 5]]
;;
(list 1 2 (list 3 4 5))
```

Racket, a dialect of Lisp, the *LISt Processor,* can use lists (or vectors) for this:

> The `ITEM` operation is used to extract the elements of a list. `ITEM(L,N)` returns the Nth item from the list L.

```scheme
;; Computation A.25, p.401#comp.0
;;
;; ITEM ([1 2 [3 4 5]], 3)
;; -> [3 4 5]
;;
(list-ref (list 1 2 (list 3 4 5)) 2)
; -> '(3 4 5)

;; Computation A.26, p.401#comp.1
;;
;; ITEM (ITEM ([1 2 [3 4 5]], 3), 2)
;; -> 4
;;
(list-ref (list-ref (list 1 2 (list 3 4 5)) 2) 1)
; -> 4
```

Racket uses `(list-ref lst pos)` for this, and unlike Turtle Procedure Language's one-based values, `pos` is zero-based. We can add an `item` function to the prelude to help us keep this straight:

```scheme
;; Prelude A.5, p.401#form.0
;;
;; ITEM(L,N)
;;
(define (item l n) (list-ref l (sub1 n)))
```

> There are two other useful operations for taking lists apart: The operation `FIRST` returns the first item of a list (thus, `FIRST` is the same as `ITEM` with a second argument of 1). The operation `REST` returns the list with the first element removed (thus, `REST[1 2 3]` returns `[2 3]` and `REST[2 3]` returns `[3]`).

```scheme
;; Example A.7, p.401#ex.0
;;
;; REST[1 2 3]
;;
(rest '(1 2 3))
; -> '(2 3)

;; Example A.8, p.401#ex.1
;;
;; REST[2 3]
;;
(rest '(2 3))
; -> '(3)
```

Racket has `first` and `rest` functions.

> One very important property of lists in Turtle Procedure Language is the fact that they can be manipulated as *first-class data objects,* which is to say that they can be assigned names using variables, passed as inputs to procedures, returned as outputs from procedures, and so on.

```scheme
;; Computation A.27, p.401#comp.2
;;
;; TO SUM (V, W)
;;    RETURN [ITEM(V,1)+ITEM(W,1) ITEM(V,2)+ITEM(W,2)]
;;
(define (sum v w)
  (list (+ (list-ref v 0) (list-ref w 0))
        (+ (list-ref v 1) (list-ref w 1))))

;; Computation A.28, p.401#comp.3
;;
;; A ← [1 3]
;; B ← [5 -1]
;;
(define a '(1 3))
(define b '(5 -1))

;; Example A.9, p.401#ex.2
;;
;; SUM(a, b)
;; -> [6 2]
;;
(sum a b)
; -> '(6 2)
```

Indeed, Racket treats lists as first-class objects.

### Structure-Directed Operations

> Writing programs that deal with lists often entails unpacking items from a list, performing some computation, and repacking the results into a new list. This kind of operation is facilitated by a technique known as *structure-directed assignment.*

```scheme
;; Computation A.29, p.401#comp.4
;;
;; [A B C] ← L
;;
;; Alternative 0: define
(match-define ([list a b c] l))

;; Computation A.29, p.401#comp.4
;;
;; [A B C] ← L
;;
;; Alternative 1: let
(match-let ([list a b c] l) …)
```

Depending on context, `match-define` or `match-let` can be used to do this.

> A similar technique enables procedures to specify *structure-directed inputs* in the title line. For example the vector-sum procedure above could also be written as

```scheme
;; Computation A.30, p.402#comp.0
;;
;; TO SUM ([V1 V2], [W1 W2])
;;    RETURN [(V1 + V2) (W1 + W2)]
;;
(define (sum v w)
  (match-let ([(list v1 v2) v]
              [(list w1 w2) w])
    (list (+ v1 w1)
          (+ v2 w2))))
```

In this context `match-let` can be used to destructure the lists.

### Local Variables

> In dealing with large programs consisting of many interacting procedures, it is important to have techniques for making the program *modular* by controlling the interactions between different parts of the program. One valuable modularity mechanism that can be provided by a computer language is to make it possible for the programmer to assign variable names independently in different parts of the program, without worrying about conflicts of names or about one part of the program accidentally destroying the variables of another part. The general problem of how to do this, and exactly what constitutes "different parts of a program," is referred to in computer-language design as the issue of "scope of variables." Different languages have different conventions for dealing with this issue.
> One point on which most of these conventions agree is that the names of inputs to procedures should be made totally internal, or *local,* to the procedure call.

```scheme
;; Computation A.31, p.402#comp.1
;;
;; TO ABS X
;;    IF X > 0 THEN RETURN X ELSE RETURN -X
;;
(define (abs x)
  (if (> x 0) x (- x)))

;; Computation A.32, p.402#comp.2
;;
;; X ← 10
;; PRINT ABS (X + 3)
;;
(define x 10)
(print (abs (+ x 3)))
```

Racket supports lexically scoped local variables, allowing for each instance of the `nested.triangle` function below to have its own copy of the variable `size`.

```scheme
;; Computation A.33, p.403#comp.0
;;
;; TO NESTED.TRIANGLE SIZE
;;    IF SIZE < 10 STOP
;;    REPEAT 3
;;       NESTED.TRIANGLE SIZE/2
;;       FORWARD SIZE
;;       RIGHT 120
;;
(define (nested.triangle size)
  (if (< size 10) stop)
  (repeat 3
    (nested.triangle (/ size 2))
    (forward size)
    (right 120)))
```

### The EXECUTE Command

> A final feature of Turtle Procedure Notation is the ability to execute character strings as commands in the language. This is accomplished by the `EXECUTE` command.

```scheme
;; Computation A.34, p.403#comp.1
;;
;; EXECUTE "PRINT 3 + 5"
;;
;; Alternative 0: eval
;;
(eval (call-with-input-string "(println (+ 3 5))" read))
```

Racket supports this functionality as well. I've hidden the details inside this `execute` function in the prelude:

```scheme
;; Prelude A.6, p.403#form.0
;;
;; EXECUTE s
;;
(define (execute s)
  (eval (call-with-input-string s read)))
```

So the original version could be rewritten as:

```scheme
;; Computation A.35, p.403#comp.1
;;
;; EXECUTE "PRINT 3 + 5"
;;
;; Alternative 1: execute function
;; 
(execute "(println (+ 3 5))")

;; Computation A.36, p.403#comp.2
;; TO ALTERNATE (COMMAND1, COMMAND2)
;;    REPEAT FOREVER
;;       EXECUTE COMMAND1
;;       EXECUTE COMMAND2
(define (alternate command1 command2)
  (forever
   (execute command1)
   (execute command2)))
```

## Reflections

That was a fair bit to cover, but that's the full extent of the Turtle Procedure Notation's language constructs. Converting them to Racket is really straightforward. It's interesting to think that those constructs, and a dozen functions to control a scuttling turtle drawing on a flat plane, make up the entirity of the environment the book operates in.

## Next Steps

In this installment we analysed the Turtle Procedure Notation's syntax and language constructs.

In the next post we'll focus on the Turtle Functions, and create the prelude implementation which sets-up our Turtle Geometry environment.

---