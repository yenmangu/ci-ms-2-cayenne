# Error Handling System

Cayenne implements a unified error-handling system to manage API and network failures consistently across the app.

## Overview

All network requests are routed through the `_fetch()` method inside the `SpoonacularClient`.
This method delegates status handling to a central policy layer that ensures:

- Clear, user-friendly messages for each error type.
- Predictable Retry behaviour for transient or recoverable errors.
- Automatic fallback to **test data** when the live Spoonacular API quota (HTTP 402) is exceeded.

### Key Components

- **`handleHttpStatus()`** – routes HTTP statuses to the correct reporter.
  Uses existing helpers:
  - `handleQuotaExceeded()` → switches to test mode on **402**.
  - `reportRefetch()` → adds a retryable error (e.g., **429**, **5xx**, network).
  - `reportError()` → logs non-retryable or user-visible errors (e.g., **404**, **401**, **403**).
- **`handleQuotaExceeded()`** – flips the `useLive` flag in the store **once**, reports a retryable “refetch” error, and stops the current live request.
- **`ErrorController`** – listens for error updates via store subscription, renders contextual messages, and wires **Dismiss** and **Retry** actions.
  - **Retry** calls `getClient().refetchFromMeta(meta)` which replays the request using either live or test data.
- **`reportRefetch()` / `reportError()`** – create standardised entries in the error state and render appropriate UI through the controller.

### Behaviour by Status

| Status        | Action                  | Message Behaviour                                            | Retry | Switch to Test |
| ------------- | ----------------------- | ------------------------------------------------------------ | ----- | -------------- |
| **402**       | `handleQuotaExceeded()` | “Live API quota reached. Switched to test data — try again.” | ✔︎    | ✔︎             |
| **404**       | `reportError()`         | “We couldn’t find that recipe. It may have been removed.”    | ✖︎    | ✖︎             |
| **429**       | `reportRefetch()`       | “We’re being rate limited. Please try again.”                | ✔︎    | ✖︎             |
| **5xx**       | `reportRefetch()`       | “Server issue. Please try again.”                            | ✔︎    | ✖︎             |
| **401 / 403** | `reportError()`         | “Authentication failed.” / “Access denied.”                  | ✖︎    | ✖︎             |
| **Other 4xx** | `reportError()`         | “Something went wrong with your request.”                    | ✖︎    | ✖︎             |
| **Network**   | `reportRefetch()`       | “Network issue. Please try again.”                           | ✔︎    | ✖︎             |

> API 404s are handled separately from router 404s.
> Router-level “page not found” errors continue to use `reportNotFound()`.

### Scoping

Errors are tagged using the `ErrorScope` typedef:

```js
'global' | `route:${string}` | `section:${string}`;
``;
```

### Example

### Error & Refetch Flow — Overview

1. **User action → request**
   A controller or UI event triggers a call to `getClient()` and performs an API request.

2. **Client performs IO**
   `SpoonacularClient.#_fetch()` runs the request.
   On failure, it throws one of the custom error classes:
   `HttpError`, `AbortError`, or `NetworkError`.

3. **Error → Reporter → Store**
   The controller catches the error and calls `reportError(store, err, hints)`.
   This uses `normaliseError()` to create a `NormalisedError`, then dispatches `addError(normalised)`.
   The app state now holds a new error entry in the `errors` slice.

4. **ErrorController renders**
   Subscribed to state changes, it re-renders the most recent error for its scope.
   The view shows the alert UI with “Retry” and “Dismiss” buttons based on the error type and metadata.

5. **Retry (user click)**
   `ErrorController.#_deriveRetry(entry)` maps the `meta.cmd` value:

   - `refetch` → calls `getClient().refetchFromMeta(meta)`
   - `refetchMany` → runs all metas in parallel (`Promise.all`)
   - `reloadRoute` → reloads the page

6. **On success**
   The controller clears the error (`resolveError()` + `setState`)
   and dispatches the event:
   `cayenne:refetch-success` → `{ data, meta, scope }`.
   This signals other modules (e.g. UI or page controllers) to update.

7. **On failure**
   If retry fails, the controller calls
   `reportRefetch(store, scope, prevMeta)`
   to enqueue a new, retryable error entry — keeping the user informed and the UI actionable.

**Result:**
All error handling, retries, and user recovery paths now run through a single, predictable flow — fully tested and verified.

![Error Message](documentation/screenshots/error-message.png)
