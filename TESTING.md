# Testing

> [!NOTE]
> Return back to the [README.md](README.md) file.

## Code Validation

### HTML

I have used the recommended [HTML W3C Validator](https://validator.w3.org) to validate all of my HTML files.

| File                       | URL                                                                  | Screenshot                                                      |
| -------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| [index](./index.html)      | [Home]('https://yenmangu.github.io/ci-ms-2-cayenne/')                | ![index](./documentation/validation/validation__index.png)      |
| [index](./features.html)   | [Home]('https://yenmangu.github.io/ci-ms-2-cayenne/features.html')   | ![index](./documentation/validation/validation__features.png)   |
| [index](./cayenne.html)    | [Home]('https://yenmangu.github.io/ci-ms-2-cayenne/cayenne.html')    | ![index](./documentation/validation/validation__cayenne.png)    |
| [index](./how-to-use.html) | [Home]('https://yenmangu.github.io/ci-ms-2-cayenne/how-to-use.html') | ![index](./documentation/validation/validation__how-to-use.png) |

### CSS

I have used the recommended [CSS Jigsaw Validator](https://jigsaw.w3.org/css-validator) to validate all of my CSS files.

| File                                | About                                               | Result           | Screenshot                                              |
| ----------------------------------- | --------------------------------------------------- | ---------------- | ------------------------------------------------------- |
| [style.css](./assets/css/style.css) | Global and SPA styles                               | Pass             | [!style.css](./documentation/validation/css__style.png) |
| [style.css](./assets/css/site.css)  | HTML page specific styles                           | Pass             | [!style.css](./documentation/validation/css__site.png)  |
| [style.css](./assets/css/theme.css) | Bootstrap overrides, root vars and light/dark rules | Fail (See below) | [!style.css](./documentation/validation/css__theme.png) |

> [!Note]
> As per [this mdn GitHub issue](https://github.com/mdn/content/issues/36714) > `color-mix(in...)` is not supported by W3C.
> This appears to be becaue W3C validation is outdated.
> I am using the correct formal syntax as described [here](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix)

## Responsiveness

I've tested my deployed project to check for responsiveness issues. I have also tested on my own device, as

| Page            | Mobile | Tablet | Desktop               | iPhone (Mine) | Notes |
| --------------- | ------ | ------ | --------------------- | ------------- | ----- |
| index.html      |        |        | [!index\_\_desktop]() |               |       |
| features.html   |        |        |                       |               |       |
| how-to-use.html |        |        |                       |               |       |
| cayenne.html    |        |        |                       |               |       |

| App Page | Mobile | Tablet | Desktop | iPhone (Mine) | Notes |
| -------- | ------ | ------ | ------- | ------------- | ----- |
|          |        |        |         |               |       |

## Browser Compatibility

I've tested my deployed project on multiple browsers to check for compatibility issues.

| Page | Chrome | Opera | Safari | Notes |
| ---- | ------ | ----- | ------ | ----- |
|      |        |       |        |       |

## Lighthouse Audit

I've tested my deployed project using the Lighthouse Audit tool to check for any major issues. Some warnings are outside of my control, and mobile results tend to be lower than desktop.

| Page | Mobile | Desktop |
| ---- | ------ | ------- |
|      |        |         |

## Defensive Programming

Defensive programming was manually tested with the below user acceptance testing:

| Page/ Feature | Expectation | Test | Result | Screenshot | Fix (if needed) |
| ------------- | ----------- | ---- | ------ | ---------- | --------------- |
|               |             |      |        |            |                 |

## Implemented User Story Testing

| Target | Expectation | Outcome | Screenshot |
| ------ | ----------- | ------- | ---------- |
|        |             |         |            |

## Bugs

### Fixed Bugs

[![GitHub issue custom search](https://img.shields.io/github/issues-search?query=repo%3Ayenmangu%2Fci-ms-2-cayenne%20label%3Abug&label=bugs)](https://www.github.com/yenmangu/ci-ms-2-cayenne/issues?q=is%3Aissue+is%3Aclosed+label%3Abug)

I've used [GitHub Issues](https://www.github.com/yenmangu/ci-ms-2-cayenne/issues) to track and manage bugs and issues during the development stages of my project.

All previously closed/fixed bugs can be tracked [here](https://www.github.com/yenmangu/ci-ms-2-cayenne/issues?q=is%3Aissue+is%3Aclosed+label%3Abug).

![screenshot](documentation/bugs/gh-issues-closed.png)

### Unfixed Bugs

[![GitHub issues](https://img.shields.io/github/issues/yenmangu/ci-ms-2-cayenne)](https://www.github.com/yenmangu/ci-ms-2-cayenne/issues)

Any remaining open issues can be tracked [here](https://www.github.com/yenmangu/ci-ms-2-cayenne/issues).

![screenshot](documentation/bugs/gh-issues-open.png)

### Known Issues

> [!IMPORTANT]
> There are no remaining bugs that I am aware of, though, even after thorough testing, I cannot rule out the possibility.
