/**
 * @name Animation Queue
 * @author Liam Chapman
 * @version 1.0.0
**/
;(function (window) {

	'use strict';
	
	/**
	 * Default options
	 */	
	var options = {
		wait: 0,
		hidden: true,
		hiddenClass: 'hidden',
		selector: 'animated',
		dataAttr: 'ani',
		animation: 'fadeInUp',				
		delay: 0,
		animationEnd: false,
		callback: false // if you want to use a callback it will be used on each animation, better to specify animation with an attribute.
	}
	
	/**
	 * Initialise animationQueue
	 */
	function init (settings) {
		// update defaults with any custom options sent through
		options = options.merge(settings);
		// hide elements if default set to true
		hideElements();
		// begin animation queue
		queue();
	}
	
	/**
	 * Shorthand Native Query Selector
	 * @notes - might be better to create custom DOM Construct. Instead of Extending Document
	 */
	Document.prototype.find = function (query) {
		if (document.querySelectorAll) {
			var query = this.querySelectorAll(query);
			if (query.length == 1)
				return query[0];
			else
				return query;	
		}
	}	
	
	/**
	 * Grab data attribues we want to use and extend the native dom..
	 * @notes - might be better to create custom DOM Construct. Instead of Extending Element
	 */
	Element.prototype.data = function(attr, value) {
		var attr = 'data-'+options.dataAttr+'-'+attr;
		if (value) {
			return this.setAttribute(attr, value);
		} else {			
			return this.getAttribute(attr);
		}
	}
		
	
	/**
	 * Basic object merge for two objects (used for options/settings)
	 */
	Object.prototype.merge = function (toMerge) {
		var obj = {};
		// first object
		for (var i in this) {
			obj[i] = this[i];
		}
		// second object
		for (var i in toMerge) {
			obj[i] = toMerge[i];
		}
		return obj;
	}
	
	/**
	 * Shorthand for binding events
	 */	
	Element.prototype.on = function (evnt, func) {
		if (typeof evnt === 'object') {
			for (var e in evnt) {
				if (this.addEventListener)  // W3C DOM
					this.addEventListener(evnt[e], func, false);
				else if (this.attachEvent) { // IE DOM
				     var r = this.attachEvent("on"+evnt[e], func);
					 return r;
				}
			}
		} else {
			if (this.addEventListener)  // W3C DOM
			    this.addEventListener(evnt, func, false);
			else if (this.attachEvent) { // IE DOM
			     var r = this.attachEvent("on"+evnt, func);
				 return r;
			}
		}
	}
	
	
	/**
	 * Hide Elements. Make their opacity 0
	 */
	 function hideElements () {
		 if (options.hidden) {
			 var elements = document.find('.'+options.selector);
			 for (var e in elements) {
			 	if (typeof elements[e] == 'object') {				 	
				 	if (options.hidden) {
					 	if (options.hidden == 'class')
					 		elements[e].classList.add(options.hiddenClass);
					 	else
					 		elements[e].style.opacity = 0;
				 	}				 	
				 }
			 }
		 }
	 }
	
	/**
	 * This is where we queue and process our animations for animating in
	 */
	function queue () {		
		// get elements
		var elements = document.find('.'+options.selector);
		// default counter
		var counter = 0;
		// empty queue array
		var queue = [];
		// loop elements
		for (var e in elements) {
			// get element data settings			
			if (typeof elements[e] == 'object') {
				var animation 	= elements[e].data('animation');
				var delay		= elements[e].data('delay');
				var sequence 	= elements[e].data('sequence');
				var callback 	= elements[e].data('callback');
				// counter check
				if (sequence) {
					counter = sequence;
				} else {
					++counter;
				}
				// store in new array for processing
				queue[counter] = { e: elements[e], a: animation, d: delay, c: callback };				
			}
		}	
		// apply wait timeout if set and > 0
		setTimeout(function () {
			// run queue
			loopQueue(queue, 1);
		}, options.wait);
	}
	
	/**
	 * Recursive Loop Timeout function for queue
	 */
	 function loopQueue (queue, counter) {	
	 	// shorthand for element
	 	var x = queue[counter];
	 	if (typeof(x) == 'object') {
		 	// create timeout and loop
			setTimeout(function () {
				// requestAnimFrame
				requestAnimFrame(loopQueue);
				// add class to element
				x.e.classList.add(x.a ? x.a : options.animationIn);			
				// do rest when animation has ended
				x.e.on(['webkitAnimationEnd', 'oanimationend', 'msAnimationEnd', 'animationend'], function () {
					// check if we have callback				
					if (x.c && typeof window[x.c] === 'function') {
						window[x.c]();
					} else {
						if (options.callback && window[options.callback] === 'function')
							window[options.callback]();
					}
					// loop and do next animation
					loopQueue(queue, ++counter);
				});
			}, x.d ? x.d : options.delay); // pass through delay
		}
	}
	
	/**
	 * Shim for RequestAnimationFrame
	 */
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function ( callback ) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	/**
	 * Global Var for returning public methods for animationQueue
	 */	
	var animationQueue = {
		init : init
	};
	
	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( animationQueue );
	} else {
		// browser global
		window.animationQueue = animationQueue;
	}

})(window);