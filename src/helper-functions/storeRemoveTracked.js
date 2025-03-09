import { getLocalData } from "./getLocalData"

export async function StoreTracked(name) {
    const trackedSites = await getLocalData("trackedSites")
    if (name in trackedSites) {
        alert("Website is already tracked")
        return
    }
    trackedSites[name] = {
        days: [],
        overall: 0
    }
    chrome.storage.local.set({ trackedSites: trackedSites })
    return
}

export async function RemoveStoredTracked(name) {
    let trackedSites = await getLocalData("trackedSites")
    delete trackedSites[name]
    chrome.storage.local.set({ trackedSites: trackedSites })
}