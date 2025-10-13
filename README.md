# Cayenne — Recipe Finder

## Overview

## Glossary

| Term             | Definition                                                                           |
| ---------------- | ------------------------------------------------------------------------------------ |
| **API**          | Application Programming Interface — used here to fetch recipe data from Spoonacular. |
| **GET**          | Not used in this context — placeholder if needed for request types or future terms.  |
| **Bootstrap**    | CSS framework used to style layout, forms, and components responsively.              |
| **LocalStorage** | Browser-based storage used to persist favourites and shopping list data.             |

## UX

### UX Overview

This platform is meant to attract two types of users.

**Primary User** -

**Secondary User** -

### The 5 Planes of UX

### The 5 Planes of UX

#### 1. Strategy Plane

##### Purpose

- Provide a fast, intuitive way for users to **discover recipes** and **plan meals** using live data from the Spoonacular API.
- Allow users to **search by ingredient** to make use of what they already have at home.
- Enable users to **save favourites** and build a **shopping list** for convenient reuse.

##### Business Goals

- Encourage regular return visits through saved favourites and a smooth user experience.
- Present a professional, portfolio-quality web application that demonstrates modern front-end development skills and API integration.
- Serve as an educational cooking resource by exposing users to new ingredients and cuisines.

##### Primary User Needs

- Search for recipes by ingredient, keyword, or category.
- Save favourite recipes for quick access.
- Add ingredients to a shopping list for later use.
- View recipes with clear imagery and legible nutritional information.
- Seamlessly switch between metric and US units.

#### 2. Scope Plane

##### Features

- A full list of [Features](#features-1) can be viewed in detail below.

##### Content Requirements

- Recipe cards with images, titles, and brief summaries.
- Detailed recipe pages including ingredients, measures, and instructions.
- Interface elements for liking recipes and managing a shopping list.
- Global controls for measurement system and unit length.
- Informative error states for missing data or network issues.

#### 3. Structure Plane

##### Information Architecture

- **Site Navigation Menu:**

  - Fixed navbar with links to **Home**, **Features**, **About**, and **Cayenne App**.
  - Each static page includes a clear “Launch the App” call-to-action linking directly to the live application (`cayenne.html`).
  - Active-link highlighting helps users track their location across the site.

- **Application Navigation:**

  - Inside the **Cayenne App**, a hash-based router controls navigation between internal views:
    - `#/` – Landing view (in-app home or welcome)
    - `#/recipe-grid` – Recipe search results
    - `#/recipe` – Individual recipe detail
    - `#/shopping-list` – User shopping list
    - `#/404` – Fallback route for invalid hashes
  - The app retains a global **App Header** with measurement toggles and a consistent layout across all internal routes.

- **Hierarchy:**
  - **Header Stack** (site header + navbar) remains consistent across all static pages.
  - **Main Content** presents clear CTAs (e.g., “Explore Features”, “Launch Cayenne App”).
  - **Footer** repeats essential navigation and attributions for accessibility.

##### User Flow

1. **User lands on the Home page (`index.html`)** → reads a short introduction to Cayenne and can immediately click **“Launch App”**.
2. Optionally explores **Features** or **About** pages to learn more about the project and its purpose.
3. Clicks **“Launch App”** → opens the live **Cayenne application** (`cayenne.html`).
4. Inside the app:
   - Searches recipes by ingredient or keyword.
   - Views recipe results in the **Recipe Grid**.
   - Opens a **Recipe Detail** view to read ingredients and instructions.
   - Adds recipes to **Favourites** or items to the **Shopping List**.
   - Navigates back to search or other features via the in-app header.
5. At any time, the user can return to the marketing pages using the main navigation bar.

This dual-layer structure (marketing site + embedded SPA) ensures that new visitors can understand Cayenne’s value before engaging with the interactive application, while returning users can jump straight into the app experience.

#### 4. Skeleton Plane

##### Wireframe Suggestions

- A full list of [Wireframes](#wireframes) can be viewed in detail below.
- Each primary view (Home, Recipe Grid, Recipe Detail, Shopping List) should have:
  - Fixed header stack with app header below.
  - Scrollable main content (`#cayenne-main`).
  - Responsive grid layout that adapts to mobile first.

#### 5. Surface Plane

##### Visual Design Elements

- **[Colours](#colour-scheme)**: see below
- **[Typography](#typography)**: see below

### Colour Scheme

Cayenne uses a warm, modern palette inspired by spice and flame:

- `#C63D0F` — Cayenne red (primary accent)
- `#F2B134` — Warm gold highlight
- `#1E1E1E` — Primary text and neutral backgrounds
- `#FFFFFF` — Content background for readability
- `#EAEAEA` — Subtle divider and neutral UI elements

_Generated via [coolors.co](https://coolors.co/). The palette was tested for contrast compliance (WCAG AA)._

![screenshot](documentation/ux/colours/cayenne-palette.png)

### Typography

- [Inter](https://fonts.google.com/specimen/Inter) for body text (legible and neutral on mobile).
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) for headings, giving a refined culinary feel.
- [Font Awesome](https://fontawesome.com) for icons such as favourites (heart), shopping basket, and navigation cues.

## Architecture

## Navigation

### Active Link Resolution

The function `getActivePageLink()` (defined in [`src/navigation.js`](./src/navigation.js)) is responsible for determining which navigation link should be marked as active, based on the current `window.location.pathname`.

It uses a robust matching strategy:

- Normalises `/` and `''` to `/index.html` to support local development (Live Server) and GitHub Pages
- Matches each link using `pathname.endsWith(linkPath)`, where `linkPath` is the trailing segment of the link's href (e.g. `/features.html`)

This ensures correct behaviour when the site is served from:

- A root `/` path locally
- A `.html` filename (e.g. `/features.html`)
- GitHub Pages (`/cayenne/features.html`)

The link config is defined in `navbarConfig.js`, and used by `initNavbar()` to render the active `<nav>` state.

### Folder Structure

### JavaScript Modules

### State Management

### Spoonacular Integration

## Features

### Existing Features

#### User Facing Features

| Feature                      | Notes                                                                                                                                                                                                                   | Image |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| SPA style hash-based routing | Client-side navigation using `#/path` fragments. Works seamlessly on GitHub Pages without server configuration. URLs are functional but less SEO-friendly and considered a legacy fallback compared to the History API. |       |
| State Management             | See [State Management System](#state-management-system)                                                                                                                                                                 |       |

#### User Facing Features

| Feature                      | Notes                                                                                                                                                                                                                   | Image |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| SPA style hash-based routing | Client-side navigation using `#/path` fragments. Works seamlessly on GitHub Pages without server configuration. URLs are functional but less SEO-friendly and considered a legacy fallback compared to the History API. |       |
| State Management             | See [State Management System](#state-management-system)                                                                                                                                                                 |       |
| Animated Responsive Header   | See [Responsive & Animated App Header](#responsive--animated-app-header). Automatically recalculates layout variables, respects motion preferences, and smoothly hides the site header when the app opens.              |       |

<!-- | Robust scroll event handling | [Single scroll handler](#handling-scroll-events-in-spa-layouts) responds to any scrollable container, allowing seamless navigation auto-hide behaviour across all SPA views.                                            |       | -->

### Future Features

<!-- ### Handling Scroll Events in SPA Layouts -->

The Cayenne app uses a single-page application (SPA) structure, with multiple independently scrollable containers (e.g., shopping list, recipe grid) dynamically injected into the main content area (`<main id="cayenne-main">`). To support features such as auto-hiding the main navigation bar during user scrolling—regardless of which scrollable area is active—the app employs a robust event-handling pattern:

#### Scroll Event Capturing

- **Background:** In the DOM event model, most events (e.g., `click`, `input`) bubble up the tree, allowing parent elements to react to events triggered by their children. However, some events—most notably `scroll`, `focus`, and `blur`—do **not** bubble.
- **Solution:** To reliably respond to scrolling within any descendant of the main SPA container, Cayenne attaches a single `scroll` event listener to `#cayenne-main` using the capture phase (`{{ capture: true }}`).
- **Result:** This ensures the handler is invoked for any scroll event originating from any scrollable child, regardless of dynamic injection or page navigation. The handler inspects `event.target` to determine which specific element was scrolled.

**Why is this necessary?**
The use of event capturing is a robust solution to a less common problem: catching non-bubbling events from dynamic children in an SPA. This avoids the complexity and fragility of attaching and detaching listeners to every scrollable component as they are created or destroyed.

#### Example Pattern

```js
const main = document.getElementById('cayenne-main');
main.addEventListener(
	'scroll',
	event => {
		const scrolledEl = event.target;
		// Logic to hide/show navbar, depending on scroll position
	},
	true // capture phase
);
```

**Reference:**
For a full explanation of event bubbling and capturing, see [javascript.info: Bubbling and Capturing](https://javascript.info/bubbling-and-capturing#capturing).

#### Responsive & Animated App Header

The **Responsive Header System** provides a dynamic, adaptive layout for Cayenne’s multi-layered header structure. It manages transitions between the site’s main header stack (`#header-stack`), the app-specific header (`AppHeader`), and the primary content container (`#cayenne-main`).

This system ensures consistent spacing, smooth animation, and accessibility compliance across different viewport sizes and motion preferences.

##### Overview

The module (`responsiveHeader.js`) is responsible for:

- Calculating and maintaining CSS custom properties to synchronise layout values between JavaScript and CSS.
- Animating the header stack to slide gracefully out of view when the Cayenne app is active.
- Respecting the user's `prefers-reduced-motion` setting for accessibility.
- Dynamically adjusting to height changes in header elements via `ResizeObserver`.

##### Core CSS Variables

| Variable                     | Purpose                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `--stack-offset-height`      | The total height of the combined header and navigation stack.                                                   |
| `--app-header-offset-height` | The height of the Cayenne app’s internal header, which contains global toggles and controls.                    |
| `--main-pad-top`             | Padding applied to the main content area to ensure smooth layout shifts during header transitions.              |
| `--header-speed`             | Duration of the header’s hide/show transition, controlled via JavaScript and synced to user motion preferences. |

##### Behaviour and Features

- **Dynamic Layout Calculation**
  The system continuously monitors header height changes, ensuring that layout spacing remains accurate as content or viewport size changes.

- **Smooth Animated Transition**
  When the app launches, the `header-stack` translates upwards, freeing additional vertical space for app content.
  The animation timing is dynamically derived from `--header-speed`, allowing easy tuning through CSS.

- **Reduced Motion Support**
  Users who prefer minimal animation will see instantaneous transitions, ensuring accessibility compliance.

- **Animation Safety and Robustness**
  The module documents multiple strategies for synchronising the end of animations:

  - A timer-based fallback (derived from CSS variable timing).
  - A `transitionend` event listener approach.
  - A hybrid of both for high-refresh-rate displays.

- **Maintainability**
  All optional patterns and design decisions (scroll-based visibility, velocity-gated animation, etc.) are retained in-line and commented for tutor review and potential future iterations.

##### Technical Notes

- Written entirely in vanilla JavaScript with ES module syntax and full JSDoc typing.
- No external dependencies or build tools are required.
- A cleanup function is returned upon initialisation, which disconnects observers, clears timeouts, and restores initial header visibility.
- Fully compatible with Bootstrap’s responsive grid system while maintaining independence from Bootstrap’s fixed header logic.

## State Management System

Cayenne uses a modular, event-driven state management system to coordinate application state and UI updates. This system is designed for flexibility, testability, and future scalability.

### Core Concepts

- **Global Store**: The core application state is managed by a central store implemented in plain JavaScript, using a custom event emitter for reactive updates.
- **Event-Driven Architecture**: All state changes publish events (e.g., `state:change`), which UI components subscribe to. This ensures efficient and decoupled updates throughout the application.
- **Selective Persistence**: Only user-relevant state (such as `likedRecipes` and `unitLocale`) is persisted to `localStorage`. Ephemeral or session-only data remains in-memory and is never stored across reloads.
- **Environment-Safe Dev Tools**: Developer tools and debug controls are injected into the UI only in non-production environments, using a central environment flag (`isProd`). This prevents debug features from leaking into production builds.

### Features

| Feature         | Notes                                                                                                                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reactive UI     | UI components automatically update when relevant state changes occur, via store subscriptions.                                                                                                                    |
| Async-Ready API | State persistence methods (such as reset and save) are wrapped in async functions, allowing for seamless migration to future async storage mechanisms (like IndexedDB or cloud storage) without changing the API. |
| Testability     | The decoupled, event-based approach allows for straightforward unit testing of both state and UI logic.                                                                                                           |
| Extensibility   | The system can be easily extended to support new features, additional persisted fields, or more advanced dev tooling.                                                                                             |

### Example Workflow

1. **User Action**: User toggles a unit setting or likes a recipe.
2. **State Update**: The store updates the relevant state and triggers a `state:change` event.
3. **Persistence**: Only the whitelisted fields are saved to `localStorage`.
4. **UI Reaction**: Subscribed components detect the state change and re-render as needed.

### Technical Notes

- The store and event system are implemented in vanilla JavaScript (no frameworks), and fully documented with JSDoc for editor IntelliSense.
- Dev-only features (such as state logging and reset buttons) are never included in production builds.

## Development & Code Style

### GIT

We follow the [Conventional Commits](COMMIT_CONVENTIONS.md) specification.
This ensures all commits are consistent, scoped, and easy to scan.

> Note: Conventional Commits were adopted from 10 September 2025. Earlier commit messages may not follow this format.

### JavaScript

### CSS

The BEM (Block, Element, Modifier) naming convention has been adopted for all custom CSS in this project. This ensures styles are:

- Easy to read and understand
- Modular and reusable across different pages or components
- Resistant to conflicts caused by global class names

#### BEM Naming Convention

**BEM** stands for:

- **Block** – The standalone component (`recipe-card`)
- **Element** – A child part of that component (`recipe-card__title`)
- **Modifier** – A variation of the block or element (`recipe-card--featured`)

```
.block {}
.block__element {}
.block--modifier {}
```

#### Example

```html
<article class="recipe-card recipe-card--featured">
	<img class="recipe-card__image" src="..." alt="..." />
	<h2 class="recipe-card__title">Spaghetti Bolognese</h2>
	<p class="recipe-card__description">A classic Italian dish...</p>
</article>
```

```css
.recipe-card {
	background: white;
	border-radius: 0.5rem;
}

.recipe-card--featured {
	border: 2px solid var(--accent);
}

.recipe-card__title {
	font-size: 1.25rem;
	font-weight: bold;
}
```

## Tools and Technologies

| Tool / Tech                                                                                                             | Use                                                                         |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [![badge](https://img.shields.io/badge/Markdown_Builder-grey?logo=markdown&logoColor=000000)](https://markdown.2bn.dev) | Generate README and TESTING templates.                                      |
| [![badge](https://img.shields.io/badge/Git-grey?logo=git&logoColor=F05032)](https://git-scm.com)                        | Version control. (`git add`, `git commit`, `git push`)                      |
| [![badge](https://img.shields.io/badge/GitHub-grey?logo=github&logoColor=181717)](https://github.com)                   | Secure online code storage.                                                 |
| [![badge](https://img.shields.io/badge/VSCode-grey?logo=htmx&logoColor=007ACC)](https://code.visualstudio.com)          | Local IDE for development.                                                  |
| [![badge](https://img.shields.io/badge/HTML-grey?logo=html5&logoColor=E34F26)](https://en.wikipedia.org/wiki/HTML)      | Main site content and layout.                                               |
| [![badge](https://img.shields.io/badge/CSS-grey?logo=css3&logoColor=1572B6)](https://en.wikipedia.org/wiki/CSS)         | Design and layout.                                                          |
| ![Static Badge](https://img.shields.io/badge/JavaScript-grey?logo=javascript&logoColor=f7df1e)                          | Interactive components and all `./src/` code.                               |
| [![badge](https://img.shields.io/badge/GitHub_Pages-grey?logo=githubpages&logoColor=222222)](https://pages.github.com)  | Hosting the deployed front-end site.                                        |
| [![badge](https://img.shields.io/badge/Bootstrap-grey?logo=bootstrap&logoColor=7952B3)](https://getbootstrap.com)       | Front-end CSS framework for modern responsiveness and pre-built components. |
| [![badge](https://img.shields.io/badge/Figma-grey?logo=figma&logoColor=F24E1E)](https://www.figma.com)                  | Creating wireframes.                                                        |
| [![badge](https://img.shields.io/badge/Font_Awesome-grey?logo=fontawesome&logoColor=528DD7)](https://fontawesome.com)   | Icons.                                                                      |

### Development Strategies

## Agile Development Process

### GitHub Projects

### GitHub Issues

### MoSCoW Prioritisation

> [!NOTE]
> See [Complex Search](COMPLEX_SEARCH.md) for MoSCoW prioritisation of the full [complexSearch](https://spoonacular.com/food-api/docs#Search-Recipes-Complex) endpoint

## Testing

> [!NOTE]
> For all testing please refer to the [TESTING.md](TESTING.md) file.

## Deployment

### API Proxy

The Cayenne app uses a lightweight Node.js API proxy (deployed on Vercel) to safely access the Spoonacular API.
This proxy is used to:

- Keep all API keys secure and out of the public frontend
- Apply minimal validation and request shaping
- Simplify and standardise communication with Spoonacular

All client-side requests from the Cayenne frontend go through this proxy (no direct calls to Spoonacular).

See also: [ci-cayenne-proxy](https://github.com/yenmangu/ci-cayenne-proxy) for the full backend proxy source code.

---

#### Test Recipe API Route

To support rapid development and testing without using up the live Spoonacular API quota, the backend proxy includes a dedicated test route:

- **Endpoint:** `/api/test?test=true`
- **Returns:** A set of stored recipe data in exactly the same format as the live Spoonacular API response.

This allows the Cayenne frontend to develop and test all recipe features using realistic, predictable data—without requiring live API access or risking quota exhaustion.
The frontend can be easily switched to use either the live API or the test route as needed.

**Note:**
All test data is kept in sync with the expected live API format for seamless integration and code parity.

### Security: Why No JWT/Auth?

The Cayenne API proxy **does not implement JWT or other authentication methods**.
This is an intentional design decision based on the following:

- **No user accounts or sensitive data:**
  The API never handles personal data, logins, or user-specific information.
  All requests are read-only (fetching recipes, ingredients, etc.).

- **Purpose is solely to protect the Spoonacular API key:**
  The only reason for the proxy is to avoid exposing the secret key in client-side code.

- **Minimal attack surface:**
  There are no endpoints that mutate state, manage sessions, or store user data.

- **Simplicity and performance:**
  Removing JWT/auth logic reduces complexity, avoids extra network overhead, and ensures smooth user experience.

If the project ever evolves to handle user logins, saved favourites, or custom data,
robust authentication (such as JWT) would be implemented as a future phase.

---

### GitHub Pages

### Local Development

> [!IMPORTANT]
> While all of the code is open source, the Node.js API proxy enforces CORS with an allowed origin list for security.
>
> - If you wish to use the official Node.js proxy, please contact the author to request your origin be added.
> - Alternatively, you are welcome to fork this repo and deploy your own proxy.
> - To connect directly to Spoonacular, you’ll need your own (free) API key:
>   [Spoonacular API Portal](https://spoonacular.com/food-api/)

**Note:**
By default, the Cayenne front-end app expects the proxy to be available at the configured API base URL.
You can override this in your environment if running your own version.

#### Cloning

#### Forking

### Local VS Deployment

## Browser Compatibility

Cayenne is written in modern JavaScript (ES modules) without build tools or transpilation.
Browser support details and feature compatibility are documented in [DEVELOPMENT.md](./DEVELOPMENT.md#browser-compatibility).

## Credits

### Credits For Specific Features

| Feature                             | Source                                                                                                                                                   | Notes                                                                                                                                                                                                         |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hash routing                        | [Medium - Hash routing](https://thedevdrawer.medium.com/single-page-application-routing-using-hash-or-url-d6d1e2adcde/Hash_routing)                      | Inspiration for using `hashchange` because GitHub pages does not support History API [GitHub Community](https://github.com/orgs/community/discussions/64096)                                                  |
| Responsive Header Layout            | [MDN – ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)                                                                  | Used to dynamically calculate and synchronise header and app-header heights, ensuring responsive spacing across breakpoints.                                                                                  |
| Motion Accessibility Compliance     | [MDN – prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-motion)                                         | Ensures animations respect user motion preferences, complying with WCAG recommendations.                                                                                                                      |
| Animation Synchronisation Pattern   | [Web.dev – “prefers-reduced-motion: Sometimes less movement is more”](https://web.dev/articles/prefers-reduced-motion)                                   | Guidance on accessible motion and techniques for reducing animation intensity for sensitive users.                                                                                                            |
| Resize Performance Considerations   | [CSS-Tricks – “A Better API for the Resize Observer”](https://css-tricks.com/a-better-api-for-the-resize-observer/)                                      | Reinforced decision to use a single observer instance for performance and maintainability in responsive layout recalculations.                                                                                |
| High-Refresh-Rate Animation Safety  | [Stack Overflow – “ResizeObserver one vs multiple performance”](https://stackoverflow.com/questions/51528940/resizeobserver-one-vs-multiple-performance) | Background research on safe update intervals and avoiding layout thrashing during ResizeObserver callbacks.                                                                                                   |
| WCAG Motion Accessibility Technique | [W3C – WCAG Technique C39](https://www.w3.org/WAI/WCAG21/Techniques/css/C39)                                                                             | Formal WCAG technique describing best practice for implementing `prefers-reduced-motion` to mitigate vestibular motion issues.                                                                                |
| Transition Event Fallback Design    | [Stack Overflow – “How can I throttle a ResizeObserver?”](https://stackoverflow.com/questions/69469814/how-can-i-throttle-a-resizeobserver)              | Informed implementation of dual fallback (CSS-duration timer + transitionend listener) to handle high-frequency frame updates and ensure animation completion synchronisation across different refresh rates. |

### Other Credits

| Material                                 | Source                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| CSS - Block, Element, Modifider Strategy | [BEM-101 on CSS-Tricks](https://css-tricks.com/bem-101/) |
|                                          |                                                          |

### Content

### Media

#### Food Photography & Icons

| Media | Source |
| ----- | ------ |

### Acknowledgements
