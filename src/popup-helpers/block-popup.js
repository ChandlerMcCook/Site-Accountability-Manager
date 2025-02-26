import { GetLocalData } from "../helper-functions/get-local-data"

export async function BlockPopupLogic() {
        const blockTable = document.getElementById("blockTable")
        const blocked = await GetLocalData("blockedSites")

        console.log(blocked)

        if (blocked.length === 0) {
            const noWebsitesText = document.createTextNode("No websites currently blocked :)")
            blockTable.appendChild(noWebsitesText)
            blockTable.style.display = "flex"
        }

        blocked.forEach(website => {
            console.log(website)

            const name = document.createTextNode(website)
            const nameNode = document.createElement("td")
            nameNode.appendChild(name)

            const deleteButton = document.createElement("button")
            deleteButton.className = "deleteButton"
            deleteButton.id = `bdb${website}`
            deleteButton.addEventListener("click", async (e) => {
                let blockedSites = await GetLocalData("blockedSites")
    
                blockedSites = blockedSites.filter(s => s !== e.target.getAttribute("id").slice(3))
    
                chrome.storage.local.set({ blockedSites: blockedSites })
                document.location.reload(true)
            })
            const dbNode = document.createElement("td")
            dbNode.className = "tableButton"
            dbNode.appendChild(deleteButton)

            const row = document.createElement("tr")
            row.append(nameNode, dbNode)
            blockTable.appendChild(row)
        })
}