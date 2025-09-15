export {};

/**
 * @typedef {object} RecipeCard
 * @property {number} id
 * @property {string} title
 * @property {string} image
 * @property {string} imageType
 */

/**
 * @typedef {object} MeasureObject
 * @property {number} amount
 * @property {string} unitLong
 * @property {string} unitShort
 */

/**
 * @typedef {object} Measures
 * @property {MeasureObject} [metric]
 * @property {MeasureObject} [us]
 */

/**
 * @typedef {object} ExtendedIngredient
 * @property {number} [id]
 * @property {string} [image]
 * @property {string} [consistency]
 * @property {string} [nameClean]
 * @property {string} aisle
 * @property {number}amount
 * @property {Measures} measures
 * @property {string[]} meta
 * @property {string} name
 * @property {string} original
 * @property {string} originalName
 * @property {string} unit

 */

/**
 * @typedef {object} WinePairing
 * @property {string[]} pairedWines
 * @property {string} pairingText
 */

/**
 * @typedef {object} RecipeSummary
 * @property {number} id
 * @property {string} summary
 * @property {string} title
 */

/**
 * @typedef {object} TemperatureObject
 * @property {number} number
 * @property {string} unit
 */

/**
 * @typedef {object} EquipmentInstance
 * @property {number} id
 * @property {string} image
 * @property {string} name
 * @property {TemperatureObject} [temperature]
 * @property {string} [localizedName]
 */

/**
 * Lean ingredient used in RecipeStep object
 * @typedef {object} RecipeStepIngredient
 * @property {number} id
 * @property {string} image
 * @property {string} name
 * @property {string} [localizedName]
 */

/**
 * @typedef {object} StepLength
 * @property {number} [number]
 * @property {string} [unit]
 */

/**
 * @typedef {object} RecipeStep
 * @property {EquipmentInstance[]} equipment
 * @property {RecipeStepIngredient[]} ingredients
 * @property {number} number
 * @property {StepLength} [length]
 * @property {string}	step

 */

/**
 * @typedef {object} InstructionIngredient
 * @property {number} [id]
 * @property {string} [name]
 * @property {string} [localizedName]
 * @property {string} [image]
 */

/**
 * @typedef {object} AnalyzedInstructions
 * @property {string} name
 * @property {RecipeStep[]} steps
 */

/**
 * @typedef {object} RecipeFull
 * @property {number} id
 * @property {string} title
 * @property {string} [image]
 * @property {string} [imageType]
 * @property {number} [servings]
 * @property {number} [readyInMinutes]
 * @property {number | null} [cookingMinutes]
 * @property {number | null} [preparationMinutes]
 * @property {string} [sourceName]
 * @property {string} [sourceUrl]
 * @property {string} [spoonacularSourceUrl]
 * @property {number} [spoonacularScore]
 * @property {boolean} [cheap]
 * @property {string[]} [cuisines]
 * @property {boolean} [dairyFree]
 * @property {boolean} [vegetarian]
 * @property {boolean} [vegan]
 * @property {boolean} [glutenFree]
 * @property {boolean} [veryHealthy]
 * @property {boolean} [veryPopular]
 * @property {boolean} [sustainable]
 * @property {boolean} [lowFodmap]
 * @property {number} [weightWatcherSmartPoints]
 * @property {string} [gaps]
 * @property {number} [aggregateLikes]
 * @property {string}	[creditsText]
 * @property {any} [license]
 * @property {number} [pricePerServing]
 * @property {string[]} diets
 * @property {string} [instructions]
 * @property {AnalyzedInstructions[]} [analyzedInstructions]
 * @property {string[]} [dishTypes]
 * @property {ExtendedIngredient[]} [extendedIngredients]
 * @property {string} [summary]
 * @property {string[]} [occasions]
 * @property {string} [spoonacularSourceUrl]
 * @property {number} [healthScore]
 * @property {WinePairing} [winePairing]
 */
