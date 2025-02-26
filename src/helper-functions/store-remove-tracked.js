import { GetLocalData } from "./get-local-data"

export async function StoreTracked(name) {
    const trackedSites = await GetLocalData("trackedSites")
    if (name in trackedSites) {
        alert("Website is already tracked")
        return false
    }
    trackedSites[name] = {
        days: [],
        overall: 0
    }
    chrome.storage.local.set({ trackedSites: trackedSites })
    return true
}

export async function RemoveStoredTracked(name) {
    let trackedSites = await GetLocalData("trackedSites")
    delete trackedSites[name]
    chrome.storage.local.set({ trackedSites: trackedSites })
}