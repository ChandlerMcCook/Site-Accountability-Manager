// this file makes sure that the active tab 

let activeDomain = null
let domainStartTime = null

// get the domain name of a website
function GetDomain(url) {
    try {
        return new URL(url).hostname
    } catch (e) {
        return null
    }
}

function StartTracking(tab) {
    const sites = Object.keys(chrome.storage.local.get("trackedSites"))
    let domain = GetDomain(tab.url)
    if (!domain || domain === activeDomain) return
    
    StopTracking()
    
    if (!sites.includes(domain)) return

    activeDomain = domain
    domainStartTime = Date.now()
}

StopTracking = () => {
    if (activeDomain !== null && domainStartTime !== null) {
        const time = Date.now() - domainStartTime
        const trackedSites = chrome.storage.local.get("trackedSites")
        const previousTime = sites[activeDomain]
        trackedSites = { ...sites, [activeDomain]: previousTime + time }
        chrome.storage.local.set(trackedSites)

        console.log(`${activeDomain} time spent: ${previousTime + time}`)
    }
    
    activeDomain = null
    domainStartTime = null
}

// track switching tabs
chrome.tabs.onActivated.addListener((activeTab) => {
    chrome.tabs.get(activeTab.tabId, (tab) => {
        if (chrome.runtime.lastError || !tab) return;
        StartTracking(tab);
    });
})

// track tab URL updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        StartTracking(tab)
    }
})

// track if different window is chosen
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        StopTracking()
    } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) StartTracking(tabs[0])
        })
    }
})