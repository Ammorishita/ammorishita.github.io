if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

(function(){
  var sliderItem = document.querySelector('#slider');
  var sliderContainer = document.querySelector('.holder');
  var imgSlider = document.querySelector('.slide-image');
  var sliderWrappers = document.querySelectorAll('.slide-wrapper');
  var arrowItem = document.querySelectorAll('.arrow-nav');
  var slideContainer = document.querySelector('.touchSlider-container');

//For IE browsers
  if (navigator.msMaxTouchPoints) {
    sliderItem.classList.add('ms-touch');
    sliderItem.addEventListener('scroll', function() {
      //imgSlider.style.transform = 'translate3d(-' + (100-imgSlider.scrollLeft()/8) + 'px,0,0)';
    })
  }
    //All other main browsers
    var sliderWidthCalc = parseInt(window.getComputedStyle(sliderItem, null).getPropertyValue("width"));
    var slider = {
      el: {
        slider: sliderItem,
        holder: sliderContainer,
        imgSlide: imgSlider,
        slideWrappers: sliderWrappers,
        arrows: arrowItem,
        pagination: null,
        container: slideContainer
      },
      slideWrapperWidth: undefined,
      slideCount: undefined,
      slideWidth: sliderWidthCalc,
      touchstartx: undefined,
      touchmovex: undefined,
      movex: undefined,
      index: 0,
      clicked: true,
      longTouch: undefined,
      automatic: false,
      addNavigation: true,
      speed: 500,
      interval: 1200,
      
      init: function() {
        this.bindUIEvents();
        this.calculateSlides();
        this.automaticSlides();
        this.addPagination();
        var sheet = null;
        for (var i=0;i<document.styleSheets.length;i++) {
          var string = document.styleSheets[i].href;
          var includes = string.includes('touch-slider.css');
          if(includes === true) {
            sheet = document.styleSheets[i];
          }
        }
        var rules = sheet.cssRules || sheet.rules;
        rules[1].style.transitionDuration = this.speed/1000 + 's';
      },

      bindUIEvents: function() {
        //Check if IE11
        if (navigator.msMaxTouchPoints) {
          this.el.holder.addEventListener("pointerdown", function(event) {
            slider.start(event);
          });
          this.el.holder.addEventListener("pointermove", function(event) {
            slider.move(event);
          });
          this.el.holder.addEventListener("pointerup", function(event) {
            slider.end(event);
          });
        } else {
          //All other browsers
          this.el.holder.addEventListener("touchstart", function(event) {
            slider.start(event);
          });
          this.el.holder.addEventListener("touchmove", function(event) {
            slider.move(event);
          });
          this.el.holder.addEventListener("touchend", function(event) {
            slider.end(event);
          });     
        }
        /**
         * detect IE
         * returns version of IE or false, if browser is not Internet Explorer
         */
        function detectIE() {
          var ua = window.navigator.userAgent;
          var msie = ua.indexOf('MSIE ');
          if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
          }

          var trident = ua.indexOf('Trident/');
          if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
          }

          /*var edge = ua.indexOf('Edge/');
          if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
          }*/

          // other browser
          return false;
        }
        if(!detectIE()) {
          this.el.holder.addEventListener("mousedown", function(event) {
            slider.start(event);
          });
          this.el.holder.addEventListener("mouseup", function(event) {
            slider.end(event);
          });
          this.el.holder.addEventListener("mousemove", slider.mousemove , false);
        }
        this.el.arrows.forEach(function(e) {
          e.addEventListener('click', function(event) {
            slider.arrowClick(event);
          });
        });
      },
      automaticSlides: function() {
        if(this.automatic === true) {
          setInterval(function() {
            slider.el.holder.classList.add('animate');
            slider.el.holder.style.transform = 'translate3d(-' + slider.slideWidth*(slider.index+1) + 'px,0,0)';
            slider.el.imgSlide.classList.add('animate');
            slider.el.imgSlide.style.transform = 'translate3d(-' + 100-slider.index*50 + 'px,0,0)';
            ++slider.index;
            if(slider.index === slider.slideCount) {
              slider.index = 0;
              slider.el.pagination[slider.index].classList.add('pagination-active');
              slider.el.holder.style.transform = 'translate3d(-' + 0 + 'px,0,0)';
            }
            slider.el.pagination.forEach(function(e) {
              e.classList.remove('pagination-active');
            });
            slider.el.pagination[slider.index].classList.add('pagination-active');
          },slider.interval)
        }
      },
      calculateSlides: function() {
        var numOfSlides = document.querySelectorAll('.slide-wrapper');
        this.slideCount = numOfSlides.length;
        this.el.holder.style.width = this.slideCount*100 + '%';
        var wrapperWidth = parseInt(window.getComputedStyle(this.el.holder, null).getPropertyValue('width'));
        var sliderWrapperWidth = wrapperWidth/this.slideCount;
        this.slideWrapperWidth = sliderWrapperWidth;
        for (var i=0;i<this.slideCount;i++) {
          this.el.slideWrappers[i].style.width = sliderWrapperWidth + 'px';
        }
      },
      arrowClick: function(e) {
        if (this.index < this.slideCount && this.index >= 0) {
          if (e.target.classList.contains('right')) {
            this.index++;
            if(this.index === this.slideCount) {
              this.index--;
            }
          } else {
            this.index--;
            if(this.index === -1) {
              this.index++;
            }
          }
          this.el.holder.classList.add('animate');
          this.el.holder.style.transform = 'translate3d(-' + this.index*this.slideWidth + 'px,0,0)';
          this.el.imgSlide.classList.add('animate');
          this.el.imgSlide.style.transform = 'translate3d(-' + 100-this.index*50 + 'px,0,0)'; 
          if(this.el.pagination != null) {
            this.el.pagination.forEach(function(e) {
              e.classList.remove('pagination-active');
            });
            this.el.pagination[this.index].classList.add('pagination-active');
          }
        }
      },
      addPagination: function() {
        var container = document.querySelector('.touchSlider-container');
        //If pagination is set to true, generate and append pagination items below the slider.
        if(this.addNavigation === true) {
          var parentEl = document.createElement('div');
          parentEl.classList.add('pagination');
          container.appendChild(parentEl);
          for (var i=0;i<this.slideCount;i++) {
            var element = document.createElement('li');
            element.classList.add('pagination-item');
            parentEl.appendChild(element);
          }
        }
        var allItems = document.querySelectorAll('.pagination-item');
        if(allItems.length > 0) {
          allItems[0].classList.add('pagination-active');
          this.el.pagination = allItems;
          this.el.pagination.forEach(function(e) {
            e.addEventListener('click', function(event) {
              slider.pagination(event);
            });
          });
        }
      },
      pagination: function(e) {
        var child = e.target;
        var parent = child.parentNode;
        var index = Array.prototype.indexOf.call(parent.children, child);
        this.index = index;
        this.el.pagination.forEach(function(e) {
          e.classList.remove('pagination-active');
        });
        e.target.classList.add('pagination-active');
        if (this.index < this.slideCount && this.index >= 0) {
          this.el.holder.classList.add('animate');
          this.el.holder.style.transform = 'translate3d(-' + this.index*this.slideWidth + 'px,0,0)';
          this.el.imgSlide.classList.add('animate');
          this.el.imgSlide.style.transform = 'translate3d(-' + 100-this.index*50 + 'px,0,0)'; 
        }
      },
      start: function(event) {
        // Test for flick.
        this.longTouch = false;
        setTimeout(function() {
          window.slider.longTouch = true;
        }, 250);
        if (event.type === 'mousedown') {
          this.el.holder.addEventListener("mousemove", slider.mousemove , false);
          event.preventDefault();
          this.touchstartx = event.pageX;
          slider.clicked = true;
        } else if (event.type === 'touchstart') {
          // Get the original touch position.
          this.touchstartx = event.touches[0].pageX;         
        } else if (event.type == 'pointerdown') {
          this.touchstartx = event.pageX;
        }
        // The movement gets all janky if there's a transition on the elements.
        var animate = document.querySelector('.animate');
        if (animate) {
          animate.classList.remove('animate');
        } else {
          return true;
        }
      },
      mousemove: function(event) {
        if (slider.clicked) {
          if(event.type === 'mousemove') {
            slider.touchmovex = event.pageX;
            // Calculate distance to translate holder.
            /*
            var offsetLeft = sliderItem.getBoundingClientRect().left + 12;
            var offsetRight = sliderItem.getBoundingClientRect().right - 12;
            if(slider.touchmovex < offsetLeft) {
              slider.el.holder.removeEventListener("mousemove", slider.mousemove, false);
              slider.end2(event);
            } else if (slider.touchmovex > offsetRight) {
              slider.el.holder.removeEventListener("mousemove", slider.mousemove, false);
              slider.end2(event);
            }*/
            slider.movex = slider.index*slider.slideWidth + (slider.touchstartx - slider.touchmovex);
            // Defines the speed the images should move at.
            var panx = 100-slider.movex/6;
            var holderStop = slider.slideWrapperWidth*(slider.slideCount-1);
            if (slider.movex < holderStop) { // Makes the holder stop moving when there is no more content.
              slider.el.holder.style.transform = 'translate3d(-' + slider.movex + 'px,0,0)';
            }
            if (panx < 100) { // Corrects an edge-case problem where the background image moves without the container moving.
              slider.el.imgSlide.style.transform = 'translate3d(-' + panx + 'px,0,0)';
            }
          }       
        } else {
          return true;
        }
        // Continuously return touch position.
      },
      move: function(event) {
        // Continuously return touch position.
        //IE11 polyfill for touchmove
        if(event.type === 'pointermove') {
          if(event.pointerType === 'touch') {
            this.touchmovex = event.pageX;
            this.movex = this.index*this.slideWidth + (this.touchstartx - this.touchmovex)
          } 
        } else {
          this.touchmovex = event.touches[0].pageX;    
          //this.touchmovex =  event.originalEvent.touches[0].pageX;
          // Calculate distance to translate holder.
          this.movex = this.index*this.slideWidth + (this.touchstartx - this.touchmovex);
        }
        // Defines the speed the images should move at.
        var panx = 100-this.movex/6;
        var holderStop = this.slideWrapperWidth*(this.slideCount-1);
        if (this.movex < holderStop) { // Makes the holder stop moving when there is no more content.
          this.el.holder.style.transform = 'translate3d(-' + this.movex + 'px,0,0)';
        }
        if (panx < 100) { // Corrects an edge-case problem where the background image moves without the container moving.
          this.el.imgSlide.style.transform = 'translate3d(-' + panx + 'px,0,0)';
        }         
      },

      end: function(event) {
        // Calculate the distance swiped.
        var absMove = Math.abs(this.index*this.slideWidth - this.movex);
        // Calculate the index. All other calculations are based on the index.
        if (absMove > this.slideWidth/2 || this.longTouch === false) {
          if (this.movex > this.index*this.slideWidth && this.index < this.slideCount-1) {
            this.index++;
          } else if (this.movex < this.index*this.slideWidth && this.index > 0) {
            this.index--;
          }
        }    
        // Move and animate the elements.
        this.el.holder.classList.add('animate');
        this.el.holder.style.transform = 'translate3d(-' + this.index*this.slideWidth + 'px,0,0)';
        this.el.imgSlide.classList.add('animate');
        this.el.imgSlide.style.transform = 'translate3d(-' + 100-this.index*50 + 'px,0,0)';
        if(this.el.pagination != null) {
          this.el.pagination.forEach(function(e) {
            e.classList.remove('pagination-active');
          });
          this.el.pagination[this.index].classList.add('pagination-active');
        }
        if(event.type === 'mouseup') {
          this.el.holder.removeEventListener("mousemove", slider.mousemove, false);
        }
      }

    };
    window.onload = function() {
      slider.init();
    }
})();