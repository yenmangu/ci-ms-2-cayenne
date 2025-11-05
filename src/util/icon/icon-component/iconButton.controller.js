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
 * @typedef {IconRegistry} Registry
 *
 * @typedef {import('../../../types/iconTypes.js').ButtonAttributes} ButtonAttributes
 * @typedef {import('../../../types/iconTypes.js').IconAttributes} IconAttributes
 * @typedef {import('../../../types/iconTypes.js').IconButtonOptions} IconButtonOptions
 */
/**
 * @typedef {import('../../../types/iconTypes.js').ButtonVariant} ButtonVariant
 * @typedef {import('../../../types/iconTypes.js').CustomSize} CustomSize
 * @typedef {import('../../../types/iconTypes.js').ButtonSize} ButtonSize
 */

import { IconRegistry } from '../iconRegistry.js';
import { Icon } from './icon.controller.js';

const ARIA_ATTRS = {
	ariaDescribedBy: 'aria-describedby',
	ariaHidden: 'aria-hidden',
	ariaLabel: 'aria-label',
	ariaLabelledBy: 'aria-labelledby',
	focusable: 'focusable',
	tabIndex: 'tabindex',
	title: 'title'
};

/**
 * Regex101 - Validate CSS Units
 * https://regex101.com/r/KFOT9a/1
 */
const CSS_LENGTH_RE =
	/^(-?(\d*\.)?\d+)((px)|(em)|(%)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(cm)|(mm)|(in)|(pt)|(pc))$/gim;

export class IconButton {
	/** @type {HTMLButtonElement} */ #buttonAttrs;
	/** @type {HTMLSpanElement} */ #buttonToggledAttrs;
	/** @type {HTMLElement|null} */ #el;
	/** @type {IconButtonOptions} */ #icon = null;
	/** @type {Icon|null} */ #iconAttrs;
	/** @type {IconRegistry} */ #iconHost;
	/** @type {string} */ #iconToggledAttrs;

	/** @type {IconAttributes} */ #labelNode = null;
	/** @type {IconAttributes} */ #opts;

	/** @type {ButtonAttributes} */ #registry;
	/** @type {ButtonAttributes} */ #routeKey = null;

	/**
	 * @param {Registry} registry
	 * @param {IconButtonOptions} opts
	 */
	constructor(registry, opts) {
		// Validation & registry
		if (!registry) throw new Error('IconButton: registry is required');
		if (!opts?.icon) throw new Error('IconButton: "icon" is required');

		this.#registry = registry;
		this.#opts = { size: 'md', toggled: false, variant: 'ghost', ...opts };
		if (opts.routeKey) this.#routeKey = opts.routeKey;

		// New attributes
		this.#iconAttrs = opts.iconAttrs || {};
		this.#iconToggledAttrs = opts.iconToggledAttrs || {};
		this.#buttonAttrs = opts.buttonAttrs || {};
		this.#buttonToggledAttrs = opts.buttonToggledAttrs || {};

		// Label/ARIA Validation - checking ONLY if one exists
		const initialLabel =
			this.#buttonAttrs.label ||
			this.#buttonToggledAttrs.label ||
			this.#buttonAttrs.ariaLabel ||
			this.#buttonToggledAttrs.ariaLabel;
		if (!initialLabel) {
			throw new Error(
				'IconButton: Visible text or ariaLabel is required in buttonAttrs or buttonToggledAttrs'
			);
		}

		// Nav Link/Route Validation
		if (opts.isNavLink && !opts.routeKey) {
			throw new Error('IconButton: routeKey must be set when isNavLink true');
		}

		// Create DOM Elements
		this.#el = document.createElement('button');
		this.#el.type = 'button';
		this.#el.className = this.#classList();
		// -- Create #iconHost
		this.#iconHost = document.createElement('span');
		this.#iconHost.className = 'icon-button__icon';
		this.#el.appendChild(this.#iconHost);

		// If label is present in either state, add the label span (text set in render)
		if (this.#buttonAttrs.label || this.#buttonToggledAttrs.label) {
			this.#labelNode = this.#createLabelNode();
		}

		this.#el.disabled = !!this.#opts.disabled;
		this.#el.setAttribute('aria-pressed', String(!!this.#opts.toggled));

		// No direct aria-label or title setting here; all handled in render()

		this.#el.addEventListener('click', event => {
			if (typeof this.#opts.toggled === 'boolean') {
				this.setToggled(!this.#opts.toggled);
			}
			this.#opts.onClick?.(event, this);
		});
	}

	/**
	 *
	 * @param {Element} el
	 * @param {object} attrs
	 */
	#classList() {
		const v = this.#opts.variant;
		const s = this.#opts.size;
		const t = this.#opts.toggled ? 'icon-button--toggled' : '';
		return `icon-button icon-button--${v} icon-button--${s} ${t}`.trim();
	}

	/**
	 *
	 * @returns {HTMLSpanElement}
	 */
	#createLabelNode() {
		const span = document.createElement('span');
		span.className = 'icon-button__label';
		this.#el.appendChild(span);
		return span;
	}

	#setLabelAttributes(el, attrs) {
		for (const [key, attrName] of Object.entries(ARIA_ATTRS)) {
			const value = attrs[key];
			if (value != null && value !== false) {
				el.setAttribute(attrName, value);
			} else {
				el.removeAttribute(attrName);
			}
		}
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

	// Optional cleanup; minimise memory leaks
	destroy() {
		this.#el.replaceWith();
		this.#icon = null;
	}

	getCurrentButtonAttrs() {
		return this.#opts.toggled
			? { ...this.#buttonAttrs, ...this.#buttonToggledAttrs }
			: { ...this.#buttonAttrs };
	}

	getCurrentIconAttrs() {
		return this.#opts.toggled
			? { ...this.#iconAttrs, ...this.#iconToggledAttrs }
			: { ...this.#iconAttrs };
	}

	/**
	 *
	 * @param {boolean} on
	 */
	isToggled() {
		return !!this.#opts.toggled;
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

	// New Render()

	async render() {
		const isToggled = !!this.#opts.toggled;

		const iconName =
			isToggled && this.#opts.toggledIcon
				? this.#opts.toggledIcon
				: this.#opts.icon;

		const currentButtonAttrs = this.getCurrentButtonAttrs();
		const currentIconAttrs = this.getCurrentIconAttrs();

		// Button attributes

		this.#el.className = this.#classList();
		this.#el.disabled = !!this.#opts.disabled;
		this.#el.setAttribute('aria-pressed', String(isToggled));

		// Set label and ARIA attributes
		this.#setLabelAttributes(this.#el, currentButtonAttrs);

		// Update label node text
		if (this.#labelNode) {
			this.#labelNode.textContent = currentButtonAttrs.label || '';
		}

		// Icon rendering
		if (!this.#icon || this.#icon.entry.name !== iconName) {
			this.#icon = this.#registry.getIcon(iconName, currentIconAttrs);
			this.#icon.render(this.#iconHost);
		} else {
			this.#icon.update(currentIconAttrs);
		}

		// Set icon ARIA label attributes
		if (this.#icon.node) {
			this.#setLabelAttributes(this.#icon.node, currentIconAttrs);
		}
	}

	setAriaLabel(text, isToggled) {
		if (isToggled) {
			this.#buttonToggledAttrs.ariaLabel = text;
		} else {
			this.#buttonAttrs.ariaLabel = text;
		}

		void this.render();
	}

	setDisabled(icon, toggledIcon = this.#opts.toggledIcon) {
		this.#opts.icon = icon;
		this.#opts.toggledIcon = toggledIcon;
		// Force fresh instance
		this.#icon = null;
		void this.render();
	}

	setIconAttrs(next, isToggled = false) {
		if (isToggled) {
			this.#iconToggledAttrs = { ...this.#iconToggledAttrs, ...next };
		} else {
			this.#iconAttrs = { ...this.#iconAttrs, ...next };
		}
		void this.render();
	}

	setLabel(text, isToggled = false) {
		if (isToggled) {
			this.#buttonToggledAttrs.label = text;
		} else {
			this.#buttonAttrs.label = text;
		}
		if (!this.#labelNode) {
			this.#labelNode = this.#createLabelNode();
		}
		this.#labelNode.textContent = text;
		void this.render();
	}

	setToggled(on) {
		this.toggled = !!on;
		this.#opts.toggled = !!on;
		void this.render();
	}

	/** @returns {HTMLButtonElement} */
	get el() {
		return this.#el;
	}

	get routeKey() {
		return this.#routeKey;
	}
}
