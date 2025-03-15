import { getLocalData } from "../helper-functions/getLocalData"
import { getHostName } from "../helper-functions/getHostName"
import { RefreshTable } from "./totalPopup"
import { storeBlocked, changeBlockLimit } from "../helper-functions/storeRemoveBlocked"
import { launchBlockAccountability } from "../helper-functions/launchBlockAccountability"
import { BlockedWesbite, BlockedWebsiteMap } from "../interfaces/blockedWebsite"

export async function RefreshBlocked() {
    const blockTable = document.getElementById("blockTable")
    while (blockTable.firstChild) {
        blockTable.removeChild(blockTable.lastChild)
    }

    const blockedSites = await getLocalData("blockedSites") as BlockedWebsiteMap
    const blocked = Object.entries(blockedSites)
    
    if (blocked.length === 0) {
        const noWebsitesText = document.createTextNode("No websites currently blocked :)")
        blockTable.appendChild(noWebsitesText)
        blockTable.style.display = "flex"
    } else {
        blockTable.style.display = "block"
    }

    blocked.forEach(async website => {
        const websiteName = website[0]
        const websiteData = website[1]

        // create img element
        const domainImg = document.createElement("img")
        domainImg.src = `https://www.google.com/s2/favicons?sz=24&domain_url=${websiteName}`
        const imageNode = document.createElement("td")
        imageNode.appendChild(domainImg)
        imageNode.className = "tableImage"

        // create website name element
        const name = document.createTextNode(websiteName)
        const nameNode = document.createElement("td")
        nameNode.appendChild(name)

        // create block streak element
        const streakFlameImage = document.createElement("img")
        streakFlameImage.src = "../../images/ui-images/flame.gif"
        const streakValue = Math.floor(
            (new Date().getTime() - new Date(websiteData.startDate as string).getTime()) / (1000 * 60 * 60 * 24)
        )
        const streakNode = document.createTextNode(String(streakValue))
        const blockStreakNode = document.createElement("td")
        blockStreakNode.append(streakFlameImage, streakNode)
        blockStreakNode.className = "tableImage"

        // create timer dropdown
        const timerDropdown = document.createElement("select")
        timerDropdown.className = "timerDropdown"
        timerDropdown.id = `timeDrop${websiteName}`
        const topRange = 14400 // 4 * 60 * 60
        const step = 300 // 5 * 60
        for (let i=0; i<=topRange; i+=step) {
            const option = document.createElement("option")
            option.className = "timeOption"
            option.value = `${i}`
            const hrAmount = Math.floor(i / 3600)
            const minAmount = (i-3600*hrAmount) / 60
            option.textContent = (hrAmount >= 1) 
                ? 
                    (minAmount >= 1) ? `${hrAmount} hr ${(i-3600*hrAmount) / 60} min` : `${hrAmount} hr`
                :
                    `${i/60} min`
            timerDropdown.add(option)
        }
        timerDropdown.value = `${websiteData.timeLimit.limit}`
        timerDropdown.addEventListener("change", async (e) => {
            const target = e.target as HTMLSelectElement
            const name = target.getAttribute("id").slice(8)
            const limit = Number(target.value)
            await changeBlockLimit(name, limit)
        })

        // create delete button element
        const deleteButton = document.createElement("button")
        deleteButton.className = "deleteButton"
        deleteButton.id = `bdb${websiteName}`
        deleteButton.addEventListener("click", async (e) => {
            const targetButton = e.target as HTMLButtonElement
            const domain = targetButton.getAttribute("id").slice(3)
            await launchBlockAccountability(domain)
            RefreshBlocked()
            RefreshTable()
        })
        const dbNode = document.createElement("td")
        dbNode.className = "tableButton"
        dbNode.appendChild(deleteButton)

        // add elements to table
        const row = document.createElement("tr")
        row.append(imageNode, nameNode, blockStreakNode, timerDropdown, dbNode)
        blockTable.appendChild(row)
    })
}

async function AddBlockedWebsite() {
    const blockInput = document.getElementById("blockInput") as HTMLInputElement
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