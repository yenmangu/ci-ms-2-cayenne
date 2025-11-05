import globals from 'globals';
import { defineConfig } from 'eslint/config';
import sortClassMembers from 'eslint-plugin-sort-class-members';
const sortPreset =
	/** @type {import('eslint').Linter.Config} */
	// @ts-expect-error
	(sortClassMembers.configs['flat/recommended']);
export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: { globals: globals.browser },
		plugins: { 'sort-class-members': /** @type {any} */ (sortClassMembers) },
		rules: {
			'sort-class-members/sort-class-members': [
				'error',
				{
					accessorPairPositioning: 'getThenSet',
					alphabetical: true,
					order: [
						'[static-properties]',
						'[static-methods]',
						'[properties]',
						'constructor',
						'[methods]'
					],
					stopAfterFirstProblem: false
				}
			]
		}
	}
]);
