import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

document.addEventListener("DOMContentLoaded", async () => {
    const content = document.getElementById("content")
    content.dataset.visiblePage = "total"

    let currentChart = null
    
    let timeData = await chrome.storage.local.get("trackedSites")
    timeData = timeData.trackedSites || {}

    console.log(JSON.stringify(timeData))

    const siteNames = Object.keys(timeData)
        .map(name => name.slice(4, -4))
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    const siteTimes = Object.keys(timeData).map(key => timeData[key] / 3600000)
    
    document.getElementById("checkMoreButton").addEventListener("click", () => {
        const content = document.getElementById("content")
        const visiblePage = content.dataset.visiblePage

        console.log(visiblePage)

        const totalDiv = document.getElementById("totalPage")
        const chartDiv = document.getElementById("chartPage")
        const checkMoreButton = document.getElementById("checkMoreButton")
        
        if (visiblePage === "" || visiblePage === "total") {
            checkMoreButton.style.backgroundImage = "url(\"images/settings.png\")"

            content.dataset.visiblePage = "chart"

            totalDiv.style.display = "none"
            chartDiv.style.display = "flex"
    
            const pieChart = document.getElementById("chart")
        
            if (currentChart) {
                currentChart.destroy()
            }

            currentChart = new Chart(pieChart, {
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
            checkMoreButton.style.backgroundImage = "url(\"images/barChart.png\")"

            totalDiv.style.display = "flex"
            chartDiv.style.display = "none"
        }

    })


    document.getElementById("pieButton").addEventListener("click", () => {
        const chart = document.getElementById("chart")
        
        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(chart, {
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
    })

    document.getElementById("barButton").addEventListener("click", () => {
        const chart = document.getElementById("chart")
        
        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(chart, {
            type: "bar",
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
    })

    document.getElementById("lineButton").addEventListener("click", () => {
        const chart = document.getElementById("chart")
        
        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(chart, {
            type: "line",
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
    })
})