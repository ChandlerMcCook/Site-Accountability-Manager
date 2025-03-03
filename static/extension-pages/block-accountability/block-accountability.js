document.addEventListener("DOMContentLoaded", async () => {
    const video = document.getElementById("webcamVideo")
    const canvas = document.getElementById("webcamCanvas")
    const context = canvas.getContext("2d")

    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("getUserMedia is not supported on this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        
        video.addEventListener("loadedmetadata", () => {
            canvas.width = 600
            canvas.height = 400
    
            const draw = () => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height)
                document.body.style.backgroundImage = `url('${canvas.toDataURL()}')`
                requestAnimationFrame(draw)
            }
            draw()
        })
    } catch (error) {
        console.log("Something went wrong!", error);
    }
})