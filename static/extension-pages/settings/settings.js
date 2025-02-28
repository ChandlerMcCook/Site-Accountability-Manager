document.addEventListener("DOMContentLoaded", () => {
    // switch pages
    const themeButton = document.getElementById("themeButton")
    const settingsButton = document.getElementById("settingsButton")
    
    const themePage = document.getElementById("themePage")
    const settingsPage = document.getElementById("settingsPage")

    themeButton.addEventListener("click", () => {
        themePage.style.display = "flex"
        settingsPage.style.display = "none"
    })
    
    settingsButton.addEventListener("click", () => {
        settingsPage.style.display = "flex"
        themePage.style.display = "none"
    })

    // select theme
    const selectThemeButtons = Array.from(document.getElementsByClassName("selectPaletteButton"))
    selectThemeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            console.log(e.target.getAttribute("id"))
            chrome.storage.local.set({ theme: e.target.getAttribute("id") })
        })
    })

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

})