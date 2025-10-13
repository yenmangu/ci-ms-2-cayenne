// emulateViewport.js (example utility)
/**
 * Force responsive breakpoints via query params.
 * Supported:
 *   ?emulate=mobile|tablet|desktop   → predefined widths
 *   ?viewport=number                 → arbitrary CSS px width (e.g., 414, 768, 1280)
 *
 * import and call early on each page.
 *
 * @param {{
 * get:(name:string) => string,
 * getAll:(name:string) => string[]
 * hasTruthyFlag:(name:string) => boolean
 * }} params
 */
export function emulateViewportFromQuery(params) {
	const preset = (params.get('emulate') || '').toLowerCase();
	const custom = params.get('viewport');

	/** @type {Record<string, number>} */
	const PRESETS = {
		mobile: 375, // iPhone-ish
		tablet: 768, // iPad Mini-ish
		desktop: 1200 // generic large breakpoint
	};

	let widthPx = 0;

	if (preset && PRESETS[preset]) widthPx = PRESETS[preset];
	if (custom && /^\d{3,4}$/.test(custom)) widthPx = parseInt(custom, 10);

	if (!widthPx) return; // nothing to emulate

	// Ensure/replace viewport meta
	const content = `width=${widthPx}, initial-scale=1, shrink-to-fit=no`;
	let meta = document.querySelector('meta[name="viewport"]');
	if (!meta) {
		meta = document.createElement('meta');
		meta.setAttribute('name', 'viewport');
		document.head.appendChild(meta);
	}
	meta.setAttribute('content', content);

	// Body class + badge
	document.documentElement.classList.add('emulate-viewport');
	document.documentElement.style.setProperty('--emulate-width', `${widthPx}px`);
	addEmulationBadge(`${preset || `${widthPx}px`} mode`);
}

/** Add a small non-intrusive badge for awareness. */
function addEmulationBadge(label) {
	const el = document.createElement('div');
	el.textContent = `Emulated: ${label}`;
	Object.assign(el.style, {
		position: 'fixed',
		zIndex: '99999',
		right: '8px',
		bottom: '8px',
		font: '12px/1.2 system-ui, sans-serif',
		color: '#222',
		background: 'rgba(255,255,255,.9)',
		border: '1px solid #ccc',
		borderRadius: '6px',
		padding: '6px 8px',
		boxShadow: '0 1px 4px rgba(0,0,0,.1)',
		pointerEvents: 'none'
	});
	document.body.appendChild(el);
}
