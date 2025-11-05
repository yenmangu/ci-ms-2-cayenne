/**
 * @typedef {import('./types/stateTypes.js').AppState} AppState
 * @typedef {import('./types/stateTypes.js').PersistableState} PersistableState
 */

import { createStateStore } from './event/store.js';
const persisted = localStorage.getItem('cayenneUserState');

/** @type {PersistableState} */
const userState = persisted ? JSON.parse(persisted) : {};

/** @type {AppState} */
const initialState = {
	currentRecipe: null,
	likedRecipes: [],
	recipeResults: [],
	shoppingList: [],
	unitLength: 'unitShort',
	unitLocale: 'metric',
	useLive: true,
	...userState
};

const cayenneStateStore = createStateStore(initialState);

export { cayenneStateStore as appStore };
