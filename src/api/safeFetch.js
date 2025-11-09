import { HttpError } from '../error/errors/httpError.js';
import { createErrorPublishing } from '../error/pipe/publishFactory.js';

// safe code block
async function safeFetchJson(store, scope, url, opts, meta) {
	let resp;
	try {
		resp = await fetch(url, opts);
	} catch (networkErr) {
		createErrorPublishing().routeError(store, scope, networkErr, meta);
		return null; // stop here
	}
	if (!resp.ok) {
		const err = new HttpError(resp, `HTTP ${resp.status}`);
		createErrorPublishing().routeError(
			store,
			scope,
			err,
			meta,
			undefined,
			resp
		);
		return null; // stop here
	}
	return await resp.json();
}
