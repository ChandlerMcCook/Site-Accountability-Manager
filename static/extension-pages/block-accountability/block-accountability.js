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
            countdown.textContent = "Unblock"
            countdown.addEventListener("click", () => {

            })
        }
    }
    
    const intervalId = setInterval(updateCountdown, 1000)
    updateCountdown()
})