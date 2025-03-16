export function navbarLogic() {
    // switch pages
    const themeButton = document.getElementById("themeButton")
    const whitelistButton = document.getElementById("whitelistButton")
    const settingsButton = document.getElementById("settingsButton")
    
    const themePage = document.getElementById("themePage")
    const whitelistPage = document.getElementById("whitelistPage")
    const settingsPage = document.getElementById("settingsPage")

    themeButton.addEventListener("click", () => {
        themePage.style.display = "flex"
        whitelistPage.style.display = "none"
        settingsPage.style.display = "none"
    })

    whitelistButton.addEventListener("click", () => {
        whitelistPage.style.display = "flex"
        themePage.style.display = "none"
        settingsPage.style.display = "none"
    })
    
    settingsButton.addEventListener("click", () => {
        settingsPage.style.display = "flex"
        themePage.style.display = "none"
        whitelistPage.style.display = "none"
    })
}