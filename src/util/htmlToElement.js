/**
 *
 * @param {string} htmlString
 * @returns {HTMLElement}
 * @throws {Error}
 */
function htmlStringToHtmlElement(htmlString) {
	const template = document.createElement('template');
	template.innerHTML = htmlString.trim();
	const node = template.content.firstElementChild;

	if (node instanceof HTMLElement) {
		return node;
	}
	throw new Error('Error - node not instance of HTMLElement');
}
export { htmlStringToHtmlElement as stringToHtml };
