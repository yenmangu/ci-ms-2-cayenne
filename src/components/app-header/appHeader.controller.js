/**
 * @typedef {import('../../types/stateTypes.js').UnitLength} UnitLength
 * @typedef {import('../../types/stateTypes.js').UnitLocale} UnitLocale
 * @typedef {import('../../types/routerTypes.js').RouteEntry} RouteEntry
 */

import { appStore } from '../../appStore.js';
import { iconButtonConfigs } from '../../data/icons/index.js';
import { ENV } from '../../env.js';
import { routeMap } from '../../router/routeMap.js';
import { routerService } from '../../router/routerService.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { getIconRegistry } from '../../util/icon/icon-component/icon.service.js';
import { IconButton } from '../../util/icon/icon-component/iconButton.controller.js';
import { ToggleComponent } from '../toggle-component/toggleComponent.controller.js';
import { renderAppHeader } from './appHeader.view.js';

export class AppHeader {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container, dev = false) {
		/** @type {HTMLElement} */
		this.container = container;

		/** @type {HTMLElement} */
		this.header = stringToHtml(renderAppHeader(ENV.HOME_URL));

		/** @type {HTMLElement} */
		this.navWrapper = null;

		this.iconRegistry = getIconRegistry();

		/** @type {IconButton[]} */
		this.iconButtons = [];

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
		if (!this.iconButtons) return;

		this.iconButtons.forEach(btn => {
			// Dev logging
			// console.log(
			// 	'Button:',
			// 	btn.routeKey,
			// 	'Active:',
			// 	routerService.activeRouteKey,
			// 	'IsActive:',
			// 	routerService.isActiveRoute(btn.routeKey)
			// );

			btn.setToggled(routerService.isActiveRoute(btn.routeKey));
		});
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
			className: 'unit-slider-toggle',
			initialValue: this.unitLocale ?? 'metric',
			key: 'unitLocale',
			offValue: 'metric',
			onValue: 'us'
		});
		this.unitLocaleToggleComponent.render();
		this.#_updateColours();
	}

	#_renderIconLinks() {
		const homeOpts = iconButtonConfigs.home(true, routeMap['/'].path, 'solid');
		const home = new IconButton(this.iconRegistry, {
			...homeOpts,
			onClick: (e, btn) => {
				e.preventDefault();
				routerService.navigateHome();
			}
		});

		const savedRecipesOpts = iconButtonConfigs.savedRecipes(
			true,
			routeMap['/saved-recipes'].path,
			'solid'
		);
		const savedRecipes = new IconButton(this.iconRegistry, {
			...savedRecipesOpts,
			onClick: (e, btn) => {
				e.preventDefault();
				routerService.navigateLikedRecipes();
			}
		});

		const shoppingListOps = iconButtonConfigs.cart(
			true,
			routeMap['/shopping-list'].path,
			'solid'
		);
		const shoppingList = new IconButton(this.iconRegistry, {
			...shoppingListOps,
			onClick: (e, btn) => {
				e.preventDefault();
				routerService.navigateShoppingList();
			}
		});

		this.iconButtons.push(home, savedRecipes, shoppingList);
	}

	async #_renderNav() {
		this.#_renderIconLinks();
		const nav = document.getElementById('app-header-nav');
		const ul = document.createElement('ul');
		ul.className = 'app-header__nav-links';
		this.iconButtons.forEach(btn => {
			const li = document.createElement('li');
			li.className = 'app-header__nav-link';
			btn.mount(li);
			ul.appendChild(li);
		});
		nav.appendChild(ul);
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

	init() {
		this.navWrapper = /** @type {HTMLElement} */ (
			this.header.querySelector('.app-header__nav-wrapper')
		);
		if (this.navWrapper instanceof HTMLElement) {
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
}
