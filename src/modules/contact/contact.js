import { createElement } from "../../utility.js";
import "./contact.css";

export function Contact(content) {

	const contactPage = createElement({
		classes: ["contact-page"],
		parent: content,
	});

	const contactInfoContainer = createElement({
		classes: ["contact-info-container", "info-panel"],
		parent: contactPage,
		overload: (infoContainer) => {
			createElement({
				type: "h2",
				classes: ["contact-info-title"],
				text: "Contact info",
				parent: infoContainer,
			});

			createElement({
				type: "p",
				classes: ["contact-info", "telephone"],
				text: "☎ +44 111 222 444",
				parent: infoContainer,
			});

			createElement({
				type: "p",
				classes: ["contact-info", "email"],
				text: "✉ retrobar@fakemail.co.uk",
				parent: infoContainer,
			});
		},
	});

	const sendMessageContainer = createElement({
		classes: ["contact-container", "info-panel"],
		parent: contactPage,
		overload: (msgContainer) => {
			createElement({
				type: "h2",
				classes: ["message-title"],
				text: "Send us a message",
				parent: msgContainer,
			});
		},
	});

	const sendMessageForm = createElement({
		type: "form",
		classes: ["send-message-form"],
		parent: sendMessageContainer,
	});

	const senderRow = createElement({
		classes: ["form-row", "sender-name-row"],
		parent: sendMessageForm,
		overload: (row) => {
			createElement({
				type: "label",
				classes: ["sender-name-label"],
				forLabel: "sender-name",
				text: "Your name:",
				parent: row,
			});
		},
	});

	const senderName = createElement({
		type: "input",
		inputType: "text",
		id: "sender-name",
		classes: ["sender-name-field"],
		parent: senderRow,
	});

	const emailRow = createElement({
		classes: ["form-row", "sender-mail-row"],
		parent: sendMessageForm,
		overload: (row) => {
			createElement({
				type: "label",
				classes: ["sender-mail-label", "form-input"],
				forLabel: "sender-mail",
				text: "Your email:",
				parent: row,
			});
		},
	});

	const senderMail = createElement({
		type: "input",
		inputType: "email",
		id: "sender-mail",
		classes: ["sender-mail-field", "form-input"],
		parent: emailRow,
        overload: (elm) => {
            elm.required = true
        }
	});

	const senderMessage = createElement({
		type: "textarea",
		classes: ["sender-message-text", "form-input"],
		parent: sendMessageForm,
		overload: (elm) => elm.setAttribute("placeholder", "Your message here..."),
	});

	const sendMessageButton = createElement({
		type: "input",
		inputType: "submit",
		text: "Send message",
		parent: sendMessageForm,
		overload: (elm) => {
			elm.value = "Send message";
			elm.onsubmit = (ev) => {
				[senderName, senderMail, senderMessage].forEach(
					(field) => (field.value = "")
				);
			};
		},
	});

	const bookingContainer = createElement({
		classes: ["booking-container", "info-panel"],
		parent: contactPage,
		overload: (bookingCtn) => {
			createElement({
				type: "h2",
				classes: ["booking-title"],
				text: "Make a reservation",
				parent: bookingCtn,
			});
		},
	});

	const bookingForm = createElement({
		type: "form",
		classes: ["booking-form"],
		parent: bookingContainer,
	});

	const dateRow = createElement({
		classes: ["form-row", "date-row"],
		parent: bookingForm,
		overload: (row) => {
			createElement({
				type: "label",
				forLabel: "date",
				classes: ["date-label"],
				text: "Date:",
				parent: row,
			});
		},
	});

	const dateField = createElement({
		type: "input",
		inputType: "date",
		id: "date",
		parent: dateRow,
	});

	const peopleRow = createElement({
		classes: ["form-row", "people-row"],
		parent: bookingForm,
		overload: (row) => {
			createElement({
				type: "label",
				forLabel: "people",
				classes: ["people-label"],
				text: "Guests:",
				parent: row,
			});
		},
	});

	const peopleField = createElement({
		type: "input",
		inputType: "number",
		id: "people",
		parent: peopleRow,
        overload: (elm) => {
            elm.setAttribute("min", 1)
        }
	});

	peopleField.addEventListener("input", () => {
		if (peopleField.value <= 8) {
			let guests = "👤".repeat(peopleField.value);
			peopleIcons.textContent = guests;
		} else {
            peopleIcons.textContent = "Sorry! We don't have tables this big!"
        }
	});

    const confirmationEmailRow = createElement({
		classes: ["form-row", "confirmation-mail-row"],
		parent: bookingForm,
		overload: (row) => {
			createElement({
				type: "label",
				classes: ["confirmation-mail-label", "form-input"],
				forLabel: "Confirmation-mail",
				text: "Your email:",
				parent: row,
                overload: (elm) => {
                    elm.required = true
                }
			});
		},
	});

	const confirmationMail = createElement({
		type: "input",
		inputType: "email",
		id: "sender-mail",
		classes: ["confirmation-mail-field", "form-input"],
		parent: confirmationEmailRow,
	});

    const peopleIcons = createElement({
		type: "span",
		classes: ["people-icons"],
		text: "👤",
		parent: bookingForm,
	});

    const bookingButton = createElement({
		type: "input",
		inputType: "submit",
		text: "Make a reservation",
		parent: bookingForm,
		overload: (elm) => {
			elm.value = "Make a reservation";
			elm.onsubmit = () => {
				alert("Thanks for booking a table! We have sent a confirmation email!");
				[dateField, peopleField, confirmationMail].forEach(
					(field) => (field.value = "")
				);
			};
		},
	});
}
