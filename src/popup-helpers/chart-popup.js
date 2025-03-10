import { Chart, registerables } from "chart.js"
import { GetLocalData } from "../helper-functions/get-local-data"

let currentChart = null
const chartColors = ["red", "blue", "yellow", "green", "purple", "orange"]

async function GetChartData(totalOrDaily) {
    const timeData = await GetLocalData("trackedSites")
    const today = new Date().toLocaleDateString()

    const websites = Object.keys(timeData)

    // make sure that two colors don't end up next to each other in pie chart
    if (websites.length === chartColors.length) chartColors.push("maroon")

    // get names of websites and times associated with websites
    let names = []
    let times = []
    if (totalOrDaily === "total") {
        names = websites
            .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        times = websites.map(site => timeData[site].overall / 3600)
    } else {
        websites.forEach(site => {
            const todayData = timeData[site].days.find(day => day.date === today)
            if (todayData !== undefined) {
                names.push(site)
                times.push(todayData.time / 3600)
            }
        })
    }

    return [names, times]
}

export async function RefreshChart() {
    const chart = document.getElementById("chart")
    const totalOrDaily = await GetLocalData("totalOrDaily")
    const [siteNames, siteTimes] = await GetChartData(totalOrDaily)
    
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
}

export function ChartPopupLogic () {
    Chart.register(...registerables)
    
    document.getElementById("pieButton").addEventListener("click", async () => {
        const chart = document.getElementById("chart")
        const totalOrDaily = await GetLocalData("totalOrDaily")
        const [siteNames, siteTimes] = await GetChartData(totalOrDaily)
        
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
        const totalOrDaily = await GetLocalData("totalOrDaily")
        const [siteNames, siteTimes] = await GetChartData(totalOrDaily)
        
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
        const trackedSites = await GetLocalData("trackedSites")
        let totalTimePerDay = {}
        Object.entries(trackedSites).forEach(entry => {
            entry[1].days.forEach(day => {
                const hours = day.time / 3600
                if (totalTimePerDay[day.date] === undefined)
                    totalTimePerDay[day.date] = hours
                else 
                    totalTimePerDay[day.date] += hours
            })
        })
        totalTimePerDay = Object.entries(totalTimePerDay)
        totalTimePerDay.sort((a, b) => new Date(a[0]) - new Date(b[0]))
        const siteNames = totalTimePerDay.map(entry => entry[0])
        const siteTimes = totalTimePerDay.map(entry => entry[1])

        console.log(siteNames)
        console.log(siteTimes)

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
        RefreshChart()
    })
}