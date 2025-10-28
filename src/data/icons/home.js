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
		icon: 'house-regular',
		toggledIcon: 'house-solid',
		isNavLink,
		routeKey: isNavLink ? routeKey : '',
		variant: variant ?? 'solid',
		disabled: false,
		buttonAttrs: {
			ariaLabel: 'Home',
			title: 'Go to Home page',
			tabIndex: 0
		},
		buttonToggledAttrs: {
			ariaLabel: 'Home (selected)',
			title: 'Home (selected)',
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
	return home;
}
