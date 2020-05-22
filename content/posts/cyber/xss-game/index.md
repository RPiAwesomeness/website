+++
title = "XSS Game Area"
date = "2020-05-21"
author = "vsvn"
draft = false
cover = ""
tags = ["xss", "cyber"]
keywords = ["cyber", "xss", "infosec", "cybersecurity"]
description = "A fun introduction to XSS"
showFullContent = false
+++

In my continued quest to learn all I can in the world of bug bounty, I stumbled across the [XSS Game](https://xss-game.appspot.com) from Google. It has six levels of differing XSS bugs, starting from the most generic direct DOM injection through a form of and insecure source injection. And apparently there's cake if you make it to the end!

So lets get right into it!

# Level 1: Hello, world of XSS

This one is super straightforward, just slap a `<script>alert()</script>` into the search engine box.

![slap it right in there](lvl1.png)

I didn't open the source for this one until I started this writeup, but this works because it's a direct injection of the `query` request parameter into the file on the result page:

![Like taking candy from a baby](lvl1-success.png)

# Level 2: Persistence is Key

This one wasn't too bad either, it's more of a stored XSS vulnerability. It's a social media site with totally unfiltered input. There are a bunch of ways that this could be exploited, though my first attempt of a simple `<script>alert()</script>` didn't work out.

So, we turn to an invalid image tag:

**Payload**: `<img src="#" onerror="alert()" />`:

![that's no moon...that's a vulnerability!](lvl2.png)
 
worked like a charm! You can see my broken image in the background with the congratulations alert:

![*explosion noises*](lvl2-success.png)

This works because it attempts to load an image located at the invalid path of "#", which will link to the HTML page itself (obviously not a valid image), and then fires the `onerror` handler.

# Level 3: That sinking feeling...

This level makes use of some dynamic content loading. Obviously, it was intended to be used for images...but we're not here for kittens. After looking at the source and some of the hints, I settled on line 17:

`html += "<img src='/static/level3/cloud" + num + ".jpg' />";`

There is no content validation on this parameter, so to break this you simply close out the single tick `'` opened in the `"<img src='/static/level3/cloud` part and inject some malicious stuff into the URL:

**Payload**: `'><script>alert()</script><img src='`

I realized I went a bit overkill with this, and definitely could've made it smaller, but it worked:

![Yeah, they're not on cloud 9 right now...](lvl3.png)

# Level 4: Context Matters

This is another content injection, but it redirects to a different page with some form of timer functionality. These are actually template HTML files, which you tell by the presence of the double curly braces in the code:

![](lvl4-template.png)

Looking into the Python server it looks like the string is passed straight through into the template, so it shouldn't be too hard. I initially tried passing in a malformed string to inject into the DOM, but this didn't work because the attempted closing of the div and injection of a script just appears in plaintext:

![](lvl4-plaintext.png)

So I targeted the JS next and that also flopped, with the page just sitting there waiting forever with part of my content showing:

![](lvl4-js-fail.png)

Hmm...why is that breaking? I popped open the console to check for JS errors and sure enough, we've got a `SyntaxError: '' string literal contains an unescaped line break`. What the heck? I eventually gave up and found [another writeup](https://medium.com/bugdecoder/google-xss-game-walkthrough-70d801dd922). He made use of an interesting bit of funkiness in JavaScript to make it attempt to evaluate our alert before calling the timeout:

**Payload**: `3'**alert();//`

JS attempts to evaluate `3**alert()` to get the argument for the `startTimer()` function, thus executing our payload!

![](lvl4-success.png)

# Level 5: Breaking protocol

This challenge has three pages total, passing around a string representing the next page to be loaded. I recognized this as a chance to inject a javascript "link" into the signup page (on line 15 of signup.html) through the `next` request parameter:

**Payload**: `?next=javascript:alert()`

![](lvl5.png)

This is triggered by clicking the `Next >>` link at the bottom of the page, which we injected with our super sneaky `javascript:alert()` functionality.

# Level 6: Follow the 🐇

This is the one that I was entirely lost on. Following the same writeup as before, I actually learned that writeup that if no protocol is supplied then it will be implied from the current page. This gets around the regex filter of disallowing all links with `http` or `https` at the start.

From there, he made use of Google's own [minified JavaScript API file](https://google.com/jsapi) and set the callback as alert:

**Payload**: `//google.com/jsapi?callback=alert`

![takes one to know one](lvl6.png)

I really liked this one because I learned two new things, the protocol being carried over and about Google's jsapi file, which was super clever.

# Conclusion

And with that... I was done!

I'm still definitely a beginner in the world of web app bug hunting, but it's exciting to learn some new stuff! I try to live by the idea of doing something every day to make myself better tomorrow, and this was it for today. I didn't have as much time as I would have liked and wasn't able to take on a Hacker101 CTF level like I have been, but this was good introduction to some new XSS techniques (even if half of them are *extremely* unlikely to actually show up in a real product).

It also gave me an opportunity to actually write something about what I'm doing for once, which I'm excited about! And finally... the cake was not, in fact, a lie:

![it wasn't a lie!](cake.png)
