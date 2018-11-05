declare var PIXI: any;
var TimelineMax = window['TimelineMax'];
var TweenMax = window['TweenMax'];
var spriteImages = document.querySelectorAll('.slide-item__image');
declare var Power1: any;
declare var Power2: any;
export const slide = (function () {

  window['CanvasSlideshow'] = function (options) {
    //  SCOPE
    /// ---------------------------
    var that = this;
    //  OPTIONS
    /// ---------------------------
    options = options || {};
    options.stageWidth = options.hasOwnProperty('stageWidth') ? options.stageWidth : 2000;
    options.stageHeight = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1500;
    options.pixiSprites = options.hasOwnProperty('sprites') ? options.sprites : [];
    options.centerSprites = options.hasOwnProperty('centerSprites') ? options.centerSprites : false;
    options.texts = options.hasOwnProperty('texts') ? options.texts : [];
    options.autoPlay = options.hasOwnProperty('autoPlay') ? options.autoPlay : true;
    options.autoPlaySpeed = options.hasOwnProperty('autoPlaySpeed') ? options.autoPlaySpeed : [10, 3];
    options.fullScreen = options.hasOwnProperty('fullScreen') ? options.fullScreen : true;
    options.displaceScale = options.hasOwnProperty('displaceScale') ? options.displaceScale : [200, 70];
    options.displacementImage = options.hasOwnProperty('displacementImage') ? options.displacementImage : '';
    options.navElement = options.hasOwnProperty('navElement') ? options.navElement : document.querySelectorAll('.scene-nav');
    options.displaceAutoFit = options.hasOwnProperty('displaceAutoFit') ? options.displaceAutoFit : false;
    options.wacky = options.hasOwnProperty('wacky') ? options.wacky : false;
    options.interactive = options.hasOwnProperty('interactive') ? options.interactive : false;
    options.interactionEvent = options.hasOwnProperty('interactionEvent') ? options.interactionEvent : '';
    options.displaceScaleTo = (options.autoPlay === false) ? [0, 0] : [20, 20];
    options.textColor = options.hasOwnProperty('textColor') ? options.textColor : '#fff';
    options.displacementCenter = options.hasOwnProperty('displacementCenter') ? options.displacementCenter : false;
    options.dispatchPointerOver = options.hasOwnProperty('dispatchPointerOver') ? options.dispatchPointerOver : false;


    //  PIXI VARIABLES
    /// ---------------------------
    var renderer: any = new PIXI.autoDetectRenderer(options.stageWidth, options.stageHeight, {transparent: true});
    var stage: any = new PIXI.Container();
    var slidesContainer: any = new PIXI.Container();
    var displacementSprite: any = new PIXI.Sprite.fromImage(options.displacementImage);
    var displacementFilter: any = new PIXI.filters.DisplacementFilter(displacementSprite);


    //  TEXTS
    /// ---------------------------
    var style = new PIXI.TextStyle({
      fill: options.textColor,
      dropShadow: true,
      letterSpacing: 2,
      wordWrap: true,
      wordWrapWidth: 400,
      dropShadowAlpha: 0.2,
      fontSize: 56
    });


    //  SLIDES ARRAY INDEX
    /// ---------------------------
    this.currentIndex = 0;


    /// ---------------------------
    //  INITIALISE PIXI
    /// ---------------------------
    this.initPixi = function () {

      // Add canvas to the HTML
      document.body.appendChild(renderer.view);


      // Add child container to the main container
      stage.addChild(slidesContainer);


      // Enable Interactions
      stage.interactive = true;


      // Fit renderer to the screen
      if (options.fullScreen === true) {
        renderer.view.style.objectFit = 'cover';
        renderer.view.style.width = '100%';
        renderer.view.style.height = '100%';
        renderer.view.style.top = '50%';
        renderer.view.style.left = '50%';
        renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1.2)';
        renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.2)';
      } else {
        renderer.view.style.maxWidth = '100%';
        renderer.view.style.top = '50%';
        renderer.view.style.left = '50%';
        renderer.view.style.webkitTransform = 'translate( -50%, -50% )';
        renderer.view.style.transform = 'translate( -50%, -50% )';
      }


      displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;


      // Set the filter to stage and set some default values for the animation
      stage.filters = [displacementFilter];

      if (options.autoPlay === false) {
        displacementFilter.scale.x = 0;
        displacementFilter.scale.y = 0;
      }

      if (options.wacky === true) {

        displacementSprite.anchor.set(0.5);
        displacementSprite.x = renderer.width / 2;
        displacementSprite.y = renderer.height / 2;
      }

      displacementSprite.scale.x = 2;
      displacementSprite.scale.y = 2;

      // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
      displacementFilter.autoFit = options.displaceAutoFit;

      stage.addChild(displacementSprite);

    };


    /// ---------------------------
    //  LOAD SLIDES TO CANVAS
    /// ---------------------------
    this.loadPixiSprites = function (sprites) {


      var rSprites = options.sprites;
      var rTexts = options.texts;

      for (var i = 0; i < rSprites.length; i++) {

        var texture = new PIXI.Texture.fromImage(sprites[i]);
        var image = new PIXI.Sprite(texture);
        console.log(rTexts);
        if (rTexts[i]) {
          let style = new PIXI.TextStyle({
            fill: rTexts[i].color || options.textColor,
            dropShadow: true,
            letterSpacing: 2,
            wordWrap: true,
            wordWrapWidth: 400,
            dropShadowAlpha: 0.2,
            fontSize: 56,
            ...rTexts[i].style
          });
          var richText: any = new PIXI.Text(rTexts[i].text, style);
          richText.anchor.set(0.5);
          richText.x = rTexts[i].x || image.width / 2 - 200;
          richText.y = rTexts[i].y || image.height / 2 - 200;
          richText.buttonMode = true;
          richText.interactive = true;
          let link = rTexts[i].link;
          if (link) {
            richText.on('pointerdown', function () {
              window.open(link);
            });
          }
          image.addChild(richText);

          if (rTexts[i].extra_image) {
            rTexts[i].extra_image.forEach(img => {
              let ex_image = new PIXI.Texture.fromImage(img.src);
              let ex_sp = new PIXI.Sprite(ex_image);
              ex_sp.anchor.set(0.5);
              ex_sp.x = img.x || -500;
              ex_sp.width = img.width || 200;
              ex_sp.height = img.height || 200;
              ex_sp.y = img.y || 0;
              image.addChild(ex_sp);
            });
          }

          if (rTexts[i].extra_texts) {
            rTexts[i].extra_texts.forEach((txt, index) => {
              let style = new PIXI.TextStyle({
                fill: rTexts[i].color || options.textColor,
                dropShadow: true,
                letterSpacing: 2,
                wordWrap: true,
                wordWrapWidth: 400,
                dropShadowAlpha: 0.2,
                fontSize: 28,
                ...txt.style
              });
              let ex_txt: any = new PIXI.Text(txt.text, style);
              ex_txt.anchor.set(0.5);
              ex_txt.x = txt.x || image.width / 2 - 400;
              ex_txt.y = txt.y || image.height / 2 - 200 + (index + 1) * 80;
              ex_txt.interactive = true;
              if(image.size){
                ex_txt.width = txt.width || 300;
                ex_txt.height = txt.height || 50;
              }
              ex_txt.hitArea = new PIXI.Rectangle(-50, -50 + 8 * (index - 1), 100, 50);
              let link = txt.link;
              console.log(link);
              if (link) {
                ex_txt.click = function () {
                  console.log('nav to link');
                  window.open(link);
                };
              }
              image.addChild(ex_txt);
            });
          }
        }

        if (options.centerSprites === true) {
          image.anchor.set(0.5);
          image.x = renderer.width / 2;
          image.y = renderer.height / 2;
        }


        // image.transform.scale.x = 1.3;
        // image.transform.scale.y = 1.3;


        if (i !== 0) {
          TweenMax.set(image, {alpha: 0});
        }

        slidesContainer.addChild(image);

      }

    };


    /// ---------------------------
    //  DEFAULT RENDER/ANIMATION
    /// ---------------------------
    if (options.autoPlay === true) {

      var ticker = new PIXI.ticker.Ticker();

      ticker.autoStart = options.autoPlay;

      ticker.add(function (delta) {

        displacementSprite.x += options.autoPlaySpeed[0] * delta;
        displacementSprite.y += options.autoPlaySpeed[1];

        renderer.render(stage);

      });

    } else {

      var render = new PIXI.ticker.Ticker();

      render.autoStart = true;

      render.add(function (delta) {
        renderer.render(stage);
      });

    }


    /// ---------------------------
    //  TRANSITION BETWEEN SLIDES
    /// ---------------------------
    var isPlaying = false;
    var slideImages = slidesContainer.children;
    this.moveSlider = function (newIndex) {

      isPlaying = true;


      var baseTimeline = new TimelineMax({
        onComplete: function () {
          that.currentIndex = newIndex;
          isPlaying = false;
          if (options.wacky === true) {
            displacementSprite.scale.set(1);
          }
        }, onUpdate: function () {

          if (options.wacky === true) {
            displacementSprite.rotation += baseTimeline.progress() * 0.02;
            displacementSprite.scale.set(baseTimeline.progress() * 3);
          }

        }
      });

      baseTimeline.clear();

      if (baseTimeline.isActive()) {
        return;
      }

      // DEMO 4
      baseTimeline
        .to(displacementFilter.scale, 1, {
          x: options.displaceScale[0],
          y: options.displaceScale[1],
          ease: Power1.easeOut
        })
        .to(slideImages[that.currentIndex], 0.5, {alpha: 0, ease: Power2.easeOut}, 0.2)
        .to(slideImages[newIndex], 0.5, {alpha: 1, ease: Power2.easeOut}, 0.3)
        .to(displacementFilter.scale, 1, {
          x: options.displaceScaleTo[0],
          y: options.displaceScaleTo[1],
          ease: Power2.easeOut
        }, 0.3);

    };


    /// ---------------------------
    //  CLICK HANDLERS
    /// ---------------------------
    var nav = options.navElement;

    for (var i = 0; i < nav.length; i++) {

      var navItem = nav[i];

      navItem.onclick = function (event) {

        // Make sure the previous transition has ended
        if (isPlaying) {
          return false;
        }

        if (this.getAttribute('data-nav') === 'next') {

          if (that.currentIndex >= 0 && that.currentIndex < slideImages.length - 1) {
            that.moveSlider(that.currentIndex + 1);
          } else {
            that.moveSlider(0);
          }

        } else {

          if (that.currentIndex > 0 && that.currentIndex < slideImages.length) {
            that.moveSlider(that.currentIndex - 1);
          } else {
            that.moveSlider(3 - 1);
          }

        }

        return false;

      };

    }


    /// ---------------------------
    //  INIT FUNCTIONS
    /// ---------------------------

    this.init = function () {


      that.initPixi();
      that.loadPixiSprites(options.pixiSprites);

      /*
      if ( options.fullScreen === true ) {
        window.addEventListener("resize", function( event ){
          scaleToWindow( renderer.view );
        });
        scaleToWindow( renderer.view );
      }
      */


    };


    /// ---------------------------
    //  INTERACTIONS
    /// ---------------------------
    function rotateSpite() {
      displacementSprite.rotation += 0.001;
      rafID = requestAnimationFrame(rotateSpite);
    }

    if (options.interactive === true) {

      var rafID, mouseX, mouseY;

      // Enable interactions on our slider
      slidesContainer.interactive = true;
      slidesContainer.buttonMode = true;

      // HOVER
      if (options.interactionEvent === 'hover' || options.interactionEvent === 'both') {

        slidesContainer.pointerover = function (mouseData) {
          mouseX = mouseData.data.global.x;
          mouseY = mouseData.data.global.y;
          TweenMax.to(displacementFilter.scale, 1, {
            x: '+=' + Math.sin(mouseX) * 100 + '',
            y: '+=' + Math.cos(mouseY) * 100 + ''
          });
          rotateSpite();
        };

        slidesContainer.pointerout = function (mouseData) {
          TweenMax.to(displacementFilter.scale, 1, {x: 0, y: 0});
          cancelAnimationFrame(rafID);
        };

      }

      // CLICK
      if (options.interactionEvent === 'click' || options.interactionEvent === 'both') {

        slidesContainer.pointerup = function (mouseData) {
          if (options.dispatchPointerOver === true) {
            TweenMax.to(displacementFilter.scale, 1, {
              x: 0, y: 0, onComplete: function () {
                TweenMax.to(displacementFilter.scale, 1, {x: 20, y: 20});
              }
            });
          } else {
            TweenMax.to(displacementFilter.scale, 1, {x: 0, y: 0});
            cancelAnimationFrame(rafID);
          }

        };

        slidesContainer.pointerdown = function (mouseData) {
          mouseX = mouseData.data.global.x;
          mouseY = mouseData.data.global.y;
          TweenMax.to(displacementFilter.scale, 1, {
            x: '+=' + Math.sin(mouseX) * 1200 + '',
            y: '+=' + Math.cos(mouseY) * 200 + ''
          });
        };

        slidesContainer.pointerout = function (mouseData) {
          if (options.dispatchPointerOver === true) {
            TweenMax.to(displacementFilter.scale, 1, {
              x: 0, y: 0, onComplete: function () {
                TweenMax.to(displacementFilter.scale, 1, {x: 20, y: 20});
              }
            });
          } else {
            TweenMax.to(displacementFilter.scale, 1, {x: 0, y: 0});
            cancelAnimationFrame(rafID);
          }

        };

      }

    }


    /// ---------------------------
    //  CENTER DISPLACEMENT
    /// ---------------------------
    if (options.displacementCenter === true) {
      displacementSprite.anchor.set(0.5);
      displacementSprite.x = renderer.view.width / 2;
      displacementSprite.y = renderer.view.height / 2;
    }


    /// ---------------------------
    //  START
    /// ---------------------------
    this.init();

    let richText = new PIXI.Text('sd', style);

    // slidesContainer.addChild(richText)
    /// ---------------------------
    //  HELPER FUNCTIONS
    /// ---------------------------
    function scaleToWindow(canvas, backgroundColor) {
      var scaleX, scaleY, scale, center;

      //1. Scale the canvas to the correct size
      //Figure out the scale amount on each axis
      scaleX = window.innerWidth / canvas.offsetWidth;
      scaleY = window.innerHeight / canvas.offsetHeight;

      //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
      scale = Math.min(scaleX, scaleY);
      canvas.style.transformOrigin = '0 0';
      canvas.style.transform = 'scale(' + scale + ')';

      //2. Center the canvas.
      //Decide whether to center the canvas vertically or horizontally.
      //Wide canvases should be centered vertically, and
      //square or tall canvases should be centered horizontally
      if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
          center = 'horizontally';
        } else {
          center = 'vertically';
        }
      } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
          center = 'vertically';
        } else {
          center = 'horizontally';
        }
      }

      //Center horizontally (for square or tall canvases)
      var margin;
      if (center === 'horizontally') {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + 'px';
        canvas.style.marginBottom = 0 + 'px';
        canvas.style.marginLeft = margin + 'px';
        canvas.style.marginRight = margin + 'px';
      }

      //Center vertically (for wide canvases)
      if (center === 'vertically') {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + 'px';
        canvas.style.marginBottom = margin + 'px';
        canvas.style.marginLeft = 0 + 'px';
        canvas.style.marginRight = 0 + 'px';
      }

      //3. Remove any padding from the canvas  and body and set the canvas
      //display style to "block"
      canvas.style.paddingLeft = 0 + 'px';
      canvas.style.paddingRight = 0 + 'px';
      canvas.style.paddingTop = 0 + 'px';
      canvas.style.paddingBottom = 0 + 'px';
      canvas.style.display = 'block';

      //4. Set the color of the HTML body background
      document.body.style.backgroundColor = backgroundColor;

      //Fix some quirkiness in scaling for Safari
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
          // Chrome
        } else {
          // Safari
          //canvas.style.maxHeight = "100%";
          //canvas.style.minHeight = "100%";
        }
      }

      //5. Return the `scale` value. This is important, because you'll nee this value
      //for correct hit testing between the pointer and sprites
      return scale;
    } // http://bit.ly/2y1Yk2k


  };

});
