import { totalPopupLogic, RefreshTable } from "./popup-helpers/totalPopup.js"
import { chartPopupLogic, RefreshChart } from "./popup-helpers/chartPopup.js" 
import { blockPopupLogic } from "./popup-helpers/blockPopup.js"
import { getLocalData } from "./helper-functions/getLocalData.js"
import { setThemeVariables } from "./helper-functions/setThemeVariables.js"

document.addEventListener("DOMContentLoaded", async () => {
    setThemeVariables()
    totalPopupLogic()
    chartPopupLogic()
    blockPopupLogic()

    const totalOrDaily = document.getElementById("totalOrDailyDropdown") as HTMLSelectElement
    const tdValue = await getLocalData("totalOrDaily")
    totalOrDaily.value = tdValue
    const upperCaseValue = tdValue.charAt(0).toUpperCase() + tdValue.slice(1)
    document.getElementById("totalTitle").innerHTML = `${upperCaseValue} time spent`
    document.getElementById("chartTitle").innerHTML = `${upperCaseValue} Time Graphs`

    // change to total or daily time
    totalOrDaily.addEventListener("change", (e : Event) => {
        const target = e.target as HTMLSelectElement
        const newVal = target.value
        chrome.storage.local.set({ totalOrDaily: newVal })
        const upperCaseVal = newVal.charAt(0).toUpperCase() + newVal.slice(1)
        document.getElementById("totalTitle").innerHTML = `${upperCaseVal} time spent`
        document.getElementById("chartTitle").innerHTML = `${upperCaseVal} Time Graphs`

        RefreshTable()
        RefreshChart()
    })

    // open settings
    document.getElementById("settings").addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("pages/settings/settings.html") })
    })

    // change tabs
    document.getElementById("checkMoreButton").addEventListener("click", () => {
        const content = document.getElementById("content")
        const visiblePage = content.dataset.visiblePage

        const totalDiv = document.getElementById("totalPage")
        const chartDiv = document.getElementById("chartPage")
        const blockDiv = document.getElementById("blockPage")
        const checkMoreButton = document.getElementById("checkMoreButton")
        
        if (visiblePage === undefined || visiblePage === "total") {
            content.dataset.visiblePage = "chart"
            checkMoreButton.style.backgroundImage = "url(\"images/ui-images/cancel.png\")"
            
            totalDiv.style.display = "none"
            chartDiv.style.display = "flex"
        } else if (visiblePage == "chart") {
            content.dataset.visiblePage = "block"
            checkMoreButton.style.backgroundImage = "url(\"images/ui-images/clock.png\")"

            chartDiv.style.display = "none"
            blockDiv.style.display = "flex"
        } else {
            content.dataset.visiblePage = "total"
            checkMoreButton.style.backgroundImage = "url(\"images/ui-images/bar-chart.png\")"

            blockDiv.style.display = "none"
            totalDiv.style.display = "flex"
        }
    })
})