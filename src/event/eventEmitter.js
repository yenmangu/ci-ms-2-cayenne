/**
 * @callback Listener
 * @param {...*} args
 * @returns {*}
 */

/**
 * @typedef {Object} ChainableReturnType
 * @property {function(): void} unsubscribe
 * @property {function(): ChainableReturnType} once
 * @property {function(Listener): ChainableReturnType} tap
 *
 */

/**
 * @typedef {'state:change'|'state:reset'} StateModes
 */

export default class CayenneEventEmitter {
	constructor() {
		/** @type {Record<string, Listener[]>} */
		this.events = {};

		/** @type {Listener[]} */
		this.wildcardListeners = [];

		/** @type {boolean} */
		this.debug = true;
	}

	/**
	 *
	 * @param {string} event
	 * @param {Listener} listener
	 * @returns {ChainableReturnType}
	 */
	subscribe(event, listener) {
		if (event === '*') {
			this.wildcardListeners.push(listener);
		}
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);

		return this.#_makeChain(event, listener);
	}

	/**
	 *
	 * @param {string} event
	 * @param {Listener} listener
	 * @returns
	 */
	unsubscribe(event, listener) {
		if (event === '*') {
			this.wildcardListeners = this.wildcardListeners.filter(
				fn => fn !== listener
			);
			return;
		}
		if (!this.events[event]) return;
		this.events[event] = this.events[event].filter(fn => fn !== listener);
	}
	/**
	 *
	 * @param {string} event
	 * @param {*} data
	 * @returns
	 */
	publish(event, data) {
		(this.events[event] || []).forEach(callback => callback(data));
		this.wildcardListeners.forEach(cb => cb(event, data));
	}

	// Private Methods
	/**
	 * 'Tap' into the chain, before any other listener is invoked;
	 * returns a new chain object to invoke listener on.
	 * Allows both tap and once to be chainable to each other.
	 *
	 * @param {string} event
	 * @param {Listener} listener
	 * @param {Listener} fn
	 * @returns {ChainableReturnType}
	 */
	#_tap(event, listener, fn) {
		const tappedListener = (...args) => {
			fn(...args);
			listener(...args);
		};
		this.subscribe(event, tappedListener);
		// Ensure the correct listener is returned to the makeChain
		return this.#_makeChain(event, tappedListener);
	}

	/**
	 * Listen once, then unsubscribe;
	 * optionally, return a new chain object to manually unsubscribe from.
	 * Optionally, allows both tap and once to be chainable to each other.
	 *
	 * @param {string} event
	 * @param {Listener} listener
	 * @returns {ChainableReturnType}
	 */
	#_once(event, listener) {
		this.unsubscribe(event, listener);
		const onceListener = (...args) => {
			listener(...args);
			this.unsubscribe(event, onceListener);
		};
		this.subscribe(event, onceListener);
		// Ensure the correct listener is returned to the makeChain
		return this.#_makeChain(event, onceListener);
	}

	/**
	 * Helper to create the chainable API object
	 *
	 * @param {*} event
	 * @param {Listener} listener
	 * @returns {ChainableReturnType}
	 */
	#_makeChain(event, listener) {
		return {
			unsubscribe: () => this.unsubscribe(event, listener),
			tap: fn => this.#_tap(event, listener, fn),
			once: () => this.#_once(event, listener)
		};
	}
}
