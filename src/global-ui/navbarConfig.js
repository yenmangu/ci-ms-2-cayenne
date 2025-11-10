/**
 * @typedef {import("../types/uiTypes.js").NavBar} NavBarConfig
 * @typedef {import("../types/uiTypes.js").LinkObject} Link
 */

/**
 * @typedef {Link[]}
 */
const links = [
	{ dataPage: 'index', href: './index.html', title: 'Home' },
	{ dataPage: 'features', href: './features.html', title: 'Features' },
	// { href: './about.html', title: 'About', dataPage: 'about' },
	{ dataPage: 'how-to-use', href: './how-to-use.html', title: 'How To Use' },
	{ dataPage: 'cayenne', href: './cayenne.html', title: 'Cayenne' }
];

/**
 * @type {NavBarConfig}
 */
const navConfig = {
	activeLink: '',
	links
};
export { links, navConfig };
