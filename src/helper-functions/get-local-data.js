export async function GetLocalData(dataName) {
    const data = await chrome.storage.local.get(dataName)

    if (data[dataName] === undefined) 
        return undefined

    return data[dataName]
}