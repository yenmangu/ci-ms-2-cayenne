import { ENV } from '../env.js';

export function isLocalPublicBase() {
	const home = new URL(ENV.HOME_URL);
	return home.hostname === '127.0.0.1' || home.hostname === 'localhost';
}

export function getPublicUrl(relativePath) {
	const base = normaliseBase(ENV.HOME_URL);
	const rel = String(relativePath).replace(/^\/+/, '');
	return new URL(rel, base).toString();
}

function normaliseBase(urlLike) {
	const u = new URL(urlLike);

	if (!u.pathname.endsWith('/')) u.pathname += '/';
	return u.toString();
}
