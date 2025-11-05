/**
 * @typedef {object} ListenerArgs
 * @property {string} label
 * @property {*} [data]
 * @property {any[]} [args]
 */

/**
 * @callback Listener
 * @param {string} event
 * @param {*} [data]
 * @param {...*} [args]
 * @returns {*}
 */

/**
 * @typedef {Object} ChainableReturnType
 * @property {function(): void} unsubscribe
 * @property {function(): ChainableReturnType} once
 * @property {function(Listener): ChainableReturnType} tap
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
	 * Helper to create the chainable API object
	 *
	 * @param {*} event
	 * @param {Listener} listener
	 * @returns {ChainableReturnType}
	 */
	#_makeChain(event, listener) {
		return {
			once: () => this.#_once(event, listener),
			tap: fn => this.#_tap(event, listener, fn),
			unsubscribe: () => this.unsubscribe(event, listener)
		};
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
		// this.unsubscribe(event, listener);
		const onceListener = (event, data, ...args) => {
			listener(event, data, ...args);
			this.unsubscribe(event, onceListener);
		};
		this.subscribe(event, onceListener);
		// Ensure the correct listener is returned to the makeChain
		return this.#_makeChain(event, onceListener);
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
		const tappedListener = (event, data, ...args) => {
			fn(event, data, ...args);
			listener(event, data, ...args);
		};
		this.subscribe(event, tappedListener);
		// Ensure the correct listener is returned to the makeChain
		return this.#_makeChain(event, tappedListener);
	}

	/**
	 *
	 * @param {string} event
	 * @param {*} [data]
	 * @param {...*} [args]
	 * @returns
	 */
	publish(event, data, ...args) {
		// Dev logging
		// if (this.debug) {
		// 	console.log('Publishing: ', event, 'with: ', data);
		// }

		(this.events[event] || []).forEach(callback =>
			callback(event, data, ...args)
		);
		this.wildcardListeners.forEach(cb => cb(event, data, ...args));
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
			return this.#_makeChain(event, listener);
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
}
