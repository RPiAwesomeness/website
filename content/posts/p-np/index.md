+++
title = "P & NP - this is completely confusing"
date = "2019-11-27"
publishdate = "2019-11-27"
draft = true
author = "Nate Olander"
tags = ["cs", "algorithms", "braindump"]
keywords = ["np", "algorithms", "cs"]
description = "I am learning P, NP, & NP-Completeness in my CS Algorithms class. It's confusing, so I'm trying to be able to explain it here because if you can explain a topic you understand it."
showFullContent = false
+++

This topic is something that just about every CS major will encounter at some point. It's wack. I don't understand it.
Let's change that.

# // Background

- An NP problem is one that has a set of inputs {x1, x2, .., xn} -> {T, F}
- NP = {decision problems with polynomial-sized certificates and polynomial-time verification} - you are unable to
guess something of exponential size
- You are unable to confirm that there is no satisfying assignment other than checking all possible inputs
- NP is biased towards YES answers, so if there is a YES answer it will eventually find it. If you put your guesses at
the start and verification at the end it is also a verification algorithm. 
- NP can be a good thing, because you know that problem X is no harder than NP
- X is not a member of P unless P = NP, which is extremely rare/lucky

# // NP-Completeness

If you have a problem X that is NP and X is NP-hard, then it is NP-Complete.
A problem X is NP-hard if every problem Y in NP can be reduced to X by a polynomial time algorithm.
You can reduce problem A -> problem B if all inputs for A can be converted to the equivalent B inputs. This means that
all inputs for A will get the same YES/NO output through the B algorithm.
This implies:
    B&isin;P  => A&isin;P
    B&isin;NP => A&isin;NP
You can't say that B is NP because A is NP, only B NP => A NP

NP-hard is everything harder than NP, with NP-Complete being at the border of NP and NP-hard.

**// How to Prove X is NP-Complete**

We cannot prove that X is not NP-Complete, but you can prove that X is at least NP-Complete and thus you won't waste
time trying to find a polynomial time algorithm for it.

Steps to prove:

1) X&isin;NP
    This means you either find a non-deterministic polynomial time algorithm, or you give a certificate and a verifier
2) Reduce from a known NP-Complete problem Y to X (reductions woo!)

You can choose any problem in NP-Complete that has already been proven to be NP-Complete, so a good chunk of the work
has already been done for us!

# // 3-SAT

This is done via converting the problem into ANDed clauses of 3 ORed literals.

# // 3-Dimensional Matching (3DM)

**Given**: disjoint sets X, Y, Z, each of size n,
           triples T &sube; X &#x2a2f; Y &#x2a2f; Z

**Is there** a subset S &sube; T s.t. every element &isin; X &union; Y &union; Z is in exactly on s &isin; S.

You can guess what elements of S are in T in polynomial time, thus it is in NP. There are at most n^3 elements, and you
can guess YES/NO for each of them.

This can be proved by reducing from 3-SAT.

For each variable Xi you can find a subset S that creates

Each clause will be in Xi &or; Xj &or; Xk. There will be a certain set of points that must be met by the clause,
otherwise the internal pair will be left behind and that is not acceptable. 
