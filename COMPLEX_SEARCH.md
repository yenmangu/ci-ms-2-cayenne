> [!NOTE]
> Return back to the [README.md](README.md) file.

# `searchRecipes` Endpoint Specification

The /recipes/complexSearch endpoint from the Spoonacular API supports a wide range of query parameters for advanced recipe filtering (e.g. dietary preferences, nutrition, ingredients, sorting, and more).

To maintain a clear and modular codebase, this document lists all available parameters, their MoSCoW priority (Must, Should, Could, Won’t have), and implementation status (Live, In Progress, Not Started).

This file exists separately from the main README.md because of the sheer number of options — including them all inline would make the main README too cumbersome to navigate. This way, myself or possible future developers can reference or expand this file as features are gradually implemented.

### MoSCoW Prioritization for `complexSearch` params

| Endpoint Parameter        | MoSCoW Priority | Status       |
|---------------------------|-----------------|--------------|
| `query`                   | must-have       | not started  |
| `number`                  | must-have       | not started  |
| `diet`                    | should-have     | not started  |
| `intolerances`            | should-have     | not started  |
| `cuisine`                 | should-have     | not started  |
| `sort`                    | should-have     | not started  |
| `sortDirection`           | should-have     | not started  |
| `instructionsRequired`    | should-have     | not started  |
| `includeIngredients`      | could-have      | not started  |
| `excludeIngredients`      | could-have      | not started  |
| `minCalories`             | could-have      | not started  |
| `maxCalories`             | could-have      | not started  |
| `minProtein`              | won't-have      | not started  |
| `maxProtein`              | won't-have      | not started  |
| `minFat`                  | won't-have      | not started  |
| `maxFat`                  | won't-have      | not started  |
| `minCarbs`                | won't-have      | not started  |
| `maxCarbs`                | won't-have      | not started  |
| `minAlcohol`              | won't-have      | not started  |
| `maxAlcohol`              | won't-have      | not started  |
| `minCaffeine`             | won't-have      | not started  |
| `maxCaffeine`             | won't-have      | not started  |
| `minCopper`               | won't-have      | not started  |
| `maxCopper`               | won't-have      | not started  |
| `minCalcium`              | won't-have      | not started  |
| `maxCalcium`              | won't-have      | not started  |
| `minCholine`              | won't-have      | not started  |
| `maxCholine`              | won't-have      | not started  |
| `minCholesterol`          | won't-have      | not started  |
| `maxCholesterol`          | won't-have      | not started  |
| `minFluoride`             | won't-have      | not started  |
| `maxFluoride`             | won't-have      | not started  |
| `minSaturatedFat`         | won't-have      | not started  |
| `maxSaturatedFat`         | won't-have      | not started  |
| `minFiber`                | won't-have      | not started  |
| `maxFiber`                | won't-have      | not started  |
| `minFolate`               | won't-have      | not started  |
| `maxFolate`               | won't-have      | not started  |
| `minFolicAcid`            | won't-have      | not started  |
| `maxFolicAcid`            | won't-have      | not started  |
| `minIodine`               | won't-have      | not started  |
| `maxIodine`               | won't-have      | not started  |
| `minIron`                 | won't-have      | not started  |
| `maxIron`                 | won't-have      | not started  |
| `minMagnesium`            | won't-have      | not started  |
| `maxMagnesium`            | won't-have      | not started  |
| `minManganese`            | won't-have      | not started  |
| `maxManganese`            | won't-have      | not started  |
| `minPhosphorus`           | won't-have      | not started  |
| `maxPhosphorus`           | won't-have      | not started  |
| `minPotassium`            | won't-have      | not started  |
| `maxPotassium`            | won't-have      | not started  |
| `minSelenium`             | won't-have      | not started  |
| `maxSelenium`             | won't-have      | not started  |
| `minSodium`               | won't-have      | not started  |
| `maxSodium`               | won't-have      | not started  |
| `minSugar`                | won't-have      | not started  |
| `maxSugar`                | won't-have      | not started  |
| `minVitaminA`             | won't-have      | not started  |
| `maxVitaminA`             | won't-have      | not started  |
| `minVitaminB1`            | won't-have      | not started  |
| `maxVitaminB1`            | won't-have      | not started  |
| `minVitaminB2`            | won't-have      | not started  |
| `maxVitaminB2`            | won't-have      | not started  |
| `minVitaminB5`            | won't-have      | not started  |
| `maxVitaminB5`            | won't-have      | not started  |
| `minVitaminB3`            | won't-have      | not started  |
| `maxVitaminB3`            | won't-have      | not started  |
| `minVitaminB6`            | won't-have      | not started  |
| `maxVitaminB6`            | won't-have      | not started  |
| `minVitaminB12`           | won't-have      | not started  |
| `maxVitaminB12`           | won't-have      | not started  |
| `minVitaminC`             | won't-have      | not started  |
| `maxVitaminC`             | won't-have      | not started  |
| `minVitaminD`             | won't-have      | not started  |
| `maxVitaminD`             | won't-have      | not started  |
| `minVitaminE`             | won't-have      | not started  |
| `maxVitaminE`             | won't-have      | not started  |
| `minVitaminK`             | won't-have      | not started  |
| `maxVitaminK`             | won't-have      | not started  |
| `offset`                  | won't-have      | not started  |
| `sort`                    | should-have     | not started  |
| `sortDirection`           | should-have     | not started  |
| `instructionsRequired`    | should-have     | not started  |
| `fillIngredients`         | won't-have      | not started  |
| `addRecipeInformation`    | could-have      | not started  |
| `addRecipeNutrition`      | won't-have      | not started  |
| `ignorePantry`            | could-have      | not started  |
| `limitLicense`            | won't-have      | not started  |
