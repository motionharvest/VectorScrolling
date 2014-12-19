/**
 * Copyright (c) 2014 Aaron Sherrill
 * http://www.digitalsurgeons.com
 * Made with love by Digital Surgeons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
 //mathutils
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
         var res = this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);

         return res;
     }
 };
 
//functionality concept
(function() {
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
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
            // if no second argument OR autoPlay is true, loop
        if (autoPlay === undefined || autoPlay === true) {
            animloop();
        }

        //options this element has
        return {
            kill: function(val) {
                callback(val);
                killswitch = true;
            },
            run: function() {
                animloop();
            }
        };
    }

   

    var $win = $(window),
        winHeight = $win.height();

    $win.resize(function() {
        winHeight = $win.height();
    });


    $.fn.piggy = function(options, inner) {

        $(this).each(function() {

            //scrolling variables
            var _top = $win.scrollTop(),
                _bottom = _top + winHeight,
                _middle = _top + (winHeight / 2),
                _rAF,
                containerOffset;

            //self variables
            var $self = $(this),
                r_top,
                r_bottom,
                r_middle,
                r_active,
                r_height;

            //positioning variables
            var _groupOffset,
                _tmp,
                _standardized,
                offBottom;

            //where we are
            r_top = $self.offset().top;
            r_height = $self.height();
            containerOffset = (inner === true) ? r_height : 0;

            r_bottom = r_top + r_height;
            r_middle = r_top + (r_bottom - r_top) * .5;


            if (options.hasOwnProperty("render")) {
                _rAF = new RenderFrameInstance(function() {
                    _groupOffset = _middle - r_middle;
                    _tmp = ((winHeight / 2) + (r_height / 2)) - containerOffset;
                    _standardized = Mathutils.map(_groupOffset, -_tmp, _tmp, -1, 1);
                    options.render(_standardized);
                }, false);
            }


            $win.scroll(function(e) {

                //grab some window stuff
                _top = $win.scrollTop();
                _bottom = _top + winHeight;
                _middle = _top + (winHeight / 2);

                //check if this element is in the zone
                if (r_top < _bottom - containerOffset && r_bottom > _top + containerOffset) {

                    if (!$self.hasClass("active")) {
                        $self.addClass("active")
                        if (options.hasOwnProperty("focus")) {
                            options.focus();

                        }
                        if (options.hasOwnProperty("render")) {
                            _rAF.run();
                        }
                    }
                    _groupOffset = _middle - r_middle;
                    _tmp = ((winHeight / 2) + (r_height / 2)) - containerOffset;

                    _standardized = Mathutils.map(_groupOffset, -_tmp, _tmp, -1, 1);
                    if (options.hasOwnProperty("scroll")) {
                        options.scroll(_standardized);
                    }

                } else {
                    if ($self.hasClass("active")) {
                        offBottom = (r_bottom > _top + containerOffset);
                        $self.removeClass("active");
                        if (options.hasOwnProperty("scroll")) {
                            options.scroll((offBottom) ? -1 : 1);
                        }
                        if (options.hasOwnProperty("render")) {
                            _rAF.kill((offBottom) ? -1 : 1);
                        }
                        if (options.hasOwnProperty("blur")) {
                            options.blur(offBottom);
                        }
                    }
                }

            }).scroll();

        });

    };
})();
