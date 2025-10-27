/**
 * Returns the recipe grid container HTML string.
 *
 * @returns {string}
 */
export function renderGridContainer(title = '') {
	return `
		<section class="container py-4">
			<h1 class="text-center mb-4">${title ? title : 'Cayenne Recipes'}</h1>
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
