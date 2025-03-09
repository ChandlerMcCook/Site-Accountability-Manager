import { Chart, ChartComponent, registerables } from "chart.js"
import { getLocalData } from "../helper-functions/getLocalData"
import { Day, TrackedWebsite, TrackedWebsiteMap } from "../interfaces/trackedWebsite"

let currentChart : Chart | null = null
const chartColors = ["red", "blue", "yellow", "green", "purple", "orange"]

async function GetChartData(totalOrDaily : string) {
    const timeData = await getLocalData("trackedSites") as TrackedWebsiteMap
    const today = new Date().toLocaleDateString()

    const websites = Object.keys(timeData)

    // make sure that two colors don't end up next to each other in pie chart
    if (websites.length === chartColors.length) chartColors.push("maroon")

    // get names of websites and times associated with websites
    let names : string[] = []
    let times : number[] = []
    if (totalOrDaily === "total") {
        names = websites
            .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        times = websites.map(site => timeData[site].overall / 3600)
    } else {
        websites.forEach(site => {
            const todayData = timeData[site].days.find((day : Day) => day.date === today)
            if (todayData !== undefined) {
                names.push(site)
                times.push(todayData.time / 3600)
            }
        })
    }

    return [names, times]
}

export async function RefreshChart() {
    const chart = document.getElementById("chart") as HTMLCanvasElement
    const totalOrDaily = await getLocalData("totalOrDaily")
    let [siteNames, siteTimes] = await GetChartData(totalOrDaily)
    siteNames = siteNames as string[]
    siteTimes = siteTimes as number[]
    
    if (currentChart) {
        currentChart.destroy()
    }
    
    currentChart = new Chart(chart, {
        type: "doughnut",
        data: {
            labels: siteNames as string[],
            datasets: [
                {
                    // cutout: "90%",
                    label: " Hours",
                    data: siteTimes as number[],
                    backgroundColor: chartColors
                }
            ]
        }
    })
}

export function chartPopupLogic () {
    Chart.register(...registerables)
    
    document.getElementById("pieButton").addEventListener("click", async () => {
        const chart = document.getElementById("chart") as HTMLCanvasElement
        const totalOrDaily = await getLocalData("totalOrDaily")
        let [siteNames, siteTimes] = await GetChartData(totalOrDaily)
        siteNames = siteNames as string[]
        siteTimes = siteTimes as number[]
        
        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(chart, {
            type: "doughnut",
            data: {
                labels: siteNames as string[],
                datasets: [
                    {
                        // cutout: "90%",
                        label: " Hours",
                        data: siteTimes,
                        backgroundColor: chartColors
                    }
                ]
            },
        })
    })

    document.getElementById("barButton").addEventListener("click", async () => {
        const chart = document.getElementById("chart") as HTMLCanvasElement
        const totalOrDaily = await getLocalData("totalOrDaily")
        let [siteNames, siteTimes] = await GetChartData(totalOrDaily)
        siteNames = siteNames as string[]
        siteTimes = siteTimes as number[]
        
        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(chart, {
            type: "bar",
            data: {
                labels: siteNames as string[],
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
        const chart = document.getElementById("chart") as HTMLCanvasElement
        const trackedSites = await getLocalData("trackedSites") as TrackedWebsiteMap

        interface TimePerDay {
            [key: string]: number
        }

        let totalTimePerDay : TimePerDay = {}
        Object.entries(trackedSites).forEach((entry : [string, TrackedWebsite]) => {
            entry[1].days.forEach(day => {
                const hours = day.time / 3600
                if (totalTimePerDay[day.date] === undefined)
                    totalTimePerDay[day.date] = hours
                else 
                    totalTimePerDay[day.date] += hours
            })
        })
        let daysAndTimes = Object.entries(totalTimePerDay)
        daysAndTimes.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        const siteNames = daysAndTimes.map(entry => entry[0])
        const siteTimes = daysAndTimes.map(entry => entry[1])

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