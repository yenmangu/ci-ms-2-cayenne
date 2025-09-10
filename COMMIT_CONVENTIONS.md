# Commit Message Conventions (Cayenne)

We use the [Conventional Commits](https://www.conventionalcommits.org/) style for all commits.

---

## Format

- **`<type>`** → what kind of change
- **`<scope>`** → optional; the slice/component/module (e.g. `recipe-grid`, `error-message`, `api`)
- **`<description>`** → concise, imperative; describes what the commit _does_

---

## Types

| Type         | When to use                                            | Example                                                                                                          |
| ------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **feat**     | A new feature                                          | `feat(recipe-grid): add sorting dropdown`                                                                        |
| **fix**      | A bug fix                                              | `fix(api): handle empty ingredient list without crashing`                                                        |
| **chore**    | Maintenance / tooling / config (no user-facing change) | `chore: update component naming convention (folders kebab-case, files camelCase.<controller\|view\|service>.js)` |
| **refactor** | Code change that doesn’t add a feature or fix a bug    | `refactor(error-message): extract view rendering into helper function`                                           |
| **style**    | Formatting only (whitespace, semicolons, etc.)         | `style(recipe-card): apply consistent indentation to view markup`                                                |
| **test**     | Adding or updating tests                               | `test(recipe-grid): add Jest coverage for sortBy method`                                                         |
| **docs**     | Documentation only                                     | `docs(readme): update project architecture diagram`                                                              |

---

## Examples

````
feat(error-message): add user facing error message rendering

fix(recipe-grid): correct skeleton layout on mobile

chore: update .gitignore for local dev artifacts

refactor(recipe-card): simplify render logic for cleaner DOM injection

style(recipe-card): fix inconsistent indentation

test(api): add unit tests for \_buildEndpoint helper

docs(readme): add BEM CSS naming convention```
````

> [!IMPORTANT]
>
> Always use the **imperative mood** (“add”, “fix”, “update”), not past tense (“added”, “fixed”).
> Keep the description **short** (ideally under 72 characters).
