export {};

/**
 * @typedef {Object} RecipeCard
 * @property {number} id
 * @property {string} title
 * @property {string} image
 * @property {string} imageType
 */

/**
 * @typedef {Object} MeasureObject
 * @property {number} amount
 * @property {string} unitLong
 * @property {string} unitShort
 */

/**
 * @typedef {Object} Measures
 * @property {MeasureObject} [metric]
 * @property {MeasureObject} [us]
 */

/**
 * @typedef {Object} ExtendedIngredient
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
 * @typedef {Object} WinePairing
 * @property {string[]} pairedWines
 * @property {string} pairingText
 */

/**
 * @typedef {Object} RecipeFull
 * @property {number} id
 * @property {string} title
 * @property {string} image
 * @property {string} imageType
 * @property {number} servings
 * @property {string} readyInMinutes
 * @property {string} cookingMinutes
 * @property {string} preparationMinutes
 * @property {string} sourceName
 * @property {string} sourceUrl
 * @property {string} spoonacularSourceUrl
 * @property {string} spoonacularScore
 * @property {boolean} cheap
 * @property {string[]} cuisines
 * @property {boolean} dairyFree
 * @property {string[]} diets
 * @property {string} instructions
 * @property {string[]} dishTypes
 * @property {ExtendedIngredient[]} extendedIngredients
 * @property {string} spoonacularSourceUrl
 * @property {number} [healthScore]
 * @property {WinePairing} [winePairing]
 */

/**
 * @typedef {Object} TemperatureObject
 * @property {number} number
 * @property {string} unit
 */

/**
 * @typedef {Object} EquipmentInstance
 * @property {number} id
 * @property {string} image
 * @property {string} name
 * @property {TemperatureObject} temperature
 */

/**
 * Lean ingredient used in RecipeStep object
 * @typedef {Object} RecipeStepIngredient
 * @property {number} id
 * @property {string} image
 * @property {string} name
 */

/**
 * @typedef {Object} RecipeStep
 * @property {EquipmentInstance[]} equipment
 * @property {RecipeStepIngredient[]} ingredients
 * @property {number} number
 * @property {string}	step
 */

/**
 * @typedef {Object} AnalyzedInstructions
 * @property {string} name
 * @property {RecipeStep[]} steps
 */
