/**
 * @typedef {import("../../types/recipeTypes.js").RecipeFull} Recipe
 * @typedef {import("../../types/recipeTypes.js").RecipeSummary} Summary
 * @typedef {import("../../types/recipeTypes.js").ExtendedIngredient} Ingredient
 */

/**
 * @typedef {object} ImageModel
 * @property {string} imageUrl
 * @property {string} title
 *
 */

const PLACEHOLDER_URL =
	'../../../assets/images/placeholders/meal-placeholder.png';

/**
 *
 * @param {ImageModel} model
 * @returns {string}
 */
export function renderImage(model) {
	return `
    <img class="img-fluid recipe-image rounded""
         src="${PLACEHOLDER_URL}"
         alt="${model.title}"
         loading="lazy"
         decoding="async"
         data-target-src="${model.imageUrl}">
    <div class="card-body"><h3 class="card-title">${model.title}</h3></div>
  `;
}

/**
 *
 * @param {Ingredient} item
 * @param {'metric' | 'us' } [system='metric']
 * @param {'unitShort' | 'unitLong' } [unitLength='unitShort']
 */
function ingredientMiniCard(item, system = 'metric', unitLength = 'unitShort') {
	const { measures } = item;
	const measure = measures && measures[system] ? measures[system] : null;
	const measureAmount = measure ? measure.amount : item.amount ?? '';
	const measureUnit = measure ? measure[unitLength] : item.unit ?? '';

	const imgHtml = item.image
		? `<img class="ingredient-image rounded me-2" width="32" height="32"
				src="https://spoonacular.com/cdn/ingredients_100x100/${item.image}"
				alt="${item.name}" />`
		: '';

	return `
		<div
			class="ingredient-mini-card d-flex align-items-center mb-2 p-1 border rounded shadow-sm"
			data-ingredient-id="${item.id}"
			data-card-type="ingredientCard"
		>
      ${imgHtml}
      <div>
        <span class="fw-bold">${item.nameClean || item.name}</span>
				<div class="ingredient-units-amounts">
					<span class="text-muted small"
						data-label="amounts">${measureAmount}
					</span>
					<span class="text-muted small"
						data-label="units">${measureUnit}
					</span>
				</div>

      </div>
    </div>
	`;
}

/**
 * Renders the recipeDetail component to the DOM
 *
 * @param {Recipe} recipe
 * @param {Summary} summaryObj
 * @param {{
 * 	system: 'metric' | 'us';
 * 	unitType: 'unitShort' | 'unitLong';
 * 	}} [opts]
 */
export function renderRecipeDetail(recipe, summaryObj, opts) {
	const { system = 'metric', unitType = 'unitShort' } = opts || {};
	// Dev logging
	// console.log('Recipe passed to view: ', recipe);
	// console.log('Opts passed to view: ', opts);

	const {
		analyzedInstructions,
		cuisines,
		dairyFree,
		diets,
		extendedIngredients,
		image,
		instructions,
		readyInMinutes,
		servings,
		summary,
		title
	} = recipe;

	/**
	 * Provide user facing feedback if value is not available
	 */
	for (const [key, value] of Object.entries(recipe)) {
		if (
			!value ||
			value === '' ||
			value === undefined ||
			value == null ||
			// Empty array
			(Array.isArray(value) && value.length === 0)
		) {
			recipe[key] = 'Not Available';
		}
	}

	const ingredientsInsertsArray = [];
	const instructionsInsertsArray = [];
	const summaryInsertsArray = [];

	if (Array.isArray(instructions)) {
		for (const step of instructions) {
			const instructionInsert = `<li class="list-group-item">
  ${step.step}
</li>`;
			instructionsInsertsArray.push(instructionInsert);
		}
	}

	if (Array.isArray(extendedIngredients)) {
		for (const item of extendedIngredients) {
			const card = ingredientMiniCard(item, system, unitType);
			ingredientsInsertsArray.push(card);
		}
	}

	const ingredientsHtml = ingredientsInsertsArray.join('');

	const recipeTemplate = `<div class="recipe-detail container my-2" id="recipeDetail">

  <section class="mb-4 text-center">
    <h2 class="recipe-title">${title}</h2>
    <div data-label-image-wrapper></div>
		<div class="toggle-container" id="toggleContainer"></div>
  </section>

  <section class="recipe-summary mb-4">
    <!-- summary HTML will be injected here -->
		${summary}
  </section>

  <div class="accordion" id="recipeAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingIngredients">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIngredients" aria-expanded="true" aria-controls="collapseIngredients">
          Ingredients
        </button>
      </h2>
      <div id="collapseIngredients" class="accordion-collapse collapse show" data-bs-parent="#recipeAccordion">
        <div id="recipe-ingredients" class="accordion-body recipe-ingredients">
          <!-- ingredients list goes here -->
        </div>
      </div>
    </div>

    <div class="accordion-item">
      <h2 class="accordion-header" id="headingInstructions">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseInstructions" aria-expanded="false" aria-controls="collapseInstructions">
          Instructions
        </button>
      </h2>
      <div id="collapseInstructions" class="accordion-collapse collapse" data-bs-parent="#recipeAccordion">
        <div class="accordion-body recipe-instructions">
          <!-- instructions list goes here -->
					${
						instructionsInsertsArray.length
							? instructionsInsertsArray
							: instructions ?? 'Instructions not available'
					}
        </div>
      </div>
    </div>
  </div>
</div>
`;

	return recipeTemplate;
}
