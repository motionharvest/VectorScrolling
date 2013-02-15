Performant-Scrolling-Construct
==============================


#### JavaScript Scrolling Construct ####
Preframework and antipattern for controlling groupings of animation inside of site sections. Use for single page scrolling sites to limit code execution to the currently active panel.

Example: http://motionharvest.com/code/performant/ 

#### What It Does ####
Controls animation privilages (activate|deactivate|render).
Tells interactive elements when to assign listeners.
Tells interactive elements when to remove listeners.

```javascript
//renderFarm requires access to  Window (until the library takes shape)
var $win = $(window);

//create the Render Farm
var  renderFarm = new RenderFarm($win);
```



#### How it works ####
Elements that have processing are wrapped in a class with 3 functions
```javascript
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
```

Wrapped elements are added to RenderableContainers
```html
<section class="renderable_container" id="section_0">
    <div id="example"></div>
</section>
```

```javascript
var sectionZero = new RenderableContainer($("#section_0"));
var exampleRenderable = new ExampleRenderable($("#example"));
sectionZero.addChild(exampleRenderable);
```
RenderableContainer groups are added to the render farm for processing

```javascript
renderFarm.addGroup(sectionZero);
```

#### Start the process ####
```javascript
renderFarm.start();
```


