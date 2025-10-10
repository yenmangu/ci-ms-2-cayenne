import { AppHeader } from '../components/app-header/appHeader.controller.js';

const STACK_OFFSET_VAR = '--stack-offset-height';
const APP_H_OFFSET_VAR = '--app-header-offset-height';
const MAIN_PAD_TOP_VAR = '--main-pad-top';
const HEADER_SPEED_VAR = '--header-speed';

const HIDDEN_CLASS = 'header-stack--hidden';

/**
 *
 * @param {AppHeader} appHeaderComponent
 * @param {number} timeout
 */
export function initAppHeader(appHeaderComponent, timeout) {
	const stack = document.getElementById('header-stack');
	const main = document.getElementById('cayenne-main');
	const appHeader = appHeaderComponent.header;

	if (!stack || !appHeader || !main)
		throw new Error('[initHeaderSystem]: Missing elements.');

	let hidden = false;
	let animating = false;
	let stackHeight = 0;
	let appHeaderHeight = 0;
	let timeoutId = /** @type {number|undefined} */ (undefined);

	/**
	 * Set `hide` to true, when hiding the header-stack.
	 * @param {boolean} hide
	 */
	const toggleStackHidden = hide => {
		// Optional - remove legacy inline transforms that override class
		// stack.style.removeProperty('transform');

		const isHidden = stack.classList.contains(HIDDEN_CLASS);
		if (hide === isHidden) return isHidden;

		stack.classList.toggle(HIDDEN_CLASS, hide);

		hidden = !!hide;

		return hidden;
	};

	const showStack = () => toggleStackHidden(false);
	const hideStack = () => toggleStackHidden(true);

	const setVar = (name, val) => {
		document.documentElement.style.setProperty(name, val);
	};

	const recalcStack = () => {
		stackHeight = stack.offsetHeight || 0;
		appHeaderHeight = appHeader.offsetHeight;
		setVar(STACK_OFFSET_VAR, `${stackHeight}px`);
	};

	const recalcAppHeader = () => {
		if (!appHeader) throw new Error('[recalcAppHeader]: Missing appHeader.');

		appHeaderHeight = appHeader.offsetHeight || 0;
		setVar(APP_H_OFFSET_VAR, `${appHeaderHeight}px`);
	};

	const recalcMainPad = () => {
		stackHeight = stack.offsetHeight || 0;
		appHeaderHeight = appHeader.offsetHeight || 0;
		const padValue = hidden ? appHeaderHeight : stackHeight + appHeaderHeight;
		setVar(MAIN_PAD_TOP_VAR, `${padValue}px`);
	};

	const recalc = () => {
		recalcStack();
		recalcAppHeader();
		recalcMainPad();
	};

	// Initial compute
	recalc();

	// Respect reduced motion
	const prefersNoMotion = window.matchMedia?.(
		'(prefers-reduced-motion: reduce)'
	).matches;

	setVar(HEADER_SPEED_VAR, prefersNoMotion ? '0ms' : `${timeout}ms`);

	// Arm transitions AFTER initial vars written (next frame)
	requestAnimationFrame(() => {
		appHeader.setAttribute('data-ready', 'true');
		main.setAttribute('data-ready', 'true');
	});

	// Keep vars fresh on resize
	const ro = new ResizeObserver(() => requestAnimationFrame(recalc));

	if (stack) ro.observe(stack);
	if (appHeader) ro.observe(appHeader);

	const animateHide = () => {
		if (prefersNoMotion || hidden || animating) return;
		animating = true;

		// Pause RO to avoid mid-flight recalcs
		ro.disconnect();

		/**
		 * Option 1: use timer based approach
		 */

		requestAnimationFrame(() => {
			// Stack transforms up
			hideStack();
			// padding-top animates from (stack+app)px -> (app)px
			setVar(MAIN_PAD_TOP_VAR, `${appHeaderHeight}px`);
		});

		// Compute runtime duration of animation
		// Reconnect RO after animation time (duration + buffer)
		// Read from CSS, so we dont reconnect the RO too early or late
		// NOTE: The 34ms additional is 2 x 16ms (2 x frames);
		// Ensures that a timer that an easing curve that has
		// completed on a subframe is ignored and
		// skipped to next ACTUAL frame.
		const runtimeDuration =
			parseInt(
				getComputedStyle(document.documentElement).getPropertyValue(
					HEADER_SPEED_VAR
				)
			) ||
			timeout ||
			300;
		setTimeout(() => {
			ro.observe(stack);
			ro.observe(appHeader);
			animating = false;
		}, runtimeDuration + 34);

		/*
		// Option 2 - watch for animation end:
		/**
		 *
		 * @param {TransitionEvent} e
		 */

		/*
		const onAnimEnd = (e) => {
			if (e.propertyName !== 'padding-top') return;
			main.removeEventListener('transitionend', onAnimEnd)
			ro.observe(stack)
			ro.observe(appHeader)
			animating = false
		}
		// Add listener before triggering transitions to avoid race conditions
		main.addEventListener('transitionend', onAnimEnd, { once: true })
		hideStack();
		setVar(MAIN_PAD_TOP_VAR, `${appHeaderHeight}px`)

		requstionAnimationFrame(() => {

			hideStack();

			setVar(MAIN_TOP_PAD_VAR, `${appHeaderHeight}px`)
			})
		*/

		// Either is fine, but option 2 is probably better as it works with
		// 60/90/120 Hz refresh rate monitors.

		// Best option is a best of both worlds combination:

		/*
		let done = false;

		// 1. Watch-dog fallback (derived from CSS var, with buffer)
		const cssMs =
			parseInt(
				getComputedStyle(document.documentElement).getPropertyValue(
					HEADER_SPEED_VAR
				)
			) ||
			timeout ||
			300;

		const fallbackId = setTimeout(() => {
			if (done) return;
			// Set `done` guard early
			done = true;

			main.removeEventListener('transitionend', onEnd);
			ro.observe(stack);
			ro.observe(appHeader);
			animating = false;
		}, cssMs + 50);
		// 50ms = ~3 frames buffer across refresh rates

		// 2. Primary: reconnect exactly on padding-top transitionend event
		/**
		 *
		 * @param {TransitionEvent} e
		 */
		/*
		const onEnd = e => {
			if (e.propertyName === 'padding-top') return;
			if (done) return;
			done = true;
			clearTimeout(fallbackId);
			main.removeEventListener('transitionend', onEnd);
			ro.observe(stack);
			ro.observe(appHeader);
			animating = false;
		};
		main.addEventListener('transitionend', onEnd);
		*/
	};

	// Wait for fonts to stabilise, then trigger after timeout
	const afterFonts = document.fonts?.ready ?? Promise.resolve();
	afterFonts.finally(() => {
		timeoutId = window.setTimeout(() => {
			animateHide();
		}, timeout);
	});

	return () => {
		ro.disconnect();
		if (timeoutId !== undefined) clearTimeout(timeoutId);

		main.removeAttribute('data-ready');
		appHeader.removeAttribute('data-ready');

		showStack();
	};
}

/* -------------------------------------------------------------------------- */
// KEPT FOR FUTURE REFERENCE

// const HIDE_THRESHOLD = 16;
// const SHOW_THRESHOLD = 8;
// const SCROLL_DELTA_MIN = 24;

// /**
//  * Function to smoothly animate header on scroll;
//  * Includes velocity gated animations
//  *
//  * @param {AppHeader} appHeaderComponent
//  */
// export function initHeaderSystem(appHeaderComponent) {
// 	const stack = document.getElementById('header-stack');
// 	const spacer = document.getElementById('scroll-spacer');
// 	const main = document.getElementById('cayenne-main');
// 	const appHeader = appHeaderComponent.header;

// 	if (!stack || !appHeader || !main)
// 		throw new Error('[initHeaderSystem]: Missing elements.');

// 	let lastTop = main.scrollTop || 0;
// 	let hidden = false;
// 	let ticking = false;
// 	let stackHeight = 0;
// 	let appHeaderHeight = 0;

// 	/**
// 	 * Set `hide` to true, when hiding the header-stack.
// 	 * @param {boolean} hide
// 	 */
// 	const toggleStackHidden = hide => {
// 		// Optional - remove legacy inline transforms that override class
// 		// stack.style.removeProperty('transform');

// 		const isHidden = stack.classList.contains(HIDDEN_CLASS);
// 		if (hide === isHidden) return isHidden;

// 		stack.classList.toggle(HIDDEN_CLASS, hide);

// 		hidden = !!hide;

// 		return hidden;
// 	};

// 	const showStack = () => toggleStackHidden(false);
// 	const hideStack = () => toggleStackHidden(true);

// 	const setVar = (name, val) => {
// 		document.documentElement.style.setProperty(name, val);
// 	};

// 	const recalcStack = () => {
// 		stackHeight = stack.offsetHeight || 0;
// 		appHeaderHeight = appHeader.offsetHeight;
// 		setVar(STACK_OFFSET_VAR, `${stackHeight}px`);
// 	};

// 	const recalcAppHeader = () => {
// 		if (!appHeader) throw new Error('[recalcAppHeader]: Missing appHeader.');

// 		appHeaderHeight = appHeader.offsetHeight || 0;
// 		setVar(APP_H_OFFSET_VAR, `${appHeaderHeight}px`);
// 	};

// 	const recalcMainPad = () => {
// 		stackHeight = stack.offsetHeight || 0;
// 		appHeaderHeight = appHeader.offsetHeight || 0;
// 		const padValue = stackHeight + appHeaderHeight;
// 		setVar(MAIN_PAD_TOP_VAR, `${padValue}px`);
// 	};

// 	// Observe containers - child changes bubble their height

// 	const ro = new ResizeObserver(() => {
// 		requestAnimationFrame(() => {
// 			recalcStack();
// 			recalcAppHeader();
// 		});
// 	});
// 	ro.observe(stack);
// 	if (appHeader) ro.observe(appHeader);

// 	// Initial compute
// 	recalcStack();
// 	recalcAppHeader();
// 	recalcMainPad();

// 	// Ensure correct initial visibility even when start at scrolled position
// 	if (main.scrollTop > HIDE_THRESHOLD) {
// 		hideStack();
// 		hidden = true;
// 	}

// 	const onScroll = () => {
// 		// Animating
// 		if (ticking) return;
// 		ticking = true;

// 		requestAnimationFrame(() => {
// 			const top = Math.max(main.scrollTop || 0, 0);

// 			const deltaY = top - lastTop;

// 			const relativeTop = Math.max(top - stackHeight, 0);
// 			// console.log('hidden:	', hidden, '	|| relativeTop: ', relativeTop);

// 			if (!hidden && deltaY > 0 && top > HIDE_THRESHOLD) {
// 				hidden = hideStack();
// 			}

// 			// SHOW (up): velocity-gated
// 			if (hidden && deltaY < 0 && Math.abs(deltaY) >= SCROLL_DELTA_MIN) {
// 				hidden = showStack();
// 			}

// 			// SHOW (near top): hysteresis and slow scroll
// 			else if (hidden && deltaY < 0 && top < SHOW_THRESHOLD) {
// 				hidden = showStack();
// 			}
// 			lastTop = top;
// 			ticking = false;
// 		});
// 	};
// 	main.addEventListener('scroll', onScroll, { passive: true });

// 	return () => {
// 		main.removeEventListener('scroll', onScroll);
// 		ro.disconnect();
// 		showStack();
// 	};
// }
