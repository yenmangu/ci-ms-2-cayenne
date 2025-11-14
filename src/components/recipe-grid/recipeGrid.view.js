/**
 * Returns the recipe grid container HTML string.
 *
 * @param {string} [title='']
 * @param {string[]} [search=[]]
 * @returns {string}
 */
export function renderGridContainer(title = '', search = []) {
	const displayTitle =
		Array.isArray(search) && search.length
			? `Searching for ingredients: ${search.join(', ')}`
			: title || 'Cayenne Recipes';

	return `
		<section class="container py-4">
			<h1 class="text-center mb-4">${displayTitle}</h1>
			<div id="recipeGrid" class="row g-3"></div>
		</section>
	`;
}

/**
 * Returns a skeleton recipe card HTML string.
 * Uses Bootstrap placeholders
 *
 * @returns {string}
 */
export function renderSkeletonCard() {
	return `
	<a class="card h-100 text-decoration-none shadow-sm placeholder-glow placeholder-shimmer">
			<div class="card-img-top bg-secondary bg-opacity-25 rounded placeholder" style="height: 200px;"></div>
			<div class="card-body">
				<h5 class="card-title mb-3">
					<span class="placeholder col-7"></span>
				</h5>
				<p class="card-text">
					<span class="placeholder col-6 mb-2"></span>
					<span class="placeholder col-8 mb-2"></span>
					<span class="placeholder col-4"></span>
				</p>
			</div>
		</a>
	`;
}

export function getCardWrapperClass() {
	return 'col-12 col-md-6 col-lg-4';
}

/**
 *
 * @param {string[]|string} searchQ
 */
export function renderNotFound(searchQ) {
	let htmlStringArr = [];

	// Console group left commented intentionally

	// console.groupCollapsed('recipe grid view');
	if (Array.isArray(searchQ)) {
		for (const s of searchQ) {
			// console.trace(s);
			// console.count(`el in query: ${s}`);

			htmlStringArr.push(`<span class="cayenne-green--dark">${s}</span>`);
		}
		// console.groupEnd();
	} else {
		htmlStringArr.push(searchQ);
	}

	const results = Array.isArray(searchQ) ? searchQ.join(' or ') : searchQ;

	return `<div data-not-found class="container py-4 text-center not-found">
		<h3>Could not find any results for:
			${htmlStringArr.join(' or ')}
		</h3>
	</div`;
}
