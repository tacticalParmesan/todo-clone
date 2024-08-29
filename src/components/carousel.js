import { createElement } from "../utility";
import "./carousel.css"

export function Carousel(page, pageName, appendData, cardWidth) {
	const carouselCtn = createElement({
		classes: ["container", pageName + "container"],
		parent: page,
	});

	const carouselView = createElement({
		classes: ["carousel-view", pageName + "-carousel-view"],
		parent: carouselCtn,
	});

	const prevBtn = createElement({
		type: "button",
		id: "prev-btn",
		text: "◀",
		parent: carouselView,
	});

	const itemList = createElement({
		classes: ["item-list", pageName + "-item-list"],
		parent: carouselView,
	});

	const nextBtn = createElement({
		type: "button",
		id: "next-btn",
		text: "▶",
		parent: carouselView,
	});

	const itemWidth = cardWidth;
	const padding = 16;
	const scrollValue = itemWidth + padding;

	prevBtn.addEventListener("mousedown", () => {
		itemList.scrollLeft -= scrollValue;
	});

	nextBtn.addEventListener("mousedown", () => {
		itemList.scrollLeft += scrollValue;
	});

	appendData(itemList)

	return itemList
}