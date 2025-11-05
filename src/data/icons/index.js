/**
 * @typedef {import("../../types/iconTypes.js").IconButtonOptions} IconButtonOptions
 * @typedef {import("../../types/iconTypes.js").IconEntry} IconEntry
 */

import { buildHomeOptions } from './home.js';
import { buildSavedRecipesOptions } from './savedRecipes.js';
import { buildCartOptions } from './shoppingList.js';

export const iconButtonConfigs = {
	cart: buildCartOptions,
	home: buildHomeOptions,
	savedRecipes: buildSavedRecipesOptions
};

// example: const cartNav = iconButtonConfigs.cart(true)
