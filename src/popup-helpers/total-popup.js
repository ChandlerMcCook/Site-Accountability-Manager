export function totalPopupLogic() {
    chrome.storage.local.get("trackedSites", async (data) => {
        const tracker = data.trackedSites || {}
        const timeList = document.getElementById("timeList")
        let blocked = await chrome.storage.local.get("blockedSites")
        if (blocked.blockedSites) {
            blocked = blocked.blockedSites
        } else {
            blocked = []
        }

        Object.entries(tracker).forEach(([domain, time]) => {
            const nonMilli = time / 1000
            const hours = nonMilli / 3600
            const minutes = Math.floor(nonMilli / 60) % 60
            const seconds = Math.floor(nonMilli % 60)

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
                    `${minutes} minutes, ${seconds} seconds`

            )
            const domainNode = document.createElement("td")
            const timeNode = document.createElement("td")
            domainNode.appendChild(domainText)
            timeNode.appendChild(timeText)

            
            const blockButton = document.createElement("button")
            blockButton.className = "blockButton"
            blockButton.id = `bb${domain}`
            console.log(blocked)
            if (blocked.includes(domain)) {
                blockButton.style.backgroundImage = "url(\"images/cancel.png\")"
            }
            blockButton.addEventListener("click", async (e) => {
                const siteClicked = e.target.getAttribute("id").slice(2)

                let blockedSites = await chrome.storage.local.get("blockedSites")

                if (blockedSites.blockedSites) {
                    blockedSites = blockedSites.blockedSites
                } else {
                    blockedSites = []
                }

                if (blockedSites.includes(siteClicked)) {
                    e.target.style.backgroundImage = "url(\"images/cancel.png\")"
                    blockedSites = blockedSites.filter(s => s !== siteClicked)
                } else {
                    e.target.style.backgroundImage = "url(\"images/light-cancel.png\")"
                    blockedSites.push(siteClicked)
                }

                chrome.storage.local.set({ blockedSites: blockedSites })
            })
            const bbNode = document.createElement("td")
            bbNode.className = "tableButton"
            bbNode.appendChild(blockButton)

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
            row.append(imageNode, domainNode, timeNode, bbNode, dbNode)
            timeList.appendChild(row)
        })
    })

    document.getElementById("newForm").addEventListener("submit", async () => {
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
    })
}
