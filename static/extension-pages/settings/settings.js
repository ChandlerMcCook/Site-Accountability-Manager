import { GetLocalData } from "@helpers/get-local-data.js"

document.addEventListener("DOMContentLoaded", async () => {
    // switch pages
    const themeButton = document.getElementById("themeButton")
    const accountabilityButton = document.getElementById("accountabilityButton")
    const settingsButton = document.getElementById("settingsButton")
    
    const themePage = document.getElementById("themePage")
    const accountabilityPage = document.getElementById("accountabilityPage")
    const settingsPage = document.getElementById("settingsPage")

    themeButton.addEventListener("click", () => {
        themePage.style.display = "flex"
        accountabilityPage.style.display = "none"
        settingsPage.style.display = "none"
    })

    accountabilityButton.addEventListener("click", () => {
        accountabilityPage.style.display = "flex"
        themePage.style.display = "none"
        settingsPage.style.display = "none"
    })
    
    settingsButton.addEventListener("click", () => {
        settingsPage.style.display = "flex"
        themePage.style.display = "none"
        accountabilityPage.style.display = "none"
    })

    // select theme
    const selectThemeButtons = Array.from(document.getElementsByClassName("selectPaletteButton"))
    selectThemeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            console.log(e.target.getAttribute("id"))
            chrome.storage.local.set({ theme: e.target.getAttribute("id") })
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

    const curAccountability = await GetLocalData("accountability")
    const accountabilityCheckbox = document.getElementById("accountabilityCheckbox")
    if (curAccountability === "none")
        accountabilityCheckbox.checked = false
    else {
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