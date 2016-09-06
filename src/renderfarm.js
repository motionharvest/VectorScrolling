(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		// Now we're wrapping the factory and assigning the return
		// value to the root (window) and returning it as well to
		// the AMD loader.
		define(["renderfarm"], function(postal) {
			return (root.renderfarm = factory(postal));
		});
	} else if (typeof module === "object" && module.exports) {
		// I've not encountered a need for this yet, since I haven't
		// run into a scenario where plain modules depend on CommonJS
		// *and* I happen to be loading in a CJS browser environment
		// but I'm including it for the sake of being thorough
		module.exports = (root.renderfarm = factory(require("renderfarm")));
	} else {
		root.renderfarm = factory();
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


	//MONITOR THESE
	var $win = $(window),
		$scroller,
		wHeight,
		wBottom,
		wTop = 0,
		piggies = [],
		onScrollCallbacks = [],
		onResizeCallbacks = [],
		i,
		tmpVals;


	//utility

	function updatePosition() {
		if(this.hasOwnProperty("y")) {
			wTop = -(this.y >> 0);
		} else {
			wTop = $scroller.scrollTop();
		}

		wBottom = wTop + wHeight;
		for (i = 0; i < onScrollCallbacks.length; i++) {
			onScrollCallbacks[i]();
		}
	}

	function equalize(perc, from, to) {
		tmpVals = {};
		for (i in from) {
			tmpVals[i] = Mathutils.map(perc, 0, 1, from[i], to[i]);
		}
		return tmpVals;
	}


	//Hook into global instance
	function RenderFarm(options) {

		//if an IScroll element has been added, lets use it for scrolling
		if (options.hasOwnProperty("scroller")) {
			options.scroller.on('scroll', updatePosition);
			options.scroller.on('scrollEnd', updatePosition);
			document.addEventListener('touchmove', function(e) {
				e.preventDefault();
			}, false);

			//hold onto this object
			$scroller = $(options.scroller.scroller);

			//set winHeight on resize
			$win.resize(function() {
				wHeight = $win.height();
				wBottom = wTop + wHeight;
				for (i = 0; i < onResizeCallbacks.length; i++) {
					onResizeCallbacks[i]();
				}
				updatePosition();
			});
		} else {
			$scroller = $(window);
			$scroller.scroll(function(){
				updatePosition();
			});
			updatePosition();

			//set winHeight on resize
			$win.resize(function() {
				wHeight = $win.height();
				wBottom = wTop + wHeight;
				for (i = 0; i < onResizeCallbacks.length; i++) {
					onResizeCallbacks[i]();
				}
				updatePosition();
			});

		}

		return {
			recalculate: function() {
				wHeight = $win.height();
				wBottom = wTop + wHeight;
				for (i = 0; i < onResizeCallbacks.length; i++) {
					onResizeCallbacks[i]();
				}
			},
			destroy: function() {
				piggies = [];
				onScrollCallbacks = [];
				onResizeCallbacks = [];
			},
			addPiggy: function(elem, options) {
				//piggy position
				var $tmpPiggy = $(elem),
					pTop,
					pHeight,
					pWhenStart,
					pWhenEnd,
					active = false,
					track1,
					track2,
					trackPerc = 0,
					rAF;


				//lets keep 'em handy
				piggies.push($tmpPiggy);

				//I need to make sure I have a start and an end.
				if (!options.hasOwnProperty("start") || !options.hasOwnProperty("end")) {
					console.warn("Must supply start:{} and end:{} objects. Look at the example in the documentation for details.");
					return;
				}

				//A little house keeping is necessary. percentages need to be decimals
				if (options.start.when.indexOf("%") !== -1) {
					options.start.when = Number(options.start.when.split("%")[0]) / 100;
				}
				if (options.start.is.indexOf("%") !== -1) {
					options.start.is = Number(options.start.is.split("%")[0]) / 100;
				}
				if (options.end.when.indexOf("%") !== -1) {
					options.end.when = Number(options.end.when.split("%")[0]) / 100;
				}
				if (options.end.is.indexOf("%") !== -1) {
					options.end.is = Number(options.end.is.split("%")[0]) / 100;
				}


				//Begin with knowing values dependant on sizing
				onResizeCallbacks.push(function() {
					pTop = $tmpPiggy.offset().top;
					pHeight = $tmpPiggy.height();
					pWhenStart = pTop + (pHeight * options.start.when);
					pWhenEnd = pTop + (pHeight * options.end.when);
				});


				//I need to know what the breakpoints are
				onScrollCallbacks.push(function() {

					//check if we're inside the window start and end.
					if (pWhenStart < wTop + (wHeight * options.start.is) &&
						pWhenEnd > wTop + (wHeight * options.end.is) &&
						!active) {

						//call once if we haven't activated yet, and call() exists
						if (options.start.hasOwnProperty("call") && !active) {

							//check if it's coming on from the bottom
							//console.log(pTop, pHeight, pWhenStart, pWhenEnd, wTop);
							if(wTop > pTop) {
								options.start.call(false);
							} else {
								options.start.call(true);
							}

						}
						active = true;


					} else if ((pWhenStart > wTop + (wHeight * options.start.is) ||
							pWhenEnd <= wTop + (wHeight * options.end.is)) &&
						active) {

						//nice - deactivate
						active = false;


						//when deactivating, check if its off the bottom, or off the top, and force a scroll call

						if ((pWhenEnd > wTop + (wHeight * options.end.is))) {
							//off bottom
							//if we have values to check, equalize the values proportionally to trackPerc
							if (options.hasOwnProperty("scroll")) {
								if (options.start.hasOwnProperty("vals") && options.end.hasOwnProperty("vals")) {
									options.scroll(options.start.vals);
								} else {
									options.scroll({
										offset: 0
									});
								}
							}

							if (options.end.hasOwnProperty("call")) {
								options.end.call(false);
							}

						} else {
							active = false;
							if (options.hasOwnProperty("scroll")) {
								if (options.start.hasOwnProperty("vals") && options.end.hasOwnProperty("vals")) {
									options.scroll(options.end.vals);
								} else {
									options.scroll({
										offset: 1
									});
								}
							}

							if (options.end.hasOwnProperty("call")) {
								options.end.call(true);
							}

						}
					}

					//If a scroll is active I'd like to know how far through it is.
					if (active) {
						track1 = Math.floor(wTop + (wHeight * options.start.is) - pWhenStart);
						track2 = Math.floor(pWhenEnd - (wTop + (wHeight * options.end.is)));
						trackPerc = Mathutils.map(track1, 0, track1 + track2, 0, 1);

						//if we have values to check, equalize the values proportionally to trackPerc
						if (options.hasOwnProperty("scroll")) {
							if (options.start.hasOwnProperty("vals") && options.end.hasOwnProperty("vals")) {
								options.scroll(equalize(trackPerc, options.start.vals, options.end.vals));
							} else {
								options.scroll({
									offset: trackPerc
								});
							}
						}
					}
				});

				$win.resize();
			}
		}
	};

	return RenderFarm;
}));