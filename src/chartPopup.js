import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content")
    content.dataset.visiblePage = "total"
    
    document.getElementById("checkMoreButton").addEventListener("click", async () => {
        const content = document.getElementById("content")
        const visiblePage = content.dataset.visiblePage

        console.log(visiblePage)

        const totalDiv = document.getElementById("totalPage")
        const chartDiv = document.getElementById("chartPage")
        
        if (visiblePage === "" || visiblePage === "total") {
            content.dataset.visiblePage = "chart"

            totalDiv.style.display = "none"
            chartDiv.style.display = "flex"
    
            let timeData = await chrome.storage.local.get("trackedSites")
            timeData = timeData.trackedSites || {}
        
            console.log(JSON.stringify(timeData))
        
            const siteNames = Object.keys(timeData)
                .map(name => name.slice(4, -4))
                .map(name => name.charAt(0).toUpperCase() + name.slice(1))
            const siteTimes = Object.keys(timeData).map(key => timeData[key] / 3600000)
        
            const pieChart = document.getElementById("pieChart")
        
            new Chart(pieChart, {
                type: "pie",
                data: {
                labels: siteNames,
                datasets: [
                    {
                    label: " Hours",
                    data: siteTimes,
                    backgroundColor: ["red", "blue", "yellow", "green", "purple", "orange"]
                    }
                ]
                }
            })
        } else {
            content.dataset.visiblePage = "total"

            totalDiv.style.display = "flex"
            chartDiv.style.display = "none"
        }

    })

})