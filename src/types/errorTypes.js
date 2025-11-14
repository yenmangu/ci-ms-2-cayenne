/**
 * @typedef {import("./stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import("./stateTypes.js").ErrorMeta} ErrorMeta
 */

/**
 * @typedef {'refetch'|'refetchMany'|'reloadRoute'|'retryAction'} ErrorCommand
 */

// Deprecated
// /**
//  * @typedef {object} ErrorContext_
//  * @property {ErrorScope} scope
//  * @property {ErrorCommand} [cmd]
//  * @property {string} [endpoint]
//  * @property {string} [url]
//  * @property {string} [path]
//  * @property {Record<string, any>} [params]
//  * @property {RequestInit} [opts]
//  * @property {ErrorMeta[]}[metas]
//  */

/**
 * @typedef {object} ErrorDetails
 * @property {string} [name]
 * @property {string} [message]
 * @property {string} [stack]
 */

// Deprecated
// /**
//  *
//  *
//  *
//  * @typedef {object} NormalisedError_
//  *  @property {ErrorType} type
//  * @property {string} code
//  * @property {number} [status]
//  * @property {string} userMessage
//  * @property {string} [additionalMessage]
//  * @property {string} [message]
//  * @property {boolean} [retry]
//  * @property {string} [action]
//  * @property {()=> (void|Promise<void>)} [onRetry] - UI hint: show Retry button
//  * @property {ErrorContext} [context] - carries scope/cmd/etc
//  * @property {ErrorDetails} [details]
//  */

/* ================= New Types ================ */

/**
 * @typedef {'network'|
 * 'server'|
 * 'client'|
 * 'not_found'|
 * 'validation'|
 * 'quota'|
 * 'rate_limit'|
 * 'unexpected'|
 * 	string
 * } ErrorType_
 */

/**
 * @typedef {object} ErrorContextMin
 * @property {ErrorCommand} [cmd]
 * @property {string} [endpoint]
 * @property {string} [urlAbs]
 * @property {string} [path]
 * @property {Record<string, any>} [params]
 * @property {RequestInit} [opts]
 * @property {ErrorMeta[]}[metas]
 *
 * @typedef {ErrorContextMin & {[k:string]:any}} ErrorContext
 */

/**
 * @typedef {object} NormalisedError
 * @property {string} code
 * @property {number} [status]
 * @property {ErrorType} type
 * @property {ErrorContext} [context]
 * @property {string} [message]
 * @property {string} [userMessage]
 * @property {boolean} [retry]
 * @property {string|{}} [details]
 * @property {any} [cause]
 * @property {any} [reason]
 */

/**
 * @typedef {'network'|'server'|'client'|'not_found'|'unexpected'} ErrorType
 */

/**
 * @typedef {{kind: 'show', payload: NormalisedError}} ShowDecision
 * @typedef {{kind: 'retry', meta?: Record<string,any>}} RetryDecision
 * @typedef {{kind: 'switchAndRetry', meta: Record<string,any>}} SwitchAndRetryDecision
 * @typedef {{kind: 'none'}} NoneDecision
 *
 * @typedef {ShowDecision | RetryDecision | SwitchAndRetryDecision| NoneDecision} Decision
 */

export {};
