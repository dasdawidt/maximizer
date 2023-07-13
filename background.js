// add a context menu item on chrome startup
chrome.runtime.onInstalled.addListener(() => {
    const contexts = [
        'page',
        'selection',
        'link',
        'editable',
        'image',
        'video',
        'audio'
    ];
    chrome.contextMenus.create({
        id: 'maximize',
        // todo: i18n this line
        title: 'Maximize something...',
        contexts,
    });
});

// when the maximizer context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    //chrome.tabs.sendMessage(tab.id, "maximizerTriggered", {frameId: info.frameId});
    if (!tab.url.includes('chrome://')) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: executeMaximizer
        });
    }
});

function executeMaximizer() {
    const selectionColorRGB = '250, 128, 114';

    var maximizerSelectionActive = true;

    // saved for restoration after hovering
    var hoveredElement = null;
    var savedBackground = null;
    var savedOutline = null;

    // saved for restoration after exiting fullscreen
    var savedOverflow = null;
    var savedHeight = null;

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
}