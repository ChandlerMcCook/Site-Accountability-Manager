import { Chart, registerables } from "chart.js"
import { GetLocalData } from "../helper-functions/get-local-data"

async function GetChartData(totalOrDaily) {
    const timeData = await GetLocalData("trackedSites")

    // get names of websites and times associated with websites
    const names = Object.keys(timeData)
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    let times
    if (totalOrDaily === "total")
        times = Object.keys(timeData).map(key => timeData[key].overall / 3600)
    else {
        const today = new Date().toLocaleDateString()
        times = Object.keys(timeData).map(key => {
            return timeData[key].days.find(day => day.date === today).time
        })
    }

    return [names, times]
}

export function ChartPopupLogic () {
    Chart.register(...registerables)
    
    // get vars to be used in all buttons across the page
    const content = document.getElementById("content")
    content.dataset.visiblePage = "total"
    let currentChart = null

    
    const chartColors = ["red", "blue", "yellow", "green", "purple", "orange"]
    
    document.getElementById("pieButton").addEventListener("click", async () => {
        const chart = document.getElementById("chart")
        const [siteNames, siteTimes] = await GetChartData("total")
        
        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(chart, {
            type: "doughnut",
            data: {
                labels: siteNames,
                datasets: [
                    {
                        cutout: "90%",
                        label: " Hours",
                        data: siteTimes,
                        backgroundColor: chartColors
                    }
                ]
            },
        })
    })

    document.getElementById("barButton").addEventListener("click", async () => {
        const chart = document.getElementById("chart")
        const [siteNames, siteTimes] = await GetChartData("total")
        
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

    document.getElementById("lineButton").addEventListener("click", async () => {
        const chart = document.getElementById("chart")
        const [siteNames, siteTimes] = await GetChartData("total")
        
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

    document.getElementById("checkMoreButton").addEventListener("click", async () => {
        const chart = document.getElementById("chart")
        const [siteNames, siteTimes] = await GetChartData("total")
        
        if (currentChart) {
            currentChart.destroy()
        }
        
        currentChart = new Chart(chart, {
            type: "doughnut",
            data: {
                labels: siteNames,
                datasets: [
                    {
                        cutout: "90%",
                        label: " Hours",
                        data: siteTimes,
                        backgroundColor: chartColors
                    }
                ]
            }
        })
    })
}