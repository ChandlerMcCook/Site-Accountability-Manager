import { getLocalData } from "../../../helper-functions/getLocalData";
import { WhitelistPresets } from "../../../interfaces/whitelistPreset";
import { isEmptyObject } from "../../../helper-functions/isEmptyObject";
import { customAlert } from "../../../helper-functions/customAlert";
import { closeModal } from "./modal";


function addToTable(table : HTMLTableElement, value : string) {
    if (value === "") {
        customAlert("Please enter a value")
        return
    }

    const siteText = document.createTextNode(value)
    const textNode = document.createElement("td")
    textNode.append(siteText)
    const db = document.createElement("button")
    db.className = "removeWebsiteFromWhitelist"
    db.id = `db${value}`
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
}


async function refreshEditWhitelistTable() {
    const whitelistPresets = await getLocalData("whitelistPresets") as WhitelistPresets
    const presetDropdown = document.getElementById("presetDropdown") as HTMLSelectElement
    const table = document.getElementById("editWhitelistTable") as HTMLTableElement

    while (table.firstChild) {
        table.removeChild(table.lastChild)
    }

    if (isEmptyObject(whitelistPresets)) {
        return
    }

    const whitelistedSites = Object.entries(whitelistPresets).find(wl => wl[0] === presetDropdown.value)[1]
    whitelistedSites.forEach(site => {
        addToTable(table, site)
    })
}


async function handlePresetDropdown() {
    // preset chooser logic
    const curPreset : string | {} = await getLocalData("curWhitelistPreset")
    const whitelistPresets = await getLocalData("whitelistPresets") as WhitelistPresets
    const presetDropdown = document.getElementById("presetDropdown") as HTMLSelectElement
    const presetNames = Object.keys(whitelistPresets)

    if (presetNames.length === 0) {
        
    }

    while (presetDropdown.firstChild) {
        presetDropdown.removeChild(presetDropdown.lastChild)
    }

    const defaultOption = document.createElement("option")
    defaultOption.disabled = true
    defaultOption.selected = true
    defaultOption.textContent = "Select a Preset"
    presetDropdown.add(defaultOption)

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
        await refreshEditWhitelistTable()
    })
}


function handleCreateModal() {
    const whitelistNameInput = document.getElementById("whitelistNameInput") as HTMLInputElement
    const addToPresetInput = document.getElementById("createAddToWhitelistInput") as HTMLInputElement
    const submitCreatePreset = document.getElementById("submitCreatePreset") as HTMLButtonElement
    const createWhitelistTable = document.getElementById("createWhitelistTable") as HTMLTableElement
    const addWhitelistButton = document.getElementById("createAddToWhitelistButton") as HTMLButtonElement

    addToPresetInput.addEventListener("keydown", (e) => {
        const target = e.target as HTMLInputElement
        if (e.key === "Enter") {
            addToTable(createWhitelistTable, target.value)
            target.value = ""
        }
    })

    addWhitelistButton.addEventListener("click", () => {
        const target = document.getElementById("addToPresetInput") as HTMLInputElement
        addToTable(createWhitelistTable, target.value)
        target.value = ""
    })

    submitCreatePreset.addEventListener("click", async () => {
        const presetName = whitelistNameInput.value
        
        if (presetName === "") {
            customAlert("Name cannot be empty")
            return
        }

        // get the name of websites from the first column of the table
        const websitesFromTable = Array.from(createWhitelistTable.rows).map(row => row.cells[0].textContent)
        const presets = await getLocalData("whitelistPresets")
        presets[presetName] = websitesFromTable
        chrome.storage.local.set({ whitelistPresets: presets })
        chrome.storage.local.set({ curWhitelistPreset: presetName })
        await handlePresetDropdown()
        await refreshEditWhitelistTable()

        // close and clear inputs
        const modal = submitCreatePreset.closest(".modal")
        closeModal(modal)
        while (createWhitelistTable.firstChild) {
            createWhitelistTable.removeChild(createWhitelistTable.lastChild)
        }
        whitelistNameInput.value = ""
        addToPresetInput.value = ""
    })
}

function handleEditModal() {
    const addToPresetInput = document.getElementById("editAddToWhitelistInput") as HTMLInputElement
    const addWhitelistButton = document.getElementById("editAddToWhitelistButton") as HTMLButtonElement
    const editWhitelistTable = document.getElementById("editWhitelistTable") as HTMLTableElement
    const submitEditPreset = document.getElementById("submitEditPreset") as HTMLButtonElement
    
    addToPresetInput.addEventListener("keydown", (e) => {
        const target = e.target as HTMLInputElement
        if (e.key === "Enter") {
            addToTable(editWhitelistTable, target.value)
            target.value = ""
        }
    })
    
    addWhitelistButton.addEventListener("click", () => {
        const target = document.getElementById("addToPresetInput") as HTMLInputElement
        addToTable(editWhitelistTable, target.value)
        target.value = ""
    })
    
    submitEditPreset.addEventListener("click", async () => {
        // get the name of websites from the first column of the table
        const websitesFromTable = Array.from(editWhitelistTable.rows).map(row => row.cells[0].textContent)
        const presets = await getLocalData("whitelistPresets")
        const presetName = await getLocalData("curWhitelistPreset")
        presets[presetName] = websitesFromTable
        chrome.storage.local.set({ whitelistPresets: presets })
        chrome.storage.local.set({ curWhitelistPreset: presetName })

        // close and clear inputs
        const modal = submitEditPreset.closest(".modal")
        closeModal(modal)
        addToPresetInput.value = ""
    })
}


function deletePreset() {
    const deleteButton = document.getElementById("deletePreset")
    deleteButton.addEventListener("click", async () => {
        const presets = await getLocalData("whitelistPresets")
        const presetName = await getLocalData("curWhitelistPreset")
        delete presets[presetName]
        chrome.storage.local.set({ whitelistPresets: presets })
        await handlePresetDropdown()
        await refreshEditWhitelistTable()
    })
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

    await handlePresetDropdown()
    await refreshEditWhitelistTable()
    handleEditModal()
    handleCreateModal()
    deletePreset()
}