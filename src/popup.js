import { totalPopupLogic } from "./popup-helpers/totalPopup.js"
import { chartPopupLogic } from "./popup-helpers/chartPopup.js" 

document.addEventListener("DOMContentLoaded", () => {
    totalPopupLogic()
    chartPopupLogic()

    document.getElementById("checkMoreButton").addEventListener("click", () => {
        const content = document.getElementById("content")
        const visiblePage = content.dataset.visiblePage


        const totalDiv = document.getElementById("totalPage")
        const chartDiv = document.getElementById("chartPage")
        const checkMoreButton = document.getElementById("checkMoreButton")
        
        if (visiblePage === "" || visiblePage === "total") {
            content.dataset.visiblePage = "chart"
            checkMoreButton.style.backgroundImage = "url(\"images/settings.png\")"
            
            totalDiv.style.display = "none"
            chartDiv.style.display = "flex"
            
            // refreshChart()
        } else {
            content.dataset.visiblePage = "total"
            checkMoreButton.style.backgroundImage = "url(\"images/barChart.png\")"

            totalDiv.style.display = "flex"
            chartDiv.style.display = "none"
        }

    })
})