import { getLocalData } from "../../../helper-functions/getLocalData"
import { WhitelistPresets } from "../../../interfaces/whitelistPreset"
import { isEmptyObject } from "../../../helper-functions/isEmptyObject"
import { customAlert } from "../../../helper-functions/customAlert"
import { closeModal } from "./modal"


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
    db.innerHTML = "&times"
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
    const curPreset = await getLocalData("curWhitelistPreset")
    const table = document.getElementById("editWhitelistTable") as HTMLTableElement

    while (table.firstChild) {
        table.removeChild(table.lastChild)
    }

    if (isEmptyObject(whitelistPresets)) {
        return
    }
    // TODO: Fix preset not loading right
    const whitelistedSites = curPreset ? Object.entries(whitelistPresets).find(wl => wl[0] === curPreset)[1] : []
    whitelistedSites.forEach(site => {
        addToTable(table, site)
    })
}


async function handlePresetDropdown() {
    // preset chooser logic
    const curPreset : string | undefined = await getLocalData("curWhitelistPreset")
    const whitelistPresets = await getLocalData("whitelistPresets") as WhitelistPresets
    const presetDropdown = document.getElementById("presetDropdown") as HTMLSelectElement
    const presetNames = Object.keys(whitelistPresets)

    if (presetNames.length === 0) {
       // TODO: Add message to show that there are no presets chosen 
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

    document.getElementById("editPreset").dataset.canFire = "true"
    document.getElementById("deletePreset").dataset.canFire = "true"
    if (typeof(curPreset) === "string") {
        presetDropdown.value = curPreset
    } else {
        if (presetNames[0] !== undefined) {
            const newPreset = presetNames[0]
            presetDropdown.value = newPreset
            chrome.storage.local.set({ curPreset: newPreset })
        } else {
            document.getElementById("editPreset").dataset.canFire = "false"
            document.getElementById("deletePreset").dataset.canFire = "false"
        }
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
        if (deleteButton.dataset.canFire == "true") {
            const presets = await getLocalData("whitelistPresets")
            const presetName = await getLocalData("curWhitelistPreset")
            delete presets[presetName]
            await chrome.storage.local.set({ whitelistPresets: presets })
            await chrome.storage.local.set({ curWhitelistPreset: undefined })
            await handlePresetDropdown()
            await refreshEditWhitelistTable()
        } else {
            customAlert("Please select a preset")
        }
    })
}

async function refreshPresetPicker() {
    const presets = Object.entries(await getLocalData("whitelistPresets") as WhitelistPresets)
    const presetPicker = document.getElementById("presetPicker")
    presets.forEach((name, sites) => {

    })
}


function renderPresets() {
    const presets = [
        { name: "Work", websites: ["github.com", "stackoverflow.com", "atlassian.com"] },
        { name: "Entertainment", websites: ["netflix.com", "youtube.com", "spotify.com"] },
        { name: "Study", websites: ["wikipedia.org", "khanacademy.org", "coursera.org"] },
    ]
    const container = document.getElementById("presetPicker")
    container.innerHTML = "" // Clear container before rendering

    presets.forEach((preset, index) => {
        // Create a div for each preset
        const presetDiv = document.createElement("div")
        presetDiv.classList.add("preset-item")

        // Create radio button and label
        const radio = document.createElement("input")
        radio.type = "radio"
        radio.name = "preset"
        radio.value = String(index)
        radio.id = `preset-${index}`
        if (index === 0) radio.checked = true // Default selection

        const label = document.createElement("label")
        label.htmlFor = `preset-${index}`
        label.textContent = preset.name

        // Create table
        const table = document.createElement("table")
        table.classList.add("preset-table")
        table.innerHTML = `<thead><tr><th>Websites</th></tr></thead>`
        
        const tbody = document.createElement("tbody")
        preset.websites.forEach((website) => {
            const row = document.createElement("tr")
            row.innerHTML = `<td>${website}</td>`
            tbody.appendChild(row)
        })
        
        table.appendChild(tbody)

        // Append elements
        presetDiv.appendChild(radio)
        presetDiv.appendChild(label)
        presetDiv.appendChild(table)
        container.appendChild(presetDiv)
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
    renderPresets()
}