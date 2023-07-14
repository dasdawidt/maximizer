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
        chrome.tabs.sendMessage(tab.id, "maximizerTriggered", { frameId: info.frameId });
        // chrome.scripting.executeScript({
        //     target: { tabId: tab.id },
        //     function: executeMaximizer
        // });
    }
});

