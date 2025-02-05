document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("trackedSites", (data) => {
        const tracker = data.trackedSites || {}
        const timeList = document.getElementById("timeList")

        timeList.innerHTML = Object.entries(tracker)
            .map(([domain, time]) => `${domain}: ${(time / 1000).toFixed(2)} seconds`)
            .join("<br>")
    })
    document.getElementById("newForm").addEventListener("submit", AddDomain)
})


async function AddDomain() {
    const domain = document.getElementById("newDomain").value
    console.log(domain)

    let trackedSites = await chrome.storage.local.get("trackedSites")

    console.log(JSON.stringify(trackedSites))
    if (trackedSites.trackedSites !== undefined) {
        trackedSites = trackedSites.trackedSites
    }

    if (domain in trackedSites) {
        console.log("site already added")
        return
    }
    trackedSites[domain] = 0
    console.log(JSON.stringify(trackedSites))
    chrome.storage.local.set({trackedSites: trackedSites})
}