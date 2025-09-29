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
	unitLocale: 'metric',
	unitLength: 'unitShort',
	recipeResults: [],
	currentRecipe: null,
	likedRecipes: [],
	...userState
};

const cayenneStateStore = createStateStore(initialState);

export { cayenneStateStore as appStore };
