export {};

/**
 * @typedef {import('../util/icon/icon-component/iconButton.controller.js').IconButton} IconButton
 */

/**
 * @typedef {object} ButtonAttributes
 * @property {string} [type] - Button type, usually 'button'
 * @property {string} [title] - Tooltip text shown on hover
 * @property {string} [label]
 * @property {string} [ariaLabel] - Accessibility label (maps to aria-label)
 * @property {boolean} [ariaPressed] - Accessibility: toggled state for buttons (maps to aria-pressed)
 * @property {boolean} [ariaDisabled] - Accessibility: disables interaction (maps to aria-disabled)
 * @property {number} [tabIndex] - Tab navigation order
 * @property {string} [class] - CSS class(es)
 * @property {string[]} [classList] - Array of CSS classes
 * @property {string} [style] - Inline style
 * @property {boolean} [focusable]
 * @property {Object.<string, string|number>} [styleObj] - Inline style as object
 * @property {string} [id] - HTML id
 * @property {string} [dataTestid] - For test selectors (e.g. data-testid)
 * @property {Object.<string, string|number|boolean>} [dataAttrs] - Custom data-* attributes
 */

/**
 * @typedef {object} IconAttributes
 * @property {string|number} [width] - SVG width (e.g. "24", "1em")
 * @property {string|number} [height] - SVG height
 * @property {string} [stroke] - Stroke colour
 * @property {string|number} [strokeWidth] - Stroke width
 * @property {string} [fill] - Fill colour
 * @property {string} [vectorEffect] - Usually "non-scaling-stroke"
 * @property {string} [role] - ARIA role, usually 'img'
 * @property {string} [label]
 * @property {string} [ariaLabel] - ARIA label for icon
 * @property {boolean} [ariaHidden] - Hide from accessibility tree
 * @property {string} [labelledBy] - ARIA-labelledby idref
 * @property {string} [describedBy] - ARIA-describedby idref
 * @property {string} [title] - <title> element for accessibility
 * @property {string} [desc] - <desc> element for accessibility
 * @property {number} [tabIndex] - Tab navigation for icon (rare)
 * @property {boolean} [focusable]
 * @property {string} [class] - CSS class(es)
 * @property {string[]} [classList] - Array of CSS classes
 * @property {string} [style] - Inline style
 * @property {Object.<string, string|number>} [styleObj] - Inline style as object
 * @property {string} [id] - HTML id for SVG
 * @property {Object.<string, string|number|boolean>} [dataAttrs] - Custom data-* attributes
 */

/**
 * @typedef {'ghost'|'solid'|'link'} ButtonVariant
 * @typedef {string} CustomSize
 * @typedef {'xs'|'sm'|'md'|'lg'|CustomSize} ButtonSize
 */

/**
 * @callback IconButtonOnClick
 * @param {MouseEvent} ev
 * @param {IconButton} btn
 */

/**
 * @typedef {object} IconButtonOptions
 * @property {string} icon
 * @property {boolean} [toggled]
 * @property {boolean} isNavLink
 * @property {IconButtonOnClick} [onClick]
 * @property {boolean} [disabled]
 * @property {ButtonVariant} [variant]
 * @property {ButtonSize} [size]
 * @property {string} [toggledIcon]
 * @property {string} [routeKey]
 * @property {ButtonAttributes} [buttonAttrs]
 * @property {ButtonAttributes} [buttonToggledAttrs]
 * @property {IconAttributes} [iconAttrs]
 * @property {IconAttributes} [iconToggledAttrs]
 */

/**
 * @typedef {object} IconEntry
 * @property {string} name
 * @property {SVGElement} template
 */

/**
 * @typedef {Record<string, IconEntry>} IconRecord
 */
