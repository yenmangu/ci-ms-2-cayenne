// eslint.config.js
// @ts-check
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const destroyGroup = {};
export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: { globals: globals.browser },
		plugins: { perfectionist },
		rules: {
			// Sort class members; this rule OVERRIDES any settings values
			'perfectionist/sort-classes': [
				'error',
				{
					customGroups: [
						{
							elementNamePattern: '^#?(destroy|dispose)$',
							groupName: 'destroy-method',
							selector: 'method',
							// match destroy() or #destroy()
							// optional: don't sort inside this group (usually a single item)
							type: 'unsorted'
						}
					],

					groups: [
						'index-signature',
						'static-property',
						'static-block',
						['protected-property', 'protected-accessor-property'],
						['private-property', 'private-accessor-property'],
						['property', 'accessor-property'],
						'constructor',
						'static-method',
						'protected-method',
						'private-method',
						'method',
						['get-method', 'set-method'],
						'unknown',
						{ newlinesBetween: 1 },
						'destroy-method'
					],
					newlinesBetween: 'ignore',

					// override: still alphabetical, but with explicit group buckets
					order: 'asc',
					type: 'alphabetical'
					// You could override ignorePattern/specialCharacters here if needed
				}
			],

			// Sort object keys; inherits from settings unless overridden here
			'perfectionist/sort-objects': [
				'error',
				{
					// no overrides → uses settings.perfectionist
				}
			]

			// If you later want import sorting (optional):
			// 'perfectionist/sort-imports': ['error', { type: 'alphabetical', order: 'asc' }],
		},

		// Global defaults for ALL perfectionist rules (lower priority than per-rule opts)
		settings: {
			perfectionist: {
				// Optional fallback when two items compare equal under the main type
				fallbackSort: {
					order: 'asc',
					type: 'natural'
				},
				ignoreCase: true, // case-insensitive by default
				// Example: don’t sort keys that start with '_' (keeps private-ish keys in place)
				ignorePattern: '^_',
				// Example: natural collation for UK English if/when needed
				locales: ['en-GB'],
				order: 'asc', // ascending
				partitionByComment: false, // split blocks at comments
				partitionByNewLine: false,
				specialCharacters: 'keep',
				type: 'alphabetical' // default sort: alphabetical
			}
		}
	}
]);
