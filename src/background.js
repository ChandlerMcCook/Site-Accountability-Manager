// this file logs the name and start time of a tab, and after the user navigates to a different tab,
// adds the total amount of time spent on the tab if it's one that's being tracked

import { GetLocalData } from "./helper-functions/get-local-data"
import { GetHostName } from "./helper-functions/get-host-name"

async function TrackWebsite() {
    let trackedSites = await GetLocalData("trackedSites")
    let blockedSites = await GetLocalData("blockedSites")

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    if (tab === undefined) return

    const domain = GetHostName(tab.url)

    if (domain in blockedSites) {
        const blockUrl = chrome.runtime.getURL("extension-pages/blocked-site/blocked-site.html")
        await chrome.tabs.update(tab.id, { url: blockUrl })
        return
    }

    if (!(domain in trackedSites)) return

    const today = new Date().toLocaleDateString()
    if (trackedSites[domain] === undefined) {
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
    } else if (!trackedSites[domain].days.some(day => day.date === today)) {
        trackedSites[domain].days.push({ date: today, time: 1 })
        trackedSites[domain].overall += 1
    } else {
        trackedSites[domain].days.find(day => day.date === today).time += 1
        trackedSites[domain].overall += 1
    }

    chrome.storage.local.set({ trackedSites: trackedSites })
}

setInterval(TrackWebsite, 1000)