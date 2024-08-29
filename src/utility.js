export function createElement({
	type = "div",
	id,
	classes,
	text,
	src,
	inputType,
	forLabel,
	parent,
    overload
} = {}) {
	const newElement = document.createElement(type);

	if (Array.isArray(classes)) {
		for (const c of classes) newElement.classList.add(c);
	} else {
		newElement.classList.add(classes);
	}

	if (id) newElement.id = id;
	if (type === "img" || (type === "iframe" && src))
		newElement.setAttribute("src", src);
	if (type === "input") newElement.setAttribute("type", inputType);
	if (text) newElement.textContent = text;
	if (parent) parent.append(newElement);
	if (type === "label" && forLabel) newElement.setAttribute("for", forLabel);

    if(overload) overload(newElement);

	return newElement;
}
