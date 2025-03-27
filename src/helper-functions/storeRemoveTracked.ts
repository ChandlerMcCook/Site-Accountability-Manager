import { getLocalData } from "./getLocalData"
import { customAlert } from "./customAlert"

export async function StoreTracked(name : string) {
    const trackedSites = await getLocalData("trackedSites")
    if (name in trackedSites) {
        customAlert("Website is already tracked")
        return
    }
    trackedSites[name] = {
        days: [],
        overall: 0
    }
    chrome.storage.local.set({ trackedSites: trackedSites })
    return
}

export async function RemoveStoredTracked(name : string) {
    let trackedSites = await getLocalData("trackedSites")
    delete trackedSites[name]
    chrome.storage.local.set({ trackedSites: trackedSites })
}