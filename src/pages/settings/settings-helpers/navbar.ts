export function navbarLogic() {
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
}