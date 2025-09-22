/**
 * @typedef {import('./types/stateTypes.js').AppState} AppState
 */

import { createStateStore } from './event/store.js';

/** @type {AppState} */
const initialState = {
	measureSystem: 'metric',
	unitType: 'unitShort',
	recipeResults: [],
	currentRecipe: null
};

const cayenneStateStore = createStateStore(initialState);

export { cayenneStateStore as appStore };
