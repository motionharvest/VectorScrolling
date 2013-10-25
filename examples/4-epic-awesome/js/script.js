/**
 * Since we need jQuery, lets go ahead and do our initializing.
 */
jQuery(function($){
	
	//renderFarm wants access to this Window
	var $win = $(window);

	//All Hail
	var  renderFarm = new RenderFarm($win);
	
	//First sacrifice
	var sectionZero = new RenderableContainer($("#sec_0"));
	renderFarm.addGroup(sectionZero);
	
	//Second sacrifice
	var sectionOne = new RenderableContainer($("#sec_1"));
	renderFarm.addGroup(sectionOne);
	
	//Third sacrifice
	var sectionTwo = new RenderableContainer($("#sec_2"));
	renderFarm.addGroup(sectionTwo);
	
	//Fourth sacrifice
	var sectionThree = new RenderableContainer($("#sec_3"));
	renderFarm.addGroup(sectionThree);
	
	//Fiffth sacrifice
	var sectionFour = new RenderableContainer($("#sec_4"));
	renderFarm.addGroup(sectionFour);
	
	//Sixth sacrifice
	var sectionFive = new RenderableContainer($("#sec_5"));
	renderFarm.addGroup(sectionFive);
	
	/*
	 * Section Zero Build
	 */
	(function(){
		var structure = new Parallaxable(
			$('.structure', '#sec_0'),
			undefined,
			400,
			undefined,
			20,
			true,
			5
		);
		var logo = new Parallaxable(
			$('.logo', '#sec_0'),
			undefined,
			700,
			undefined,
			100,
			true,
			5
		);
		var sublogo = new Parallaxable(
			$('.sublogo', '#sec_0'),
			undefined,
			750,
			undefined,
			200,
			true,
			5
		);
		sectionZero.addChild(structure)
		sectionZero.addChild(logo)
		sectionZero.addChild(sublogo)
	})();
	
	/*
	 * Section 2 Build
	 */
	(function(){
		var robotImage = new Parallaxable(
			$('.image', '#sec_1'),
			undefined,
			250,
			undefined,
			-100,
			true,
			5
		);
		var robotShadow = new Parallaxable(
			$('.shadow', '#sec_1'),
			 -460,
			100,
			 -400,
			205,
			true,
			5
		);
		var robotDescription = new Parallaxable(
			$('.description', '#sec_1'),
			undefined,
			300,
			undefined,
			100,
			true,
			5
		);
		sectionOne.addChild(robotDescription);
		sectionOne.addChild(robotImage);
		sectionOne.addChild(robotShadow);
	})();
	
	/*
	 * Section 3 Build
	 */
	(function(){
		var shape = new Parallaxable(
			$('.shape', '#sec_2'),
			undefined,
			550,
			undefined,
			-300,
			true,
			5
		);
		var computer = new Parallaxable(
			$('.computer', '#sec_2'),
			undefined,
			250,
			undefined,
			0,
			true,
			5
		);
		var phone = new Parallaxable(
			$('.phone', '#sec_2'),
			600,
			420,
			0,
			250,
			true,
			5
		);
		var copy = new Parallaxable(
			$('.copy', '#sec_2'),
			undefined,
			450,
			undefined,
			-100,
			true,
			5
		);
		sectionTwo.addChild(shape);
		sectionTwo.addChild(computer);
		sectionTwo.addChild(phone);
		sectionTwo.addChild(copy);
	})();
	
	
	
	
	
	
	/*
	 * Section 3 Build
	 */
	(function(){
		var bg = new Parallaxable(
			$('.bg', '#sec_3'),
			-400,
			undefined,
			-220,
			undefined,
			true,
			5
		);
		var copy = new Parallaxable(
			$('.copy', '#sec_3'),
			undefined,
			330,
			undefined,
			100,
			true,
			5
		);
		var hero = new Parallaxable(
			$('.hero', '#sec_3'),
			200,
			undefined,
			0,
			undefined,
			true,
			5
		);
		sectionThree.addChild(bg);
		sectionThree.addChild(copy);
		sectionThree.addChild(hero);
	})();
	
	/*
	 * Section 4 Build
	 */
	(function(){
		var bg = new Parallaxable(
			$('.frame', '#sec_4'),
			undefined,
			150,
			undefined,
			20,
			true,
			5
		);
		var beast = new Parallaxable(
			$('.beast', '#sec_4'),
			-258,
			220,
			-158,
			70,
			true,
			5
		);
		var hero = new Parallaxable(
			$('.hero', '#sec_4'),
			-267,
			370,
			-360,
			220,
			true,
			5
		);
		var grass = new Parallaxable(
			$('.grass', '#sec_4'),
			-317,
			585,
			-475,
			440,
			true,
			5
		);
		
		
		//create timeline
		var tl = new TimelineLite();
		
		//linear easing is best for linking to the scrollbar (for now) 
		TweenLite.defaultEase = Linear.easeNone;
		var head = new TweenLite.to($('.beast-head', '#sec_4'), 10, {x: 80, y:0});
		
		var blood = new TweenLite.from($('.beast-blood', '#sec_4'), 1, {delay: 3, width: 1});
		var bloodMove = new TweenLite.to($('.beast-blood', '#sec_4'), 10, {x:100, y:-170});
		//add tweens to timeline and pause them.
		tl.add([blood, bloodMove, head]);
		tl.pause();
		
		//create TimelineInterface();
		var tli = new TimelineInterface(tl);
		
		
		//add it to the renderable container
		sectionFour.addChild(tli);
		
		
		
		sectionFour.addChild(bg);
		sectionFour.addChild(beast);
		sectionFour.addChild(head);

		sectionFour.addChild(hero);
		sectionFour.addChild(grass);
	})();
	
	/*
	 * Section 5 Build
	 */
	(function(){
		
		var logo = new Parallaxable(
			$('.logo', '#sec_5'),
			undefined,
			0,
			undefined,
			500,
			true,
			5
		);
		
		
		
		sectionFive.addChild(logo);
	})()
	
	
	
	/*
	(function(){
		
		//create timeline
		var tl = new TimelineLite();
		
		//linear easing is best for linking to the scrollbar (for now) 
		TweenLite.defaultEase = Linear.easeNone;
		
		//create tweens
		
		var head = new TweenLite.to($('.beast-head', '#sec_5'), 10, {x: 80, y:65, rotationZ: -10});
		var beast = new TweenLite.to($('.beast', '#sec_5'), 10, {x:100, y:-50});
		var blood = new TweenLite.from($('.beast-blood', '#sec_5'), 1, {delay:5, width: 1});
		var bloodMove = new TweenLite.to($('.beast-blood', '#sec_5'), 10, {x:100, y:-50});
		
		//add tweens to timeline and pause them.
		tl.add( [head, beast, blood, bloodMove] );
		tl.pause();
		
		
		//create TimelineInterface();
		var tli = new TimelineInterface(tl);
		
		
		//add it to the renderable container
		sectionFive.addChild(tli);
	})()
	*/
	//Start
	renderFarm.start();
    
});

/***
 * Usable Components
 */


/*
 * Parallaxable
 * Slides an element from point A to point B
 * jQueryObject [Object] - element that we're controlling
 * startX [Number] - the horizontal (left) position of the element at start
 * startY [Number] - the vertical (top) position of the element at start
 * endX [Number] - the horizontal (left) position of the element at end
 * endY [Number] - the vertical (top) position of the element at end
 * updateOnRender [Boolean || Number] - false by default. If true, default easing speed. If Number, Number easing speed.
 */
function Parallaxable(jQueryObj, startX, startY, endX, endY, updateOnRender, speed){
	
	var $elem = jQueryObj,
	curX = tarX = startX || jQueryObj.position().left,
	curY = tarY = startY || jQueryObj.position().top,
	speed = speed || 5,
	tarOffset;
	
	
	$elem.css({
		'position':'absolute',
		'top': startY,
		'left': startX
	});
	
	
	
	this.focus = function(){
		//happens when activated
		//perfect time to add event listeners
	};
	
	
	if(updateOnRender){
		this.render = function(offset){
			//loops while in focus
			//perfect for stepping through animation formulas
			tarX = Mathutils.map(offset, -1, 1, startX, endX);
			tarY = Mathutils.map(offset, -1, 1, startY, endY);
			
			curX += (tarX - curX) / speed;
			curY += (tarY - curY) / speed;
			
			$elem.css({
				'left': curX,
				'top': curY
			});
		};
	}
	
	this.scroll = function(offset){
		//window scroll is passed down as well
		//use this if you don't want to listen/unlisten to your own
	};
    this.blur = function(offBottom){
		//happens when deactivated
		//perfect for removing event listeners
		
		//just added offBottom. so it will be prepared for the next time you encounter the panel
		if(offBottom){
			//off bottom
			tarX = currX = endX;
			tarY = currY = endY;
			$elem.css({
				'left': tarX,
				'top': tarY
			});
		}else{
			//off top
			tarX = currX = startX;
			tarY = currY = startY;
			$elem.css({
				'left': tarX,
				'top': tarY
			});	
		}
	};
}



/*
	Parallax doesn't seem to be the right word. This is an IRenderable interface with
	a Timeline instance.
	
	1. pass in a timeline
	2. define a render method
	3. do some math to figure out what percentage of the totalDuration you should seek to.
	
	4. craft some awesome tweens
	
*/
function TimelineInterface(timeline){
	
	//timeline
	var tl = timeline;
	
	//just gonna update the seek position based on where we are in the scroll
	var currSeek = 0;
	var tarSeek = 0;
	
	//render me some frames
	this.render = function(offset){
		/*
			This version of the renderfarm gives us a value from -1 to 1 based on the height of the container. And
			how far it has been scrolled. When the container is exactly centered the value is 0.
			
			Take that value and convert it to a decimal percentage between 0 to 1 where 0 is 0% and 1 is 100%
			
			Take that percentage value and step 1/5th of the way there each render(). This softens the animation.
			
			seek to the position in the timeline using the totalDuration * the percentage value by finding the exact
			timecode you'd need to seek to in order to be that far through the animation.

			That means that you can create animations as long as you want and they'll be controlled just the same.
			So go sick.
		*/
		tarSeek = Mathutils.map(offset, -1, 1, 0, 1);
		currSeek += (tarSeek - currSeek) / 5;
		tl.seek(tl.totalDuration() * currSeek);
	}
	
		
}



