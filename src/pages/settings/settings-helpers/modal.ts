import { customAlert } from "../../../helper-functions/customAlert"

export function modalLogic() {
    const openModalButtons = document.querySelectorAll('[data-modal-target]') as NodeListOf<HTMLButtonElement>
    const closeModalButtons = document.querySelectorAll("[data-close-modal-button]") as NodeListOf<HTMLButtonElement>
    const overlay = document.getElementById("overlay")
    
    openModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.dataset.hasOwnProperty("can-fire")) {
                if (button.dataset.canFire == "false") {
                    customAlert("Please select a preset")
                    return
                }
            }
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
    
    
    overlay.addEventListener("click", () => {
        const modals = document.querySelectorAll(".modal.active")
        modals.forEach(modal => {
            closeModal(modal)
        })
    })
}

export function openModal(modal : Element) {
    if (modal == null) return
    const overlay = document.getElementById("overlay")
    modal.classList.add("active")
    overlay.classList.add("active")
}

export function closeModal(modal : Element) {
    if (modal == null) return
    const overlay = document.getElementById("overlay")
    modal.classList.remove("active")
    overlay.classList.remove("active")
}