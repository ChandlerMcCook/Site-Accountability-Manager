import { Chart, registerables } from "chart.js"
import { GetLocalData } from "../helper-functions/get-local-data"

export async function chartPopupLogic () {
    Chart.register(...registerables)
    
    // get vars to be used in all buttons across the page
    const content = document.getElementById("content")
    content.dataset.visiblePage = "total"
    let currentChart = null
    const timeData = await GetLocalData("trackedSites") || {}

    // get names of websites and times associated with websites
    const siteNames = Object.keys(timeData)
        .map(name => name.slice(4, -4))
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    const siteTimes = Object.keys(timeData).map(key => timeData[key] / 3600000)

    // const chartColors = ["#789DBC", "#FFE3E3", "#FEF9F2", "#C9E9D2", "#C4D9FF", "#C5BAFF", "#E8F9FF"]
    const chartColors = ["red", "blue", "yellow", "green", "purple", "orange"]

    document.getElementById("pieButton").addEventListener("click", () => {
        const chart = document.getElementById("chart")
        
        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(chart, {
            type: "doughnut",
            cutout: "80%",
            data: {
                labels: siteNames,
                datasets: [
                    {
                        label: " Hours",
                        data: siteTimes,
                        backgroundColor: chartColors
                    }
                ]
            },
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
                        backgroundColor: chartColors
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
                        backgroundColor: chartColors
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
            type: "doughnut",
            cutout: "80%",
            data: {
                labels: siteNames,
                datasets: [
                    {
                        label: " Hours",
                        data: siteTimes,
                        backgroundColor: chartColors
                    }
                ]
            }
        })
    })
}