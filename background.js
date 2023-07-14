// Add a context menu item on chrome startup
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
        title: chrome.i18n.getMessage('contextMenuItemTitle'),
        contexts,
    });
});

// When the maximizer context menu item is clicked, execute the maximizer on that tab
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab.url.includes('chrome://')) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: executeMaximizer
        });
    }
});

// Executes the maximizer
function executeMaximizer() {

    const selectionColorRGB = '250, 128, 114';

    const listeners = [
        ['mouseover', highlightElement, false],
        ['mouseout', unhighlightElement, false],
        ['click', maximizeElement, true],
        ['keydown', cancelSelection, true],
    ];

    // Add all the listeners to the page
    listeners.forEach(l => document.addEventListener(l[0], l[1], { once: l[2] }));

    // Saved for restoration after hovering
    let hoveredElement = null;
    let savedBackground = null;
    let savedOutline = null;



    // Different steps in the maximization process

    function highlightElement(event) {
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
        event.stopPropagation();
        event.preventDefault();
        resetElementStyle(hoveredElement)
    }
    
    function maximizeElement(event) {
        event.stopPropagation();
        event.preventDefault();
        event.target.requestFullscreen(event);
        resetElementStyle(hoveredElement);
        removeListeners();
    }
    
    function cancelSelection(event) {
        if (event.key === 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            resetElementStyle(hoveredElement);
            removeListeners();
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
}
