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
		icon: 'cart-regular',
		toggledIcon: 'cart-solid',
		isNavLink,
		routeKey: isNavLink ? routeKey : '',
		variant: variant ?? 'solid',
		disabled: false,
		buttonAttrs: {
			ariaLabel: 'Shopping list',
			title: isNavLink ? 'View Shopping list' : 'Add to shopping list',
			tabIndex: 0
		},
		buttonToggledAttrs: {
			ariaLabel: 'Shopping list (selected)',
			title: isNavLink
				? 'Shopping list (selected)'
				: 'Remove from shopping list',
			tabIndex: 0
		},
		iconAttrs: {
			ariaHidden: true, // Decorative SVG
			focusable: false
		},
		iconToggledAttrs: {
			ariaHidden: true,
			focusable: false
		}
	};
	return cart;
}
export { buildCartOptions };
