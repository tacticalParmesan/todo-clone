import { createElement } from "../../utility";
import "./about.css"

const aboutData = (function () {
	const aboutText = `Our establishment boasts an extensive collection of retro arcade games, from Donkey Kong to Street Fighter, ensuring endless entertainment for gamers of all ages. But the fun doesn't stop there. Our expert mixologists craft an array of themed cocktails inspired by beloved retro games, from the refreshing Sonic Spritz to the electrifying Pikachu Punch.
    Whether you're reliving your childhood memories or discovering the classics for the first time, RetroBar promises an immersive journey through gaming history. So grab a joystick, sip on a themed beverage, and let the good times roll at RetroBar - where every night is a blast from the past.`;

	const hours = {
		Tuesday: "8AM - 9PM",
		Wednesday: "8AM - 9PM",
		Thursday: "8AM - 9PM",
		Friday: "4PM - 12PM",
		Saturday: "4PM - 12PM",
		Sunday: "4PM - 12PM",
	};

	return { aboutText, hours };
})();

export function About(content) {
	const aboutPage = createElement({ classes: ["about-page"], parent: content });

	const aboutTextCtn = createElement({
		classes: ["about-text-ctn", "info-panel"],
        text: "About RetroBar",
		parent: aboutPage,
	});

	createElement({
		type: "p",
		text: aboutData.aboutText,
		classes: ["about-text"],
		parent: aboutTextCtn,
	});
	// Display Hours
	const hoursCtn = createElement({
		classes: ["hours-container", "info-panel"],
        parent: aboutPage
	});

    const hoursHeader = createElement({
        type: "h2",
        classes: ["hours-head"],
        text: "Hours",
        parent: hoursCtn
    })

    loadHours(hoursCtn)
	
    const locationCtn = createElement({
        classes: ["location-container", "info-panel"],
        text: "Where are we?",
        parent: aboutPage
    })

    const address = createElement({
        type: "p",
        id: "address",
        text: "📍 66 Plender St, London, UK @ Camden Town",
        parent: locationCtn
    })

    const map = createElement({
        type: "iframe",
        classes: ["info-map"],
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.723870863843!2d-0.13800104966661736!3d51.53662428015537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b1f66064425%3A0x193156734429fe0a!2s66%20Plender%20St%2C%20London%2C%20UK!5e0!3m2!1sen!2sit!4v1714050600416!5m2!1sen!2sit",
        parent: locationCtn
    })

}

function loadHours(container) {

    for (const weekday in aboutData.hours) {
        const day = weekday;
        const hours = aboutData.hours[weekday]
        
        const dayCtn = createElement({
            classes: ["day-container", day.toLowerCase()],
            text: day + " : " + hours,
            parent: container
        })
    }

    createElement({
        type: "p",
        classes: ["day-container", "closing-day"],
        text: "Closing day: MONDAY",
        parent: container
    })

}




