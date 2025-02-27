import { TotalPopupLogic, RefreshTable } from "./popup-helpers/total-popup.js"
import { ChartPopupLogic, RefreshChart } from "./popup-helpers/chart-popup.js" 
import { BlockPopupLogic } from "./popup-helpers/block-popup.js"
import { GetLocalData } from "./helper-functions/get-local-data.js"

document.addEventListener("DOMContentLoaded", async () => {
    TotalPopupLogic()
    ChartPopupLogic()
    BlockPopupLogic()

    const totalOrDaily = document.getElementById("totalOrDailyDropdown")
    const tdValue = await GetLocalData("totalOrDaily")
    totalOrDaily.value = tdValue
    const upperCaseValue = tdValue.charAt(0).toUpperCase() + tdValue.slice(1)
    document.getElementById("totalTitle").innerHTML = `${upperCaseValue} time spent`
    document.getElementById("chartTitle").innerHTML = `${upperCaseValue} Time Graphs`

    // change to total or daily time
    totalOrDaily.addEventListener("change", (e) => {
        const newVal = e.target.value
        chrome.storage.local.set({ totalOrDaily: newVal })
        const upperCaseVal = newVal.charAt(0).toUpperCase() + newVal.slice(1)
        document.getElementById("totalTitle").innerHTML = `${upperCaseVal} time spent`
        document.getElementById("chartTitle").innerHTML = `${upperCaseVal} Time Graphs`

        RefreshTable()
        RefreshChart()
    })

    // open settings
    document.getElementById("settings").addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("extension-pages/settings/settings.html") })
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
            checkMoreButton.style.backgroundImage = "url(\"images/ui-images/clock-theme1.png\")"

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