RenderFarm
==============================

Completely re-done.

Simple to use interface.

    $('.className').piggy({
 		focus: function(){
        },
		blur: function(offBottom){
		},
		scroll: function(offset){
		},
		render: function(offset){
		}
    });

That's it. Nothing hard. Just target an element, and give it instructions for the cases that fit your needs.

#### focus ####
`focus` is triggered when the element appears on the screen

#### blur ####
`blur` is triggered when the element is scrolled off the screen. A boolean is passed to indicate if the element has been scrolled off the bottom.

#### scroll ####
`scroll` is triggered when the element is on the screen and the user scrolls. A value between -1 and 1 is passed to indicate how much of the element is on the screen.

When the element is exactly centered on the screen, offset is 0 

#### render ####
`render` is triggered when the element is on the screen using requestAnimationFrame. A value between -1 and 1 is passed to indicate how much of the element is on the screen.

When the element is exactly centered on the screen, offset is 0

There is a demo included showing how to control a Greensock TimelineLite animation with this new implementation. Everything else should be easy to figure out for yourself.

Enjoy animating everything!

http://codepen.io/cmndo/pen/PwoRyx
