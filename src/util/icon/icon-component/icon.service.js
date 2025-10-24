import { IconRegistry } from '../iconRegistry.js';

/** @type {IconRegistry|null} */
let _registry = null;

/** @type {string | null} */
let _baseDir = null;

/**
 *
 * @param {string} baseDir
 * @returns
 */
export function configureIconBaseDir(baseDir) {
	if (_registry) return;
	_baseDir = baseDir.replace(/\+$/, '');
}

export function getIconRegistry() {
	if (!_registry) {
		const dir = _baseDir ?? '/assets/images/icon';
		_registry = new IconRegistry(dir);
	}
	return _registry;
}

export async function preloadIcons(names) {
	const reg = getIconRegistry();
	await reg.preload(names);
}
