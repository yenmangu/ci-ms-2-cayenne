/**
 * @typedef {import("../../types/iconTypes.js").IconButtonOptions} IconButtonOptions
 * @typedef {import("../../types/iconTypes.js").IconEntry} IconEntry
 * @typedef {import("../../types/iconTypes.js").IconRecord} IconRecord
 * @typedef {import("../../types/iconTypes.js").ButtonVariant} Variant
 */

/**
 * @param {boolean} [isNavLink=false]
 * @param {string} [routeKey='']
 * @param {Variant} [variant=undefined]
 */
function buildCartOptions(
	isNavLink = false,
	routeKey = '',
	variant = undefined
) {
	// Not including toggled, onClick (those will be added later)
	/** @type {IconButtonOptions} */
	const cart = {
		buttonAttrs: {
			ariaLabel: 'Shopping list',
			tabIndex: 0,
			title: isNavLink ? 'View Shopping list' : 'Add to shopping list'
		},
		buttonToggledAttrs: {
			ariaLabel: 'Shopping list (selected)',
			tabIndex: 0,
			title: isNavLink
				? 'Shopping list (selected)'
				: 'Remove from shopping list'
		},
		disabled: false,
		icon: 'cart-regular',
		iconAttrs: {
			ariaHidden: true, // Decorative SVG
			focusable: false
		},
		iconToggledAttrs: {
			ariaHidden: true,
			focusable: false
		},
		isNavLink,
		routeKey: isNavLink ? routeKey : '',
		toggledIcon: 'cart-solid',
		variant: variant ?? 'solid'
	};
	return cart;
}
export { buildCartOptions };
