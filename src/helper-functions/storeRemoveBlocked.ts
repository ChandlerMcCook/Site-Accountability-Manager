import { getLocalData } from "./getLocalData"

export async function storeBlocked(name : string) {
    const blockedSites = await getLocalData("blockedSites")
    if (name in blockedSites) {
        alert("Website is already blocked")
        return false 
    }
    blockedSites[name] = new Date().toLocaleDateString()
    chrome.storage.local.set({ blockedSites: blockedSites })
    return true
}

export async function removeStoredBlocked(name : string) {
    let blockedSites = await getLocalData("blockedSites")
    delete blockedSites[name]
    chrome.storage.local.set({ blockedSites: blockedSites })
}