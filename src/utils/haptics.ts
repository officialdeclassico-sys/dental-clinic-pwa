// Global, PWA-compatible haptic feedback utility built on the Web Vibration API.
// - Checks feature support and genuine user activation before vibrating.
// - Coalesces synchronous event handlers in a microtask and deduplicates rapid taps
//   so one user tap never triggers multiple or overlapping vibrations.
// - Gracefully no-ops on unsupported browsers/devices (such as iOS Safari) and never throws.

export type HapticKind = 'light' | 'selection' | 'checkbox' | 'nav' | 'success' | 'error';

export const HAPTIC_PATTERNS: Record<HapticKind, number | number[]> = {
  light: 12,
  selection: 10,
  checkbox: 10,
  nav: 12,
  success: 22,
  error: [18, 35, 18],
};

const INTERACTIVE_SELECTOR = [
  'button',
  'a[href]',
  'select',
  'input[type="checkbox"]',
  'input[type="radio"]',
  '[role="button"]',
  '[role="tab"]',
  '[role="radio"]',
  '[role="option"]',
  '[role="menuitemradio"]',
  '[role="checkbox"]',
  '[role="switch"]',
].join(', ');

const DEDUPE_COOLDOWN_MS = 55;
const GESTURE_WINDOW_MS = 10_000;

let initialized = false;
let hasTrustedGesture = false;
let lastTrustedGestureAt = 0;
let lastVibratedAt = -Infinity;
let lastVibratedKind: HapticKind | null = null;
let lastObservedClickTarget: EventTarget | null = null;
let lastObservedClickAt = -Infinity;

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function isHapticsSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as NavigatorWithStandalone;
  const iosStandalone = nav.standalone === true;
  const displayModeStandalone =
    typeof window.matchMedia === 'function' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches);
  return Boolean(iosStandalone || displayModeStandalone);
}

function isDisabledElement(el: HTMLElement): boolean {
  return (
    el.hasAttribute('disabled') ||
    el.getAttribute('aria-disabled') === 'true' ||
    (el as HTMLButtonElement).disabled === true
  );
}

function hasValidUserActivation(): boolean {
  if (typeof navigator === 'undefined') return false;
  const userActivation = (navigator as Navigator & { userActivation?: Partial<UserActivation> })
    .userActivation;
  if (userActivation?.isActive) {
    return true;
  }
  if (!initialized) {
    return userActivation?.hasBeenActive ?? true;
  }
  if (!hasTrustedGesture) {
    return false;
  }
  return performance.now() - lastTrustedGestureAt <= GESTURE_WINDOW_MS;
}

function executeVibrate(kind: HapticKind, pattern: number | number[]): boolean {
  if (!isHapticsSupported()) return false;
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
    return false;
  }
  if (!hasValidUserActivation()) {
    return false;
  }

  const now = performance.now();
  const isPriorityOutcome = kind === 'success' || kind === 'error';

  if (now - lastVibratedAt < DEDUPE_COOLDOWN_MS) {
    if (!isPriorityOutcome || lastVibratedKind === kind) {
      return false;
    }
  }

  try {
    const result = navigator.vibrate(pattern);
    lastVibratedAt = now;
    lastVibratedKind = kind;
    return result !== false;
  } catch {
    return false;
  }
}

function triggerSemanticHaptic(kind: HapticKind, pattern: number | number[]): boolean {
  return executeVibrate(kind, pattern);
}

export function triggerLightHaptic(durationMs = HAPTIC_PATTERNS.light as number): boolean {
  const clamped = Math.max(5, Math.min(25, Math.round(durationMs)));
  return triggerSemanticHaptic('light', clamped);
}

export function triggerSelectionHaptic(): boolean {
  return triggerSemanticHaptic('selection', HAPTIC_PATTERNS.selection);
}

export function triggerCheckboxHaptic(): boolean {
  return triggerSemanticHaptic('checkbox', HAPTIC_PATTERNS.checkbox);
}

export function triggerNavHaptic(): boolean {
  return triggerSemanticHaptic('nav', HAPTIC_PATTERNS.nav);
}

export function triggerSuccessHaptic(): boolean {
  return triggerSemanticHaptic('success', HAPTIC_PATTERNS.success);
}

export function triggerErrorHaptic(): boolean {
  return triggerSemanticHaptic('error', HAPTIC_PATTERNS.error);
}

function classifyInteractiveElement(el: HTMLElement): HapticKind | null {
  const override = el.getAttribute('data-haptic');
  if (override === 'none' || override === 'deferred') {
    return null;
  }
  if (override === 'selection') return 'selection';
  if (override === 'checkbox') return 'checkbox';
  if (override === 'nav') return 'nav';
  if (override === 'light') return 'light';

  if (el.closest('nav[aria-label="Primary Bottom Navigation"]')) {
    return 'nav';
  }

  const role = el.getAttribute('role');
  if (
    role === 'checkbox' ||
    role === 'switch' ||
    (el instanceof HTMLInputElement && el.type === 'checkbox')
  ) {
    return 'checkbox';
  }

  if (
    role === 'radio' ||
    role === 'option' ||
    role === 'tab' ||
    role === 'menuitemradio' ||
    el instanceof HTMLSelectElement ||
    (el instanceof HTMLInputElement && el.type === 'radio')
  ) {
    return 'selection';
  }

  return 'light';
}

function scheduleTapHaptic(kind: HapticKind): void {
  executeVibrate(kind, HAPTIC_PATTERNS[kind]);
}

export function initGlobalHaptics(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }
  if (initialized) {
    return () => {};
  }
  initialized = true;

  const markGesture = (e: Event) => {
    if (!e.isTrusted) return;
    hasTrustedGesture = true;
    lastTrustedGestureAt = performance.now();
  };

  const handleClick = (e: MouseEvent) => {
    if (!e.isTrusted) return;
    markGesture(e);

    if (!(e.target instanceof Element)) return;
    const interactive = e.target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
    if (!interactive || isDisabledElement(interactive)) return;

    // Guard against duplicate synthetic clicks generated by label -> input forwarding
    const now = performance.now();
    if (
      lastObservedClickTarget &&
      lastObservedClickTarget !== e.target &&
      now - lastObservedClickAt < 40 &&
      interactive.contains(lastObservedClickTarget as Node)
    ) {
      return;
    }
    lastObservedClickTarget = e.target;
    lastObservedClickAt = now;

    const kind = classifyInteractiveElement(interactive);
    if (!kind) return;

    scheduleTapHaptic(kind);
  };

  const handleChange = (e: Event) => {
    if (!e.isTrusted) return;
    markGesture(e);
    if (e.target instanceof HTMLSelectElement) {
      triggerSelectionHaptic();
    }
  };

  const handleInvalid = (e: Event) => {
    if (!e.isTrusted) return;
    // Only vibrate for user-initiated form submission validation
    if (!hasValidUserActivation()) return;
    triggerErrorHaptic();
  };

  document.addEventListener('pointerdown', markGesture, { capture: true, passive: true });
  document.addEventListener('touchstart', markGesture, { capture: true, passive: true });
  document.addEventListener('keydown', markGesture, { capture: true, passive: true });
  document.addEventListener('click', handleClick, { capture: true, passive: true });
  document.addEventListener('change', handleChange, { capture: true, passive: true });
  document.addEventListener('invalid', handleInvalid, { capture: true, passive: true });

  return () => {
    document.removeEventListener('pointerdown', markGesture, { capture: true });
    document.removeEventListener('touchstart', markGesture, { capture: true });
    document.removeEventListener('keydown', markGesture, { capture: true });
    document.removeEventListener('click', handleClick, { capture: true });
    document.removeEventListener('change', handleChange, { capture: true });
    document.removeEventListener('invalid', handleInvalid, { capture: true });
    initialized = false;
  };
}
