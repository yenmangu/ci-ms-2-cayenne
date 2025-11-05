/**
 * Possible future refactors:
 * HTMLImageElement classList modifier methods - avoid repetition
 * 'ok' checker method
 */

/**
 * @typedef {import('../types/imageTypes.js').ImageModel} ImageModel
 */

// Ensure placeholder url resolves relative to the module
const DEFAULT_IMAGE_PLACEHOLDER = new URL(
	'../../assets/images/placeholders/meal-placeholder.png',
	import.meta.url
).toString();

import { preloadImage } from './imagePreloader.js';

export function normaliseSpoonacularUrl(url) {
	if (!url) return url;
	const constructedUrl = new URL(url, location.href);

	const hasExtension = /\.(jpeg|jpg|png|webp)$/i.test(constructedUrl.pathname);
	const hasSizeSuffix = /-\d+x\d+$/.test(constructedUrl.pathname);

	if (!hasExtension && hasSizeSuffix) {
		return url + '.jpg';
	}
	return url;
}

/**
 *
 * @param {ImageModel} model
 * @returns {ImageModel}
 */
function addPlaceholder(model) {
	if (!model.placeholder || model.placeholder === undefined) {
		return { placeholder: DEFAULT_IMAGE_PLACEHOLDER, ...model };
	}
	return model;
}

/**
 *
 * @param {HTMLElement} wrapperEl
 * @param {ImageModel} model
 * @param {'recipe'|'card'} [type='recipe']
 */
export function mountImage(wrapperEl, model, type = 'recipe') {
	model = addPlaceholder(model);
	const img = document.createElement('img');
	img.className =
		type === 'recipe' ? 'img-fluid recipe-img rounded' : 'card-img-top';
	img.loading = type === 'card' ? 'lazy' : 'eager';
	img.decoding = 'async';
	img.alt = model.alt || '';
	img.src = model.placeholder;
	img.fetchPriority = type === 'recipe' ? 'high' : 'auto';
	wrapperEl.replaceChildren(img);

	// Generate unique token on each new image load;
	// store on the image dataset
	let tokenCounter = 0;

	/**
	 * Attempt a preload and guard against race conditions
	 * @param {HTMLImageElement} img
	 * @param {ImageModel} model
	 */
	const apply = async (img, model) => {
		if (model.alt != null) img.alt = model.alt;

		// CSS hook
		img.classList.add('is-loading');

		const target = normaliseSpoonacularUrl(model.src);
		const myToken = String(++tokenCounter);
		img.dataset.token = myToken;

		const timeout = model.timeoutMs ?? 7000;
		const { ok } = await preloadImage(target, timeout);

		// Bail if a newer load started whilst waiting
		if (img.dataset.token !== myToken) {
			img.classList.remove('is-loading');
			return;
		}

		if (ok) {
			img.src = target;
			img.classList.remove('img-fallback');
		} else {
			img.classList.add('img-fallback');
		}
		img.classList.remove('is-loading');
	};

	const onError = () => {
		img.classList.add('img-fallback');
		img.src = model.placeholder;
	};
	img.addEventListener('error', onError);

	// First load
	// - but dont await the response, just kick off the async
	void apply(img, model);

	return {
		destroy() {
			img.removeEventListener('error', onError);
		},
		/**
		 *
		 * @param {ImageModel} nextModel
		 */
		update(nextModel) {
			// If src changes, show placeholder whilst loading new image
			const curr = normaliseSpoonacularUrl(model.src);
			const next = normaliseSpoonacularUrl(nextModel.src);

			if (nextModel.alt != null) img.alt = nextModel.alt;

			if (curr !== next) {
				if (nextModel.placeholder && img.src !== nextModel.placeholder) {
					img.src = nextModel.placeholder;
				}
				model = nextModel;
				// Dont await response
				void apply(img, model);
			} else {
				// Same src: allow placeholder/alt adjustments without reload

				if (nextModel.placeholder && img.src === model.placeholder) {
					img.src = nextModel.placeholder;
				}
				model = nextModel;
			}
		}
	};
}
