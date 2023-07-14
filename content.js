
// Listener that responds to triggering the Maximizer context menu item
chrome.runtime.onMessage.addListener(request => {
    if (request === "maximizerTriggered") {
        activeSelection = true;
    }
});

const selectionColorRGB = '250, 128, 114';
const listeners = [
    ['mouseover', highlightElement],
    ['mouseout', unhighlightElement],
    ['click', maximizeElement],
    ['keydown', cancelSelection],
];

// Add all the listeners to the page
listeners.forEach(l => document.addEventListener(l[0], l[1]));

let activeSelection = false;

// Saved for restoration after hovering
let hoveredElement = null;
let savedBackground = null;
let savedOutline = null;



// Different steps in the maximization process

function highlightElement(event) {
    if (!activeSelection) return;
    event.stopPropagation();
    event.preventDefault();
    if (event.target?.style instanceof CSSStyleDeclaration) {
        try {
            savedBackground = event.target.style.background;
            savedOutline = event.target.style.outline;
            event.target.style.background = `rgba(${selectionColorRGB}, 0.25)`;
            event.target.style.outline = `2px solid rgb(${selectionColorRGB})`;
        } catch (error) {
            console.debug('There was an error while highligting the element.', error);
        }
    }
    hoveredElement = event.target;
}

function unhighlightElement(event) {
    if (!activeSelection) return;
    event.stopPropagation();
    event.preventDefault();
    resetElementStyle(hoveredElement)
}

function maximizeElement(event) {
    if (!activeSelection) return;
    event.stopPropagation();
    event.preventDefault();
    event.target.requestFullscreen(event);
    resetElementStyle(hoveredElement);
    activeSelection = false;
}

function cancelSelection(event) {
    if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
        resetElementStyle(hoveredElement);
        activeSelection = false;
    }
}



// Helper functions

function resetElementStyle(element) {
    if (element?.style instanceof CSSStyleDeclaration) {
        try {
            element.style.background = savedBackground;
            element.style.outline = savedOutline;
        } catch (error) {
            console.debug("There was an error resetting the elements style.", error);
        }
    }
}

// Removes the listeners on the tab and thereby ends the maximization process
function removeListeners() {
    listeners.forEach(l => document.removeEventListener(l[0], l[1]));
}
