export const routerService = {
	activeRouteKey: null,

	setActiveRouteKey(newKey) {
		this.activeRouteKey = newKey;
	},

	isActiveRoute(key) {
		return this.activeRouteKey === key;
	},

	navigateHome() {
		window.location.hash = '#/';
	},
	navigateRecipe(recipeId) {
		window.location.hash = `#/recipe?id=${encodeURIComponent(recipeId)}`;
	},

	navigateShoppingList() {
		window.location.hash = `#/shopping-list`;
	},

	navigateLikedRecipes() {
		window.location.hash = '#/saved-recipes';
	},

	navigate(path, params) {
		let hash = '#/' + path;
		if (params && typeof params === 'object') {
			const query = Object.entries(params)
				.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
				.join('&');
			if (query) {
				hash += '?' + query;
			}
		}
		window.location.hash = hash;
	}
};
