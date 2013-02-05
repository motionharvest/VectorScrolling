function ElaborateTweenExample(){
    var headerText = $("#teaserHeader span"),
    staggerTextIntro = $("#staggerTextIntro"),
    staggerTextOut = $("#staggerTextOut"),
    skew = $(".skew"),
    bezierHead = $("#bezierHead"),
    bezierPlugin = $("#bezierPlugin"),
    bezierLogoWrapper = $("#bezierLogoWrapper"),
    question = $(".question"),
    features = $("#features"),
    logosHolder = $("#logosHolder"),
    endHead = $("#introHead"),
    endLogos = $("#introLogosWrapper div"),
    endNavBarTip = $("#introNavBarTip"),
    miniBoxesHolder = $("#miniBoxesHolder"),
    jQueryWrapper = $("#jQueryWrapper"),
    andIsIt = $("#andIsIt"),
    twenty = $("#twenty"),
    faster =$("#faster"),
    thanJquery =$("#thanJquery"),
    chartBaseline = $("#chartBaseline"),
    bars = $(".bar"),
    speedTest = $("#speedTest"),
    funBox = $("#funBox"),
    slider = $("#sliderBar"),
    play_btn = $("#play").button(),
    reverse_btn = $("#reverse").button(),
    pause_btn = $("#pause").button(),
    restart_btn = $("#restart").button(),
    oldIE=false,
    mainTimeline;
    
    //we limit some effects that IE8 and less struggle with
    function getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    }

    function checkVersion() {
        var msg = "You're not using Windows Internet Explorer.";
        var ver = getInternetExplorerVersion();
        if (ver > -1) {
            if (ver <= 8.0) {   
            oldIE = true;           
            }
        }
    }
    
    // build all nested timelines
                                                                                                                    
    function getIntroTimeline() {
        var introTimeline = new TimelineMax();
        introTimeline.staggerFromTo(headerText, 0.5, {scale:0, alpha:0, top:60, rotation:-20}, {scale:1, alpha:1, top:0, rotation:0, ease:Back.easeOut, immediateRender:true}, 0.1)
        .from(staggerTextIntro, 0.2, {left:100, alpha:0});
        var boxesTimeline = new TimelineMax({repeat:1, repeatDelay:0.1, yoyo:true});    
        for(n = 0; n < 18; n++){
            miniBoxesHolder.append('<div class="miniBox"></div>');
            }   
        var miniBoxes = $('.miniBox');
    
        boxesTimeline.staggerFromTo(miniBoxes, 0.8, {height:0, backgroundColor:'#ff6600', rotation:(oldIE) ? 0 : 200, autoAlpha:0}, 
            {height:100, transformOrigin:"bottom", backgroundColor:'#91e600', rotation:0, autoAlpha:1, ease:Back.easeOut, immediateRender:true}, 0.1);
        introTimeline.add(boxesTimeline)    
        .from(staggerTextOut, 0.2, {right:100, alpha:0}, "-=3")
        .to([staggerTextOut, staggerTextIntro, miniBoxesHolder], 0.4, {autoAlpha:0}, "-=1") 
        return introTimeline;   
    }
    
    function getSkewTimeline() {
        var skewTimeline = new TimelineLite()
        skewTimeline.to(skew, 2, {left:580, ease:SlowMo.ease.config(0.2, 1.2)})
        .from(skew, 2, {skewX:45, ease:SlowMo.ease.config(0.2, 1.2, true)}, 0)
        return skewTimeline;
    }
    
    function getBezierTimeline() {
        var bezierTimeline = new TimelineLite();
        bezierTimeline.to(bezierHead, 0.5, {left:30, autoAlpha:1})
        .fromTo(bezierPlugin, 1,  {width:0, autoAlpha:0.9}, {width:560, autoAlpha:1, immediateRender:true})
        .to(bezierLogoWrapper, 3, 
            {bezier: {curviness:1.7, type:"thru", autoRotate:(oldIE) ? false : true, values:[{x:105-55, y:199-130}, {x:172-55, y:128-130}, {x:232-55, y:182-130},{x:385-55, y:155-130}, {x:502-55, y:265-130} ]}, 
            ease:Bounce.easeOut, immediateRender:true})
        .to(bezierPlugin, 0.4, {scale:0, alpha:0, top:"-=0px"}, "+=0.5");
        if(oldIE){
            bezierTimeline.set(bezierLogo, {autoAlpha:0}, "-=0.5")
        };
        bezierTimeline.to(bezierHead, 0.2, {autoAlpha:0}, "-=1")
        return bezierTimeline;
    }
    
    function getFeaturesTimeline(){
        var featuresTimeline = new TimelineLite();
        var features_arr = ['repeat', 'reverse', 'timeshift', 'pause', 'use labels', 'jump to any time', 'repeat infinitely', 'yoyo', 'stagger', 'work in IE6', 'animate colors', 'do CSS3 transforms', 'nest timelines', 'create killer', 'effects', 'like this one?'];
        var featuresLength = features_arr.length;
        for(f = 0; f < featuresLength; f++){
            features.append('<div class="featureWord">' + features_arr[f] + '</div>');
         } 
        $('.featureWord').each( function(index, element){
            var featureWordTl = new TimelineLite();
            featureWordTl.fromTo($(element), 0.65, {scale:0}, {scale:1, ease:SlowMo.ease.config(0.25, 0.9)}, index * 0.6)
            .fromTo($(element), 0.65, {autoAlpha:0}, {autoAlpha:1, ease:SlowMo.ease.config(0.25, 0.9, true), immediateRender:true}, index *.6);
            featuresTimeline.add(featureWordTl, 0);
         })
         return featuresTimeline;   
    }
    
    function getFlyingLogosTimeline() {
        var numLogos = (oldIE) ? 10 : 30;
        for(i = 0; i < numLogos; i++){
            logosHolder.append('<div class="logo"></div>');
        } 
        var flyingLogosTimeline = new TimelineLite();
        var logo = $('.logo');    
        logo.each(function(index, element){
            var delay = (index * 0.05);
            var duration = 2 + (Math.random() * 1);
            var top = 25 + (Math.random() * 250) + "px";
            var element = $(element);
        if(oldIE==false){
            flyingLogosTimeline.add(TweenMax.to(element, duration, {rotation:390, ease:Power1.easeOut}), delay);
        }
        flyingLogosTimeline.add([
            TweenMax.to(element, duration/2, {top:top, yoyo:true, repeat:1, ease:Power1.easeOut}),
            TweenMax.to(element, duration, {left:460 + (Math.random() * 250) +"px", ease:Linear.easeNone})
        ], delay);
        }) 
        return flyingLogosTimeline;
    }
    
    function getJqueryTimeline() {
        var jqueryTimeline = new TimelineLite();
        jqueryTimeline.from(andIsIt, 0.4, {width:0, alpha:0})
        .fromTo(twenty, 0.4, {backgroundPosition:'117px 0px', alpha:0}, {backgroundPosition:'10px', alpha:1, ease:Back.easeOut, immediateRender:true}, "-=.05")
        .from(faster, 0.4, {backgroundPosition:'-169px 0px', alpha:0, ease:Back.easeOut}, "-=0.4")
        .from(thanJquery, 0.6, {backgroundPosition:'0px -55px', alpha:0, ease:Back.easeOut}, "+=0.2") 
        .from(chartBaseline, 0.2, {top:'+=20px', alpha:0})
        .staggerFrom(bars, 0.5, {top:148, alpha:0}, 0.2)
        .from(speedTest, 0.2, {alpha:0}, "+=0.2")
        .to(jQueryWrapper, 0.2, {autoAlpha:0, scale:(oldIE) ? 1 : 0.5}, "+=4");
        return jqueryTimeline;  
    }
    
    function getEndTimeline() {
        var endTimeline = new TimelineLite();
        endTimeline.from(endHead, 0.2,  {alpha:0, scale:0.5, ease:Back.easeOut}, "-=0.1")
        .staggerFromTo(endLogos, 0.5, {autoAlpha:0, scale:0.5, rotation:0}, {autoAlpha:1,  scale:1, rotation:0, ease:Back.easeOut, immediateRender:true}, 0.1)
        .fromTo(endNavBarTip, 0.5, {top:304, autoAlpha:0}, {top:284, autoAlpha:1, immediateRender:true}, "+=0.5");  
        return endTimeline;
    }
    
    function buildMainTimeline() {
        mainTimeline = new TimelineMax({onUpdate:updateSlider, paused:true});
        mainTimeline.add(getIntroTimeline())
        .add("skew", "-=0.6")
        .add(getSkewTimeline(), "skew")
        .from(question, 0.5, {css:{alpha:0, scale:2.2}, ease:Back.easeOut})
        .to(question, 0.5, {css:{alpha:0, scale:0}, ease:Power1.easeIn})
        .add(getBezierTimeline(), "bezier")
        .fromTo(question,  0.5, {css:{alpha:0, scale:2.2}}, {css:{alpha:1, scale:1}, ease:Back.easeOut, immediateRender:true}, "-=0.1")
        .to(question, 0.5, {css:{alpha:0, scale:0, rotate:360}, ease:Power1.easeIn})
        .add(getFeaturesTimeline(), "features'")
        .to(question, 0.5, {css:{alpha:1, scale:1}, ease:Back.easeOut})
        .add([getFlyingLogosTimeline(),
            TweenLite.to(question, 2, {css:{left:1000, top: -100, rotation:360}, delay:0.9}),
            TweenMax.staggerTo(headerText, 1, {css:{top:-100, left:800, rotation:270}, delay:.8}, .05)
        ], "logos")
        .add('jQuery', "-=0.7")
        .add(getJqueryTimeline(), "jQuery")
        .add(getEndTimeline())
    }
        
    // config jQueryUI slider and navigation
                    
    $( "#sliderBar" ).slider({
            range: false,
            min: 0,
            max: 100,
            step:0.1,
            slide: function ( event, ui ) {
                mainTimeline.pause();
                
                mainTimeline.progress( ui.value/100 );
            }
     });                            
    
    //called by mainTimeline's onUpdate callback to sync timeline playback and slider position
    function updateSlider(){
        slider.slider("value", mainTimeline.progress() *100);
    }
        
    $("input").change(function(){
        var  speed=$("input[name='speed']:checked").val();
        mainTimeline.timeScale(speed);
        });
    
    
    
    function startUp(){
        mainTimeline.play();
    }
    
    function init() {
        checkVersion(); 
        buildMainTimeline();
    }
    
    var tarPerc = 0;
    var currPerc = 0;
    
    this.render = function(){
        currPerc = ((tarPerc - currPerc) / 35) + currPerc;
        mainTimeline.progress(currPerc);    
    }
    this.scroll = function( offset ){
        tarPerc = MathUtils.map(offset, -400, 400, 0, 1)
        
    }

    
    
    
    
    init();
}
