// this file logs the name and start time of a tab, and after the user navigates to a different tab,
// adds the total amount of time spent on the tab if it's one that's being tracked

import { getLocalData } from "./helper-functions/getLocalData"
import { getHostName } from "./helper-functions/getHostName"
import { Day, TrackedWebsite, TrackedWebsiteMap } from "./interfaces/trackedWebsite"

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === "install") {
        chrome.storage.local.set({ accountability: "none" })
        chrome.storage.local.set({ theme: "green" })
        chrome.storage.local.set({ totalOrDaily: "total" })
        chrome.storage.local.set({ whitelist: false })
    }
})

async function TrackWebsite() {
    let trackedSites : TrackedWebsiteMap = await getLocalData("trackedSites") as TrackedWebsiteMap
    let blockedSites : Record<string, string> = await getLocalData("blockedSites")

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    if (!tab || !tab.url) return

    const domain = getHostName(tab.url)

    if (domain in blockedSites) {
        const blockUrl = chrome.runtime.getURL("pages/blockedSite/blockedSite.html")
        await chrome.tabs.update(tab.id, { url: blockUrl })
        return
    }

    if (!(domain in trackedSites)) return

    const today = new Date().toLocaleDateString()
    if (!trackedSites[domain]) {
        const template = {
            days: [
                {
                    date: today,
                    time: 1
                }
            ],
            overall: 1
        }
        trackedSites[domain] = template
    } else if (!trackedSites[domain].days.some((day : Day) => day.date === today)) {
        trackedSites[domain].days.push({ date: today, time: 1 })
        trackedSites[domain].overall += 1
    } else {
        trackedSites[domain].days.find((day : Day) => day.date === today).time += 1
        trackedSites[domain].overall += 1
    }

    chrome.storage.local.set({ trackedSites: trackedSites })
}

setInterval(TrackWebsite, 1000)