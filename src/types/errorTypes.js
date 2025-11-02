/**
 * @typedef {import("./stateTypes.js").ErrorScope} ErrorScope
 */

/**
 * @typedef {'refetch'|'reloadRoute'|'retryAction'} ErrorCommand
 */

/**
 * @typedef {object} ErrorContext
 * @property {ErrorScope} scope
 * @property {ErrorCommand} [cmd]
 * @property {string} [endpoint]
 * @property {string} [url]
 * @property {Record<string, any>} [params]
 * @property {RequestInit} [opts]
 */

/**
 * @typedef {'network'|
 * 'server'|
 * 'client'|
 * 'not_found'|
 * 'validation'|
 * 'quota'|
 * 'rate_limit'|
 * 'unexpected'
 * } ErrorType
 *
 * @typedef {object} NormalisedError
 *  @property {ErrorType} type
 * @property {string} code
 * @property {number} [status]
 * @property {string} userMessage
 * @property {string} [message]
 * @property {boolean} [retry]
 * @property {()=> (void|Promise<void>)} [onRetry] - UI hint: show Retry button
 * @property {ErrorContext} [context] - carries scope/cmd/etc
 */

export {};
