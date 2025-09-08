export const SPOONACULAR_ENDPOINTS = {
	// Recipes
	searchRecipes: '/recipes/complexSearch',
	searchRecipesByIngredients: '/recipes/findByIngredients',
	searchRecipesByNutrients: '/recipes/findByNutrients',
	getRecipeInformation: '/recipes/{id}/information',
	getRecipeInformationBulk: '/recipes/informationBulk',
	getSimilarRecipes: '/recipes/{id}/similar',
	getRandomRecipes: '/recipes/random',
	autocompleteRecipeSearch: '/recipes/autocomplete',
	analyzeRecipeSearchQuery: '/recipes/queries/analyze',
	analyzeRecipeInstructions: '/recipes/analyzeInstructions',
	analyzeRecipe: '/recipes/analyze',
	classifyCuisine: '/recipes/cuisine',
	guessNutritionByDishName: '/recipes/guessNutrition',
	summarizeRecipe: '/recipes/{id}/summary',
	convertAmounts: '/recipes/convert',
	quickAnswer: '/recipes/quickAnswer',
	extractRecipeFromWebsite: '/recipes/extract',

	// Recipe widgets & images
	recipeNutritionWidgetJson: '/recipes/{id}/nutritionWidget.json',
	recipeNutritionWidgetHtml: '/recipes/{id}/nutritionWidget',
	recipeNutritionLabelPng: '/recipes/{id}/nutritionLabel.png',
	recipeNutritionLabelHtml: '/recipes/{id}/nutritionLabel',
	recipeIngredientsWidgetJson: '/recipes/{id}/ingredientWidget.json',
	recipeIngredientsWidgetHtml: '/recipes/{id}/ingredientWidget',
	recipeIngredientsImagePng: '/recipes/{id}/ingredientWidget.png',
	recipeEquipmentWidgetJson: '/recipes/{id}/equipmentWidget.json',
	recipeEquipmentWidgetHtml: '/recipes/{id}/equipmentWidget',
	recipeEquipmentImagePng: '/recipes/{id}/equipmentWidget.png',
	recipePriceBreakdownJson: '/recipes/{id}/priceBreakdownWidget.json',
	recipePriceBreakdownHtml: '/recipes/{id}/priceBreakdownWidget',
	recipePriceBreakdownPng: '/recipes/{id}/priceBreakdownWidget.png',
	recipeTasteJson: '/recipes/{id}/tasteWidget.json',
	recipeTasteHtml: '/recipes/{id}/tasteWidget',
	recipeTastePng: '/recipes/{id}/tasteWidget.png',
	createRecipeCard: '/recipes/visualizeRecipe',
	visualizeRecipeNutrition: '/recipes/visualizeNutrition',
	visualizeEquipment: '/recipes/visualizeEquipment',
	visualizePriceBreakdown: '/recipes/visualizePriceEstimator',
	createRecipeCardById: '/recipes/{id}/card',

	// Ingredients
	autocompleteIngredientSearch: '/food/ingredients/autocomplete',
	ingredientSearch: '/food/ingredients/search',
	getIngredientInformation: '/food/ingredients/{id}/information',
	computeIngredientAmount: '/food/ingredients/{id}/amount',
	getIngredientSubstitutes: '/food/ingredients/substitutes',
	getIngredientSubstitutesById: '/food/ingredients/{id}/substitutes',
	mapIngredientsToProducts: '/food/ingredients/map',
	computeGlycemicLoad: '/food/ingredients/glycemicLoad',

	// Products (grocery)
	autocompleteProductSearch: '/food/products/suggest',
	searchGroceryProducts: '/food/products/search',
	searchGroceryProductsByUpc: '/food/products/upc/{upc}',
	getProductInformation: '/food/products/{id}',
	getComparableProductsByUpc: '/food/products/upc/{upc}/comparable',
	productNutritionWidgetHtml: '/food/products/{id}/nutritionWidget',
	productNutritionWidgetPng: '/food/products/{id}/nutritionWidget.png',
	productNutritionLabelPng: '/food/products/{id}/nutritionLabel.png',
	productNutritionLabelHtml: '/food/products/{id}/nutritionLabel',

	// Menu items
	searchMenuItems: '/food/menuItems/search',
	autocompleteMenuItemSearch: '/food/menuItems/suggest',
	getMenuItemInformation: '/food/menuItems/{id}',
	menuItemNutritionWidgetHtml: '/food/menuItems/{id}/nutritionWidget',
	menuItemNutritionWidgetPng: '/food/menuItems/{id}/nutritionWidget.png',
	menuItemNutritionLabelPng: '/food/menuItems/{id}/nutritionLabel.png',
	menuItemNutritionLabelHtml: '/food/menuItems/{id}/nutritionLabel',

	// General food search & media
	searchAllFood: '/food/search',
	searchSiteContent: '/food/site/search',
	searchFoodVideos: '/food/videos/search',
	imageAnalysisByUrl: '/food/images/analyze',
	imageClassificationByUrl: '/food/images/classify',

	// NLP / fun / misc
	detectFoodInText: '/food/detect',
	randomFoodJoke: '/food/jokes/random',
	randomFoodTrivia: '/food/trivia/random',
	conversationSuggests: '/food/converse/suggest',
	talkToChatbot: '/food/converse',

	// Users & custom foods
	searchCustomFoods: '/food/customFoods/search',
	connectUser: '/users/connect',

	// Meal planner
	generateMealPlan: '/mealplanner/generate',
	getMealPlanWeek: '/mealplanner/{username}/week/{start_date}',
	clearMealPlanDay: '/mealplanner/{username}/day/{date}',
	addToMealPlan: '/mealplanner/{username}/items',
	deleteFromMealPlan: '/mealplanner/{username}/items/{id}',
	getMealPlanTemplates: '/mealplanner/{username}/templates',
	getMealPlanTemplate: '/mealplanner/{username}/templates/{id}',
	addMealPlanTemplate: '/mealplanner/{username}/templates',

	// Shopping list
	getShoppingList: '/mealplanner/{username}/shopping-list',
	addToShoppingList: '/mealplanner/{username}/shopping-list/items',
	deleteFromShoppingList: '/mealplanner/{username}/shopping-list/items/{id}',
	generateShoppingList:
		'/mealplanner/{username}/shopping-list/{start_date}/{end_date}',

	// Restaurants
	searchRestaurants: '/food/restaurants/search',

	// Wine
	getDishPairingForWine: '/food/wine/dishes',
	getWinePairing: '/food/wine/pairing',
	getWineDescription: '/food/wine/description',
	getWineRecommendation: '/food/wine/recommendation'
};

// Legacy/alternate (keep separate if needed)
export const SPOONACULAR_LEGACY_ENDPOINTS = {
	searchRecipesLegacy: '/recipes/search'
};

/**
 * @typedef {keyof typeof SPOONACULAR_ENDPOINTS} EndpointKey
 */

/**
 *
 * @param {string} endpoint
 * @param {Record<string, string|number>} params
 */
export function buildEndpoint(endpoint, params = {}) {
	/**
	 * @type {string[]}
	 */
	const matches = endpoint.match(/{[^}]+}/g) || [];

	for (const token of matches) {
		const key = token.slice(1, -1);
		if (!(key in params)) {
			throw new Error(`[buildEndpoint] Missing path param: "${key}"`);
		}
	}

	return matches.reduce(
		/**
		 *
		 * @param {string} out
		 * @param {string} token
		 * @returns {string}
		 */
		(out, token) => {
			const key = token.slice(1, -1);
			const val = encodeURIComponent(String(params[key]));
			return out.replace(token, val);
		},
		endpoint
	);
}
