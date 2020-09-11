import { easings } from "./bezier";

export function initAnimation() {
  let id = null;
  let startTick = null;
  function clear() {
    cancelAnimationFrame(id);
  }
  function animation(callback: any) {
    id = window.requestAnimationFrame((stick) => {
      if (startTick === null) startTick = stick;
      const duration = stick - startTick;
      animation(callback);
      callback(duration, clear);
    });
  }

  return {
    clear,
    animation,
  };
}

export function scrollTo(dom, { top, left }) {
  const hasTop = top != null;
  const hasLeft = left != null;
  if ((!hasTop && !hasLeft) || !dom) return;
  const animaObj = initAnimation();
  const initScrollTop = dom.scrollTop;
  const initScrollLeft = dom.scrollLeft;
  const transition = easings["ease-in-out"];
  if (dom.scrollTo) {
    dom.scrollTo({
      left,
      top,
      behavior: "smooth",
    });
    return;
  }
  animaObj.animation((duration, stop) => {
    if (hasTop && hasLeft) {
      const endS = (Math.abs(top - initScrollTop) * 1.5 + Math.abs(left - initScrollLeft) * 1.5) / 2;
      const percent = duration / endS;
      /* eslint-disable no-param-reassign */
      dom.scrollLeft = transition(initScrollLeft, left, percent);
      dom.scrollTop = transition(initScrollTop, top, percent);
      if (percent === 1) stop();
      return;
    }
    if (hasTop) {
      const endS = Math.abs(top - initScrollTop) * 1.5;
      const percent = duration / endS;
      dom.scrollTop = transition(initScrollTop, top, percent);
      if (percent === 1) stop();
      return;
    }

    if (hasLeft) {
      const endS = Math.abs(left - initScrollLeft) * 1.5;
      const percent = duration / endS;
      dom.scrollLeft = transition(initScrollLeft, left, percent);
      if (percent === 1) stop();
    }
    /* eslint-enable no-param-reassign */
  });
}
