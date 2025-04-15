import { getLocalData } from "../helper-functions/getLocalData"
import { getHostName } from "../helper-functions/getHostName"
import { RefreshBlocked } from "./blockPopup"
import { StoreTracked, RemoveStoredTracked } from "../helper-functions/storeRemoveTracked"
import { storeBlocked, removeStoredBlocked } from "../helper-functions/storeRemoveBlocked"
import { launchBlockAccountability } from "../helper-functions/launchBlockAccountability"
import { TrackedWebsite, TrackedWebsiteMap } from "../interfaces/trackedWebsite"
import { customAlert } from "../helper-functions/customAlert"

export async function RefreshTable() {
    const timeList = document.getElementById("timeList")
    while (timeList.firstChild) {
        timeList.removeChild(timeList.lastChild)
    }

    const tracker = await getLocalData("trackedSites") as TrackedWebsiteMap
    const blocked = Object.keys(await getLocalData("blockedSites"))

    let trackedWebsiteEntries = Object.entries(tracker)

    if (trackedWebsiteEntries.length === 0) {
        const noWebsitesText = document.createTextNode("No websites currently tracked :)")
        timeList.appendChild(noWebsitesText)
        timeList.style.display = "flex"
        return
    } else {
        timeList.style.display = "table"
    }

    // sort total or daily and by usage time
    const mode = await getLocalData("totalOrDaily")
    const today = new Date().toLocaleDateString()
    let timePerWebsite : [string, number][]
    if (mode === "total") {
        timePerWebsite = trackedWebsiteEntries.map((entry : [string, TrackedWebsite]) => [entry[0], entry[1].overall])
    } else {
        timePerWebsite = trackedWebsiteEntries.map(entry => {
            let timeForEntry = entry[1].days.find(day => day.date === today)?.time
            timeForEntry = (timeForEntry !== undefined) ? timeForEntry : 0
            return [entry[0], timeForEntry]
        })
    }
    timePerWebsite.sort((a, b) => b[1] - a[1])

    // build the table of tracked websites
    timePerWebsite.forEach(async ([domain, time]) => {
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
        const domainText = document.createTextNode(`${domain}`)
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
            const target = e.target as HTMLButtonElement
            const siteClicked = target.getAttribute("id").slice(2)

            let blockedSites = Object.keys(await getLocalData("blockedSites"))

            if (blockedSites.includes(siteClicked)) {
                await launchBlockAccountability(siteClicked)
            } else {
                await storeBlocked(siteClicked)
            }

            await RefreshTable()
            RefreshBlocked()
        })
        const bbNode = document.createElement("td")
        bbNode.className = "tableButton"
        bbNode.appendChild(blockButton)

        // add delete button
        const deleteButton = document.createElement("button")
        deleteButton.className = "deleteButton"
        deleteButton.id = `db${domain}`
        deleteButton.addEventListener("click", async (e) => {
            const target = e.target as HTMLButtonElement
            await RemoveStoredTracked(target.getAttribute("id").slice(2))
            await RefreshTable()
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

async function AddTrackedWebsite() {
    const newDomain = document.getElementById("newDomain") as HTMLInputElement
    const domain = newDomain.value
    newDomain.value = ""
    
    if (domain === "") {
        customAlert("Please enter a value")
        return
    }
    
    const domainName = getHostName(domain)
    
    await StoreTracked(domainName)

    await RefreshTable()
}

export async function totalPopupLogic() {
    // populate tracked table on startup
    await RefreshTable()
    

    // ADD WEBSITE BUTTON
    document.getElementById("addSiteButton").addEventListener("click", () => {
        AddTrackedWebsite()
    })

    document.getElementById("newDomain").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            AddTrackedWebsite()
        }
    })
}
