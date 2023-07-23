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
		width: 201px;
		outline-color: initial;
	}
	.dates{
		background-color: #e0e0e0;
		border-radius: 5px;
	}

	</style>
	<form class="widget">
		<div class="item">
			<label>Откуда</label>
			<select required id="select-from"></select>
		</div>
		<div class="item">
			<label>Куда</label>
			<select required id="select-to"></select>
		</div>
		<div class="item">
			<label>Даты</label>
			<div class="dates">
				<input required id="date-from" type="date" />
				<input required id="date-to" type="date" />
			</div>
		</div>
		<button type="submit" id="search-btn">Найти</button>
	</form>
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
		this.button.addEventListener("click", (e) => {
			e.preventDefault();

			if (!this.dateFrom.value) {
				showRedOutline(this.dateFrom);
				showToast("Please select date from");
				return;
			}
			if (!this.dateTo.value) {
				showRedOutline(this.dateTo);
				showToast("Please select date to");
				return;
			}

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

	renderCities() {
		let options = "";
		this.cities.forEach(({ country, city }) => {
			options += `<option value="${city}">${city}, ${country}</option>`;
		});

		this.selectFrom.innerHTML = options;
		this.selectTo.innerHTML = options;
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

const search = document.querySelector("#first");
const search2 = document.querySelector("#second");
const toast = document.querySelector("#toast");

getCities().then(({ data }) => {
	console.log(data);
	search.cities = data;
	search2.cities = [{ city: "bishkek", country: "kyrgyzstan" }];
});

search.addEventListener("search", (e) => {
	console.log(e, "first widget event");
});
search2.addEventListener("search", (e) => {
	console.log(e, "second widget event");
});

async function getCities() {
	// const res = await fetch("https://countriesnow.space/api/v0.1/countries");
	const res = await fetch(
		"https://countriesnow.space/api/v0.1/countries/population/cities"
	);
	const data = await res.json();
	return data;
}

function getToday() {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function showToast(message = "Something went wrong") {
	toast.textContent = message;
	toast.style.visibility = "visible";
	toast.style.opacity = "1";

	setTimeout(() => {
		toast.style.visibility = "hidden";
		toast.style.opacity = "0";
	}, 2000);
}

function showRedOutline(elem) {
	elem.style.outlineColor = "#dc3545";
	setTimeout(() => {
		elem.style.outlineColor = "initial";
	}, 2000);
	elem.focus();
}
