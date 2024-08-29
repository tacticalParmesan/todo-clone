import { createElement } from "./utility.js";
import { Home } from "./modules/home/home.js";
import { About } from "./modules/about/about.js";
import { Contact } from "./modules/contact/contact.js";
import { Menu } from "./modules/menu/menu.js";
import "./style.css";

export const PageRouter = function() {

	const contentArea = document.querySelector("#content");
	const body = document.querySelector("body");

	const pages = {
		"Home": () => Home(contentArea),
		"About": () => About(contentArea),
		"Menu": () => Menu(contentArea),
		"Contact": () => Contact(contentArea)
	}

	function loadLanding() {
		document.addEventListener("DOMContentLoaded", () => {
			loadTabSwitching();
			Home(contentArea);
			footer();
		});
	}

	function switchPage(pageName) {
		wipePage();
		pages[pageName]()
	}

	function wipePage() {
		contentArea.removeChild(contentArea.firstChild);
	}

	function loadTabSwitching() {
		const navButtons = document.querySelectorAll("nav > button");
		navButtons.forEach((btn) => {
			btn.addEventListener("mousedown", (clickEvent) =>{
				switchPage(clickEvent.target.textContent)
			})
		})
	}

	const footer = () =>
	createElement({
		type: "footer",
		text: "Restaurant page project by @tacticalParmesan | Odin Project 2024",
		parent: body,
	});

	return {loadLanding, switchPage}
}();

PageRouter.loadLanding()
