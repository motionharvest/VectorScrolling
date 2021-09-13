Install
==============================
	npm install vectorscrolling --save-dev


#### Control a GSAP Timeline Animation ####
```
	//include gsap
	var myGSAPTimeline = gsap.timeline({paused:true});
	...

	const vs = require('vectorscrolling');
	vs(myGSAPTimeline, {
		trigger: "#myTarget",
		start: "top top",
		end: "bottom bottom"
	});

	/*
		The above says: Start when #myTarget's top is at the top of the viewport and end when #myTarget's bottom is at the bottom of the viewport.
	*/
```	

Using VectorScrolling
==============================
Does the animation start as your element is coming into view? Or does the animation wait until the entire element is in the middle on the screen? Maybe the element is already on the screen at page load (Like a nav bar) and you want to animate it as the user scrolls down your page. It's up to you.

Blatantly Rip of ScrollTrigger?
---
Hey look, I was here first, so what if Greensock is bigger. We can coexist. In 4.0.0 I've been inspired by Greensock's interface for controlling the timeline. So now it's easier to remember how to use it. VectorScolling parses the text properties `top`, `middle`, and `bottom`. Nothing else. It's just basic scrub features of ScrollTrigger, packed up in <1kb


Have fun
---
[Demo](https://codepen.io/motionharvest/pen/rNwwRxX)
