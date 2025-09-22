/**
 * @typedef {import('./types/stateTypes.js').AppState} AppState
 */

import { createStateStore } from './event/store.js';

/** @type {AppState} */
const initialState = {
	measureSystem: 'metric',
	unitLength: 'unitShort',
	recipeResults: [],
	currentRecipe: null
};

const cayenneStateStore = createStateStore(initialState);

export { cayenneStateStore as appStore };
