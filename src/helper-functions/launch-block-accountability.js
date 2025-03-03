import { GetLocalData } from "./get-local-data"
import { RemoveStoredBlocked } from "./store-remove-blocked"

export async function LaunchBlockAccountability(domain) {
    const acc = await GetLocalData("accountability")
    if (acc === "none") {
        await RemoveStoredBlocked(domain)
        return
    }
    const runtimeURL = chrome.runtime.getURL("extension-pages/block-accountability/block-accountability.html")+`?domain=${domain}`
    chrome.tabs.create({ url: runtimeURL }) 
}