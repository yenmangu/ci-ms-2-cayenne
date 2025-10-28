/**
 * @typedef {import("../../types/ingredientTypes.js").IngredientResultCard} ingredientResultCard
 * @typedef {import("../../types/ingredientTypes.js").IngredientInformation} Ingredient
 */

import { escapeHtml } from '../../util/escapeHtml.js';

export function renderShoppingList() {
	return `<section class="shopping-list__section py-5 text-center">
	<h1 class="shopping-list__title mb-4">Shopping List</h1>
	<div id="shopping-list-container"></div>
	</section>`;
}

/**
 *
 * @returns {string}
 */
export function renderInput() {
	return `<form id="addItemForm"
			class="shopping-list__add0form mb-3"
			autocomplete="off">
			<h3>Shopping List</h3>
	<div class="shopping-list__input-group input-group">
		<input type="text"
					 class="shopping-list__input form-control"
					 id="ingredientInput"
					 placeholder="Add ingredient..."
					 aria-label="Add ingredient"
					 autocomplete="off">
		<button class="shopping-list__search-btn btn btn-primary"
						type="submit"
						id="shoppingListSubmit"> Search </button>
	</div>
	<!-- Dropdown menu injected here after search -->
	<div id="shoppingListDropdown"
			 class="shopping-list__ingredient-dropdown dropdown-menu w-100"></div>
</form>
`;
}

/**
 *
 * @param {Ingredient} item
 * @param {object} [opts={}]
 * @param {number} [opts.imageWidth=25]
 */
export function renderDropdownItem(item, opts = {}) {
	const { image, original, id } = item;
	const imageWidth = opts.imageWidth ?? 25;
	const label = escapeHtml(original || 'Unknown Ingredient');
	return `<button type="button"
				data-ingredient-id="${id}"
				class="shopping-list__dropdown-item dropdown-item">
	<img src="${image ?? './assets/images/placeholders.ingredient-plaeholder.png'}"
			 alt="${label}"
			 class="shopping-list__dropdown-img"
			 width="${imageWidth}"
			 height="${imageWidth}">
	<span class="shopping-list__dropdown-label">${label}</span>
</button>
`;
}

/**
 * Renders the shoppingList component to the DOM
 *
 * @param {ingredientResultCard} item
 * @returns
 */
export function renderShoppingListItem(item) {
	const { name, id } = item;

	return `<li class="shopping-list__item d-flex align-items-center justify-content-between py-2 px-3 border-bottom"
		data-shopping-item-id="${id}">
  <div class="shopping-list__info d-flex flex-column flex-grow-1">
    <span class="shopping-list__name fw-semibold">${name}</span>
    <span class="shopping-list__meta text-muted small">

    </span>
  </div>
  <button
    class="btn btn--shopping-list-remove btn-sm ms-2"
    data-remove-item-btn
		data-ingredient-id="${id}"
    aria-label="Remove ${name} from shopping list"
    title="Remove from shopping list"
    type="button"
  >
    <i class="fa fa-trash"></i>
  </button>
</li>`;
}
