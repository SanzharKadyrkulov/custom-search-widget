const template = document.createElement("template");
template.innerHTML = `
	<style>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.widget {
		font-family: "Roboto", sans-serif;
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
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 201px;
	}

	</style>
	<div class="app">
		<div class="widget">
			<div class="item">
				<label>Откуда</label>
				<select id="select-from">
					<option value="1">São Paulo, São Paulo,...</option>
					<option value="2">São Paulo, São Paulo,...</option>
					<option value="3">São Paulo, São Paulo,...</option>
				</select>
			</div>
			<div class="item">
				<label>Куда</label>
				<select id="select-to">
					<option value="1">São Paulo, São Paulo,...</option>
					<option value="2">São Paulo, São Paulo,...</option>
					<option value="3">São Paulo, São Paulo,...</option>
				</select>
			</div>
			<div class="item">
				<label>Даты</label>
				<div class="dates">
					<input id="date-from" type="date" />
					<input id="date-to" type="date" />
				</div>
			</div>
			<button id="search-btn">Найти</button>
		</div>
	</div>
	`;

class SearchWidget extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		shadow.append(template.content.cloneNode(true));

		this.selectFrom = shadow.querySelector("#select-from");
		this.selectTo = shadow.querySelector("#select-to");

		this.dateFrom = shadow.querySelector("#date-from");
		this.dateFrom.setAttribute("min", getToday());
		this.dateTo = shadow.querySelector("#date-to");

		this.dateFrom.addEventListener("change", () => {
			const from = this.dateFrom.value;
			const to = this.dateTo.value;
			this.dateTo.setAttribute("min", from);

			if (new Date(from) > new Date(to)) {
				this.dateTo.value = from;
			}
		});

		this.button = shadow.querySelector("#search-btn");
		this.button.addEventListener("click", () => {
			const event = new CustomEvent("search", {
				detail: {
					startPoint: this.selectFrom.value,
					endPoint: this.selectTo.value,
					dateFrom: this.dateFrom.value,
					dateTo: this.dateTo.value,
				},
			});
			this.dispatchEvent(event);
		});

		this.cities = [];
	}

	async getCities() {
		// const res = await fetch("https://countriesnow.space/api/v0.1/countries");
		const res = await fetch(
			"https://countriesnow.space/api/v0.1/countries/population/cities"
		);
		const data = await res.json();
		return data;
	}

	renderCities() {
		this.selectFrom.innerHTML = "";
		this.selectTo.innerHTML = "";
		this.cities.forEach(({ country, city }) => {
			this.selectFrom.innerHTML += `<option value="${city}">${city}, ${country}</option>`;
			this.selectTo.innerHTML += `<option value="${city}">${city}, ${country}</option>`;
			// console.log(country);
			// // country.cities.forEach((city) => {
			// // });
		});
	}

	get cities() {
		return this.data;
	}

	set cities(arr) {
		this.data = arr;
		this.renderCities();
	}

	connectedCallback() {}

	// disconnectedCallback() {
	// 	// браузер вызывает этот метод при удалении элемента из документа
	// 	// (может вызываться много раз, если элемент многократно добавляется/удаляется)
	// }

	// static get observedAttributes() {
	// 	return [
	// 		/* массив имён атрибутов для отслеживания их изменений */
	// 	];
	// }

	// attributeChangedCallback(name, oldValue, newValue) {
	// 	// вызывается при изменении одного из перечисленных выше атрибутов
	// }
}

customElements.define("search-widget", SearchWidget);

const search = document.querySelector("search-widget");

search.getCities().then(({ data }) => {
	console.log(data);
	search.cities = data.slice(0, 20);
});
console.log(search);

search.addEventListener("search", (e) => {
	console.log(e, "search");
});

function getToday() {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}
