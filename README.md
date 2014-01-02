cssAnimationQueue
=================

This is a small JS library to queue CSS3 animations. It has been built in mind with [daneden's animate.css](https://github.com/daneden/animate.css) you can also apply your own animations or other libraries.

I wrote this to help reduce the amount of callbacks and timeouts needed to apply css animations with javascript. I've worked on several projects that may have an intro animation or whatever and it turns into a horrible mess of nested timeouts and callbacks. This script aims to try and make it a little cleaner and easier to manage. I still have a few more things to add and improve, so stay tuned. I hope its of some use to you. 

Feel free to fork it, make pull requests and try and improve it :)

## How to use

Firstly, include the script on your page! Then by using data attributes you can set your custom parameters. A basic example is below, with all available options:

	<div class="animated" data-ani-animation="fadeInUp" data-ani-delay="1000" data-ani-sequence="1" data-ani-callback="test" data-ani-dont-hide></div>

So as you can see you can set several options. The most important thing is setting a class for the script to find what elements to animate. 

* animation
	- css animation
* delay
	- delay before animation starts
* sequence 
	- order you want it to play
* callback
	- name of a function you want to be used on animation completition.
* dont-hide
	- optional parameter to make sure it doesn't get hidden if hidden set true
* dont-queue (*not in the example above*)
	- sometimes you might have a css animation that you don't want to be queued.

The -ani- part is a custom addition to target only elements you want animated. If you don't like the -ani- part you can set your own custom selector. Instructions can be found below. Also, all parameters are optional so only write what you need and it will use the defaults you set.

With multiple elements it can get quite verbose at times, so make sure to set custom defaults when you intialise to reduce amount of code you have to write.

# Sequence animations

Something that is quite useful is having the ability to change the sequence of the animations. By default the sequence starts at 1. An example can be seen below:

	<div class="animated" data-ani-animation="fadeInUp" data-ani-sequence="1"></div>
	<div class="animated" data-ani-animation="fadeInLeft" data-ani-sequence="3"></div>
	<div class="animated" data-ani-animation="fadeInRight" data-ani-sequence="4"></div>
	<div class="animated" data-ani-animation="fadeInDown" data-ani-sequence="2"></div>


## How to initialise and set default parameters

Basic initialisation

	cssAnimationQueue.init();

Initalisation with custom settings

	cssAnimationQueue.init({
		wait: 0,
		hidden: true,
		hiddenClass: 'hidden',
		selector: 'animated',
		dataAttr: 'ani',
		animation: 'fadeInUp',
		delay: 0,
		animationEnd: false,
		callback: false
	});

* wait (*Default: 0*)
	- for creating an intial delay. Uses milliseconds
* hidden (*Default: true*)
	- Makes elements hidden by setting their opacity to zero. If the value is set to 'class' it will use the hiddenClass parameter instead
* hiddenClass (*Default: 'hidden'*)
	- If hidden set to class you can use your own css class to hide elements
* selector *(Default: animated)*
	- The class used to apply the script too. If your using animate.css you need the class 'animated'. So I've made this the default so you don't have to add more.
* dataAttr (*Default: 'ani'*)
	- Part of the data attribute e.g. data-ani-animation. You could change this to your own e.g. data-aq-animation
* animation (*Default: 'fadeInUp'*)
	- if you don't set a specific animation on your element you can make it so it defaults to a global one
* delay (*Default: 0*)
	- You can set a global delay for each element
* animationEnd (*Default: false*)
	- Not used yet, but the intention is to make it so you can override the animation end setting to allow multiple animations at once.
* callback (*Default: false*)
	- You can pass through a string name of a custom function. It will be fired each time of every animation though. So its better to set a specific one on an element


### Compatibility

I've used some of the latest JS methods. So this won't be compatable with older versions of IE. But lets face it, if you want CSS3 animations. You need IE10+. This should work well on the latest FireFox and Webkit Browsers (Chrome & Safari). I might add some additional functionality for it to add some basic effects for older browsers later.

I recommend using [classie](https://github.com/desandro/classie) for a crossbrowser classList replacement. I hope to make a condition to detect if set when I get a little extra time.