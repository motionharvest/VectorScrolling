Performant-Scrolling-Construct
==============================


#### JavaScript Scrolling Construct ####
Preframework and antipattern for controlling groupings of animation inside of site sections. Use for single page scrolling sites to limit code execution to the currently active panel.

Example: [http://www.digitalsurgeonsdev.com/epicawesome/scroll/](http://www.digitalsurgeonsdev.com/epicawesome/scroll/)

#### What It Does ####
Controls animation privilages (activate|deactivate|render).
Tells interactive elements when to assign listeners.
Tells interactive elements when to remove listeners.

	
	//renderFarm requires access to  Window (until the library takes shape)
	var $win = $(window);
	
	//create the Render Farm
	var  renderFarm = new RenderFarm($win);




#### How it works ####
Elements that have processing are wrapped in a class with 3 functions

	function ExampleRenderable( jQueryObj ){
	    var $core = jQueryObj;
	    
	    this.focus = function(){
	        //happens when activated
	        //perfect time to add event listeners
	    };
	    this.render = function(offset){
	        //loops while in focus
	        //perfect for stepping through animation formulas
	    };
	    this.scroll = function(offset){
	        //window scroll is passed down as well
	        //use this if you don't want to listen/unlisten to your own
	    };
	    this.blur = function(){
	        //happens when deactivated
	        //perfect for removing event listeners
	    };
	}

Wrapped elements are added to RenderableContainers


	<section class="renderable_container" id="section_0">
	    <div id="example"></div>
	</section>

RenderableContainers are sections that facilitate child element's active and render states.
The div inside of the renderable_container is being controlled so lets set that up.

	var sectionZero = new RenderableContainer($("#section_0"));
	var exampleRenderable = new ExampleRenderable($("#example"));
	sectionZero.addChild(exampleRenderable);


Add the RenderableContainer as a group for processing. Then add the group to the render farm.


	renderFarm.addGroup(sectionZero);


#### Start up the engine ####

	renderFarm.start();


