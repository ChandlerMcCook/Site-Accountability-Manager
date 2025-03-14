import { getLocalData } from "../../../helper-functions/getLocalData";
import { WhitelistPresets } from "../../../interfaces/whitelistPreset";

async function refreshWhitelistTable() {
    const whitelistPresets = await getLocalData("whitelistPresets") as WhitelistPresets
    const presetDropdown = document.getElementById("presetDropdown") as HTMLSelectElement
    const whitelistTables = Array.from(document.getElementsByClassName("whitelistTable") as HTMLCollection)

    if (!whitelistPresets) {

    }

    const whitelistedSites = Object.entries(whitelistPresets).find(wl => wl[0] === presetDropdown.value)[1]
    whitelistTables.forEach(table => {
        whitelistedSites.forEach(site => {
            const siteText = document.createTextNode(site)
            const td = document.createElement("td")
            td.append(siteText)
            const tr = document.createElement("tr")
            tr.append(td)
            table.append(tr)
        })
    })
}

export async function whitelistLogic() {
    // whitelist checkbox logic
    const curWhitelist = await getLocalData("whitelist")
    const whitelistCheckbox = document.getElementById("whitelistCheckbox") as HTMLInputElement
    const whitelistContainer = document.getElementById("whitelistContainer")
    if (curWhitelist === false || curWhitelist === undefined) {
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

    // preset chooser logic
    let curPreset : string | null = null 
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

    presetDropdown.addEventListener("change", () => {
        refreshWhitelistTable()
    })

    document.getElementById("createPreset").addEventListener("click", () => {

    })
}