import { IconRegistry } from '../iconRegistry.js';
import { getPublicUrl } from '../../publicPath.js';

/** @type {IconRegistry|null} */
let _registry = null;

/** @type {string | null} */
let _baseDir = null;

/**
 *
 * @param {string} dirRel
 * @returns
 */
export function configureIconBaseDir(dirRel) {
	if (_registry) return;
	// _baseDir = getPublicUrl(dirRel.replace(/\/+$/, ''));
	_baseDir = dirRel.replace(/\$/, '');
}

export function getIconRegistry() {
	if (!_registry) {
		const dir = _baseDir ?? getPublicUrl('/assets/images/icon');
		_registry = new IconRegistry(dir);
	}
	return _registry;
}

export async function preloadIcons(names) {
	const reg = getIconRegistry();
	await reg.preload(names);
}
