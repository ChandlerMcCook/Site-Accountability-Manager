export async function GetLocalData(dataName) {
    const data = await chrome.storage.local.get(dataName)

    if (data[dataName] === undefined) 
        if (dataName === "trackedSites")
            return {}
        else if (dataName === "blockedSites") 
            return []
        else 
            return undefined

    return data[dataName]
}