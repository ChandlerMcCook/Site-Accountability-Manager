import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

document.addEventListener("DOMContentLoaded", () => {
    // let timeData = {
    //     "www.facebook.com": 200000,
    //     "www.google.com": 2866744,
    //     "www.linkedin.com": 1991200,
    //     "www.reddit.com": 757504,
    //     "www.twitter.com": 100000,
    //     "www.youtube.com": 9323897
    // }

    let timeData = chrome.storage.local.get("trackedSites")
    console.log(JSON.stringify(timeData))
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
})