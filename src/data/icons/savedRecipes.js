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
		icon: 'bookmark-regular',
		toggledIcon: 'bookmark-solid',
		isNavLink,
		routeKey: isNavLink ? routeKey : '',
		variant: variant ?? 'solid',
		disabled: false,
		buttonAttrs: {
			ariaLabel: 'Saved recipes',
			title: 'View saved recipes',
			tabIndex: 0
		},
		buttonToggledAttrs: {
			ariaLabel: 'Saved recipes (selected)',
			title: 'Saved recipes (selected)',
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
	return savedRecipes;
}
