document.addEventListener("DOMContentLoaded", () => {
    const chartDiv = document.getElementById("chartPage")

    const text = document.createTextNode("Hello")

    const p = document.createElement("p")

    p.appendChild(text)

    chartDiv.appendChild(p)
})