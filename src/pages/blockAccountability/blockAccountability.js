import { removeStoredBlocked } from "../../helper-functions/storeRemoveBlocked.js"

document.addEventListener("DOMContentLoaded", async () => {
    const video = document.getElementById("webcamVideo")
    
    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("getUserMedia is not supported on this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.log("Something went wrong!", error);
    }

    const countdown = document.getElementById("countdown")

    let timeLeft = 30
    const updateCountdown = () => {
        if (timeLeft > 0) {
            countdown.textContent = timeLeft
            timeLeft--
        } else {
            clearInterval(intervalId)
            const url = new URL(location.href)
            const domain = url.searchParams.get("domain")
            countdown.textContent = `Unblock ${domain}`
            countdown.addEventListener("click", async () => {
                await Unblock(domain)
            })
        }
    }
    
    const intervalId = setInterval(updateCountdown, 1000)
    updateCountdown()
})

async function Unblock(domain) {
    // get name of blocked site from url query
    await removeStoredBlocked(domain)
    chrome.tabs.getCurrent(tab => {
        chrome.tabs.remove(tab.id)
    })
}