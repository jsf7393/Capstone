fetch("http://localhost:8001/args", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(args => {
        if (args[0] === "baseline") {
            let color = args[1];
    
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 28, 28);
        } else if (args[0] === "attack") {
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
            }

            img.src = args[1] + ".png"
        }
    });