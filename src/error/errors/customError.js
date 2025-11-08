/** @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta */

export class CustomError extends Error {
	/**
	 *
	 * @param {string} message
	 * @param {ErrorMeta|{}} [meta={}]
	 */
	constructor(message, meta = {}) {
		super(message);
		this.name = new.target.name;
		/** @type {ErrorMeta | {}} */
		this.meta = meta;
		if (Object.setPrototypeOf) {
			Object.setPrototypeOf(this, new.target.prototype);
		}
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, new.target);
		}
	}

	toJSON() {
		const { name, message, stack } = this;
		return { name, message, stack, meta: this.meta };
	}
}

export class AbortError extends CustomError {
	/** @param {ErrorMeta|{}} meta */
	constructor(meta = {}) {
		super('[AbortError] Request aborted/timed out.', meta);
	}
}

export class NetworkError extends CustomError {
	/** @param {ErrorMeta|{}} meta */
	constructor(meta = {}) {
		super('[NetworkError] Failed to fetch', meta);
	}
}

export class TeapotError extends CustomError {
	/**
	 *
	 * @param {ErrorMeta|{}} meta
	 */
	constructor(meta = {}) {
		super(
			'[TEAPOT] Router signalled fallback required: details not cached.',
			meta
		);
	}
	// On TeapotError, show a brief “We’ve refreshed your recommendations.”
	// banner when redirecting home—this makes the transition feel intentional rather than broken.
}
