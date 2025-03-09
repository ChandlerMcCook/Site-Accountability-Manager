export async function getLocalData(dataName) {
    const data = await chrome.storage.local.get(dataName)

    if (data[dataName] === undefined) 
        return {}

    return data[dataName]
}