/**
 * @typedef {import("../types/uiTypes.js").NavBar} NavBarConfig
 * @typedef {import("../types/uiTypes.js").LinkObject} Link
 */

/**
 * @typedef {Link[]}
 */
const links = [
	{ href: './index.html', title: 'Home' },
	{ href: './features.html', title: 'Features' },
	{ href: './about.html', title: 'About' },
	{ href: './cayenne.html', title: 'Cayenne' }
];

/**
 * @type {NavBarConfig}
 */
const navConfig = {
	links,
	activeLink: ''
};
export { links, navConfig };
