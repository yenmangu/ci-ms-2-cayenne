import * as service from './shoppingList.service.js'

export class ShoppingList {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		/** @type {HTMLElement} */
		this.container = container;
	}

	render() {
		console.warn('Function render() not yet implemented.');
	}

	destroy(){
		console.warn('Function destroy() not yet implemented.');
	}
}
