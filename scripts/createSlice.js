import fs from 'fs';
import path from 'path';

/**
 * Run with:
 * 		node createSlice.js <kebab-case>
 *
 */

// process.argv.forEach((val, index) => {
// 	console.log(`${index}: ${val}`);
// });

// process.exit(0);

let pathArg = null;
if (process.argv[3]) {
	pathArg = process.argv[3];
}
const sliceName = process.argv[2];

if (!sliceName) {
	console.error('Please provide a slice name in kebab-case');
	process.exit(1);
}

const camelName = sliceName.replace(/-([a-z])/g, (_, /** @type {string} */ c) =>
	c.toUpperCase()
);

const baseDir = pathArg ?? path.join('src', 'components', sliceName);
if (!fs.existsSync(baseDir)) {
	fs.mkdirSync(baseDir, { recursive: true });
	console.log(`Created folder: ${baseDir}`);
}

const controllerFile = `${camelName}.controller.js`;
const viewFile = `${camelName}.view.js`;
const serviceFile = `${camelName}.service.js`;

const className = camelName.charAt(0).toUpperCase() + camelName.slice(1);

const controllerContent = `import * as service from './${serviceFile}'

export class ${className} {
	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		/** @type {HTMLElement} */
		this.container = container;
	}

	render() {
		console.warn('Function render() not yet implemented.');
	}

	destroy(){
		console.warn('Function destroy() not yet implemented.');
	}
}
`;

const viewContent = `/**
 * Renders the ${camelName} component to the DOM
 *
 */

export function render${className}() {
	// TODO: implment view logic
}`;

const serviceContent = `export {};`;

const files = [
	{ content: controllerContent, name: controllerFile },
	{ content: viewContent, name: viewFile },
	{ content: serviceContent, name: serviceFile }
];

files.forEach(({ content, name }) => {
	const filePath = path.join(baseDir, name);
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, content);
		console.log(`Created: ${filePath}`);
	} else {
		console.log(`Skipped (already exists): ${filePath}`);
	}
});
