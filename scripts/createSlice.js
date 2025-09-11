import fs from 'fs';
import path from 'path';

/**
 * Run with:
 * 		node createSlice.js <kebab-case>
 *
 */

const sliceName = process.argv[2];

if (!sliceName) {
	console.error('Please provide a slice name in kebab-case');
	process.exit(1);
}

const camelName = sliceName.replace(/-([a-z])/g, (_, /** @type {string} */ c) =>
	c.toUpperCase()
);

const baseDir = path.join('src', 'components', sliceName);
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

constructor() {}

	render() {
		console.warn('Function render() not yet implemented.')
	}
}`;

const viewContent = `/**
 * Renders the ${camelName} component to the DOM
 *
 */

export function render${className}() {
	// TODO: implment view logic
}`;

const serviceContent = `export {};`;

const files = [
	{ name: controllerFile, content: controllerContent },
	{ name: viewFile, content: viewContent },
	{ name: serviceFile, content: serviceContent }
];

files.forEach(({ name, content }) => {
	const filePath = path.join(baseDir, name);
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, content);
		console.log(`Created: ${filePath}`);
	} else {
		console.log(`Skipped (already exists): ${filePath}`);
	}
});
