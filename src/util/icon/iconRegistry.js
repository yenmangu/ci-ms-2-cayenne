/**
 * NOTES ABOUT THIS
 *
 * I agree this is overkill for such a project, but I like to learn and building it
 * is the only way to learn.
 *
 * References/resources/further reading:
 *
 * https://developer.mozilla.org/en-US/docs/Web/SVG
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use
 * https://stackoverflow.com/questions/70202971/load-external-svg-icons-into-vanilla-javascript-code/70205031#70205031
 * https://css-tricks.com/svg-symbol-good-choice-icons/
 * https://css-tricks.com/svg-sprites-use-better-icon-fonts/
 *
 */

/**
 * @typedef {object} IconEntry
 * @property {string} name
 * @property {SVGElement} template
 */

/**
 * @typedef {object} IconAttributes
 * @property {string|number} [width]
 * @property {string|number} [height]
 * @property {string} [stroke]
 * @property {string|number} [strokeWidth]
 * @property {string} [fill]
 * @property {string} [vectorEffect]
 */

/**
 * @typedef {Record<string, IconEntry>} IconRecord
 */

import { Icon } from './icon-component/icon.controller.js';

export class IconRegistry {
	/**
	 * @param {string} baseDir e.g. '/assets/icons'
	 */
	constructor(baseDir) {
		/** @type {string} */
		this.baseDir = baseDir.replace(/\/+$/, '');
		this.iconSet = new Set();

		/**
		 * @type {IconRecord}
		 */
		this.icons = {};
	}

	/** @type {Map<string, IconEntry>} */
	#icons = new Map();
	has(name) {
		return this.#icons.has(name);
	}

	/**
	 * Register an icon from the raw svgText
	 *
	 * @param {string} name
	 * @param {string} svgText
	 */
	registerRaw(name, svgText) {
		if (this.#icons.has(name)) return;

		const template = this.#parseAndNormalise(svgText);
		this.#icons.set(name, { name, template });
	}

	getIcon(name, attrs = {}) {
		const entry = this.#icons.get(name);
		if (!entry) throw new Error(`Icon "${name}" not registered`);
		return new Icon(entry, attrs);
	}

	/**
	 *
	 * @param {string} svgText
	 * @returns {SVGElement}
	 */
	#parseAndNormalise(svgText) {
		const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
		const svg = doc.documentElement;

		if (!svg || svg.tagName.toLowerCase() !== 'svg') {
			throw new Error('Invalid SVG: root <svg> not found');
		}

		if (!(svg instanceof SVGElement)) {
			throw new Error('Not instance of SVGElement');
		}

		this.#sanitizeSvg(svg);

		// Ensure viewBox exists (scalable). If absent, derive from width/height
		if (!svg.getAttribute('viewBox')) {
			const w = parseFloat(svg.getAttribute('width') || '24') || 24;
			const h = parseFloat(svg.getAttribute('height') || '24') || 24;
			svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
		}

		// Font-like sizing by default
		svg.setAttribute('width', '1em');
		svg.setAttribute('height', '1em');

		if (!svg.hasAttribute('vector-effect')) {
			svg.setAttribute('vector-effect', 'non-scaling-stroke');
		}

		return /** @type {SVGElement} */ (svg);
	}

	/**
	 *
	 * @param {SVGElement} svg
	 * @param {boolean} strict
	 */
	#sanitizeSvg(svg, strict = true) {
		svg.querySelectorAll('script, foreignObject').forEach(n => n.remove());

		svg.querySelectorAll('*').forEach(n => {
			for (const attribute of n.getAttributeNames()) {
				if (attribute.startsWith('on')) n.removeAttribute(attribute);
				if (strict && (attribute === 'href' || attribute === 'xlink:href')) {
					const val = n.getAttribute(attribute) || '';
					if (/^\s*javascript:|^\s*data:/i.test(val))
						n.removeAttribute(attribute);
				}
				if (strict && /url\(/i.test(n.getAttribute(attribute) || '')) {
					if (attribute === 'style') n.removeAttribute('style');
				}
			}
		});
		return svg;
	}

	test() {}
}
