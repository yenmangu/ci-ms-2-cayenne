/**
 * @typedef {import("../types/uiTypes.js").NavBar} NavBar
 */

export const NAVBAR_BASE = `<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand"
					 href="#">Navbar</a>
				<button class="navbar-toggler"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#navbarNav"
								aria-controls="navbarNav"
								aria-expanded="false"
								aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse"
						 id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item">
							<a class="nav-link"
								 aria-current="page"
								 href="./index.html">Home</a>
						</li>
						<li class="nav-item">
							<a class="nav-link"
								 href="./features.html">Features</a>
						</li>
						<li class="nav-item">
							<a class="nav-link"
								 href="./about.html">About</a>
						</li>
						<li class="nav-item">
							<a class="nav-link disabled"
								 aria-disabled="true">Disabled</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>`;

/**
 *
 * @param {NavBar} config
 * @returns {{navInner: string, navClasses: string}}
 */
const createNavbarInner = config => {
	const { activeLink, links } = config;

	const navClasses = 'navbar navbar-expand-lg bg-body-tertiary';
	const navLinks = links
		.map(link => {
			const isActive = link.title === activeLink;
			const classes = `nav-link${isActive ? ' active' : ''}`;
			const aria = isActive ? 'aria-current="page"' : '';

			return `
		<li class="nav-item">
					<a class="${classes}" ${aria} href="${link.href}">${link.title}</a>
				</li>`;
		})
		.join('\n');

	const navInner = `
	<div class="container-fluid">
		<a class="navbar-brand" href="./index.html">Cayenne</a>
		<button class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				${navLinks}
			</ul>
		</div>
	</div>`;
	return { navInner, navClasses };
};

/**
 *
 * @param {NavBar} navConfig
 * @returns {HTMLElement}
 */
export const createNavbar = navConfig => {
	const { navInner, navClasses } = createNavbarInner(navConfig);
	const navEl = document.createElement('nav');
	navEl.classList = navClasses;
	navEl.innerHTML = navInner;

	return navEl;
};
