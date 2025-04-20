import { totalPopupLogic, RefreshTable } from "./popup-helpers/totalPopup"
import { chartPopupLogic, RefreshChart } from "./popup-helpers/chartPopup" 
import { blockPopupLogic } from "./popup-helpers/blockPopup"
import { getLocalData } from "./helper-functions/getLocalData"
import { setThemeVariables } from "./helper-functions/setThemeVariables"

document.addEventListener("DOMContentLoaded", async () => {
    setThemeVariables()
    totalPopupLogic()
    chartPopupLogic()
    blockPopupLogic()

    const totalOrDaily = document.getElementById("totalOrDailyDropdown") as HTMLSelectElement
    const tdValue = await getLocalData("totalOrDaily")
    totalOrDaily.value = tdValue
    const upperCaseValue = tdValue.charAt(0).toUpperCase() + tdValue.slice(1)
    document.getElementById("totalTitle").innerHTML = `${upperCaseValue} time spent`
    document.getElementById("chartTitle").innerHTML = `${upperCaseValue} Time Graphs`

    // change to total or daily time
    totalOrDaily.addEventListener("change", (e : Event) => {
        const target = e.target as HTMLSelectElement
        const newVal = target.value
        chrome.storage.local.set({ totalOrDaily: newVal })
        const upperCaseVal = newVal.charAt(0).toUpperCase() + newVal.slice(1)
        document.getElementById("totalTitle").innerHTML = `${upperCaseVal} time spent`
        document.getElementById("chartTitle").innerHTML = `${upperCaseVal} Time Graphs`

        RefreshTable()
        RefreshChart()
    })

    // open settings
    document.getElementById("settings").addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("pages/settings/settings.html") })
    })

    // change tabs
    const totalDiv = document.getElementById("totalPage")
    const chartDiv = document.getElementById("chartPage")
    const blockDiv = document.getElementById("blockPage")

    document.getElementById("goToTotalButton").addEventListener("click", () => {
        chartDiv.style.display = "none"
        blockDiv.style.display = "none"
        totalDiv.style.display = "flex"
    })

    document.getElementById("goToChartButton").addEventListener("click", () => {
        totalDiv.style.display = "none"
        blockDiv.style.display = "none"
        chartDiv.style.display = "flex"
    })

    document.getElementById("goToBlockButton").addEventListener("click", () => {
        totalDiv.style.display = "none"
        chartDiv.style.display = "none"
        blockDiv.style.display = "flex"
    })
})