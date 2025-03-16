import { getLocalData } from "../../../helper-functions/getLocalData";
import { WhitelistPresets } from "../../../interfaces/whitelistPreset";
import { isEmptyObject } from "../../../helper-functions/isEmptyObject";

async function refreshWhitelistTable(tableName : string) {
    const whitelistPresets = await getLocalData("whitelistPresets") as WhitelistPresets
    const presetDropdown = document.getElementById("presetDropdown") as HTMLSelectElement
    const table = document.getElementById(tableName)

    while (table.firstChild) {
        table.removeChild(table.lastChild)
    }

    if (isEmptyObject(whitelistPresets)) {
        return
    }

    const whitelistedSites = Object.entries(whitelistPresets).find(wl => wl[0] === presetDropdown.value)[1]
    whitelistedSites.forEach(site => {
        const siteText = document.createTextNode(site)
        const textNode = document.createElement("td")
        textNode.append(siteText)
        const db = document.createElement("button")
        db.className = "removeWebsiteFromWhitelist"
        db.id = `db${site}`
        db.innerHTML = "&times;"
        db.addEventListener("click", async (e) => {
            const target = e.target as HTMLButtonElement
            const websiteToRemove = target.getAttribute("id").slice(2)
            let presets = await getLocalData("whitelistPresets")
            const curPreset = await getLocalData("curWhitelistPreset")
            presets[curPreset].filter((site : string) => site !== websiteToRemove)
            chrome.storage.local.set({ whitelistPresets: presets })
        })
        const dbNode = document.createElement("td")
        dbNode.append(db)
        const tr = document.createElement("tr")
        tr.append(textNode, dbNode)
        table.append(tr)
    })
}

async function handlePresetDropdown() {
    // preset chooser logic
    const curPreset : string | {} = await getLocalData("curWhitelistPreset")
    const whitelistPresets = await getLocalData("whitelistPresets") as WhitelistPresets
    console.log(JSON.stringify(whitelistPresets))
    if (!whitelistPresets) console.log("BRUH")
    const presetDropdown = document.getElementById("presetDropdown") as HTMLSelectElement
    const presetNames = Object.keys(whitelistPresets)

    presetNames.forEach(name => {
        const option = document.createElement("option")
        option.value = name
        option.textContent = name
        presetDropdown.add(option)
    })
    if (typeof(curPreset) === "string") {
        presetDropdown.value = curPreset
    }

    presetDropdown.addEventListener("change", async (e) => {
        const target = e.target as HTMLSelectElement
        chrome.storage.local.set({ curWhitelistPreset: target.value })
        await refreshWhitelistTable("editWhitelistTable")
    })
}

function handleCreateModal() {
    const whitelistNameInput = document.getElementById("whitelistNameInput") as HTMLInputElement
    const addToPresetInput = document.getElementById("addToPresetInput") as HTMLInputElement
    const submitCreatePreset = document.getElementById("submitCreatePreset") as HTMLButtonElement
    const createWhitelistTable = document.getElementById("createWhitelistTable") as HTMLTableElement
}


export async function whitelistLogic() {
    // whitelist checkbox logic
    const isWhitelistOn = await getLocalData("whitelist")
    const whitelistCheckbox = document.getElementById("whitelistCheckbox") as HTMLInputElement
    const whitelistContainer = document.getElementById("whitelistContainer")
    if (isWhitelistOn === false) {
        whitelistCheckbox.checked = false
    } else {
        whitelistCheckbox.checked = true
        whitelistContainer.style.display = "inline"
    } 
    whitelistCheckbox.addEventListener("change", () => {
        if (whitelistCheckbox.checked) {
            chrome.storage.local.set({ whitelist: true })
            whitelistContainer.style.display = "inline"
        } else {
            chrome.storage.local.set({ whitelist: false })
            whitelistContainer.style.display = "none"
        }
    })

    handlePresetDropdown()
    handleCreateModal()
}