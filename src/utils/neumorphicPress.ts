// Global delegated press-state manager for immediate mouse, touch, and keyboard
// neumorphic pressed-in feedback without interfering with clicks, scroll, or navigation.

const INTERACTIVE_SELECTOR =
  'button, a[href], [role="button"], [role="tab"], [role="radio"], [role="option"], [role="menuitemradio"]';

let initialized = false;

export function initNeumorphicPress(): void {
  if (initialized || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  initialized = true;

  let activeEl: HTMLElement | null = null;
  let pressedAt = 0;
  let releaseTimer: number | null = null;
  let startX = 0;
  let startY = 0;

  const isDisabled = (el: HTMLElement): boolean =>
    el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';

  const clearImmediate = (target?: HTMLElement | null) => {
    const el = target ?? activeEl;
    if (releaseTimer !== null) {
      window.clearTimeout(releaseTimer);
      releaseTimer = null;
    }
    if (el && el.isConnected) {
      el.removeAttribute('data-neu-pressed');
    }
    if (!target || target === activeEl) {
      activeEl = null;
    }
  };

  const pressElement = (el: HTMLElement) => {
    if (isDisabled(el)) return;
    if (activeEl && activeEl !== el) {
      clearImmediate(activeEl);
    }
    if (releaseTimer !== null) {
      window.clearTimeout(releaseTimer);
      releaseTimer = null;
    }
    activeEl = el;
    pressedAt = performance.now();
    el.setAttribute('data-neu-pressed', 'true');
  };

  const releaseElement = (immediate = false) => {
    if (!activeEl) return;
    const el = activeEl;
    if (immediate) {
      clearImmediate(el);
      return;
    }
    const elapsed = performance.now() - pressedAt;
    const minHoldMs = 110;
    if (elapsed >= minHoldMs) {
      clearImmediate(el);
    } else {
      if (releaseTimer !== null) window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        clearImmediate(el);
      }, minHoldMs - elapsed);
    }
  };

  const findInteractive = (target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof Element)) return null;
    const found = target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
    if (!found || found.hasAttribute('data-no-press') || isDisabled(found)) {
      return null;
    }
    return found;
  };

  document.addEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const el = findInteractive(e.target);
      if (!el) return;
      startX = e.clientX;
      startY = e.clientY;
      pressElement(el);
    },
    { passive: true }
  );

  document.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      if (!activeEl) return;
      if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) {
        releaseElement(true);
      }
    },
    { passive: true }
  );

  document.addEventListener(
    'pointerup',
    () => {
      releaseElement(false);
    },
    { passive: true }
  );

  document.addEventListener(
    'pointercancel',
    () => {
      releaseElement(true);
    },
    { passive: true }
  );

  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = findInteractive(e.target);
      if (!el) return;
      pressElement(el);
    },
    { passive: true }
  );

  document.addEventListener(
    'keyup',
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      releaseElement(false);
    },
    { passive: true }
  );

  window.addEventListener('blur', () => releaseElement(true), { passive: true });
  document.addEventListener('scroll', () => releaseElement(true), {
    passive: true,
    capture: true,
  });
}
