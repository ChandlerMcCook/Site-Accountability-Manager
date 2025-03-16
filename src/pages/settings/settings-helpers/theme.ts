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

    // default/user theme routing
    const defaultThemePage = document.getElementById("defaultThemePage")
    const userThemePage = document.getElementById("userThemePage")
    const defaultThemeButton = document.getElementById("defaultThemeButton")
    const userThemeButton = document.getElementById("userThemeButton")

    defaultThemeButton.addEventListener("click", () => {
        defaultThemePage.style.display = "flex"
        userThemePage.style.display = "none"
    })

    userThemeButton.addEventListener("click", () => {
        userThemePage.style.display = "flex"
        defaultThemePage.style.display = "none"
    })
}