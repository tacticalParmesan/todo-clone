import { createElement } from "../../utility.js";
import { Carousel } from "../../components/carousel.js";
import { Card } from "../../components/card.js";
import foodData from "./food.json";
import drinksData from "./drinks.json";
import gamesData from "./games.json";
import "./menu.css";

export function Menu(content) {
	const menuPage = createElement({ classes: ["menu-page"], parent: content });

	const menuTitle = createElement({
		type: "h2",
		classes: ["menu-title"],
		text: "Menu",
		parent: menuPage,
	});

	const foodTitle = createElement({
		type: "h2",
		classes: ["food-menu", "info-title"],
		text: "Food selection",
		parent: menuPage,
	});

	const foodCarousel = Carousel(
		menuPage,
		"menu",
		(list) => loadData(list, foodData),
		265
	);

	const drinksTitle = createElement({
		type: "h2",
		classes: ["drinks-menu", "info-title"],
		text: "Drinks selection",
		parent: menuPage,
	});

	const drinksCarousel = Carousel(
		menuPage,
		"menu",
		(list) => loadData(list, drinksData),
		265
	);

	const gamesTitle = createElement({
		type: "h2",
		classes: ["games-menu", "info-title"],
		text: "Consoles selection",
		parent: menuPage,
	});

	const gamesCarousel = Carousel(
		menuPage,
		"menu",
		(list) => loadData(list, gamesData),
		265
	);
}

function loadData(list, data) {
	for (const item in data) {
		const cardData = data[item];
		Card(
			list,
			cardData.imgUrl,
			cardData.name,
			cardData.info,
			cardData.cost + "£"
		);
	}
}
