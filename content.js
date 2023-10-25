// Listener that responds to triggering the Maximizer context menu item
chrome.runtime.onMessage.addListener((request) => {
    if (request === "maximizerTriggered") {
        beginSelection();
    }
});

const logoSrc = chrome.runtime.getURL("images/512.png");
const primaryColorRGB = "250, 128, 114";
const primaryColor = `rgb(${primaryColorRGB})`;
const secondayColor = "rgb(255, 212, 207)";

const listeners = [
    ["mouseover", highlightElement],
    ["mouseout", unhighlightElement],
    ["click", maximizeElement],
    ["keydown", cancelSelection],
];

let tooltipNode =
    htmlToNode(/*html*/ `<div style="position: fixed; bottom: 0; display: none; flex-direction: row; justify-content: center; align-items: center; width: 100%; pointer-events: none;">
        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 0.5rem; background-color: ${secondayColor}; border: 2px solid ${primaryColor}; color: black; border-radius: 0.5rem; margin: 1rem; padding: 0.5rem; box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);">
            <img src="${logoSrc}" style="height: 1.2rem; width: auto;" />
            ${chrome.i18n.getMessage("tooltipMaximizeText")}
            ${chrome.i18n.getMessage("tooltipCancelText")}
        </div>
    <div>`);

// Add all the listeners to the page
listeners.forEach((l) => document.addEventListener(l[0], l[1]));
tooltipNode = document.body.appendChild(tooltipNode);

let activeSelection = false;

// Saved for restoration after hovering
let hoveredElement = null;
let savedBackground = null;
let savedOutline = null;

// Different steps in the maximization process

function beginSelection() {
    activeSelection = true;
    tooltipNode.style.display = "flex";
}

function endSelection() {
    activeSelection = false;
    tooltipNode.style.display = "none";
}

function highlightElement(event) {
    if (!activeSelection) return;
    event.stopPropagation();
    event.preventDefault();
    if (event.target?.style instanceof CSSStyleDeclaration) {
        try {
            savedBackground = event.target.style.background;
            savedOutline = event.target.style.outline;
            event.target.style.background = `rgba(${primaryColorRGB}, 0.25)`;
            event.target.style.outline = `2px solid rgb(${primaryColorRGB})`;
        } catch (error) {
            console.debug(
                "There was an error while highligting the element.",
                error
            );
        }
    }
    hoveredElement = event.target;
}

function unhighlightElement(event) {
    if (!activeSelection) return;
    event.stopPropagation();
    event.preventDefault();
    resetElementStyle(hoveredElement);
}

function maximizeElement(event) {
    if (!activeSelection) return;
    event.stopPropagation();
    event.preventDefault();
    event.target.requestFullscreen(event);
    resetElementStyle(hoveredElement);
    endSelection();
}

function cancelSelection(event) {
    if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
        resetElementStyle(hoveredElement);
        endSelection();
    }
}

// Helper functions

function resetElementStyle(element) {
    if (element?.style instanceof CSSStyleDeclaration) {
        try {
            element.style.background = savedBackground;
            element.style.outline = savedOutline;
        } catch (error) {
            console.debug(
                "There was an error resetting the elements style.",
                error
            );
        }
    }
}

// Removes the listeners on the tab and thereby ends the maximization process
function removeListeners() {
    listeners.forEach((l) => document.removeEventListener(l[0], l[1]));
}

/**
 * @param {String} HTML string
 * @return {Node[]}
 * @author [Mark Amery](https://stackoverflow.com/users/1709587/mark-amery)
 * @see [Stack Overflow Answer](https://stackoverflow.com/a/35385518)
 */
function htmlToNode(html) {
    var template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}
