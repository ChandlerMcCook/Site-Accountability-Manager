export function modalLogic() {
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
}