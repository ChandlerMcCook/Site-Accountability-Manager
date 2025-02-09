document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("trackedSites", (data) => {
        const tracker = data.trackedSites || {}
        const timeList = document.getElementById("timeList")

        Object.entries(tracker).forEach(([domain, time], index) => {
            const nonMilli = time / 1000
            const hours = nonMilli / 3600
            const minutes = Math.floor(nonMilli / 60) % 60
            const seconds = nonMilli % 60

            // create img element
            const domainImg = document.createElement("img")
            domainImg.src = `https://www.google.com/s2/favicons?sz=24&domain_url=${domain}`
            const imageNode = document.createElement("td")
            imageNode.appendChild(domainImg)
            imageNode.className = "tableImage"
            
            // create text elements 
            let websiteName = domain.slice(4, -4)
            websiteName = websiteName.charAt(0).toUpperCase() + websiteName.slice(1)
            const domainText = document.createTextNode(`${websiteName}`)
            const timeText = document.createTextNode(
                (hours > 1) ?
                    `${hours.toFixed(2)} hours`
                :
                    `${minutes} minutes, ${seconds.toFixed(2)} seconds`

            )
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
            deleteButton.id = `db${domain}`
            deleteButton.addEventListener("click", async (e) => {
                let trackedSites = await chrome.storage.local.get("trackedSites")

                if (trackedSites.trackedSites !== undefined) {
                    trackedSites = trackedSites.trackedSites
                }

                delete trackedSites[e.target.getAttribute("id").slice(2)]

                chrome.storage.local.set({ trackedSites: trackedSites })
                console.log(`DELETE BUTTON CLICKED ${e.target.getAttribute("id").slice(2)}`)
                
                document.location.reload(true)
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

    document.getElementById("checkMoreButton").addEventListener("click", () => {
        chrome.tabs.create({ url: "https://us-tuna-sounds-images.voicemod.net/e2fe1cea-9e94-41da-b9bf-daff2d703460-1678634997912.png" })
        console.log("BRUHHHHHH")
    })
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
    chrome.storage.local.set({ trackedSites: trackedSites })
}