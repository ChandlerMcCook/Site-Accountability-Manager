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

async function StartTracking(tab) {
    console.log("STARTED TRACKING")

    let sites = await chrome.storage.local.get("trackedSites")

    if (sites.trackedSites !== undefined) {
        sites = sites.trackedSites
    }

    console.log(`SITES: ${JSON.stringify(sites)}`)
    let domain = GetDomain(tab.url)

    console.log(`DOMAIN OF START FUNCTION: ${domain}`)

    let activeDomain = await chrome.storage.local.get("activeDomain")
    if (activeDomain !== undefined) {
        activeDomain = activeDomain.activeDomain
    }

    if (!domain || domain === activeDomain) return
    
    StopTracking()
    
    if (!domain in sites) return

    chrome.storage.local.set({ activeDomain: domain })
    chrome.storage.local.set({ domainStartTime: Date.now() }) 
}

async function StopTracking() {
    console.log("STOPPING TRACKING")

    let activeDomain = await chrome.storage.local.get("activeDomain")
    let domainStartTime = await chrome.storage.local.get("domainStartTime")

    console.log(`STOP FUNCTION, ACTIVE DOMAIN: ${JSON.stringify(activeDomain)}, DOMAIN START TIME: ${JSON.stringify(domainStartTime)}`)

    if (activeDomain !== undefined) {
        activeDomain = activeDomain.activeDomain
    } if (domainStartTime !== undefined) {
        domainStartTime = domainStartTime.domainStartTime
    }

    if (activeDomain !== null && domainStartTime !== null) {
        const time = Date.now() - domainStartTime

        console.log(`TIME TO ADD: ${time}`)

        let trackedSites = await chrome.storage.local.get("trackedSites")

        if (trackedSites.trackedSites !== undefined) {
            trackedSites = trackedSites.trackedSites
        }
        
        if (trackedSites[activeDomain] !== undefined) {
            trackedSites[activeDomain] += time
            chrome.storage.local.set({ trackedSites: trackedSites })
    
            console.log(`${activeDomain} time spent: ${trackedSites[activeDomain] + time}`)
        }
    }
    
    chrome.storage.local.set({ activeDomain: null })
    chrome.storage.local.set({ domainStartTime: null })
}

// track switching tabs
chrome.tabs.onActivated.addListener((activeTab) => {
    console.log("switched tabs")

    chrome.tabs.get(activeTab.tabId, (tab) => {
        if (chrome.runtime.lastError || !tab) return;
        StartTracking(tab);
    });
})

// track tab URL updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("updated URL")

    if (changeInfo.url) {
        StartTracking(tab)
    }
})

// track if different window is chosen
chrome.windows.onFocusChanged.addListener((windowId) => {
    console.log("changed window")
    
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        StopTracking()
    } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) StartTracking(tabs[0])
        })
    }
})