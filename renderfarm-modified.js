module.exports = (function() {
    'use strict';

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
	var y, totalDist, offset;

    //Hook into global instance
    function RenderFarm(scroller, callback) {

		//utility
		function updatePosition() {
			y = Math.abs(scroller.y);
			totalDist = Math.abs(scroller.maxScrollY);

			offset = Mathutils.map(y, 0, totalDist, 0, 1);

			callback({
				offset: offset
			});

		}

        //if an IScroll element has been added, lets use it for scrolling
        scroller.on('scroll', updatePosition);
        scroller.on('scrollEnd', updatePosition);
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);

		return {
			destroy: function() {
				y = undefined;
				totalDist = undefined;
				offset = undefined;
				scroller = null
			}
		}

    }

    return RenderFarm;

})();
