import { getLocalData } from "./getLocalData"
import { removeStoredBlocked } from "./storeRemoveBlocked"

export async function launchBlockAccountability(domain) {
    const acc = await getLocalData("accountability")
    if (acc === "none") {
        await removeStoredBlocked(domain)
        return
    }
    const runtimeURL = chrome.runtime.getURL("extension-pages/block-accountability/block-accountability.html")+`?domain=${domain}`
    chrome.tabs.create({ url: runtimeURL }) 
}