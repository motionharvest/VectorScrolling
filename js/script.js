//create some class to add to the screen

function FollowMouse(){
    //construct
    var $win = $(window);
    var $goob = $('<div>Come here</div>');
    $goob.css({
        'position':'absolute',
        'top': 0,
        'left':0,
        'border': '2px solid red'
    });
    var mx, my;
    
    //controllables
    this.core = function(){
        return $goob;
    };
    this.focus = function(){
        //with focus, assign events and callbacks
        $win.on('mousemove', function(evt){
            mx = evt.pageX;
            my = evt.pageY;
            console.log("mouse is moving")
        });
        
        $goob.css({
            'border': '2px solid green'
        });
        
    };
    var posX, posY;
    this.render = function(distFromCenter){
    	console.log(distFromCenter);
        //anything that has to be done repeatedly as if on an onEnterFrame
        posX = $goob.position().left;
        posY = $goob.position().top;

        $goob.css({
            'top': ((my - posY) / 15) + posY ,
            'left': ((mx - posX) / 15) + posX ,
        });
        //if you needed to know how far away from the middle of the screen we are for this container use distFromCenter
    };
    this.blur = function(){
        //do what you need to stop this class from running calculations
        $win.unbind('mousemove');
        $goob.css({
            'border': '2px solid red'
        });
    };
    
}
FollowMouse.prototype = new IRenderable();




function ChamberHall($elem){
    
    var $core = $elem;
    
    //core omitted because its already a dom element
     this.focus = function(){

     };
     var pos = -400;
     var tar = 0;
     
     this.render = function(offset){
         tar = offset / 10;
         pos += ((tar - pos) / 15) + tar;    
         $core.css({
             'background-position': pos + 'px 0px'
         });
        
     };
     this.blur = function(){
         $core.css({
             pos:-400,
             tar: 0,
             'background-position': '0px 0px'
         });
     };
}
ChamberHall.prototype = new IRenderable();






/**
 * Since we need jQuery, lets go ahead and do our initializing.
 */
jQuery(function($){
    
    //renderFarm wants access to this Window
    var $win = $(window);
    
    //create the Render Farm
    var  renderFarm = new RenderFarm($win);
    
   //set up a Containers from the HTML sections
   var sectionZero = new RenderableContainer($("#sec_0"));
   var sectionOne = new RenderableContainer($("#sec_1"));
   var sectionTwo = new RenderableContainer($("#sec_2"));
   var sectionThree = new RenderableContainer($("#sec_3"));
   var sectionFour = new RenderableContainer($("#sec_4"));
   var sectionFive = new RenderableContainer($("#sec_5"));
   
   renderFarm.addGroup(sectionZero);
   renderFarm.addGroup(sectionOne);
   renderFarm.addGroup(sectionTwo);
   renderFarm.addGroup(sectionThree);
   renderFarm.addGroup(sectionFour);
   renderFarm.addGroup(sectionFive);
   
   //IRenderable
   var camberHall = new ChamberHall($('#test_chamber'));
   var mouseToy = new FollowMouse();
   
   
   //RenderableContainer addChild()
   sectionZero.addChild(camberHall);
   sectionOne.addChild(mouseToy);
   
   //Start
   renderFarm.start();
    
});
