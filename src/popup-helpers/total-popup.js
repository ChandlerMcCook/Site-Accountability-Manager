import { GetLocalData } from "../helper-functions/get-local-data"
import { GetHostName } from "../helper-functions/get-host-name"

export async function RefreshTable() {
    const timeList = document.getElementById("timeList")
    while (timeList.firstChild) {
        timeList.removeChild(timeList.lastChild)
    }

    const tracker = await GetLocalData("trackedSites")
    const blocked = await GetLocalData("blockedSites")

    const domainsOfSites = Object.entries(tracker)

    if (domainsOfSites.length === 0) {
        const noWebsitesText = document.createTextNode("No websites currently tracked :)")
        timeList.appendChild(noWebsitesText)
        timeList.style.display = "flex"
    }

    // build the table of tracked websites
    domainsOfSites.forEach(async ([domain, domainTimeData]) => {
        const mode = await GetLocalData("totalOrDaily")

        let time
        if (mode === "total") {
            time = domainTimeData.overall
        } else {
            const today = new Date().toLocaleDateString()
            time = domainTimeData.days.find(day => day.date === today)
        }

        const hours = time / 3600
        const minutes = Math.floor(time / 60) % 60
        const seconds = time % 60

        // create img element
        const domainImg = document.createElement("img")
        domainImg.src = `https://www.google.com/s2/favicons?sz=24&domain_url=${domain}`
        const imageNode = document.createElement("td")
        imageNode.appendChild(domainImg)
        imageNode.className = "tableImage"
        
        // create text elements 
        let websiteName = domain.charAt(0).toUpperCase() + domain.slice(1)
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

        // block website button logic
        const blockButton = document.createElement("button")
        blockButton.className = "blockButton"
        blockButton.id = `bb${domain}`
        // change the button from greyed out to highlighted if blocked
        if (blocked.includes(domain)) {
            blockButton.style.backgroundImage = "url(\"images/ui-images/cancel.png\")"
        }
        blockButton.addEventListener("click", async (e) => {
            const siteClicked = e.target.getAttribute("id").slice(2)

            let blockedSites = await GetLocalData("blockedSites")

            if (blockedSites.includes(siteClicked)) {
                blockedSites = blockedSites.filter(s => s !== siteClicked)
            } else {
                blockedSites.push(siteClicked)
            }

            chrome.storage.local.set({ blockedSites: blockedSites })
            document.location.reload(true)
        })
        const bbNode = document.createElement("td")
        bbNode.className = "tableButton"
        bbNode.appendChild(blockButton)

        // add delete button
        const deleteButton = document.createElement("button")
        deleteButton.className = "deleteButton"
        deleteButton.id = `db${domain}`
        deleteButton.addEventListener("click", async (e) => {
            let trackedSites = await GetLocalData("trackedSites")

            delete trackedSites[e.target.getAttribute("id").slice(2)]

            chrome.storage.local.set({ trackedSites: trackedSites })
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
}

export async function TotalPopupLogic() {
    // TIME LIST 
    RefreshTable()
    

    // ADD WEBSITE BUTTON
    document.getElementById("newForm").addEventListener("submit", async () => {
        const domain = document.getElementById("newDomain").value

        const domainName = GetHostName(domain)
        console.log(domainName)

        const trackedSites = await GetLocalData("trackedSites")
    
        if (domainName in trackedSites) {
            alert("Website is already tracked")
            console.log("site already added")
            return
        }

        trackedSites[domainName] = {
            days: [],
            overall: 0
        }
        chrome.storage.local.set({ trackedSites: trackedSites })
    })
}
