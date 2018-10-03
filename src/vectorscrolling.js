(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		// Now we're wrapping the factory and assigning the return
		// value to the root (window) and returning it as well to
		// the AMD loader.
		define(function() {
			return (root.vs = factory());
		});
	} else if (typeof module === "object" && module.exports) {
		// I've not encountered a need for this yet, since I haven't
		// run into a scenario where plain modules depend on CommonJS
		// *and* I happen to be loading in a CJS browser environment
		// but I'm including it for the sake of being thorough
		module.exports = (root.vs = factory());
	} else {
		root.vs = factory();
	}
}(this, function() {
	//Mathutils never fails me!
	var Mathutils = {
		normalize: function($value, $min, $max) {
			return ($value - $min) / ($max - $min);
		},
		interpolate: function($normValue, $min, $max) {
			return $min + ($max - $min) * $normValue;
		},
		map: function($value, $min1, $max1, $min2, $max2) {
			if ($value < $min1) {
				$value = $min1;
			}
			if ($value > $max1) {
				$value = $max1;
			}
			return this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);
		}
	};
	// pure functions
	function equalize(perc, from, to) {
		var tmpVals = {};
		for (i in from) {
			tmpVals[i] = Mathutils.map(perc, 0, 1, from[i], to[i]);
		}
		tmpVals.offset = perc;
		return tmpVals;
	}


	function $$(el) {
		return el.nodeName ? el : el[0].nodeName ? el[0] : document.querySelector(el);
	}



	//Animate GSAP Timelines as you scroll.
	var vs = function(elem_or_selector, timeline, options) {

		// base options
		var defaults = {
			condition: 1,
			start: {},
			end: {},
			override: false
		}

		defaults.scroll = function(options) {
			if(!defaults.override) {
				timeline.seek(timeline.totalDuration() * options.offset);
			}
		}


		//it might be a config object
		// override with options
		if (options !== undefined && typeof(options) == "object") {
			for (var key in defaults) {
				if (options.hasOwnProperty(key)) {
					if (key === "scroll") {
						defaults.userScroll = options[key];
						defaults[key] = function(options) {
							defaults.userScroll(options);
							if(!defaults.override) {
								timeline.seek(timeline.totalDuration() * options.offset);
							}
						}
					} else {
						defaults[key] = options[key];
					}
				}
			}
		}


		// save configuration variables based on the condition
		switch (defaults.condition) {
			case 1:
				defaults.start.when = 0;
				defaults.start.is = 1;
				defaults.end.when = 1;
				defaults.end.is = 0;
				break;
			case 2:
				defaults.start.when = 1;
				defaults.start.is = 1;
				defaults.end.when = 0;
				defaults.end.is = 0;
				break;
			case 3:
				defaults.start.when = 0;
				defaults.start.is = 0;
				defaults.end.when = 1;
				defaults.end.is = 1;
				break;
			case 4:
				defaults.start.when = 0;
				defaults.start.is = 0;
				defaults.end.when = 1;
				defaults.end.is = 0;
				break;
			case 5:
				defaults.start.when = 0;
				defaults.start.is = 1;
				defaults.end.when = 1;
				defaults.end.is = 1;
				break;
			case 6:
				defaults.start.when = Number(options.start.when.split("%")[0]) / 100;
				defaults.start.is = Number(options.start.is.split("%")[0]) / 100;
				defaults.end.when = Number(options.end.when.split("%")[0]) / 100;
				defaults.end.is = Number(options.end.is.split("%")[0]) / 100;
				break;
		}


		// MONITOR THESE
		var last_known_scroll_position = window.scrollY,
			ticking = false,
			$win = window,
			wHeight,
			wBottom,
			wTop = 0,
			i,
			tmpVals,
			$tmpPiggy = $$(elem_or_selector),
			active = false,
			firstLoad = true;

		function doSomething(scroll_pos) {
			wTop = scroll_pos;
			wBottom = wTop + wHeight;


			//check if we're inside the window start and end.
			if (pWhenStart < wTop + (wHeight * defaults.start.is) &&
				pWhenEnd > wTop + (wHeight * defaults.end.is) &&
				!active) {

				//call once if we haven't activated yet, and call() exists
				if (defaults.start.hasOwnProperty("call") && !active) {

					//check if it's coming on from the bottom
					//console.log(pTop, pHeight, pWhenStart, pWhenEnd, wTop);
					if (wTop > pTop) {
						defaults.start.call(false);
					} else {
						defaults.start.call(true);
					}

				}
				active = true;


			} else if ((pWhenStart > wTop + (wHeight * defaults.start.is) ||
					pWhenEnd <= wTop + (wHeight * defaults.end.is)) &&
				active) {

				//nice - deactivate
				active = false;


				//when deactivating, check if its off the bottom, or off the top, and force a scroll call

				if ((pWhenEnd > wTop + (wHeight * defaults.end.is))) {
					//off bottom

					//if we have values to check, equalize the values proportionally to trackPerc
					if (defaults.hasOwnProperty("scroll")) {
						if (defaults.start.hasOwnProperty("vals") && defaults.end.hasOwnProperty("vals")) {
							defaults.scroll(defaults.start.vals);
						} else {
							defaults.scroll({
								offset: 0
							});
						}
					}

					if (defaults.end.hasOwnProperty("call")) {
						defaults.end.call(false);
					}

				} else {
					active = false;
					if (defaults.hasOwnProperty("scroll")) {
						if (defaults.start.hasOwnProperty("vals") && defaults.end.hasOwnProperty("vals")) {
							defaults.scroll(defaults.end.vals);
						} else {
							defaults.scroll({
								offset: 1
							});
						}
					}

					if (defaults.end.hasOwnProperty("call")) {
						defaults.end.call(true);
					}

				}
			} else if(firstLoad) {
				firstLoad = false;
				//todo check if it's above or below

				//for now, I' just gonna put it on it's end
				defaults.scroll({
					offset: 1
				});
			}

			//If a scroll is active I'd like to know how far through it is.
			if (active) {
				track1 = Math.floor(wTop + (wHeight * defaults.start.is) - pWhenStart);
				track2 = Math.floor(pWhenEnd - (wTop + (wHeight * defaults.end.is)));
				trackPerc = Mathutils.map(track1, 0, track1 + track2, 0, 1);



				//if we have values to check, equalize the values proportionally to trackPerc
				if (defaults.hasOwnProperty("scroll")) {
					if (defaults.start.hasOwnProperty("vals") && defaults.end.hasOwnProperty("vals")) {
						defaults.scroll(equalize(trackPerc, defaults.start.vals, defaults.end.vals));
					} else {
						defaults.scroll({
							offset: trackPerc
						});
					}
				}
			}
		}

		function scrollHandler(e) {
			last_known_scroll_position = window.scrollY;

			if (!ticking) {

				window.requestAnimationFrame(function() {
					recalculate();
					doSomething(last_known_scroll_position);
					ticking = false;
				});

				ticking = true;

			}
		}

		window.addEventListener('scroll', scrollHandler);


		function recalculate() {
			wHeight = window.innerHeight;
			wTop = last_known_scroll_position;
			wBottom = Math.abs(wTop) + wHeight;

			pTop = $tmpPiggy.offsetTop;
			pHeight = $tmpPiggy.clientHeight;
			pWhenStart = pTop + (pHeight * defaults.start.when);
			pWhenEnd = pTop + (pHeight * defaults.end.when);
		}




		//set winHeight on resize
		window.addEventListener('resize', function() {
			recalculate();
			doSomething(last_known_scroll_position);
		}, {
			passive: true
		});

		recalculate();
		doSomething(last_known_scroll_position); 

		return false;
	}

	return vs;
}));