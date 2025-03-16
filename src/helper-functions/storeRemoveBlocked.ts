import { getLocalData } from "./getLocalData"

export async function storeBlocked(name : string) {
    const blockedSites = await getLocalData("blockedSites")
    if (name in blockedSites) {
        alert("Website is already blocked")
        return false 
    }
    blockedSites[name] = {
        startDate: new Date().toLocaleDateString(),
        timeLimit: {
            todayDate: new Date().toLocaleDateString(),
            time: 0,
            limit: 0
        }
    }
    chrome.storage.local.set({ blockedSites: blockedSites })
    return true
}

export async function removeStoredBlocked(name : string) {
    let blockedSites = await getLocalData("blockedSites")
    delete blockedSites[name]
    chrome.storage.local.set({ blockedSites: blockedSites })
}

export async function changeBlockLimit(name : string, limit : number) {
    const blockedSites = await getLocalData("blockedSites")
    blockedSites[name].timeLimit.limit = limit
    chrome.storage.local.set({ blockedSites: blockedSites })
}