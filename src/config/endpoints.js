/**
 * @typedef {'searchRecipes'|
 * 'searchRecipesByIngredients'|
 * 'searchRecipesByNutrients'|
 * 'getRecipeInformation'|
 * 'getRecipeInformationBulk'|
 * 'getSimilarRecipes'|
 * 'getRandomRecipes'|
 * 'autocompleteRecipeSearch'|
 * 'analyzeRecipeSearchQuery'|
 * 'analyzeRecipeInstructions'|
 * 'analyzeRecipe'|
 * 'classifyCuisine'|
 * 'guessNutritionByDishName'|
 * 'summarizeRecipe'|
 * 'convertAmounts'|
 * 'quickAnswer'|
 * 'extractRecipeFromWebsite'|
 * 'recipeNutritionWidgetJson'|
 * 'recipeNutritionWidgetHtml'|
 * 'recipeNutritionLabelPng'|
 * 'recipeNutritionLabelHtml'|
 * 'recipeIngredientsWidgetJson'|
 * 'recipeIngredientsWidgetHtml'|
 * 'recipeIngredientsImagePng'|
 * 'recipeEquipmentWidgetJson'|
 * 'recipeEquipmentWidgetHtml'|
 * 'recipeEquipmentImagePng'|
 * 'recipePriceBreakdownJson'|
 * 'recipePriceBreakdownHtml'|
 * 'recipePriceBreakdownPng'|
 * 'recipeTasteJson'|
 * 'recipeTasteHtml'|
 * 'recipeTastePng'|
 * 'createRecipeCard'|
 * 'visualizeRecipeNutrition'|
 * 'visualizeEquipment'|
 * 'visualizePriceBreakdown'|
 * 'createRecipeCardById'|
 * 'autocompleteIngredientSearch'|
 * 'ingredientSearch'|
 * 'getIngredientInformation'|
 * 'computeIngredientAmount'|
 * 'getIngredientSubstitutes'|
 * 'getIngredientSubstitutesById'|
 * 'mapIngredientsToProducts'|
 * 'computeGlycemicLoad'|
 * 'autocompleteProductSearch'|
 * 'searchGroceryProducts'|
 * 'searchGroceryProductsByUpc'|
 * 'getProductInformation'|
 * 'getComparableProductsByUpc'|
 * 'productNutritionWidgetHtml'|
 * 'productNutritionWidgetPng'|
 * 'productNutritionLabelPng'|
 * 'productNutritionLabelHtml'|
 * 'searchMenuItems'|
 * 'autocompleteMenuItemSearch'|
 * 'getMenuItemInformation'|
 * 'menuItemNutritionWidgetHtml'|
 * 'menuItemNutritionWidgetPng'|
 * 'menuItemNutritionLabelPng'|
 * 'menuItemNutritionLabelHtml'|
 * 'searchAllFood'|
 * 'searchSiteContent'|
 * 'searchFoodVideos'|
 * 'imageAnalysisByUrl'|
 * 'imageClassificationByUrl'|
 * 'detectFoodInText'|
 * 'randomFoodJoke'|
 * 'randomFoodTrivia'|
 * 'conversationSuggests'|
 * 'talkToChatbot'|
 * 'searchCustomFoods'|
 * 'connectUser'|
 * 'generateMealPlan'|
 * 'getMealPlanWeek'|
 * 'clearMealPlanDay'|
 * 'addToMealPlan'|
 * 'deleteFromMealPlan'|
 * 'getMealPlanTemplates'|
 * 'getMealPlanTemplate'|
 * 'addMealPlanTemplate'|
 * 'getShoppingList'|
 * 'addToShoppingList'|
 * 'deleteFromShoppingList'|
 * 'generateShoppingList'|
 * 'searchRestaurants'|
 * 'getDishPairingForWine'|
 * 'getWinePairing'|
 * 'getWineDescription'|
 * 'getWineRecommendation'} EndpointKeys
 */

export const SPOONACULAR_ENDPOINTS = {
	// Meal planner
	addMealPlanTemplate: '/mealplanner/{username}/templates',
	addToMealPlan: '/mealplanner/{username}/items',
	// Shopping list
	addToShoppingList: '/mealplanner/{username}/shopping-list/items',
	// Recipes
	analyzeRecipe: '/recipes/analyze',
	analyzeRecipeInstructions: '/recipes/analyzeInstructions',
	analyzeRecipeSearchQuery: '/recipes/queries/analyze',
	// Ingredients
	autocompleteIngredientSearch: '/food/ingredients/autocomplete',
	// Menu items
	autocompleteMenuItemSearch: '/food/menuItems/suggest',
	// Products (grocery)
	autocompleteProductSearch: '/food/products/suggest',
	autocompleteRecipeSearch: '/recipes/autocomplete',
	classifyCuisine: '/recipes/cuisine',
	clearMealPlanDay: '/mealplanner/{username}/day/{date}',
	computeGlycemicLoad: '/food/ingredients/glycemicLoad',
	computeIngredientAmount: '/food/ingredients/{id}/amount',
	// Users & custom foods
	connectUser: '/users/connect',
	// NLP / fun / misc
	conversationSuggests: '/food/converse/suggest',
	convertAmounts: '/recipes/convert',

	// Recipe widgets & images
	createRecipeCard: '/recipes/visualizeRecipe',
	createRecipeCardById: '/recipes/{id}/card',
	deleteFromMealPlan: '/mealplanner/{username}/items/{id}',
	deleteFromShoppingList: '/mealplanner/{username}/shopping-list/items/{id}',
	detectFoodInText: '/food/detect',
	extractRecipeFromWebsite: '/recipes/extract',
	generateMealPlan: '/mealplanner/generate',
	generateShoppingList:
		'/mealplanner/{username}/shopping-list/{start_date}/{end_date}',
	getComparableProductsByUpc: '/food/products/upc/{upc}/comparable',
	// Wine
	getDishPairingForWine: '/food/wine/dishes',
	getIngredientInformation: '/food/ingredients/{id}/information',
	getIngredientSubstitutes: '/food/ingredients/substitutes',
	getIngredientSubstitutesById: '/food/ingredients/{id}/substitutes',
	getMealPlanTemplate: '/mealplanner/{username}/templates/{id}',
	getMealPlanTemplates: '/mealplanner/{username}/templates',
	getMealPlanWeek: '/mealplanner/{username}/week/{start_date}',
	getMenuItemInformation: '/food/menuItems/{id}',
	getProductInformation: '/food/products/{id}',
	getRandomRecipes: '/recipes/random',
	getRecipeInformation: '/recipes/{id}/information',
	getRecipeInformationBulk: '/recipes/informationBulk',

	getShoppingList: '/mealplanner/{username}/shopping-list',
	getSimilarRecipes: '/recipes/{id}/similar',
	getWineDescription: '/food/wine/description',
	getWinePairing: '/food/wine/pairing',
	getWineRecommendation: '/food/wine/recommendation',
	guessNutritionByDishName: '/recipes/guessNutrition',
	// General food search & media
	imageAnalysisByUrl: '/food/images/analyze',
	imageClassificationByUrl: '/food/images/classify',

	ingredientSearch: '/food/ingredients/search',
	mapIngredientsToProducts: '/food/ingredients/map',
	menuItemNutritionLabelHtml: '/food/menuItems/{id}/nutritionLabel',
	menuItemNutritionLabelPng: '/food/menuItems/{id}/nutritionLabel.png',
	menuItemNutritionWidgetHtml: '/food/menuItems/{id}/nutritionWidget',
	menuItemNutritionWidgetPng: '/food/menuItems/{id}/nutritionWidget.png',
	productNutritionLabelHtml: '/food/products/{id}/nutritionLabel',
	productNutritionLabelPng: '/food/products/{id}/nutritionLabel.png',
	productNutritionWidgetHtml: '/food/products/{id}/nutritionWidget',

	productNutritionWidgetPng: '/food/products/{id}/nutritionWidget.png',
	quickAnswer: '/recipes/quickAnswer',
	randomFoodJoke: '/food/jokes/random',
	randomFoodTrivia: '/food/trivia/random',
	recipeEquipmentImagePng: '/recipes/{id}/equipmentWidget.png',
	recipeEquipmentWidgetHtml: '/recipes/{id}/equipmentWidget',
	recipeEquipmentWidgetJson: '/recipes/{id}/equipmentWidget.json',

	recipeIngredientsImagePng: '/recipes/{id}/ingredientWidget.png',
	recipeIngredientsWidgetHtml: '/recipes/{id}/ingredientWidget',
	recipeIngredientsWidgetJson: '/recipes/{id}/ingredientWidget.json',
	recipeNutritionLabelHtml: '/recipes/{id}/nutritionLabel',
	recipeNutritionLabelPng: '/recipes/{id}/nutritionLabel.png',

	recipeNutritionWidgetHtml: '/recipes/{id}/nutritionWidget',
	recipeNutritionWidgetJson: '/recipes/{id}/nutritionWidget.json',
	recipePriceBreakdownHtml: '/recipes/{id}/priceBreakdownWidget',
	recipePriceBreakdownJson: '/recipes/{id}/priceBreakdownWidget.json',
	recipePriceBreakdownPng: '/recipes/{id}/priceBreakdownWidget.png',

	recipeTasteHtml: '/recipes/{id}/tasteWidget',
	recipeTasteJson: '/recipes/{id}/tasteWidget.json',

	recipeTastePng: '/recipes/{id}/tasteWidget.png',
	searchAllFood: '/food/search',
	searchCustomFoods: '/food/customFoods/search',
	searchFoodVideos: '/food/videos/search',
	searchGroceryProducts: '/food/products/search',
	searchGroceryProductsByUpc: '/food/products/upc/{upc}',
	searchMenuItems: '/food/menuItems/search',
	searchRecipes: '/recipes/complexSearch',

	searchRecipesByIngredients: '/recipes/findByIngredients',
	searchRecipesByNutrients: '/recipes/findByNutrients',
	// Restaurants
	searchRestaurants: '/food/restaurants/search',
	searchSiteContent: '/food/site/search',

	summarizeRecipe: '/recipes/{id}/summary',

	talkToChatbot: '/food/converse',
	visualizeEquipment: '/recipes/visualizeEquipment',
	visualizePriceBreakdown: '/recipes/visualizePriceEstimator',
	visualizeRecipeNutrition: '/recipes/visualizeNutrition'
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
