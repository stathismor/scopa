import { gsap } from 'gsap';

/* 
https://greensock.com/docs/v3/HelperFunctions

Copy this to your project. Pass in the elements (selector text or NodeList or Array), then a 
function/callback that actually performs your DOM changes, and optionally a vars 
object that contains any of the following properties to customize the transition:

 - duration [Number] - duration (in seconds) of each animation
 - stagger [Number | Object | Function] - amount to stagger the starting time of each animation. You may use advanced staggers too (see https://codepen.io/GreenSock/pen/jdawKx)
 - ease [Ease] - controls the easing of the animation. Like "power2.inOut", or "elastic", etc.
 - onComplete [Function] - a callback function that should be called when all the animation has completed.
 - delay [Number] - time (in seconds) that should elapse before any of the animations begin. 

This function will return a Timeline containing all the animations. 
*/

type Element = any;

export function flip(elements: Element[], changeFunc: Function, vars: any = {}) {
  const gsapElements = gsap.utils.toArray(elements);
  const tl = gsap.timeline({ onComplete: vars.onComplete, delay: vars.delay || 0 });
  const bounds = gsapElements.map((el: Element) => el.getBoundingClientRect());
  const copy: any = {};
  let p;
  gsapElements.forEach((el: Element) => {
    el._flip && el._flip.progress(1);
    el._flip = tl;
  });
  changeFunc();
  for (p in vars) {
    p !== 'onComplete' && p !== 'delay' && (copy[p] = vars[p]);
  }
  copy.x = (i: number, element: Element) => '+=' + (bounds[i].left - element.getBoundingClientRect().left);
  copy.y = (i: number, element: Element) => '+=' + (bounds[i].top - element.getBoundingClientRect().top);
  console.log(copy, bounds)
  return tl.from(gsapElements, copy);
}
