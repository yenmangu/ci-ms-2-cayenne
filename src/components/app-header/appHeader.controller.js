/**
 * @typedef {import('../../types/stateTypes.js').UnitLength} UnitLength
 * @typedef {import('../../types/stateTypes.js').UnitLocale} UnitLocale
 * @typedef {import('../../types/routerTypes.js').RouteEntry} RouteEntry
 */

import { appStore } from '../../appStore.js';
import { routeMap } from '../../router/routeMap.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { ToggleComponent } from '../toggle-component/toggleComponent.controller.js';
import * as service from './appHeader.service.js';
import { renderAppHeader, renderAppNav } from './appHeader.view.js';

export class AppHeader {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container, dev = false) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {HTMLElement} */
		this.header = stringToHtml(renderAppHeader());
		// this.setOffset();

		/** @type {HTMLElement} */
		this.navWrapper = null;

		/** @type {NodeListOf<HTMLAnchorElement>} */
		this.navLinks = null;

		/** @type {string} */
		this.currentPath = '/';

		/** @type {HTMLElement} */
		this.toggleContainer = null;

		/** @type {HTMLElement} */
		this.unitLocaleToggle = null;

		/** @type {HTMLElement} */
		this.unitLengthToggle = null;

		/** @type {ToggleComponent} */
		this.unitLengthToggleComponent = null;

		/** @type {ToggleComponent} */
		this.unitLocaleToggleComponent = null;

		/** @type {UnitLocale} */
		this.unitLocale = 'metric';

		/** @type {UnitLength} */
		this.unitLength = 'unitShort';

		this.dev = false;

		this.subscription = appStore.subscribe(state => {
			this.unitLength = state.unitLength ?? 'unitShort';
			this.unitLocale = state.unitLocale ?? 'metric';
		});
		this.routeSubscription = appStore.subscribe(state => {
			console.log('ROUTE: ', state);
			const { route } = state;
			this.#_handleRouteChange(route.path);
		}, 'route');
	}

	/**
	 *
	 * @param {string} path
	 * @returns {*}
	 */
	#_handleRouteChange(path) {
		this.navLinks.forEach(link => {
			const href = link.getAttribute('href').replace(/^#/, '');
			link.classList.toggle('is-active', href === path);
			link.setAttribute('aria-current', href === path ? 'page' : 'false');
		});
	}

	/**
	 *
	 * @param {boolean} [scrolled=false]
	 */
	setOffset(scrolled = false) {
		const headerStack = document.getElementById('header-stack');

		if (!headerStack) throw new Error('#header-stack not found');
		const spacer = document.getElementById('scroll-spacer');
		if (!spacer) throw new Error('#spacer not found');

		const headerStackOffset = headerStack.offsetHeight;

		if (scrolled) {
			this.header.style.marginTop = `${0}`;
			spacer.style.height = `${this.header.offsetHeight}px`;
		} else {
			this.header.style.marginTop = `${headerStackOffset}px`;
			spacer.style.height = `${0}`;
		}
	}

	init() {
		this.navWrapper = /** @type {HTMLElement} */ (
			this.header.querySelector('.app-header__nav-wrapper')
		);
		if (this.navWrapper instanceof HTMLElement) {
			console.log('rendering nav');

			this.#_renderNav();
		}
		this.toggleContainer = /** @type {HTMLElement} */ (
			this.header.querySelector('.toggle-container')
		);
		if (this.toggleContainer) {
			this.#_initToggles();
		}
		if (this.dev) {
			this.#_initDevControls();
		}
	}

	#_renderNav() {
		console.log('RouteMap: ', routeMap);

		const nav = renderAppNav(routeMap);
		const htmlNav = stringToHtml(nav);
		this.navWrapper.appendChild(htmlNav);
		this.navLinks = /** @type {NodeListOf<HTMLAnchorElement>} */ (
			htmlNav.querySelectorAll('a.app-header__nav-link')
		);
	}

	#_initDevControls() {
		const controls = [
			{ label: 'Log State', onClick: () => console.log(appStore.getState()) },
			{
				label: 'Reset State',
				onClick: () => {
					console.log('Resetting state..');
					appStore.resetState();
					console.log(appStore.getState());
				}
			}
		];
		const ref = this.header.querySelector('.app-header__left');
		controls.forEach(({ label, onClick }) => {
			const btn = document.createElement('button');
			btn.innerText = label;
			btn.style.padding = '0.2rem';
			btn.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				onClick();
			});
			ref.insertAdjacentElement('afterend', btn);
		});
	}

	#_initToggles() {
		// Enable unit length toggle below
		// this.unitLengthToggleComponent = new ToggleComponent(this.toggleContainer, {
		// 	key: 'unitLength',
		// 	onValue: 'unitLong',
		// 	offValue: 'unitShort',
		// 	initialValue: this.unitLength ?? 'unitShort'
		// });
		this.unitLocaleToggleComponent = new ToggleComponent(this.toggleContainer, {
			key: 'unitLocale',
			onValue: 'us',
			offValue: 'metric',
			initialValue: this.unitLocale ?? 'metric',
			className: 'unit-slider-toggle'
		});
		this.unitLocaleToggleComponent.render();
		this.#_updateColours();
		// this.unitLengthToggleComponent.render();
	}
	#_updateColours() {
		if (this.unitLocaleToggleComponent) {
		}
	}

	destroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (this.routeSubscription) {
			this.routeSubscription.unsubscribe();
		}
	}
}
