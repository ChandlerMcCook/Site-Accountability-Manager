// this file logs the name and start time of a tab, and after the user navigates to a different tab,
// adds the total amount of time spent on the tab if it's one that's being tracked

import { GetLocalData } from "./helper-functions/get-local-data"


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
    console.log(`updated URL to ${tab.url}`)

    StartTracking(tab)
})

// track if different window is chosen
chrome.windows.onFocusChanged.addListener((windowId) => {
    console.log("changed window")
    
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        StopTracking("Window changed")
    } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) StartTracking(tabs[0])
        })
    }
})


// get the domain name of a website
function GetDomain(url) {
    try {
        return new URL(url).hostname
    } catch (e) {
        return null
    }
}

// Whenever a new tab comes into focus, start tracking it
async function StartTracking(tab) {
    console.log("STARTED TRACKING")

    let sites = await GetLocalData("trackedSites") || {}
    let blockedSites = await GetLocalData("blockedSites") || []

    let domain = GetDomain(tab.url)
    
    if (blockedSites.includes(domain)) {
        const blockUrl = chrome.runtime.getURL("extension-pages/blocked-site/blocked-site.html")
        const tab = await chrome.tabs.query({ currentWindow: true, active: true })
        await chrome.tabs.update(tab[0].id, { url: blockUrl })
        return
    }

    let activeDomain = await GetLocalData("activeDomain") || null

    if (!domain || domain === activeDomain) return
    
    await StopTracking("StartTracking")
    
    if (!domain in sites) return

    await chrome.storage.local.set({ activeDomain: domain })
    await chrome.storage.local.set({ domainStartTime: Date.now() }) 
}

// Whenever a new tab comes into focus, stop tracking the last one and store the time spent on the last one
async function StopTracking(source) {
    console.log(`STOPPING TRACKING FROM ${source}`)

    let activeDomain = await GetLocalData("activeDomain") || null
    let domainStartTime = await GetLocalData("domainStartTime") || null

    console.log(`STOP FUNCTION, ACTIVE DOMAIN: ${JSON.stringify(activeDomain)}, DOMAIN START TIME: ${JSON.stringify(domainStartTime)}`)

    if (activeDomain !== null && domainStartTime !== null) {
        const time = Date.now() - domainStartTime

        console.log(`TIME TO ADD: ${time}`)

        let trackedSites = await GetLocalData("trackedSites") || {}
        
        if (trackedSites[activeDomain] !== undefined) {
            trackedSites[activeDomain] += time
            chrome.storage.local.set({ trackedSites: trackedSites })
    
            console.log(`${activeDomain} time spent: ${trackedSites[activeDomain] + time}`)
        }
    }
    
    chrome.storage.local.set({ activeDomain: null })
    chrome.storage.local.set({ domainStartTime: null })
}

