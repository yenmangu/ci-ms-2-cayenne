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
users of any age and background, who share a common goal of wanting to stay on track with their fitness goals.

**Secondary User** -
any existing fitness organisation/gym owner who currently doesn't but wishes to offer fitness or goal tracking services to existing customers.

There is clear navigation for both types of User, designed to clearly guide the user towards the appropriate section.

Users can directly contact Momentum if they wish to work with us as we are always looking for new talent to join our growing family.

### The 5 Planes of UX

#### 1. Strategy Plane

##### Purpose

- Advertise and introduce the App to new Users
- Provide a sign up service to new Users for the App
- Provide information to Users about the App and the services it provides.

##### Business Goals

- New Users signing up to the Momentum App
- Return business from User Subscription to the Momentum App

##### Primary User Needs

- Registration forms
- Details of the services the Momentum platform will provide
- Information on how to start getting into fitness
- Links to fitness articles (this could provide SEO opportunities with back linking)

#### 2. Scope Plane

##### Features

- A full list of [Features](#features-1) can be viewed in detail below.

##### Content Requirements

- Clear, motivational text about the Momentum platform's mission.
- Photos showcasing the platform
- Descriptions of platform features.
- Forms for User sign-up.

#### 3. Structure Plane

##### Information Architecture

- **Navigation Menu**:
  - Accessible links in the navbar.
- **Hierarchy**:
  - Clear call-to-action buttons.
  - Prominent placement of social media links in the footer.

##### User Flow

1. User lands on the home page → learns about the Momentum platform's mission.
2. Navigates to the fitness user page → learns about the Momentum plaform's features.
3. Signs up via the sign-up page.

#### 4. Skeleton Plane

##### Wireframe Suggestions

- A full list of [Wireframes](#wireframes) can be viewed in detail below.

#### 5. Surface Plane

##### Visual Design Elements

- **[Colours](#colour-scheme)**: see below
- **[Typography](#typography)**: see below

### Colour Scheme

I used [coolors.co](https://coolors.co/6a0dad-ff3b30-1e1e1e-f2f2f2-ff9500) to generate my color palette.

- `rgb(224,131,0)` / `#FF9500` Primary.
- `rgb(106, 13, 173)` / `#6A0DAD` Primary highlights & secondary text.
- `rgb(30,30,30)` / `#1E1E1E` Primary text.
- `rgb(235,235,235)` / `#F2F2f2` Background and tertiary.
- `rgb(255,59,48)` / `#FF3B30` Secondary highlights.

Other colours used
-``/`#`

![screenshot](documentation/ux/colours/momentum-palette.png)

### Typography

- [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) Was used for the logo typeface, and main header.
- [Montserrat](https://fonts.google.com/specimen/Montserrat) was used for the secondary headers and text body.
- [Font Awesome](https://fontawesome.com) icons were used throughout the site, such as the social media icons in the footer.

## Architecture

> Note:

### Folder Structure

### JavaScript Modules

### State Management

### Spoonacular Integration

## Features

### Existing Features

#### User Facing Features

#### Development Features

### Future Features

## Development & Code Style

### GIT

We follow the [Conventional Commits](COMMIT_CONVENTIONS.md) specification.
This ensures all commits are consistent, scoped, and easy to scan.

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

### GitHub Pages

### Local Development

> [!IMPORTANT]
> While all of the code is open source, API keys are restricted. You may clone and run this project locally using your own Spoonacular developer key.

#### Cloning

#### Forking

### Local VS Deployment

## Credits

### Credits For Specific Features

| Feature | Source | Notes |
| ------- | ------ | ----- |

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
