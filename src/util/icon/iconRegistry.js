/**
 * NOTES ABOUT THIS
 *
 * I agree this is overkill for such a project, but I like to learn and building it
 * is the only way to learn.
 *
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
 * XSS prevention:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
 * https://portswigger.net/web-security/cross-site-scripting
 * https://www.cloudflare.com/en-gb/cloudforce-one/research/svgs-the-hackers-canvas/
 *
 *
 */

/**
 * @typedef {import('../../types/iconTypes.js').IconEntry} IconEntry
 * @typedef {import('../../types/iconTypes.js').IconRecord} IconRecord
 */

/**
 * @typedef {object} IconAttributes
 * @property {string|number} [width]
 * @property {string|number} [height]
 * @property {string} [stroke]
 * @property {string|number} [strokeWidth]
 * @property {string} [fill]
 * @property {string} [vectorEffect]
 * @property {string} [role] - usually 'img'
 * @property {string} [ariaLabel] - accessible name
 * @property {boolean} [ariaHidden] - mark decorative
 * @property {string} [labelledBy] - idref to <title> or external label
 * @property {string} [describedBy] - idref to <desc> or external hint
 * @property {string} [title] - creates/updates <title>
 * @property {string} [toggledTitle]
 * @property {string} [desc] - creates/updates <desc>
 * @property {number} [tabIndex] - focus management (defaults: no tab stop)
 * @property {string} [class]
 * @property {string[]} [classList]
 * @property {string} [style]
 * @property {Record<string, string|number>} [styleObj]
 */

import { Icon } from './icon-component/icon.controller.js';

export class IconRegistry {
	/**
	 * @param {string} baseDir e.g. '/assets/icons'
	 */
	constructor(baseDir) {
		/** @type {string} */
		this.baseDir = baseDir.replace(/\/+$/, '');
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

	/**
	 * Fetch and register `baseDir/<name>.svg`
	 * Optimised - if already cached, returns
	 *
	 * @param {string} name
	 * @param {{sanitise?: boolean}} [options]
	 */
	async register(name, options = {}) {
		if (this.#icons.has(name)) return;

		const url = `${this.baseDir}/${encodeURIComponent(name)}.svg`;
		console.log('URL FROM ICON REG: ', url);

		const res = await fetch(url, { cache: 'force-cache' });
		if (!res.ok) {
			throw new Error(`IconRegistry: failed to fetch ${url} (${res.status})`);
		}

		const svgText = await res.text();
		const template = this.#parseAndNormalise(svgText, options.sanitise ?? true);
		this.#icons.set(name, { name, template });
	}

	/**
	 *
	 * @param {string} name
	 * @param {{sanitise?: boolean}} options
	 * @returns
	 */
	async ensure(name, options = {}) {
		if (this.#icons.has(name)) return;
		await this.register(name, options);
	}

	/**
	 *
	 * @param {string[]} names
	 * @param {{sanitise?: boolean}} [options]
	 */
	async preload(names, options = {}) {
		await Promise.all(
			names.map(n =>
				this.ensure(n, options).catch(err => {
					console.warn(`Iconregistry failed to preload "${n}": `, err);
				})
			)
		);
	}

	getIcon(name, attrs = {}) {
		const entry = this.#icons.get(name);
		if (!entry) throw new Error(`Icon "${name}" not registered`);
		return new Icon(entry, attrs);
	}

	#buildUrl(name) {
		const base = this.baseDir.endsWith('/') ? this.baseDir : this.baseDir + '/';
		return new URL(`${name}.svg`, base).toString();
	}

	/**
	 *
	 * @param {string} svgText
	 * @param {boolean} sanitise
	 * @returns {SVGElement}
	 */
	#parseAndNormalise(svgText, sanitise = true) {
		const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
		const svg = doc.documentElement;

		if (!svg || svg.tagName.toLowerCase() !== 'svg') {
			throw new Error('Invalid SVG: root <svg> not found');
		}

		if (!(svg instanceof SVGElement)) {
			throw new Error('Not instance of SVGElement');
		}

		if (sanitise) {
			this.#sanitizeSvg(svg);
		}

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
