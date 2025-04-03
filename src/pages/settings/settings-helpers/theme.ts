export function themeLogic() {
    // select theme
    const selectThemeButtons = Array.from(document.getElementsByClassName("selectPaletteButton"))
    selectThemeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const target = e.target as HTMLButtonElement
            console.log(target.getAttribute("id"))
            chrome.storage.local.set({ theme: target.getAttribute("id") })
        })
    })
}