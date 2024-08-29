import { createElement } from "../utility";
import "./card.css"

export function Card(itemList, imgSrc, name, info, cost){

    const cardContainer = createElement({
        classes: ["card-container"],
        parent: itemList
    })

    const image = createElement({
        classes: ["card-img"],
        parent: cardContainer
    })

    image.style.backgroundImage = `url(${imgSrc})`

    const cardBody = createElement({
        classes: ["card-body"],
        parent: cardContainer
    })

    const cardName = createElement({
        type: "p",
        classes: ["card-text", "card-name"],
        text: name,
        parent:cardBody
    })

    const cardInfo = createElement({
        type: "p",
        classes: ["card-text", "card-info"],
        text: info,
        parent: cardBody
    })

    const cardCost = createElement({
        type: "p",
        classes: ["card-text", "card-cost"],
        text: cost,
        parent: cardBody
    })

}