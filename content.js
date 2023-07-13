const selectionColorRGB = '250, 128, 114'

let maximizerSelectionActive = false;

// saved for restoration after hovering
let hoveredElement = null;
let savedBackground = null;
let savedBorderColor = null;
let savedOutline = null;

// saved for restoration after exiting fullscreen
let savedOverflow = null;
let savedHeight = null;

// listener that responds to triggering the Maximizer context menu item
chrome.runtime.onMessage.addListener(request => {
    if (request === "maximizerTriggered") {
        
        maximizerSelectionActive = true;
    }
});

// listen for hovering over elements
// used for selecting the element to maximize
document.addEventListener('mouseover', event => {
    if (maximizerSelectionActive !== true) return;
    event.stopPropagation();
    event.preventDefault();
    if (event.target?.style instanceof CSSStyleDeclaration) {
        try {
            savedBackground = event.target.style.background;
            savedOutline = event.target.style.outline;
            event.target.style.background = `rgba(${selectionColorRGB}, 0.25)`;
            event.target.style.outline = `2px solid rgb(${selectionColorRGB})`;
        } catch (error) {
            console.log('We catched an error', error);
        }
    }
    hoveredElement = event.target;
});

// listen for un-hovering elements
// used for resetting the style properties from the hovering over an element
document.addEventListener('mouseout', event => {
    if (maximizerSelectionActive !== true) return;
    event.stopPropagation();
    event.preventDefault();
    resetElementStyle(hoveredElement)
});

// listen for clicking an element
// used for actually triggering the maximization of an element
document.addEventListener('click', event => {
    if (maximizerSelectionActive === true) {
        event.stopPropagation();
        event.preventDefault();
        event.target.requestFullscreen(event);
        resetElementStyle(hoveredElement);
        maximizerSelectionActive = false;
    }
});

// make it possible to exit the maximization by pressing escape
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
        resetElementStyle(hoveredElement);
        maximizerSelectionActive = false;
    }
});

// reset an element's style after it has been hovered over for maximization selection
function resetElementStyle(element) {
    if (element?.style instanceof CSSStyleDeclaration) {
        try {
            element.style.background = savedBackground;
            element.style.outline = savedOutline;
        } catch (error) {
            console.log("We catched an error!", error);
        }
    }
}