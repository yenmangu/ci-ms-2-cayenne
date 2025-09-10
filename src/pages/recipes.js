import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/recipeGrid.controller.js';

export function initRecipesPage() {
	const grid = new RecipeGrid(multipleRecipes);
	grid.render();
}
