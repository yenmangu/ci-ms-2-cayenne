/**
 * @param {unknown} unknownVal
 */
export function serialiseError(unknownVal) {
	const error =
		unknownVal instanceof Error ? unknownVal : new Error(String(unknownVal));

	const result = {
		name: error.name,
		message: error.message,
		stack: typeof error.stack === 'string' ? error.stack : undefined
	};

	const cause = /** @type {any} */ (error).cause;
	if (cause) {
		result.cause =
			cause instanceof Error
				? {
						name: cause.name,
						message: cause.message,
						stack: typeof cause.stack === 'string' ? cause.stack : undefined
				  }
				: String(cause);
	}
	return result;
}
