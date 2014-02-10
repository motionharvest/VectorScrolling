/**
 * Copyright (c) 2013 Aaron Sherrill
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



/**
 *  Controllable sections with animation capabilities
 *  As you scroll, determine which section is on the screen.
 *	Pass events to them.
 *	Ignore the rest.
 */


function RenderFarm( $window ){
    //private
    var _groups = [];
    var _active = false;
    var _i;
    var activeRender;
    
    //handle scrolling internally, why not
    var _nextActive;
    var _currActive;
    var  _top;
    var _bottom;
    var _middle;
	var _groupOffset;
    var _tmp;
	var _standardized;
	
	
    $window.on('scroll', function(e){
         
        _top = $window.scrollTop();
        _bottom = _top + $window.height();
        _middle = _top + ($window.height() * .5);
        
        
        /*
            This is the meat and potatoes
			Each scrolll event this loops the # of times that there are group containers to track
			IF there is a group container who's top is greather than the bottom of the viewport AND
				that group container's bottom is greater than the top of the viewport
					THEN part of that group's container MUST be on the screen.
			If a group container on the screen is not active, activate() it.
			Find the distance between the middle of the viewport, and the middle of an active group.
			Given half the viewport added to half the group height, standardize the proportion through the sroll to a value of -1 to 1,
				where -1 is as the group container surfaces from the bottom of the page
				and 1 is as the group container floats off the top of the page
			Pass 
			
        */
        for(_i = 0;  _i < _groups.length; _i++){
		
            if(_groups[_i].getTop() < _bottom && _groups[_i].getBottom() > _top){
                
                if(!_groups[_i].active){
                    _groups[_i].activate();
                }
                
                _groupOffset = _middle - _groups[_i].getMiddle();
                
                _tmp = ($window.height() / 2) + (_groups[_i].getHeight() / 2);
				
                _standardized = Mathutils.map(_groupOffset, -_tmp, _tmp, -1, 1);
                
                _groups[_i].scrollAll(_standardized);
                
            }else{
                if(_groups[_i].active){
                    _groups[_i].deactivate((_groups[_i].getBottom() > _top));
                }   
            }
        }
        
        
        
        
    })
    
    /*
		This animation loop runs over and over.
		Same as above.
		Undecided if its more trouble than its worth to change it
		
	*/
    function animloop(){
        requestAnimFrame(animloop);
        
        for(_i = 0;  _i < _groups.length; _i++){
            if(_groups[_i].active){
                
                _groupOffset = _middle - _groups[_i].getMiddle();
                
                _tmp = ($window.height() / 2) + (_groups[_i].getHeight() / 2);
				
                _standardized = Mathutils.map(_groupOffset, -_tmp, _tmp, -1, 1);
				
				_groups[_i].renderAll(_standardized);
            }
        }
        
    }
    
    /*
		When a group is added, prepare it.
	*/
    this.addGroup = function( R_Container ){
        //we're now have access to the Renderable Container.
        _groups.push(R_Container);
        R_Container.prepare();
    };
	
	/*
		Begin the animation loop
		Fire the first scroll event
	*/
    this.start = function(){
        animloop();
        $window.trigger('scroll');
    }    
}

/*
	A renderable container defines the group of renderable elements
	Passes down prepare, focus, blur, scroll, and render events from the RenderFarm 
	
	Define a renderable container with a jQuery selector.
	Add the renderable container to the RenderFarm
*/
function RenderableContainer( selector ){
    //private variables
    var $container = selector;
    $container.resize(function(){
    	$container.trigger('scroll');
    })
    
    
    
    var IR_Children = [];
	var _height = $container.height();
    var _top;
    var _bottom;
    var _middle;
    
    //public variables
    /*
        If the current one is active, we don't need to re-activate it
    */
    this.active = false;
	
    this.prepare = function(){
       //establish a knowledge of where this element is
       _top = $container.offset().top;
       _bottom = _top + $container.height();
       _middle = _top + (_bottom - _top) * .5;
	   
	   //if a child element implements a this.prepare() method call it now
       for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('prepare')){
                IR_Children[i].prepare();
            }
        }
    };
	
	//make knowledge of where this element is, referecable
    this.getTop = function(){
        return _top;
    };
    this.getBottom = function(){
        return _bottom;
    };
    this.getMiddle = function(){
        return _middle;     
    };
    this.getHeight = function(){
        return _height;  
    };
	
	
	/*
		Pass actions to all children that implement those properties
	*/
	
    //a container's activate fires focus
    this.activate = function(){
        this.active = true;
         $container.addClass('active');
         for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('focus')){
                IR_Children[i].focus();
            }
        }
    }
    
    //blur (disappears off the screen) boolean offBottom - true if disappears off the bottom of the window
    this.deactivate = function( offBottom ){
        this.active = false;
        $container.removeClass('active');
        for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('blur')){
                IR_Children[i].blur(offBottom);
            }
        }
    }
    
	//render loop pass distance
    this.renderAll = function(distance){
        for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('render')){
                IR_Children[i].render(distance);
            }
        }
    };
    
    //if children have a scroll method, give it a call, and pass along the distance it is from the center
    this.scrollAll = function(distance){
        for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('scroll')){
                IR_Children[i].scroll(distance);
            }
        }
    };
    
	/*
		Tell this container that it should take ownership of this object
		-Optional if the iRenderable class implements a this.core variable (a dynamic jQuery object that isn't in the DOM)
			add it to the DOM inside of this group's $container
	*/
    this.addChild = function( iRenderable ){
        IR_Children.push( iRenderable );
        if(iRenderable.hasOwnProperty('core')){
            $container.append( iRenderable.core() );
        }
    };

}
/*
	A possible child renderable
	
	function ExampleChild($selector){
		this.focus = function(){
			//add events or start intervals
		};
		this.scroll = function( standardizedOffset ){
			//do something amazing
		};
		this.blur = function(offBottom){
			//remove events or stop intervals
			//reset the group based on if its offBottom or not.
		}
	}
	
	var example_child = new ExampleChild($('#foo_bar'));
	
*/

 /*
	RenderFarm implements a few features that require external code. Nothing intense, but it's below
	RequestAnimationFrame
	Read more http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
 window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
 /*
	RequestAnimationFrame Polyfill
	Read more http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*
	Mathutils for converting values proportionally from one range to another
	Inspired by https://github.com/bigspaceship/as3/blob/master/com/bigspaceship/utils/MathUtils.as
*/
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
        var res = this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);

        return res;
    }
};
