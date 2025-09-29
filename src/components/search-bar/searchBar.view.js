/**
 * Renders the searchBar component to the DOM
 *
 */

export function renderSearchBar() {
	// TODO: implment view logic
	return `<!-- cayenne-search-bar  -->
<form class="search-bar d-flex align-items-center gap-2" autocomplete="off">
  <input
		id="cayenneSearch"
    type="search"
    name="query"
    class="form-control search-bar__input"
    placeholder="Search recipes or ingredients…"
    aria-label="Search recipes"
    required
  />
  <button
    type="submit"
    class="btn btn-success search-bar__btn"
    aria-label="Search"
  >
    Search
  </button>
</form>
`;
}
