const template = document.createElement("template");
template.innerHTML = `
	<style>
	@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	body {
		font-family: "Roboto", sans-serif;
	}
	.widget {
		display: flex;
		align-items: flex-end;
		column-gap: 15px;
		box-shadow: 20px 20px 120px 15px #0000000d;
		padding: 13px 23px 18px;
		border-radius: 10px;

		max-width: max-content;
	}

	.widget .item {
		display: flex;
		flex-direction: column;
		row-gap: 5px;
	}

	.widget .item label {
		color: #333333;

		font-size: 14px;
		font-weight: 500;
	}

	.widget button {
		padding: 14px 40px;
		background: #333333;
		border: none;
		border-radius: 5px;

		color: #f2f2f2;
		font-size: 16px;
		font-weight: 700;
	}
	input,
	select {
		background-color: #e0e0e0;
		color: #333333;
		padding: 14px;
		font-size: 14px;
		font-weight: 400;
		border: none;
		border-radius: 5px;
		appearance: none;
	}
	</style>
	<div class="app">
		<div class="widget">
			<div class="item">
				<label>Откуда</label>
				<select>
					<option value="1">São Paulo, São Paulo,...</option>
					<option value="2">São Paulo, São Paulo,...</option>
					<option value="3">São Paulo, São Paulo,...</option>
				</select>
			</div>
			<div class="item">
				<label>Куда</label>
				<select>
					<option value="1">São Paulo, São Paulo,...</option>
					<option value="2">São Paulo, São Paulo,...</option>
					<option value="3">São Paulo, São Paulo,...</option>
				</select>
			</div>
			<div class="item">
				<label>Даты</label>
				<div class="dates">
					<input type="date" />
					<input type="date" />
				</div>
			</div>
			<button>Найти</button>
		</div>
	</div>
	`;

class SearchWidget extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		shadow.append(template.content.cloneNode(true));
	}
}

customElements.define("search-widget", SearchWidget);