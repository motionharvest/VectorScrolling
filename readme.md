Install
==============================
	npm install vectorscrolling --save-dev


#### Control a GSAP Timeline Animation ####
	const vs = require('vectorscrolling');
	vs("#myTarget", myGSAPTimeline);
	

Using VectorScrolling
==============================
Does the animation start as your element is coming into view? Or does the animation wait until the entire element is centered on the screen? Maybe the element is already on the screen at page load (Like a navigation bar), and you want to animate it as the user scrolls down your page. It's up to you.

The 5 Element Positions and the Vernacular
---
Target your element and think about how and when it shows up on the screen. Think in percentages. The screen's height ranges from 0% at the top to 100% at the bottom. Your element's top edge can be considered 0%, and it's bottom edge is 100%. With that in mind, if the top of your element is touching the top of the screen you'd say that 0% of the element is at 0% of the browser window.

Adding logic for start and end points.
---

The logic here requires some time to grasp. Ths image below can help to illustrate this.

The way I think about how a scrolling experience works is to break sections of animation into pieces. When do I want the animation to start being affected by the scrolling. My internal dialog says "when `what percentage of my element's height` is at `what percentage of the screen's height`, start controlling it." And then, "when `what percentage of my element's height` is `what percentage of the screen's height`, stop controlling it." Here are the 5 element positions for activation and deactivation, and that graphic I mentioned.

 1. Activate when 0% is at 100%, deactivate when 100% is at 0%.
 2. Activate when 100% is at 100%, deactivate when 0% is at 0%.
 3. Activate when 0% is at 0%, deactivate when 100% is at 100%.
 4. Activate when 0% is at 0%, deactivate when 100% is at 0%.
 5. Activate when 0% is at 100%, deactivate when 100% is at 100%.

![](README/howtofarm.jpg)

Configuration Options
--

#### Customize the Scroll Condition ####

	vs("#myTarget", myGSAPTimeline, {
		condition: 2
	});


#### Advanced - Condition 6 - Custom Everything ####

	vs("#myTarget", myGSAPTimeline, {
		condition: 6,
		start: {
			when: "25%",
			is: "100%",
			vals: {
				step: 0
			},
			call: function(){
				console.log("this element has entered the start condition");
			}
		},
		end: {
			when: "75%",
			is: "0%",
			vals: {
				step: 255
			},
			call: function(){
				console.log("this element has left the end condition");
			}
		},
		scroll: function(vals) {
			console.log(vals); 
			// returns vals object with properties at their percentage through the states.
		}
	});


Power Options
---
If you look at condition 6, you'll notice a bunch of options. These are available for all of the above examples. You can leverage the time-saving features with the default condition, but also react when the element is within the condition's range. Below I'm using the default condition (1) by not specifying it, but using the advanced feature of overriding the scroll method.


	vs("#myTarget", myGSAPTimeline, {
		start: {
			vals: {
				miles: 100
			}
		},
		end: {
			vals: {
				miles: 200
			}
		},
		scroll: function(vals) {
			console.log(vals)
		}
	});


Have fun
---
[Demo](https://codepen.io/motionharvest/full/PwoRyx/)
