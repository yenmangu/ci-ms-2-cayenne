import { IconRegistry } from '../iconRegistry.js';
import { getPublicUrl } from '../../publicPath.js';

/** @type {IconRegistry|null} */
let _registry = null;

/** @type {string | null} */
let _baseDir = null;

/**
 *
 * @param {string} relative
 * @returns
 */
export function configureIconBaseDir(relative) {
	if (_registry) return;
	// _baseDir = getPublicUrl(dirRel.replace(/\/+$/, ''));
	_baseDir = relative;
}

export function getIconRegistry() {
	if (!_registry) {
		// const dir = _baseDir ?? getPublicUrl('/assets/images/icon');
		const dir = _baseDir ?? 'assets/images/icon';
		_registry = new IconRegistry(dir);
	}
	return _registry;
}

export async function preloadIcons(names) {
	const reg = getIconRegistry();
	await reg.preload(names);
}
