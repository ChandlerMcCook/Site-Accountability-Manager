import { GetLocalData } from "./get-local-data"

export async function LaunchBlockAccountability(domain) {
    const acc = await GetLocalData("accoutability")
    if (acc === "none") return
    const runtimeURL = chrome.runtime.getURL("extension-pages/block-accountability/block-accountability.html")+`?domain=${domain}`
    chrome.tabs.create({ url: runtimeURL }) 
}