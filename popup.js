document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("trackedSites", (data) => {
        const tracker = data.trackedSites || {}
        const timeList = document.getElementById("timeList")

        Object.entries(tracker).forEach(([domain, time], index) => {
            const hours = time / 3600000
            const seconds = (time / 1000) % 60

            // create img element
            const domainImg = document.createElement("img")
            domainImg.src = `https://www.google.com/s2/favicons?sz=24&domain_url=${domain}`
            const imageNode = document.createElement("td")
            imageNode.appendChild(domainImg)
            imageNode.className = "tableImage"
            
            // create text elements 
            const domainText = document.createTextNode(`${domain}`)
            const timeText = document.createTextNode(`${hours.toFixed(2)} hours, ${seconds.toFixed(2)} seconds`)
            const domainNode = document.createElement("td")
            const timeNode = document.createElement("td")
            domainNode.appendChild(domainText)
            timeNode.appendChild(timeText)

            // add time button
            // const buttonDiv = document.createElement("div")
            // const addLabel = document.createElement("label")
            // addLabel.setAttribute("for", `ab${index}`)
            const addTimeButton = document.createElement("button")
            addTimeButton.className = "addButton"
            addTimeButton.id = `ab${index}`
            addTimeButton.addEventListener("click", async () => {
                // let trackedSites = await chrome.storage.local.get("trackedSites")

                // if (trackedSites.trackedSites !== undefined) {
                //     trackedSites = trackedSites.trackedSites
                // }

                console.log("ADD BUTTON CLICKED")
            })
            const abNode = document.createElement("td")
            abNode.className = "tableButton"
            abNode.appendChild(addTimeButton)

            // add delete button
            const deleteButton = document.createElement("button")
            deleteButton.className = "deleteButton"
            deleteButton.id = `db${index}`
            deleteButton.addEventListener("click", async () => {
                // let trackedSites = await chrome.storage.local.get("trackedSites")

                // if (trackedSites.trackedSites !== undefined) {
                //     trackedSites = trackedSites.trackedSites
                // }

                console.log("DELETE BUTTON CLICKED")
            })
            const dbNode = document.createElement("td")
            dbNode.className = "tableButton"
            dbNode.appendChild(deleteButton)

            // add to table
            const row = document.createElement("tr")
            row.append(imageNode, domainNode, timeNode, abNode, dbNode)
            timeList.appendChild(row)
        })
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