class SearchWidget extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = "hi custom";
	}
}

customElements.define("search-widget", SearchWidget);
