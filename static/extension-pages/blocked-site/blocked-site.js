const imageNames = ["bruh.png", "dog.png", "kid-cup.jpg", "worm.jpg", "evolution.jpg"]

document.addEventListener("DOMContentLoaded", () => {
    const imageIndex = Math.floor(Math.random() * imageNames.length)
    const background = document.getElementsByTagName("body")[0]
    background.style.backgroundImage = `url("../../images/blocked-images/${imageNames[imageIndex]}")`
})