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
export type MoveOptions = {
  duration?: number;
  stagger?: number;
  ease?: number;
  onComplete?: gsap.Callback;
  delay?: number;
};

export function move(
  elements: Element[],
  updateFunc: () => void,
  { onComplete, delay = 0, ...vars }: MoveOptions = {},
) {
  const gsapElements = gsap.utils.toArray(elements);
  const tl = gsap.timeline({ onComplete, delay });
  const bounds = gsapElements.map((el: Element) => el.getBoundingClientRect());
  const copy: any = {};

  // Temporarily move the elements to their new position. gsap will animate them just after that.
  updateFunc();

  for (let p in vars) {
    copy[p] = vars[p];
  }
  copy.x = (i: number, element: Element) => '+=' + (bounds[i].left - element.getBoundingClientRect().left);
  copy.y = (i: number, element: Element) => '+=' + (bounds[i].top - element.getBoundingClientRect().top);
  return tl.from(gsapElements, copy);
}
