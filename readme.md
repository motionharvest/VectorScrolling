RenderFarm v3
==============================
It has been determined that there are 6 conditions for start positions and end positions from which elements can animate from and to.

DOM elements heights are looked at in percentages. Each DOM element is 100% tall.

The screen is also seen as a percentage. No matter the window size, it is considered 100% tall. With that in mind, the "TOP" is 0% and the "BOTTOM" is 100%.


The 6 Element Positions
---
Each element you target will have a point which activates it, and another point which deactivates it. They are considered active when `what percentage of the element's height` is `less than what percentage of the screen's height` and vice-versa for deactivating. Here are the 6 element positions for activation and deactivation.

 1. Activate when 0% is at 100%, deactivate when 100% is at 0%.
 2. Activate when 100% is at 100%, deactivate when 0% is at 0%.
 3. Activate when 0% is at 0%, deactivate when 100% is at 100%.
 4. Activate when 0% is at 0%, deactivate when 100% is at 0%.
 5. Activate when 0% is at 100%, deactivate when 100% is at 100%.
 6. Activate when x% is at x%, deactivate when x% is at x%

![](README/howtofarm.jpg)

Here is how you use it.
--
#### Detect on-screen and off-screen ####


    $('#selector').addPiggy({
		start: {
			when: "0%",
			is: "100%",
			call: function(){
			}
		},
		end: {
			when: "100%",
			at: "0%",
			call: function(){
			}
		}
    });


Select your element, specify the points that activate and deactivate it, and use the `call` method to take action on it.

#### Animate While Scrolling ####

    $('#selector').addPiggy({
		start: {
			when: "0%",
			is: "100%",
			vals: {
				x: 0
			}
		},
		end: {
			when: "100%",
			at: "0%",
			vals: {
				x: 50
			}
		},
		scroll: function(vals){
		}
    });

`scroll` is triggered when the element is on the screen and the user scrolls. An object is passed as an argument to the `scroll` method containing any properties you've specified inside of `start.vals` and `end.vals` as calculated to the  proportion of the distance between their values depending on the percentage of where your element is between the `start` and `end` values.