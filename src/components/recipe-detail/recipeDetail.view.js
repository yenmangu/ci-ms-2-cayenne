/**
 * @typedef {import("../../types/recipeTypes.js").RecipeFull} Recipe
 * @typedef {import("../../types/recipeTypes.js").RecipeSummary} Summary
 * @typedef {import("../../types/recipeTypes.js").ExtendedIngredient} Ingredient
 */

/**
 *
 * @param {Ingredient} item
 * @param {'metric' | 'us' } [system='metric']
 * @param {'unitShort' | 'unitLong' } [unitType='unitShort']
 */
function ingredientMiniCard(item, system = 'metric', unitType = 'unitShort') {
	const { measures } = item;
	const measure = measures && measures[system] ? measures[system] : null;
	const measureAmount = measure ? measure.amount : item.amount ?? '';
	const measureUnit = measure ? measure[unitType] : item.unit ?? '';

	const imgHtml = item.image
		? `<img class="ingredient-image rounded me-2" width="32" height="32" src="https://spoonacular.com/cdn/ingredients_100x100/${item.image}" alt="${item.name}" />`
		: '';

	return `
		<div class="ingredient-mini-card d-flex align-items-center mb-2 p-1 border rounded shadow-sm">
      ${imgHtml}
      <div>
        <span class="fw-bold">${item.nameClean || item.name}</span>
        <span class="text-muted small ms-2">${measureAmount} ${measureUnit}</span>
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
	console.log('Recipe passed to view: ', recipe);
	const { system = 'metric', unitType = 'unitShort' } = opts || {};

	const {
		title,
		image,
		servings,
		readyInMinutes,
		cuisines,
		dairyFree,
		diets,
		instructions,
		extendedIngredients,
		summary,
		analyzedInstructions
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
		// TODO: Add async methods for retrieving additional details
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

	// const summaryBlock = Array.isArray(summary) ? summary : summary.split('.');
	// for (let el of summaryBlock) {
	// 	const summaryInsert = `<p>${el}</p>`;
	// 	summaryInsertsArray.push(summaryInsert);
	// }

	const recipeTemplate = `<main class="recipe-detail container my-2">
  <header class="mb-4 text-center">
    <h2 class="recipe-title">${title}</h2>
    <img class="img-fluid recipe-image rounded" src="${image}" />
  </header>

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
        <div class="accordion-body recipe-ingredients">
          <!-- ingredients list goes here -->
					${ingredientsHtml}
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
					${instructionsInsertsArray}
        </div>
      </div>
    </div>
  </div>
</main>
`;

	return recipeTemplate;
}
