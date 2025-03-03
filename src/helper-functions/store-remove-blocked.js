import { GetLocalData } from "./get-local-data"

export async function StoreBlocked(name) {
    const blockedSites = await GetLocalData("blockedSites")
    if (name in blockedSites) {
        alert("Website is already blocked")
        return false 
    }
    blockedSites[name] = new Date().toLocaleDateString()
    chrome.storage.local.set({ blockedSites: blockedSites })
    return true
}

export async function RemoveStoredBlocked(name) {
    let blockedSites = await GetLocalData("blockedSites")
    delete blockedSites[name]
    chrome.storage.local.set({ blockedSites: blockedSites })
}