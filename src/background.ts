// this file logs the name and start time of a tab, and after the user navigates to a different tab,
// adds the total amount of time spent on the tab if it's one that's being tracked

import { getLocalData } from "./helper-functions/getLocalData"
import { getHostName } from "./helper-functions/getHostName"
import { Day, TrackedWebsiteMap } from "./interfaces/trackedWebsite"
import { BlockedWebsiteMap } from "./interfaces/blockedWebsite"

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === "install") {
        chrome.storage.local.set({ accountability: "none" })
        chrome.storage.local.set({ theme: "cobalt" })
        chrome.storage.local.set({ totalOrDaily: "total" })
    }
})

async function TrackWebsite() {
    let trackedSites = await getLocalData("trackedSites") as TrackedWebsiteMap
    let blockedSites = await getLocalData("blockedSites") as BlockedWebsiteMap

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    if (!tab || !tab.url) return

    const domain = getHostName(tab.url)
    const today = new Date().toLocaleDateString()

    if (domain in blockedSites) {
        const timeLimit = blockedSites[domain].timeLimit
        const trackedDate = timeLimit.todayDate
        if (trackedDate !== today) {
            timeLimit.todayDate = today
            timeLimit.time = 0
        }

        timeLimit.time++
        
        chrome.storage.local.set({ blockedSites: blockedSites })

        if (timeLimit.time >= timeLimit.limit) {
            const blockUrl = chrome.runtime.getURL("pages/blocked-site/blocked-site.html")
            await chrome.tabs.update(tab.id, { url: blockUrl })
            return
        }
    }

    if (!(domain in trackedSites)) return

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