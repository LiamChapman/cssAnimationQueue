/**
 * @name CSS Animation Queue
 * @author Liam Chapman
 * @version 1.0.0
 */
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
		allAtOnce: false, // boolean to play all animations in one go or not.
		before: false, // if you want to use a callback it will be used on each animation, better to specify animation with an attribute.
		after: false, // if you want to use a callback it will be used on each animation, better to specify animation with an attribute.
		loop: false
	}
	
	// simple regex for commas for multple parameters etc.
	// not finished.. work in progress
	//var commaCheck = new RegExp(",");
		
	/**
	 * Initialise cssAnimationQueue
	 */
	function init (settings) {
		if ('classList' in document.documentElement) {
			// update defaults with any custom options sent through
			options = options.merge(settings);
			// hide elements if default set to true
			hideElements();
			// begin animation queue
			queue();
		}
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
		// for looping / binding array of events to the same object
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
			// apply one event.
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
			 		// check if elements wants to be hidden!		 	
			 		var dont_hide = elements[e].data('dont-hide');
			 		// reset class to selector only
			 		elements[e].className = options.selector;
				 	if (options.hidden && !dont_hide) {
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
				var before 		= elements[e].data('before');
				var after 		= elements[e].data('after');
				var dont_queue  = elements[e].data('dont-queue');								
				// counter check
				if (!dont_queue) {					
					// update order / sequence
					if (sequence) {
						counter = sequence;
					} else {
						++counter;
					}
					// store in new array for processing
					queue[counter] = { 						 
						a:  animation, 
						af: after,
						b:  before,
						d:  delay,
						dt: dont_queue,
						e:  elements[e]
					};				
				}
			}
		}	
		// apply wait timeout if set and > 0
		setTimeout(function () {
			// run queue
			loopQueue(queue, 1);
		}, options.wait);
	}
	
	/**
	 * Wrapper for firing callbacks
	 */
	function callback (action, defaultAction) {
		if (action && typeof window[action] === 'function') {
			window[action]();
		} else {
			if (defaultAction && options[defaultAction] && window[options.defaultAction] === 'function')
				window[options.defaultAction]();
		}		
	}
	
	/**
	 * Recursive Loop Timeout function for queue
	 */
	 function loopQueue (queue, counter) {	
	 	// shorthand for element
	 	var x = queue[counter];
	 	// internal private for for length of queue
		var queueLength = parseInt(queue.length - 1);	 
	 	// check if we are doing allAtOnce
	 	if (!options.allAtOnce) {
		 	if (typeof x == 'object') {
			 	// create timeout and loop
				setTimeout(function () {
					// requestAnimFrame for better performance
					requestAnimFrame(loopQueue);				
					// check if we have a before callback				
					callback(x.b, 'before');
					// add class to element
					x.e.classList.add(x.a ? x.a : options.animation);	
					// do rest when animation has ended check if animationEnd set		
					animationEnd(x.e, function () {
						// check if we have a after callback				
						callback(x.af, 'after');
						// check if we are looping
						// not finished
					 	if (options.loop && counter == queueLength) {
					 		// hide elements again
					 		//hideElements();
					 		// reset counter
					 		//counter = 0;
					 		//console.log(counter, queueLength);					 		
					 	}
						loopQueue(queue, ++counter);
					});
				}, x.d ? x.d : options.delay); // pass through delay
			}
		// this is where we are doing all animations at once..
		} else {			
			// check if there is multple animations
			if (queueLength > 1) {
				// loop and apply all animations asap.					
				for (var q in queue) {
					if (typeof queue[q] == 'object') {
						// perform animation and callbcks
						callback(queue[q].b, 'before');
						queue[q].e.classList.add(queue[q].a ? queue[q].a : options.animation);
						callback(queue[q].af, 'after');		
						// if all at once looping not permitted, page freaks out. best to set loop in the css declaration maybe?
					}
				}
			}
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
	 * Wrapper for animationEnd Event
	 */
	function animationEnd (element, call) {
		if (element && call) {
			element.on(['webkitAnimationEnd', 'oanimationend', 'msAnimationEnd', 'animationend'], function () {
				call();
			});
		}
	}
	
	/**
	 * Global Var for returning public methods for animationQueue
	 */	
	var cssAnimationQueue = {
		init : init
	};
	
	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( cssAnimationQueue );
	} else {
		// browser global
		window.cssAnimationQueue = cssAnimationQueue;
	}

})(window);