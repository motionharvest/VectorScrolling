//define some unrelated capabilities
// shim layer with setTimeout fallback
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
    
/**
 *  Here's what I see.
 *  Controllable sections of animation.
 *  When scrolling determine which section is closest to the middle of the screen and activate it.
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
    var  _middle;
    $window.on('scroll', function(e){
         _middle = $window.scrollTop() + ($window.height() * .5);
        var _closest = 99999999;
        var _tmp ;
        
        
        $('#helper ').css({
            'top': _middle
        })
        
        
        for(_i = 0;  _i < _groups.length; _i++){
            _tmp = Math.abs(_middle - _groups[_i].getCenter());
            if(_tmp < _closest){
                _closest = _tmp;
                _nextActive = _groups[_i];
            }
        }
        
        if(!_currActive){
            _nextActive.activate();
            _currActive = _nextActive;
            
        }
        if(_nextActive != _currActive){
            _currActive.deactivate();
            _nextActive.activate();
            _currActive = _nextActive; 
        }
        
        _currActive.scrollAll(_middle - _currActive.getCenter());
        
    })
    
    //don't forget to step.
    // include the renderAnimFrame in here. and call _currActive.render() over and over.
    function animloop(){
        requestAnimFrame(animloop);
        if(_currActive){
            _currActive.renderAll(_middle - _currActive.getCenter());
        }
    }
    
    //public
    this.addGroup = function( R_Container ){
        //we're now have access to the Renderable Container.
        _groups.push(R_Container);
        R_Container.prepare();
    };
    this.removeAll = function(){
        
    }
    
    this.start = function(){
        animloop();
        $window.trigger('scroll');
    }
    
}

function RenderableContainer( selector ){
    //private
    var $container = selector;
    var IR_Children = [];
    
    
    
    var _center;
    function onScreen(e){
        $container.addClass('active');
    }
    
    //public
    this.test = "killer!";
    this.id = $container.attr('id');
    this.prepare = function(){
       //check when this element is closest to the middle of the page.
       _center = $container.position().top + ($container.height() * .5);
    };
    
    this.getCenter = function(){
        return _center;
    }
    
    //focus on all renderables
    this.activate = function(){
        console.log(this.id + ": Active");
         $container.addClass('active');
         for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('focus')){
                IR_Children[i].focus();
            }
        }
    }
    
    //blur all renderables
    this.deactivate = function(){
        console.log(this.id + ": Deactivated");
        $container.removeClass('active');
        for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('blur')){
                IR_Children[i].blur();
            }
        }
    }
    
    this.renderAll = function(distance){
        for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('render')){
                IR_Children[i].render(distance);
            }
        }
    };
    
    this.scrollAll = function(distance){
        for(var i = 0; i < IR_Children.length; i++){
            if(IR_Children[i].hasOwnProperty('scroll')){
                IR_Children[i].scroll(distance);
            }
        }
    };
    
    this.addChild = function( iRenderable ){
        IR_Children.push( iRenderable );
        if(iRenderable.hasOwnProperty('core')){
            $container.append( iRenderable.core());
        }
    };
    this.removeChild = function( iRenderable){
        //todo
    };
}
/**
 *  Now we need some renderable elements for the container to manage 
 */
function IRenderable(){
    /*
     this.core = function(){
         
     };
     this.focus = function(){
         
     };
     this.render = function(){
         
     };
     this.blur = function(){
         
     };
     */
}


/*
 * For safe keeping, here is the basis
 * 
 function IRenderable(){
}
IRenderable.prototype.core = function(){};
IRenderable.prototype.focus = function(){};
IRenderable.prototype.render = function(){};
IRenderable.prototype.blur = function(){};

function FollowMouse(){
    var $win = $(window);
    var $goob = $('<div>Come here</div>');
    $goob.css({
        'position':'absolute',
        'top': 0,
        'left':0
    });
    this.core = function(){
        return $goob;
    }
    this.focus = function(){
        //with focus, assign events and callbacks
    }
    this.render = function(){
        //anything that has to be done repeatedly as if on an onEnterFrame
    }
    this.blur = function(){
        //do what you need to stop this class from running calculations
    }
}
FollowMouse.prototype = new IRenderable();
 * */

