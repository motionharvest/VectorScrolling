module.exports = (function() {
    'use strict';

    //MONITOR THESE
	var y, totalDist, offset;

    //Hook into global instance
    function RenderFarm(scroller, callback) {

		//utility
		function updatePosition() {
			y = Math.abs(scroller.y);
			totalDist = Math.abs(scroller.maxScrollY);
			offset = y / totalDist;
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
