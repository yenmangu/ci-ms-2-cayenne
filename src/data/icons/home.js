/**
 * @typedef {import("../../types/iconTypes.js").IconButtonOptions} IconButtonOptions
 * @typedef {import("../../types/iconTypes.js").ButtonVariant} Variant
 */

/**
 * @param {boolean} [isNavLink=false]
 * @param {string} [routeKey='']
 * @param {Variant} [variant='']
 */
export function buildHomeOptions(
	isNavLink = false,
	routeKey = '',
	variant = undefined
) {
	// Not including toggled, onClick (those will be added later)
	/** @type {IconButtonOptions} */
	const home = {
		buttonAttrs: {
			ariaLabel: 'Home',
			tabIndex: 0,
			title: 'Go to Home page'
		},
		buttonToggledAttrs: {
			ariaLabel: 'Home (selected)',
			tabIndex: 0,
			title: 'Home (selected)'
		},
		disabled: false,
		icon: 'house-regular',
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
		toggledIcon: 'house-solid',
		variant: variant ?? 'solid'
	};
	return home;
}
