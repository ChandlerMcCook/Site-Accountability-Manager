import { getLocalData } from "../helper-functions/getLocalData"
import { getHostName } from "../helper-functions/getHostName"
import { RefreshTable } from "./totalPopup"
import { storeBlocked, removeStoredBlocked } from "../helper-functions/storeRemoveBlocked"
import { launchBlockAccountability } from "../helper-functions/launchBlockAccountability"

export async function RefreshBlocked() {
    const blockTable = document.getElementById("blockTable")
    while (blockTable.firstChild) {
        blockTable.removeChild(blockTable.lastChild)
    }

    const blockedSites = await getLocalData("blockedSites")
    const blocked = Object.entries(blockedSites)
    
    if (blocked.length === 0) {
        const noWebsitesText = document.createTextNode("No websites currently blocked :)")
        blockTable.appendChild(noWebsitesText)
        blockTable.style.display = "flex"
    } else {
        blockTable.style.display = "block"
    }

    blocked.forEach(async website => {
        // create img element
        const domainImg = document.createElement("img")
        domainImg.src = `https://www.google.com/s2/favicons?sz=24&domain_url=${website[0]}`
        const imageNode = document.createElement("td")
        imageNode.appendChild(domainImg)
        imageNode.className = "tableImage"

        // create website name element
        const name = document.createTextNode(website[0])
        const nameNode = document.createElement("td")
        nameNode.appendChild(name)

        // create days since last visit element

        // create delete button element
        const deleteButton = document.createElement("button")
        deleteButton.className = "deleteButton"
        deleteButton.id = `bdb${website[0]}`
        deleteButton.addEventListener("click", async (e) => {
            const domain = e.target.getAttribute("id").slice(3)
            await launchBlockAccountability(domain)
            RefreshBlocked()
            RefreshTable()
        })
        const dbNode = document.createElement("td")
        dbNode.className = "tableButton"
        dbNode.appendChild(deleteButton)

        // create block streak element
        const streakFlameImage = document.createElement("img")
        streakFlameImage.src = "../../images/ui-images/flame.gif"
        const streakValue = Math.floor(
            (new Date() - new Date(website[1])) / (1000 * 60 * 60 * 24)
        )
        const streakNode = document.createTextNode(streakValue)
        const blockStreakNode = document.createElement("td")
        blockStreakNode.append(streakFlameImage, streakNode)
        blockStreakNode.className = "tableImage"


        // add elements to table
        const row = document.createElement("tr")
        row.append(imageNode, nameNode, blockStreakNode, dbNode)
        blockTable.appendChild(row)
    })
}

async function AddBlockedWebsite() {
    const blockInput = document.getElementById("blockInput")
    const domain = blockInput.value
    blockInput.value = ""
        
    if (domain === "") {
        alert("Please enter a value")
        return
    }

    const domainName = getHostName(domain)

    await storeBlocked(domainName)

    RefreshTable()
    RefreshBlocked()
}

export function blockPopupLogic() {
    // populate blocked table on startup
    RefreshBlocked()

    document.getElementById("addBlockedSiteButton").addEventListener("click", () => {
        AddBlockedWebsite()
    })

    document.getElementById("blockInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            AddBlockedWebsite()
        }
    })
}