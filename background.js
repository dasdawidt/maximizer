// when the maximizer context menu item is clicked,
// send a message to the current tab's content script to start maximization selection
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, "maximizerTriggered", {frameId: info.frameId});
});

// add a context menu item on chrome startup
chrome.runtime.onInstalled.addListener(function () {
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
        title: 'Maximize something...',
        contexts,
    });
});
