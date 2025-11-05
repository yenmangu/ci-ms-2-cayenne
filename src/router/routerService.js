export const routerService = {
	activeRouteKey: null,

	isActiveRoute(key) {
		return this.activeRouteKey === key;
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
	},

	navigateHome() {
		window.location.hash = '#/';
	},
	navigateLikedRecipes() {
		window.location.hash = '#/saved-recipes';
	},

	navigateRecipe(recipeId) {
		window.location.hash = `#/recipe?id=${encodeURIComponent(recipeId)}`;
	},

	navigateShoppingList() {
		window.location.hash = `#/shopping-list`;
	},

	setActiveRouteKey(newKey) {
		this.activeRouteKey = newKey;
	}
};
