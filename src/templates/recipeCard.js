export function renderRecipeCard(recipe) {
	return `
	<article class="recipe-card">
			<h2 class="recipe-card__title">${recipe.title}</h2>
			<img src="${recipe.image}" alt="${recipe.title}" class="recipe-card__image">
		</article>
	`;
}
