import { getLocalData } from "../../helper-functions/getLocalData"
import { navbarLogic } from "./settings-helpers/navbar"
import { modalLogic } from "./settings-helpers/modal"
import { themeLogic } from "./settings-helpers/theme"
import { whitelistLogic } from "./settings-helpers/whitelist"

document.addEventListener("DOMContentLoaded", async () => {
    navbarLogic()
    modalLogic()
    themeLogic()
    whitelistLogic()
    
    // accountability checkbox logic
    const curAccountability = await getLocalData("accountability")
    const accountabilityCheckbox = document.getElementById("accountabilityCheckbox") as HTMLInputElement
    if (curAccountability === "none" || curAccountability === undefined) {
        accountabilityCheckbox.checked = false
    } else {
        accountabilityCheckbox.checked = true
    }
    accountabilityCheckbox.addEventListener("change", () => {
        if (accountabilityCheckbox.checked) {
            chrome.storage.local.set({ accountability: "timeout" })
        } else {
            chrome.storage.local.set({ accountability: "none" })
        }
    })
})
