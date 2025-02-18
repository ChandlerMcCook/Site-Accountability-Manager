// this file logs the name and start time of a tab, and after the user navigates to a different tab,
// adds the total amount of time spent on the tab if it's one that's being tracked

import { GetLocalData } from "./helper-functions/get-local-data"

function GetDomain(url) {
    try {
        return new URL(url).hostname
    } catch (e) {
        return null
    }
}

async function TrackWebsite() {
    let trackedSites = await GetLocalData("trackedSites") || {}
    let blockedSites = await GetLocalData("blockedSites") || []

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    if (tab === undefined) return

    const domain = GetDomain(tab.url)
    console.log(`DOMAIN: ${domain}`)

    if (blockedSites.includes(domain)) {
        const blockUrl = chrome.runtime.getURL("extension-pages/blocked-site/blocked-site.html")
        await chrome.tabs.update(tab.id, { url: blockUrl })
        return
    }

    if (!(domain in trackedSites)) return

    trackedSites[domain] += 1

    chrome.storage.local.set({ trackedSites: trackedSites })
}

setInterval(TrackWebsite, 1000)