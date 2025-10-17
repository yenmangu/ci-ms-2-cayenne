const FOOTER_OFFSET_VAR = '--footer-offset-height';

export function initStickyFooter() {
	const footer = document.getElementById('site-footer');
	const main = document.getElementById('cayenne-main');

	if (!footer || !main) throw new Error('Footer or main not found');

	const setVar = () => {
		const height = footer.offsetHeight || 0;
		document.documentElement.style.setProperty(
			FOOTER_OFFSET_VAR,
			`${height}px`
		);
	};

	requestAnimationFrame(setVar);

	const ro = new ResizeObserver(setVar);
	ro.observe(footer);

	window.addEventListener('resize', setVar, { passive: true });
}
