# Development Notes

## Development Scripts

### Generate a Vertical Slice

You can scaffold a full vertical slice using the built-in CLI tool:

```bash
npm run slice -- <slice-name>
```

Example:

```
npm run create-slice -- recipe-detail
```

This creates:

```
src/components/recipe-detail/
  recipeDetail.controller.js
  recipeDetail.service.js
  recipeDetail.view.js
```

## Browser Compatibility

Cayenne is written in modern JavaScript using ES modules. No build tools or transpilation are used, so the code runs directly in the browser. As such, supported features depend on the user’s browser version.

The project is configured with `target: "ES2020"` in `jsconfig.json`, which ensures IntelliSense and type-checking align with broadly supported JavaScript features.

### ES Feature Support

| Feature / Syntax                       | ECMAScript Year | Browser Support (approx.)                   | Notes         |
| -------------------------------------- | --------------- | ------------------------------------------- | ------------- | ------------------------------------------- | -------- |
| Optional chaining `?.`                 | ES2020          | Chrome 80, Firefox 72, Safari 13.1, Edge 80 | Safe baseline |
| Nullish coalescing `??`                | ES2020          | Chrome 80, Firefox 72, Safari 13.1, Edge 80 | Safe baseline |
| BigInt                                 | ES2020          | Chrome 67, Firefox 68, Safari 14, Edge 79   |               |
| Dynamic `import()`                     | ES2020          | Chrome 63, Firefox 67, Safari 11, Edge 79   |               |
| Promise.allSettled()                   | ES2020          | Chrome 76, Firefox 71, Safari 13, Edge 79   |               |
| globalThis                             | ES2020          | Chrome 71, Firefox 65, Safari 12, Edge 79   |               |
| String.matchAll()                      | ES2020          | Chrome 73, Firefox 67, Safari 13, Edge 79   |               |
| Logical assignment (`                  |                 | =`, etc.)                                   | ES2021        | Chrome 91, Firefox 90, Safari 14.5, Edge 91 | Cautious |
| String.replaceAll()                    | ES2021          | Chrome 85, Firefox 77, Safari 13.1, Edge 85 | Cautious      |
| Numeric separators (`1_000`)           | ES2021          | Chrome 75, Firefox 70, Safari 13, Edge 79   |               |
| Class fields (#private)                | ES2022          | Chrome 91, Firefox 90, Safari 15.4, Edge 91 | Risky         |
| Top-level await                        | ES2022          | Chrome 89, Firefox 89, Safari 15, Edge 89   | Risky         |
| Object.hasOwn()                        | ES2022          | Chrome 93, Firefox 92, Safari 15.4, Edge 93 | Risky         |
| Error cause (`new Error(...,{cause})`) | ES2022          | Chrome 93, Firefox 91, Safari 15.4, Edge 93 | Risky         |

### Guidance

- **Safe to use**: ES2020 features.
- **Use cautiously**: ES2021 features. These may break on Safari < 14.
- **Avoid unless necessary**: ES2022 features. These will not run on older browsers without polyfills or transpilation.

For coursework and GitHub Pages deployment, ES2020 is the baseline.

```

```
