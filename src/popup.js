import { TotalPopupLogic, RefreshTable } from "./popup-helpers/total-popup.js"
import { ChartPopupLogic } from "./popup-helpers/chart-popup.js" 
import { BlockPopupLogic } from "./popup-helpers/block-popup.js"

document.addEventListener("DOMContentLoaded", () => {
    TotalPopupLogic()
    ChartPopupLogic()
    BlockPopupLogic()

    // change to total or daily time
    document.getElementById("totalOrDailyDropdown").addEventListener("change", (e) => {
        chrome.storage.local.set({ totalOrDaily: e.target.value })

        RefreshTable()
        // RefreshChart()
    })

    // change tabs
    document.getElementById("checkMoreButton").addEventListener("click", () => {
        const content = document.getElementById("content")
        const visiblePage = content.dataset.visiblePage

        const totalDiv = document.getElementById("totalPage")
        const chartDiv = document.getElementById("chartPage")
        const blockDiv = document.getElementById("blockPage")
        const checkMoreButton = document.getElementById("checkMoreButton")
        
        if (visiblePage === "" || visiblePage === "total") {
            content.dataset.visiblePage = "chart"
            checkMoreButton.style.backgroundImage = "url(\"images/ui-images/cancel.png\")"
            
            totalDiv.style.display = "none"
            chartDiv.style.display = "flex"
        } else if (visiblePage == "chart") {
            content.dataset.visiblePage = "block"
            checkMoreButton.style.backgroundImage = "url(\"images/ui-images/settings.png\")"

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