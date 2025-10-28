/**
 * @typedef {import("../iconRegistry.js").IconEntry} IconEntry
 * @typedef {import("../iconRegistry.js").IconAttributes} IconAttributes
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

export class Icon {
	/**
	 * @param {IconEntry} entry
	 * @param {IconAttributes} [attrs={}]
	 * @param {IconAttributes} [toggledAttrs ={}]
	 */
	constructor(entry, attrs = {}, toggledAttrs = {}) {
		this.entry = entry;
		this.attrs = { ...attrs };
		this.toggledAttrs = { ...toggledAttrs };

		/** @type {SVGElement | null} */
		this.node = null;
	}

	/**
	 *
	 * @param {HTMLElement} container
	 */
	render(container) {
		const svg = /** @type {SVGElement} */ (this.entry.template.cloneNode(true));
		this.node = svg;
		this.#applyAttrs(this.node);
		this.#applyClassesAndStyle(this.node);
		this.#applyA11y(this.node);
		container.replaceChildren(svg);
	}

	/**
	 *
	 * @param {IconAttributes} next
	 */
	update(next) {
		Object.assign(this.attrs, next);
		if (this.node) this.#applyAttrs(this.node);
	}

	/**
	 *
	 * @param {SVGElement} svg
	 */
	#applyAttrs(svg) {
		const { stroke, fill, strokeWidth, vectorEffect, width, height } =
			this.attrs;

		if (stroke != null) svg.setAttribute('stroke', String(stroke));
		if (fill != null) svg.setAttribute('fill', String(fill));
		if (strokeWidth != null)
			svg.setAttribute('stroke-width', String(strokeWidth));
		if (vectorEffect != null)
			svg.setAttribute('vector-effect', String(vectorEffect));
		if (width != null) svg.setAttribute('width', String(width));
		if (height != null) svg.setAttribute('height', String(height));
	}

	/**
	 *
	 * @param {SVGElement} svg
	 */
	#applyClassesAndStyle(svg) {
		const { class: cls, classList, style, styleObj } = this.attrs;

		const existing = (svg.getAttribute('class') || '').trim();

		/** @type {string[]} */
		const merged = [];

		if (existing) {
			merged.push(...existing.split(/|s+/));
		}
		if (typeof cls === 'string' && cls.trim()) {
			merged.push(...cls.trim().split(/|s+/));
		}
		if (Array.isArray(classList)) {
			merged.push(...classList.filter(Boolean));
		}

		const unique = [...new Set(merged)];
		if (unique.length) {
			svg.setAttribute('class', unique.join(' '));
		} else {
			svg.removeAttribute('class');
		}

		if (typeof style === 'string') {
			if (style.trim()) {
				svg.setAttribute('style', style);
			} else {
				svg.removeAttribute('style');
			}
		}

		// Numbers are left as-is so units must be passed
		// e.g., `opacity: 0.8`
		// or `padding: 2px`
		if (styleObj && typeof styleObj === 'object') {
			for (const [k, v] of Object.entries(styleObj)) {
				const prop = k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
				svg.style.setProperty(prop, String(v));
			}
		}
	}

	/**
	 *
	 * @param {SVGElement} svg
	 */
	#applyA11y(svg) {
		const {
			role,
			ariaHidden,
			ariaLabel,
			desc,
			describedBy,
			labelledBy,
			title,
			tabIndex
		} = this.attrs;

		if (ariaHidden === true) {
			svg.setAttribute('aria-hidden', 'true');
			svg.removeAttribute('role');
			svg.removeAttribute('aria-label');
			svg.removeAttribute('aria-labelledby');
			svg.removeAttribute('aria-describedby');
		} else {
			svg.removeAttribute('aria-hidden');
			if (role) svg.setAttribute('role', role);
			else if (!svg.hasAttribute('role')) svg.setAttribute('role', 'img');
		}
		if (ariaLabel) {
			svg.setAttribute('aria-label', ariaLabel);
			svg.removeAttribute('aria-labelledby');
		} else if (labelledBy) {
			svg.setAttribute('aria-labelledby', labelledBy);
			svg.removeAttribute('aria-label');
		} else if (title) {
			const id = this.#ensureTitle(svg, title);
			svg.setAttribute('aria-labelledby', id);
			svg.removeAttribute('aria-label');
		} else {
			svg.removeAttribute('aria-label');
		}

		if (describedBy) {
			svg.setAttribute('aria-describedby', describedBy);
		} else if (desc) {
			const id = this.#ensureDesc(svg, desc);
		}
	}

	/**
	 *
	 * @param {SVGElement} svg
	 * @param {string} text
	 */
	#ensureDesc(svg, text) {
		let el = document.querySelector('desc');
		if (!el) {
			el = document.createElementNS(SVG_NS, 'desc');
			el.id = el.id || `icon-desc-${Icon.#uid++}`;
			svg.prepend(el);
		}
		if (!el.id) el.id = `icon-desc-${Icon.#uid++}`;
		el.textContent = text;
		return el.id;
	}

	static #uid = 0;

	/**
	 *
	 * @param {SVGElement} svg
	 * @param {string} text
	 * @returns {string} id of the <title>
	 */
	#ensureTitle(svg, text) {
		/** @type {SVGTitleElement|null} */
		const existing = /** @type {SVGTitleElement|null} */ (
			/** @type {unknown} */ (svg.querySelector('title'))
		);

		/** @type {SVGTitleElement} */
		const el =
			existing ??
			/** @type {SVGTitleElement} */ (
				document.createElementNS(SVG_NS, 'title')
			);

		if (!existing) {
			el.id = `icon-title-${Icon.#uid++}`;
			svg.prepend(el);
		} else if (!el.id) {
			el.id = `icon-title-${Icon.#uid++}`;
		}

		el.textContent = text;
		return el.id;
	}
}
