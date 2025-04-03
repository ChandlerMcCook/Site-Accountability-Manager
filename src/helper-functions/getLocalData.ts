export async function getLocalData(dataName : string) {
    const data = await chrome.storage.local.get(dataName)

    if (data[dataName] === undefined) {
        if (dataName === "trackedSites" || dataName === "blockedSites" || dataName === "whitelistPresets") {
            return {}
        }
        return undefined
    } 

    return data[dataName]
}