import { GetLocalData } from "../helper-functions/get-local-data"
import { GetHostName } from "../helper-functions/get-host-name"
import { RefreshTable } from "./total-popup"
import { StoreBlocked, RemoveStoredBlocked } from "../helper-functions/store-remove-blocked"

export async function RefreshBlocked() {
    const blockTable = document.getElementById("blockTable")
    while (blockTable.firstChild) {
        blockTable.removeChild(blockTable.lastChild)
    }

    const blocked = await GetLocalData("blockedSites")
    console.log(`REFRESH BLOCKED`)
    console.log(blocked)

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
        domainImg.src = `https://www.google.com/s2/favicons?sz=24&domain_url=${website}`
        const imageNode = document.createElement("td")
        imageNode.appendChild(domainImg)
        imageNode.className = "tableImage"

        // create website name element
        const name = document.createTextNode(website)
        const nameNode = document.createElement("td")
        nameNode.appendChild(name)

        // create days since last visit element

        // create delete button element
        const deleteButton = document.createElement("button")
        deleteButton.className = "deleteButton"
        deleteButton.id = `bdb${website}`
        deleteButton.addEventListener("click", async (e) => {
            await RemoveStoredBlocked(e.target.getAttribute("id").slice(3))
            RefreshBlocked()
            RefreshTable()
        })
        const dbNode = document.createElement("td")
        dbNode.className = "tableButton"
        dbNode.appendChild(deleteButton)

        // add elements to table
        const row = document.createElement("tr")
        row.append(imageNode, nameNode, dbNode)
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

    const domainName = GetHostName(domain)

    await StoreBlocked(domainName)

    RefreshTable()
    RefreshBlocked()
}

export function BlockPopupLogic() {
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