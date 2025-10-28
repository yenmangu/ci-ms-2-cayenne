/**
 * @typedef {import("../../types/iconTypes.js").IconButtonOptions} IconButtonOptions
 * @typedef {import("../../types/iconTypes.js").IconEntry} IconEntry
 */

import { buildHomeOptions } from './home.js';
import { buildSavedRecipesOptions } from './savedRecipes.js';
import { buildCartOptions } from './shoppingList.js';

export const iconButtonConfigs = {
	cart: buildCartOptions,
	savedRecipes: buildSavedRecipesOptions,
	home: buildHomeOptions

	// More to be added
};

// example: const cartNav = iconButtonConfigs.cart(true)
