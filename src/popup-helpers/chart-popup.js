import { Chart, registerables } from "chart.js"

export async function chartPopupLogic () {
    Chart.register(...registerables)
    
    // get vars to be used in all buttons across the page
    const content = document.getElementById("content")
    content.dataset.visiblePage = "total"

    let currentChart = null
    
    let timeData = await chrome.storage.local.get("trackedSites")
    timeData = timeData.trackedSites || {}

    const siteNames = Object.keys(timeData)
        .map(name => name.slice(4, -4))
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    const siteTimes = Object.keys(timeData).map(key => timeData[key] / 3600000)

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

    document.getElementById("checkMoreButton").addEventListener("click", () => {
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
}