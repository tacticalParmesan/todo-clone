import { createElement } from "../../utility.js";
import { PageRouter } from "../../index.js";
import { Carousel } from "../../components/carousel.js";
import reviews from "./reviews.json"
import "./home.css";

const homeData = (function () {
	const welcomeText =
		"Welcome to RetroBar, where nostalgia meets nightlife in a symphony of pixels and pixels. Nestled in the heart of the city, RetroBar offers a unique experience marrying classic arcade gaming with a vibrant bar atmosphere. Step into a world where Pac-Man chomps alongside your cocktails and Space Invaders provide the backdrop to your night out.";
	
	const loadReviews = function (itemList) {
		for (let r in reviews) {
			const review = reviews[r];
			createElement({
				classes: ["item-card"],
				text: "✪✪✪✪✪ " + review.reviewText + "     " + "- " + review.customer,
				parent: itemList,
			});
		}
	};

	return { welcomeText, loadReviews };
})();

export function Home(content) {
	const homePage = createElement({ classes: ["home-page"], parent: content });

	const upperHome = createElement({
		classes: ["upper-part"],
		parent: homePage,
	});

	const textPanel = createElement({
		classes: ["home-text-panel"],
		parent: upperHome,
	});

	createElement({
		type: "h2",
		classes: ["welcome-msg"],
		text: "Welcome to the RetroBar, \n where nostalgia and good drinks meet!",
		parent: textPanel,
	});

	createElement({
		type: "p",
		classes: ["welcome-text"],
		text: homeData.welcomeText,
		parent: textPanel,
	});

	createElement({
		type: "img",
		classes: ["home-img"],
		src: "https://images.unsplash.com/photo-1523843268911-45a882919fec?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		parent: upperHome,
	});

	const btnsContainer = createElement({
		classes: ["buttons-container"],
		parent: textPanel,
	});

	createElement({
		type: "button",
		classes: ["home-menu-btn", "home-btn"],
		text: "Browse menu",
		parent: btnsContainer,
	});

	createElement({
		type: "button",
		classes: ["home-book-btn", "home-btn"],
		text: "Make a reservation",
		parent: btnsContainer,
	});

	Carousel(homePage, "home", homeData.loadReviews, 600);
	loadButtonsFunctionality();
}

function loadButtonsFunctionality() {
	const homeMenuButton = document.querySelector(".home-menu-btn");
	homeMenuButton.addEventListener("mousedown", () =>
		PageRouter.switchPage("Menu")
	);

	const homeBookButton = document.querySelector(".home-book-btn");
	homeBookButton.addEventListener("mousedown", () =>
		PageRouter.switchPage("Contact")
	);
}
