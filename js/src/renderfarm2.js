/**
 * In this version I'm trying to be more flexible
 */
(function () {

	var Mathutils = {
		normalize: function ($value, $min, $max) {
			return ($value - $min) / ($max - $min);
		},
		interpolate: function ($normValue, $min, $max) {
			return $min + ($max - $min) * $normValue;
		},
		map: function ($value, $min1, $max1, $min2, $max2) {
			if ($value < $min1) {
				$value = $min1;
			}
			if ($value > $max1) {
				$value = $max1;
			}

			return this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);
		}
	};

	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	//RAF wrapper
	function RenderFrameInstance(callback, autoPlay) {
		var killswitch = false;

		//loop
		function animloop() {
			if (killswitch) {
				killswitch = false;
				return;
			}
			requestAnimFrame(animloop);
			callback();
		}

		if (autoPlay === undefined || autoPlay === true) {
			animloop();
		}

		//options this element has
		return {
			kill: function (val) {
				callback(val);
				killswitch = true;
			},
			run: function () {
				animloop();
			}
		};
	}

	//window control and window height
	var $win = $(window),
		wHeight = $win.height(),
		wBottom,
		wTop,
		piggies = [],
		onScrollCallbacks = [],
		onResizeCallbacks = [],
		i,
		tmpVals;

	//set winHeight on resize
	$win.resize(function () {
		wHeight = $win.height();
		wTop = $win.scrollTop();
		wBottom = wTop + wHeight;
		for (i = 0; i < onResizeCallbacks.length; i++) {
			onResizeCallbacks[i]();
		}
		$win.scroll();
	});

	//set scrolltop on scroll
	$win.scroll(function () {
		wTop = $win.scrollTop();
		wBottom = wTop + wHeight;
		for (i = 0; i < onScrollCallbacks.length; i++) {
			onScrollCallbacks[i]();
		}
	});


	function equalize(perc, from, to){
		tmpVals = {};
		for (i in from){
			tmpVals[i] = Mathutils.map(perc, 0, 1, from[i], to[i]);
		}
		return tmpVals;
	}


	//yup, its officially a jQuery extension
	$.fn.piggy = function (options) {

		//loop through matching selectors
		$(this).each(function () {

			//piggy position
			var $tmpPiggy = $(this),
				pTop,
				pHeight,
				pWhenStart,
				pWhenEnd,
				active = false,
				track1,
				track2,
				trackPerc=0,
				rAF;

			//lets keep 'em handy
			piggies.push($tmpPiggy);

			//I need to make sure I have a start and an end.
			if (!options.hasOwnProperty("start") || !options.hasOwnProperty("end")) {
				console.warn("Must supply start:{} and end:{} objects. Look at the example in the documentation for details.");
				return;
			}

			//A little house keeping is necessary. percentages need to be decimals
			if(options.start.when.indexOf("%") !== -1){
				options.start.when = Number(options.start.when.split("%")[0]) / 100;
			}
			if(options.start.is.indexOf("%") !== -1){
				options.start.is = Number(options.start.is.split("%")[0]) / 100;
			}
			if(options.end.when.indexOf("%") !== -1){
				options.end.when = Number(options.end.when.split("%")[0]) / 100;
			}
			if(options.end.is.indexOf("%") !== -1){
				options.end.is = Number(options.end.is.split("%")[0]) / 100;
			}


			//Begin with knowing values dependant on sizing
			onResizeCallbacks.push(function(){
				pTop = $tmpPiggy.offset().top;
				pHeight = $tmpPiggy.height();
				pWhenStart = pTop + (pHeight * options.start.when);
				pWhenEnd = pTop + (pHeight * options.end.when);
			});

			if(options.hasOwnProperty("render")){
				rAF = new RenderFrameInstance(function() {
					if(options.start.hasOwnProperty("vals") && options.end.hasOwnProperty("vals")){
						options.render(equalize(trackPerc, options.start.vals, options.end.vals));
					}else{
						options.render({offset:trackPerc});
					}
				}, false);
			}

			//I need to know what the breakpoints are
			onScrollCallbacks.push(function () {

				//check if we're inside the window start and end.
				if(pWhenStart < wTop + (wHeight * options.start.is)
					&& pWhenEnd > wTop + (wHeight * options.end.is)
					&& !active){

					//call once if we haven't activated yet, and call() exists
					if(options.start.hasOwnProperty("call") && !active){
						options.start.call();
					}
					active = true;

					if(options.hasOwnProperty("render")){
						rAF.run();
					}


				}else if((pWhenStart > wTop + (wHeight * options.start.is)
					|| pWhenEnd < wTop + (wHeight * options.end.is))
					&& active){

					//nice - deactivate
					active = false;
					if(options.end.hasOwnProperty("call")){
						options.end.call();
					}
					if(options.hasOwnProperty("render")){
						rAF.kill();
					}

					//when deactivating, check if its off the bottom, or off the top, and force a scroll call
					if((pWhenEnd > wTop + (wHeight * options.end.is))){
						//off bottom
						//if we have values to check, equalize the values proportionally to trackPerc
						if(options.hasOwnProperty("scroll")){
							if(options.start.hasOwnProperty("vals") && options.end.hasOwnProperty("vals")){
								options.scroll(options.start.vals);
							}else{
								options.scroll(0);
							}
						}

					}else{
						if(options.hasOwnProperty("scroll")){
							if(options.start.hasOwnProperty("vals") && options.end.hasOwnProperty("vals")){
								options.scroll(options.end.vals);
							}else{
								options.scroll(1);
							}
						}
					}
				}

				//If a scroll is active I'd like to know how far through it is.
				if(active){
					track1 = wTop + (wHeight * options.start.is) - pWhenStart;
					track2 = pWhenEnd - (wTop + (wHeight * options.end.is));
					trackPerc = Mathutils.map(track1, 0, track1 + track2, 0, 1);


					//if we have values to check, equalize the values proportionally to trackPerc
					if(options.hasOwnProperty("scroll")){
						if(options.start.hasOwnProperty("vals") && options.end.hasOwnProperty("vals")){
							options.scroll(equalize(trackPerc, options.start.vals, options.end.vals));
						}else{
							options.scroll({offset:trackPerc});
						}
					}
				}

			});




		});

		//run a resize command to calculate values
		$win.resize();
	};
})();