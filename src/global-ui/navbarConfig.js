/**
 * @typedef {import("../types/uiTypes.js").NavBar} NavBarConfig
 * @typedef {import("../types/uiTypes.js").LinkObject} Link
 */

/**
 * @typedef {Link[]}
 */
const links = [
	{ href: './index.html', title: 'Home', dataPage: 'index' },
	{ href: './features.html', title: 'Features', dataPage: 'features' },
	{ href: './about.html', title: 'About', dataPage: 'about' },
	{ href: './cayenne.html', title: 'Cayenne', dataPage: 'cayenne' }
];

/**
 * @type {NavBarConfig}
 */
const navConfig = {
	links,
	activeLink: ''
};
export { links, navConfig };
