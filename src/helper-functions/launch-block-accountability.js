import { GetLocalData } from "./get-local-data"

export async function LaunchBlockAccountability() {
    const acc = await GetLocalData("accoutability")
    if (acc === "none") return
    chrome.tabs.create({ url: chrome.runtime.getURL("extension-pages/block-accountability/block-accountability.html") })
}