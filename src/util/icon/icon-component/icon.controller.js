/**
 * @typedef {import("../iconRegistry.js").IconEntry} IconEntry
 * @typedef {import("../iconRegistry.js").IconAttributes} IconAttributes
 */

export class Icon {
	/**
	 * @param {IconEntry} entry
	 * @param {IconAttributes} [attrs={}]
	 */
	constructor(entry, attrs = {}) {
		this.entry = entry;
		this.attrs = { ...attrs };

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
}
