/**
 * Resources:
 * https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
 *
 */

import { CustomError } from './customError.js';

/** @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta */

export class HttpError extends CustomError {
	/**
	 *
	 * @param {Response|{}|undefined} [response]
	 * @param {string} [message]
	 * @param {{status?: number, detail?:string, meta?:ErrorMeta}} [info]
	 */
	constructor(response, message, { status, detail, meta } = {}) {
		const isHttp = response instanceof Response;
		const resolvedStatus = isHttp ? response.status : status;

		const finalMsg = isHttp
			? `[HTTP ${response.status}] ${response.statusText}${
					detail ? ` - ${detail}` : ''
			  }`
			: typeof resolvedStatus === 'number'
			? `[HTTP ${resolvedStatus}]${detail ? ` - ${detail}` : ''}`
			: 'Unknown HTTP Error';

		super(finalMsg);

		/** @type {string|undefined} */
		this.detail = detail;

		/** @type {ErrorMeta|undefined} */
		this.meta = meta;

		/** @type {number|undefined} */
		this.status = resolvedStatus;

		// Tooling/Minification guard
		if (Object.setPrototypeOf) {
			Object.setPrototypeOf(this, new.target.prototype);
		}
		// V8: Chrome/Node guard
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, HttpError);
		}
	}

	toJSON() {
		const { message, stack } = this;
		return {
			name: this.name,
			status: this.status,
			detail: this.detail,
			meta: this.meta,
			message,
			stack
		};
	}
}
