/**
 * Renders a Bootstrap-styled error message block
 *
 * @param {Object} options
 * @param {'network'|'not-found'|'generic'} options.type
 * @param {string} options.message
 * @param {boolean} options.includeRetry
 * @param {string} options.retryLabel
 * @param {string} [options.title]
 * @returns {string}
 */
export function renderErrorMessage({
	type,
	message,
	includeRetry = false,
	retryLabel = 'Try Again',
	title
}) {
	// ...

	const titleByType = {
		network: "Kitchen's Closed!",
		'not-found': 'Not Found',
		generic: '“Too many cooks… something went wrong.”'
	};

	const heading = title || titleByType[type] || 'Error';

	const retryButton = includeRetry
		? `<button class="btn btn-outline-danger mt-3" data-error-retry>${retryLabel}`
		: '';

	return `
	<div class="alert alert-danger text-center" role="alert">
			<h4 class="alert-heading">${heading}</h4>
			<p>${message}</p>
			${retryButton}
		</div>
	`;
}
