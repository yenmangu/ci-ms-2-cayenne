/**
 * @typedef {import("../../types/iconTypes.js").IconButtonOptions} IconButtonOptions
 * @typedef {import("../../types/iconTypes.js").ButtonVariant} Variant
 */

/**
 * @param {boolean} [isNavLink=false]
 * @param {string} [routeKey='']
 * @param {Variant} [variant='']
 */
export function buildSavedRecipesOptions(
	isNavLink = false,
	routeKey = '',
	variant = undefined
) {
	// Not including toggled, onClick (those will be added later)
	/** @type {IconButtonOptions} */
	const savedRecipes = {
		buttonAttrs: {
			ariaLabel: 'Saved recipes',
			tabIndex: 0,
			title: 'View saved recipes'
		},
		buttonToggledAttrs: {
			ariaLabel: 'Saved recipes (selected)',
			tabIndex: 0,
			title: 'Saved recipes (selected)'
		},
		disabled: false,
		icon: 'bookmark-regular',
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
		toggledIcon: 'bookmark-solid',
		variant: variant ?? 'solid'
	};
	return savedRecipes;
}
