
module.exports = (function () {

	//Mathutils never fails me!
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
	function updatePosition(){
		wTop = -(this.y >> 0);
		wBottom = wTop + wHeight;
		for (i = 0; i < onScrollCallbacks.length; i++) {
			onScrollCallbacks[i]();
		}
	}
	function equalize(perc, from, to){
		tmpVals = {};
		for (i in from){
			tmpVals[i] = Mathutils.map(perc, 0, 1, from[i], to[i]);
		}
		return tmpVals;
	}


	//Hook into global instance
	function RenderFarm(options) {

		//if an IScroll element has been added, lets use it for scrolling
		if(options && options.hasOwnProperty("scroller")) {

			options.scroller.on('scroll', updatePosition);
			options.scroller.on('scrollEnd', updatePosition);
			document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

			//hold onto this object
			$scroller = $(options.scroller.scroller);

			//set winHeight on resize
			$win.resize(function() {
				wHeight = $win.height();
				wBottom = wTop + wHeight;
				for(i = 0; i < onResizeCallbacks.length; i++) {
					onResizeCallbacks[i]();
				}
				updatePosition();
			});
		}else{
			$win.scroll(function(e){
				e.preventDefault();
				updatePosition();
				console.log("woop");
			});
		}

		return {

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
					pTop = $tmpPiggy.position().top;
					pHeight = $tmpPiggy.height();
					pWhenStart = pTop + (pHeight * options.start.when);
					pWhenEnd = pTop + (pHeight * options.end.when);
				});


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


					}else if((pWhenStart > wTop + (wHeight * options.start.is)
						|| pWhenEnd < wTop + (wHeight * options.end.is))
						&& active){

						//nice - deactivate
						active = false;
						if(options.end.hasOwnProperty("call")){
							options.end.call();
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

				$win.resize();
			}
		}
	};

	return RenderFarm;
})();
