// this file makes sure that the active tab 

// let activeDomain = null
// let domainStartTime = null

// get the domain name of a website
function GetDomain(url) {
    try {
        return new URL(url).hostname
    } catch (e) {
        return null
    }
}

function StartTracking(tab) {
    console.log("STARTED TRACKING")

    const sites = chrome.storage.local.get("trackedSites")
    console.log(sites)
    let domain = GetDomain(tab.url)

    console.log(domain)

    let activeDomain = chrome.storage.local.get("activeDomain")
    if (activeDomain !== undefined) {
        activeDomain = activeDomain.activeDomain
    }

    if (!domain || domain === activeDomain) return
    
    StopTracking()
    
    if (!sites.includes(domain)) return

    chrome.storage.local.set({ activeDomain: domain })
    chrome.storage.local.set({ domainStartTime: Date.now() }) 
}

function StopTracking() {
    let activeDomain = chrome.storage.local.get("activeDomain")
    let domainStartTime = chrome.storage.local.get("domainStartTime")

    if (activeDomain !== undefined) {
        activeDomain = activeDomain.activeDomain
    } if (domainStartTime !== undefined) {
        domainStartTime = domainStartTime.domainStartTime
    }

    if (activeDomain !== null && domainStartTime !== null) {
        const time = Date.now() - domainStartTime
        let trackedSites = chrome.storage.local.get("trackedSites")

        if (trackedSites !== undefined) {
            trackedSites = trackedSites.trackedSites
        }

        trackedSites[activeDomain] += time
        chrome.storage.local.set({ trackedSites: trackedSites })

        console.log(`${activeDomain} time spent: ${previousTime + time}`)
    }
    
    chrome.storage.local.set({ activeDomain: null })
    chrome.storage.local.set({ domainStartTime: null })
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