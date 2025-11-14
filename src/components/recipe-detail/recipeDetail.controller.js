/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} Recipe
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 * @typedef {import('../../types/componentTypes.js').RecipeDetailParams} RecipeDetailParams
 * @typedef {import('../../types/stateTypes.js').AppState} AppState
 * @typedef {import('../../types/stateTypes.js').PartialAppState} PartialAppState
 * @typedef {import('../../types/stateTypes.js').UnitLocale} UnitLocale
 * @typedef {import('../../types/stateTypes.js').UnitLength} UnitLength
 * @typedef {import('../../types/imageTypes.js').ImageModel} ImageModel
 * @typedef {import('../../types/errorTypes.js').ErrorScope} ErrorScope
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCard
 */

import { appStore } from '../../appStore.js';
import { createErrorPublishing } from '../../error/pipe/publishFactory.js';
import { getCurrentRouteScope } from '../../error/util/errorScope.js';
import { escapeHtml } from '../../util/escapeHtml.js';
import { stringToHtml } from '../../util/htmlToElement.js';
import { mountImage } from '../../util/mountImage.js';
import { IngredientMiniCard } from '../ingredient-mini-card/ingredientMiniCard.controller.js';
import { Loading } from '../loading/loading.controller.js';
import { ToggleComponent } from '../toggle-component/toggleComponent.controller.js';
import * as service from './recipeDetail.service.js';
import { renderLikeButton, renderRecipeDetail } from './recipeDetail.view.js';

/**
 * @component
 * @domain
 *
 * Top level routed component for '/recipe/
 */
export class RecipeDetail {
	/**
	 * Usually #app
	 * @param {HTMLElement} appRoot
	 * @param {RecipeDetailParams} detailParams
	 */
	constructor(appRoot, detailParams) {
		this.appRoot = appRoot;

		/** @type {HTMLElement} */
		this.recipeDetailComponent = null;

		this.recipeId = detailParams.recipeId;
		this.service = service.createDetailService();
		/** @type {Recipe} */ this.fetchedRecipe = null;
		/** @type {Summary} */ this.summary = null;

		this.noSummaryPlaceholder = {
			id: 0,
			summary: 'No summary available.',
			title: 'Not Available'
		};

		/** @type {UnitLocale} */
		this.unitLocale = 'metric';

		/** @type {UnitLength} */
		this.unitLength = 'unitShort';

		/** @type {HTMLElement} */
		this.recipeContainer = null;

		/** @type {HTMLElement} */
		this.toggleContainer = null;

		/** @type {ToggleComponent} */
		this.unitLocaleToggle = null;

		/** @type {ToggleComponent} */
		this.unitLengthToggle = null;

		/** @type {HTMLButtonElement} */
		this.likeBtn = /** @type {HTMLButtonElement} */ (
			stringToHtml(renderLikeButton())
		);

		this.imageHost = null;

		/** @type {IngredientMiniCard[]} */
		this.ingredientCardInstances = [];

		this.lastState = null;
		this.subscription = null;
		this.likeButtonSubscription = null;

		this.componentReady = false;
		this.deps = createErrorPublishing();
		this.loading = new Loading(this.appRoot);

		this.lastState = null;
		// this.init();
	}

	#_buildIngredientCards() {
		if (this.fetchedRecipe && this.fetchedRecipe.extendedIngredients) {
			const ingredientsContainer = /** @type {HTMLElement} */ (
				this.recipeDetailComponent.querySelector('#recipe-ingredients')
			);
			const ingredients = this.fetchedRecipe.extendedIngredients;

			if (!ingredients || !Array.isArray(ingredients)) {
				// Handle no ingredients
				ingredientsContainer.innerHTML =
					'<h4>Sorry no ingredients found for this recipe</h4>';
			}

			ingredientsContainer.innerHTML = '';

			ingredients.forEach(i => {
				const card = new IngredientMiniCard(i, {
					inRecipeDetail: true,
					linkedRecipe: this.fetchedRecipe.title,
					linkedRecipeId: this.recipeId
				});
				card.buildEl();
				card.init();
				this.ingredientCardInstances.push(card);
				ingredientsContainer.appendChild(card.el);
			});
		}
	}

	#_getIngredientCards() {
		const ingredientCards = this.recipeDetailComponent.querySelectorAll(
			"[data-card-type='ingredientCard']"
		);
		if (ingredientCards) {
			return /** @type {NodeListOf<HTMLElement>} */ (ingredientCards);
		} else {
			throw new Error('Error, no IngredientCards found in DOM');
		}
	}

	#_handleIngredientUpdate() {
		// Guard against no currentRecipe
		const state = this.lastState;
		if (!state?.currentRecipe) return;

		const cards = this.#_getIngredientCards();
		const { currentRecipe } = this.lastState;
		cards.forEach(card => {
			let id = card.dataset.ingredientId;
			if (!id) {
				throw new Error('Error: `ingredientId` not set on HTMLElement dataset');
			}

			const ingredient = currentRecipe.extendedIngredients.find(
				k => k.id === parseInt(id, 10)
			);

			if (!ingredient) throw new Error(`Ingredient with id ${id} not found`);

			const measureObj = ingredient.measures[this.unitLocale];
			if (!measureObj) {
				throw new Error(
					`No measure for locale '${this.unitLocale}' on ingredient id ${id}`
				);
			}

			const amount =
				typeof measureObj.amount === 'number'
					? measureObj.amount
					: ingredient.amount ?? '';

			const units = measureObj[this.unitLength] ?? ingredient.unit ?? '';

			const cardUnit = card.querySelector('span[data-label="units"]');
			const cardAmounts = card.querySelector('span[data-label="amounts"]');

			if (cardUnit) {
				/** @type {HTMLElement} */ (cardUnit).innerText = units;
			}
			if (cardAmounts) {
				/** @type {HTMLElement} */ (cardAmounts).innerText =
					amount.toString() ?? 'Not available';
			}
		});
	}

	#_hydrate() {
		this.#_handleIngredientUpdate();
	}

	/**
	 *
	 * @param {ErrorScope} expectedScope
	 * @param {(...args)=> any} handler
	 */
	#_onRefetchSuccessOnce(expectedScope, handler) {
		const eHandler = event => {
			const detail = event?.detail;
			if (!detail || detail.scope !== expectedScope) return;
			window.removeEventListener('cayenne:refetch-success', eHandler);
			handler(detail.data, detail.meta);
		};
		window.addEventListener('cayenne:refetch-success', eHandler);
	}

	/**
	 *
	 * @param {ImageModel} recipeImage
	 */
	#_renderImage(recipeImage) {
		const imageWrapper = /** @type {HTMLElement} */ (
			this.recipeDetailComponent.querySelector(
				'[data-label-image-wrapper="detail"]'
			)
		);
		if (imageWrapper) {
			const card = /** @type {RecipeCard} */ ({
				id: this.recipeId,
				title: this.fetchedRecipe.title ?? 'No Title Found',
				image: this.fetchedRecipe.image ?? '',
				imageType: this.fetchedRecipe.imageType ?? ''
			});
			this.imageHost = mountImage(imageWrapper, recipeImage, 'recipe');
			imageWrapper.appendChild(this.likeBtn);
		}

		// const imageEl = stringToHtml(renderImage(recipeImage));
	}

	/**
	 *
	 * @param {HTMLElement} icon
	 */
	checkIsLiked(icon) {
		const liked = appStore.getState().likedRecipes || [];
		const isLiked = liked.some(id => id === this.fetchedRecipe.id);
		this.#_toggleIcon(icon, isLiked);
	}

	/**
	 *
	 * @param {HTMLElement} icon
	 * @param {boolean} [on=true]
	 */
	#_toggleIcon(icon, on = true) {
		if (on) {
			icon.classList.remove('fa-regular');
			icon.classList.add('fa-solid');
		} else {
			icon.classList.remove('fa-solid');
			icon.classList.add('fa-regular');
		}
		const likeBtn = this.likeBtn;
		if (!likeBtn) {
			throw new Error('Cannot find like button');
		}
		this.likeBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
		this.likeBtn.setAttribute('title', on ? 'Remove like' : 'Like this recipe');
		const likeText = this.likeBtn.querySelector('span.btn__like-text');
		if (!likeText) {
			throw new Error('Cannot update like text: Cannot find element.');
		}
		likeText.textContent = on ? 'Remove like' : 'Like this recipe';
	}

	_getIdFromUrl() {
		throw new Error('Method not implemented.');
	}

	async _testEndpoint(id) {
		const { recipe, summary } = await service.fetchRecipeDetail(id);
		this.fetchedRecipe = recipe;

		this.summary = summary ?? this.noSummaryPlaceholder;

		appStore.setState({ currentRecipe: this.fetchedRecipe });
	}

	async fetchRecipe() {
		await this.service.fetchRecipeById(this.recipeId, {});
		this.fetchedRecipe = this.service.fetchedRecipe;
		this.summary = this.service.recipeSummary;
		appStore.setState({ currentRecipe: this.fetchedRecipe });
	}

	/**
	 *
	 * @param {PartialAppState} state
	 */
	handleStateChange(state) {
		this.lastState = state;
		this.unitLength = state.unitLength;
		this.unitLocale = state.unitLocale;
		if (this.recipeDetailComponent) {
			this.#_hydrate();
		}
	}

	buildElements() {}

	async attemptFetch() {
		if (!this.subscription) {
			this.subscription = appStore.subscribe(state => {
				this.handleStateChange(state);
			});
			try {
				const { fetchedRecipe, summary } = await this.service.fetchRecipeById(
					this.recipeId,
					{}
				);
				if (fetchedRecipe) this.fetchedRecipe = fetchedRecipe;
				if (summary) this.summary = summary;
				this.loading.isLoading = false;
			} catch (err) {
				const scope = getCurrentRouteScope();
				this.deps.routeError(
					appStore,
					scope,
					err,
					undefined,
					'Error caught attempting fetch'
				);
			}
		}
	}

	async init() {
		this.loading.isLoading = true;
		const scope = /** @type {ErrorScope} */ ('/route:/recipe');
		this.#_onRefetchSuccessOnce(scope, ({ recipe, summary }) => {
			this.fetchedRecipe = recipe;
			this.recipeSummary = summary;
			this.render();
		});

		if (!this.subscription) {
			this.subscription = appStore.subscribe(state => {
				this.handleStateChange(state);
			});
			const { fetchedRecipe, summary } = await this.service.fetchRecipeById(
				this.recipeId,
				{}
			);
			if (fetchedRecipe) this.fetchedRecipe = fetchedRecipe;
			if (summary) this.summary = summary;
			this.loading.isLoading = false;
		}
		if (!this.likeButtonSubscription) {
			this.likeButtonSubscription = appStore.subscribe(state => {
				let found;
				if (state && state.likedRecipes) {
					found = state.likedRecipes.some(r => r.id === this.recipeId);
				}
				this.icon = this.likeBtn?.querySelector('i');

				if (!this.icon) {
					throw new Error(
						`Like button icon not found for recipe id: ${this.recipeId}`
					);
				}
				this.#_toggleIcon(this.icon, found);
			}, 'likedRecipes');
			this.likeBtn.addEventListener('click', e => {
				e.preventDefault();
				e.stopPropagation();
				this.#_onLikeClicked();
			});
		}

		// Build the component using the HTML string;
		this.recipeDetailComponent = stringToHtml(
			renderRecipeDetail(this.fetchedRecipe, this.summary)
		);
		this.componentReady = true;
	}

	async publicTest() {
		await this._testEndpoint(this.recipeId);
	}
	#_onLikeClicked() {
		const card = /** @type {RecipeCard} */ ({
			id: this.recipeId,
			title: this.fetchedRecipe.title,
			image: this.fetchedRecipe.image,
			imageType: this.fetchedRecipe.imageType
		});
		appStore.toggleLikedrecipe(card);
	}

	render() {
		if (this.appRoot) {
			this.appRoot.append(this.recipeDetailComponent);

			const imageModel = /** @type {ImageModel } */ ({
				alt: escapeHtml(this.fetchedRecipe.title),
				src: this.fetchedRecipe.image,
				title: escapeHtml(this.fetchedRecipe.title)
			});

			this.#_renderImage(imageModel);
			this.#_buildIngredientCards();
		} else {
			console.warn('No App root');
		}
	}

	destroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		if (this.imageHost) {
			this.imageHost.destroy();
		}
		this.ingredientCardInstances.forEach(i => i.destroy());
	}
}
