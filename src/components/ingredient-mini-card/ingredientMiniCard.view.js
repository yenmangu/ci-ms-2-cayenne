/**
 * Renders the ingredientMiniCard component to the DOM
 *
 */

/**
 * @typedef {import("../../types/recipeTypes.js").RecipeFull} Recipe
 * @typedef {import("../../types/recipeTypes.js").RecipeSummary} Summary
 * @typedef {import("../../types/recipeTypes.js").ExtendedIngredient} Ingredient
 * @typedef {import("../../types/stateTypes.js").ShoppingListItem} ShoppingListItem
 */

/**
 *
 * @param {Ingredient} item
 * @param {'metric' | 'us' } [system='metric']
 * @param {'unitShort' | 'unitLong' } [unitLength='unitShort']
 * @param {object} [opts]
 * @param {boolean} [opts.inRecipeDetail=true]
 * @param {number} [opts.linkedRecipeId]
 * @param {string} [opts.linkedRecipe]
 */
export function renderIngredientMiniCard(
	item,
	system = 'metric',
	unitLength = 'unitShort',
	opts = { inRecipeDetail: true }
) {
	let measureAmount = null;
	let measureUnit = '';
	if (opts.inRecipeDetail) {
		const { measures } = item;
		const measure = measures && measures[system] ? measures[system] : null;
		measureAmount = measure ? measure.amount : item.amount ?? '';
		measureUnit = measure ? measure[unitLength] : item.unit ?? '';
	}
	if (measureAmount === null) measureAmount = '';

	const imgHtml = item.image
		? `<img class="ingredient-image rounded me-2" width="32" height="32" src="https://spoonacular.com/cdn/ingredients_100x100/${item.image}" alt="${item.name}" />`
		: '';

	if (opts.inRecipeDetail) {
		return `<div
			class="ingredient-mini-card ingredient-mini-card--in-recipe d-flex align-items-center mb-2 p-1 border rounded shadow-sm"
			data-ingredient-id="${item.id}"
			data-card-type="ingredientCard"
		>
		<div class="ingredient-mini-card__left">
      ${imgHtml}
      <div class="ingredient-mini-card__label-wrapper">
        <span class="ingredient-mini-card__item-label fw-semibold">${
					item.nameClean || item.name
				}</span>
				<div class="ingredient-mini-card__units-amounts ingredient-units-amounts">
					<span class="text-muted small"
						data-label="amounts">${measureAmount !== null ? measureAmount : ''}
					</span>
					<span class="ingredient-mini-card__units text-muted small"
						data-label="units">${measureUnit}
					</span>
				</div>
      </div>
		</div>
		<div class="ingredient-mini-card__right">
			<div class='ingredient-mini-card__icon-insert'></div>
		</div>
	</div>
	`;
	} else {
		return `
		<div
			class="ingredient-mini-card d-flex align-items-center mb-2 border rounded shadow-sm"
			data-ingredient-id="${item.id}"
			data-card-type="ingredientCard"
		>
		<div class="ingredient-mini-card__left">

      ${imgHtml}
      <div class="ingredient-mini-card__label-wrapper">
        <span class="ingredient-mini-card__item-label fw-semibold">${
					item.nameClean || item.name
				}</span>
				<div class="ingredient-units-amounts">
					<span class="text-muted small"
						data-label="amounts">
					</span>
					<span class="text-muted small"
						data-label="units">
					</span>
				</div>
      </div>
			</div>
			<div class="ingredient-mini-card__middle">
			<span class="ingredient-mini-card__linked-recipe">
			Recipe:
			</span>
			${
				opts.linkedRecipe && opts.linkedRecipeId
					? `<a href="#/recipe?id=${opts.linkedRecipeId}"
					class="linked-recipe-label ms-2">
					${opts.linkedRecipe}
					</a>`
					: ''
			}
			</span>
			</div>
			<div class="ingredient-mini-card__right">
			<div class='ingredient-mini-card__icon-insert'></div>
			</div>
    </div>
	`;
	}
}
