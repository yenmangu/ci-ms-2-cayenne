/**
 * NOTES ABOUT THIS
 *
 * Continuing on from the IconRegistry, I know this is overkill
 *
 *
 * References/resources/further reading:
 *
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides
 * https://www.a11yproject.com/
 * https://www.a11yproject.com/resources/
 *
 */

/**
 * @typedef {import('../iconRegistry.js').IconRegistry} Registry
 * @typedef {import('./icon.controller.js').Icon} Icon
 */

import { IconRegistry } from '../iconRegistry.js';

/**
 * @typedef {'ghost'|'solid'|'link'} ButtonVariant
 * @typedef {string} CustomSize
 * @typedef {'xs'|'sm'|'md'|'lg'|CustomSize} ButtonSize
 */

/**
 * @typedef {object} IconButtonOptions
 * @property {string} icon
 * @property {boolean} isNavLink
 * @property {string} [routeKey]
 * @property {import("./icon.controller.js").IconAttributes} [iconAttrs]
 * @property {string} [toggledIcon]
 * @property {boolean} [toggled]
 * @property {boolean} [disabled]
 * @property {string} [label]
 * @property {string} [ariaLabel]
 * @property {ButtonVariant} [variant]
 * @property {ButtonSize} [size]
 * @property {(ev: MouseEvent, btn:IconButton) => void} [onClick]
 */

/**
 * Regex101 - Validate CSS Units
 * https://regex101.com/r/KFOT9a/1
 */
const CSS_LENGTH_RE =
	/^(-?(\d*\.)?\d+)((px)|(em)|(%)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(cm)|(mm)|(in)|(pt)|(pc))$/gim;

export class IconButton {
	/** @type {HTMLButtonElement} */ #el;
	/** @type {HTMLSpanElement} */ #iconHost;
	/** @type {HTMLElement|null} */ #labelNode = null;
	/** @type {IconButtonOptions} */ #opts;
	/** @type {Icon|null} */ #icon = null;
	/** @type {IconRegistry} */ #registry;
	/** @type {string} */ #routeKey = null;

	/**
	 *
	 * @param {Registry} registry
	 * @param {IconButtonOptions} opts
	 */
	constructor(registry, opts) {
		if (!registry) throw new Error('IconButton: registry is required');
		if (!opts?.icon) throw new Error('IconButton: "icon" is required');
		if (!opts.label && !opts.ariaLabel)
			throw new Error('IconButton: icon-only usage requires ariaLabel');
		if (opts.isNavLink && !opts.routeKey)
			throw new Error('IconButton: routeKey must be set when isNavLink true');
		this.#registry = registry;
		this.#opts = { variant: 'ghost', size: 'md', toggled: false, ...opts };

		if (opts.routeKey) this.#routeKey = opts.routeKey;

		this.#el = document.createElement('button');
		this.#el.type = 'button';
		this.#el.className = this.#classList();
		this.#el.disabled = !!this.#opts.disabled;
		this.#el.setAttribute('aria-pressed', String(!!this.#opts.toggled));
		if (this.#opts.ariaLabel) {
			this.#el.setAttribute('aria-label', this.#opts.ariaLabel);
		}

		this.#iconHost = document.createElement('span');
		this.#iconHost.className = 'icon-button__icon';
		this.#el.appendChild(this.#iconHost);

		if (this.#opts.label) {
			const span = document.createElement('span');
			span.className = 'icon-button__label';
			span.textContent = this.#opts.label;
			this.#el.appendChild(span);
			this.#labelNode = span;
		}

		this.toggled = false;

		this.#el.addEventListener('click', ev => {
			if (typeof this.#opts.toggled === 'boolean') {
				this.setToggled(!this.#opts.toggled);
			}
			this.#opts.onClick?.(ev, this);
		});
	}

	#classList() {
		const v = this.#opts.variant;
		const s = this.#opts.size;
		const t = this.#opts.toggled ? 'icon-button--toggled' : '';
		return `icon-button icon-button--${v} icon-button--${s} ${t}`.trim();
	}

	/**
	 *
	 * @param {HTMLButtonElement} el
	 * @param {ButtonSize} size
	 */
	applyIconButtonSize(el, size) {
		const presets = ['xs', 'sm', 'md', 'lg'];
		el.classList.remove(...presets.map(p => `icon-button--${p}`));

		if (presets.includes(String(size))) {
			el.classList.add(`icon-button--${size}`);
			return;
		}

		if (typeof size === 'string' && CSS_LENGTH_RE.test(size.trim())) {
			el.style.setProperty('font-size', size.trim());
			return;
		}

		console.warn('IconButton Invalid size value: ', size);
	}

	/** @returns {HTMLButtonElement} */
	get el() {
		return this.#el;
	}

	get routeKey() {
		return this.#routeKey;
	}

	/**
	 *
	 * @param {HTMLElement} container
	 */
	mount(container) {
		if (!container)
			throw new Error('IconButton No container provided to mount()');
		container.appendChild(this.#el);
		void this.render();
	}

	async render() {
		const name =
			this.#opts.toggled && this.#opts.toggledIcon
				? this.#opts.toggledIcon
				: this.#opts.icon;

		if (!this.#icon || this.#icon.entry.name !== name) {
			this.#icon = this.#registry.getIcon(name, this.#opts.iconAttrs);
			this.#icon.render(this.#iconHost);
		} else {
			if (this.#opts.iconAttrs) {
				this.#icon.update(this.#opts.iconAttrs);
			}
		}

		this.#el.className = this.#classList();
		this.#el.setAttribute('aria-pressed', String(!!this.#opts.toggled));
		this.#el.disabled = !!this.#opts.disabled;
	}

	setToggled(on) {
		// if (this.isToggled() === !!on) return;
		console.log('Toggling icon: ', this.#routeKey, 'with: ', on);
		this.toggled = !!on;
		this.#opts.toggled = !!on;
		void this.render();
	}

	isToggled() {
		return !!this.#opts.toggled;
	}

	setDisabled(icon, toggledIcon = this.#opts.toggledIcon) {
		this.#opts.icon = icon;
		this.#opts.toggledIcon = toggledIcon;
		// Force fresh instance
		this.#icon = null;
		void this.render();
	}

	setIconAttrs(next) {
		this.#opts.iconAttrs = {
			...(this.#opts.iconAttrs || {}),
			...next
		};
		void this.render();
	}

	setLabel(text) {
		this.#opts.label = text;
		if (!this.#labelNode) {
			const span = document.createElement('span');
			span.className = 'icon-button__label';
			this.#el.appendChild(span);
			this.#labelNode = span;
		}
		this.#labelNode.textContent = text;
		this.#el.removeAttribute('aria-label');
	}

	setAriaLabel(text) {
		this.#opts.ariaLabel = text;
		this.el.setAttribute('aria-label', text);
	}

	// Optional cleanup; minimise memory leaks
	destroy() {
		this.#el.replaceWith();
		this.#icon = null;
	}
}
