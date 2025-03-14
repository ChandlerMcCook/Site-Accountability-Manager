import { getLocalData } from "../../helper-functions/getLocalData"
import { navbarLogic } from "./settings-helpers/navbar"
import { themeLogic } from "./settings-helpers/theme"
import { whitelistLogic } from "./settings-helpers/whitelist"

document.addEventListener("DOMContentLoaded", async () => {
    navbarLogic()
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
    
    // modal button logic
    const openModalButtons = document.querySelectorAll('[data-modal-target]') as NodeListOf<HTMLButtonElement>
    const closeModalButtons = document.querySelectorAll("[data-close-modal-button]") as NodeListOf<HTMLButtonElement>
    const overlay = document.getElementById("overlay")
    
    openModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = document.querySelector(button.dataset.modalTarget)
            openModal(modal)
        })
    })
    
    closeModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest('.modal')
            closeModal(modal)
        })
    })
    
    
    function openModal(modal : Element) {
        if (modal == null) return
        modal.classList.add("active")
        overlay.classList.add("active")
    }
    
    function closeModal(modal : Element) {
        if (modal == null) return
        modal.classList.remove("active")
        overlay.classList.remove("active")
    }
    
    overlay.addEventListener("click", () => {
        const modals = document.querySelectorAll(".modal.active")
        modals.forEach(modal => {
            closeModal(modal)
        })
    })
})
