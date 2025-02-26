import { GetLocalData } from "./get-local-data"

export async function StoreBlocked(name) {
    const blockedSites = await GetLocalData("blockedSites")
    if (blockedSites.includes(name)) {
        alert("Website is already blocked")
        return false 
    }
    blockedSites.push(name)
    chrome.storage.local.set({ blockedSites: blockedSites })
    return true
}

export async function RemoveStoredBlocked(name) {
    let blockedSites = await GetLocalData("blockedSites")
    blockedSites = blockedSites.filter(s => s !== name)
    chrome.storage.local.set({ blockedSites: blockedSites })
}