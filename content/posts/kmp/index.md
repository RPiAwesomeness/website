+++
title = "String Matching - Knuth-Morris-Pratt"
date = "2019-11-27"
publishdate = "2019-11-27"
author = "Nate Olander"
draft = true
cover = ""
tags = ["cs", "algorithms"]
keywords = ["cs", "algorithms", "kmp", "string-matching"]
description = "An exploration of the Knuth-Morris-Pratt string matching algorithm. If you can teach it you know it."
showFullContent = false
+++

# // Introduction

So what exactly is Knuth-Morris-Pratt? Well, simply put it's a string matching algorithm. You give it a source string and a pattern to match and it will find the offset of the pattern within the string.

The main reason that this is important is because it is an improvement on the naive method of simply checking character by character. This method is much slower and has a lot of wasted comparisons.

Sooooo we ended up with the first linear-time algorithm for string matching from James Morris, Donald Knuth, and Vaughan Pratt, published jointly in 1977.

# // Basics

The naive/brute force approach is O(len(S) * len(P)), which can end up being reeeaaaally bad. We don't want to do that if these two strings end up being long.

KMP to the rescue. What KMP does differently is it takes advantage of successful matches. It watches for any suffixes within the currently matching string that are also prefixes of the source string. Take a look at this example:

{{< example title="Suffix is Prefix" >}}

S = adsadgwxyktuadsadbe\
P = adsadbe

In this case, the first 3 letters match and then g &ne; b. So, we stop matching.

*However*, note that a suffix of the currently matched sequence ("adsad", suffix being "ad") is also a prefix of the
pattern! 

{{< /example >}}

Thus, we do not need to start comparing from the very start of the pattern again, we could start by comparing the 3rd character in the pattern (in this case "s") with the mis-matched character in the string.

Unfortunately, this comparison fails, since s &ne; g either, but we avoided a bunch of unnecessary comparisons!

Because it failed immediately and there was no matching suffix/prefix combo, we have to start over from the beginning of our pattern string, and start by comparing 'a' with 'w'. Bummer, it doesn't work again. So keep going in the source string until we match the first character in the pattern with the first character in the string.

# // Prefix-Suffix Table

Oh boy, here comes the good stuff. This is how you actually implement the algorithm in some software, by using a table to keep track of the offset into the pattern at which you can start.

More succinctly put:

> `table[i]` is the offset into P to start matching at after a mismatch at i + 1.
>
> The value in `table[i]` is the length of the longest suffix of the pattern that is also a prefix of the string in the range [0, i].

If we have a value of 0 in the table at index i, then there is no paired suffix/prefix that matches. Anything greater than 0, and that is the offset into the pattern to start with.

We can calculate the Prefix-Suffix table
