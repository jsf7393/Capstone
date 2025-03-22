const express = require("express");
const fs = require("fs").promises;

let dataFile = "";
let run = 1;
if (process.argv.length > 1) {
    dataFile = process.argv[2];
}

const server = express();
server.use(express.json({limit: '50mb'}));

const PORT = 8000;

server.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});

server.get("/", (_, res) => {
    fs.readFile(__dirname + "/index.html")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
    });
});

server.get("*.js", (req, res) => {
    fs.readFile(__dirname + req.url)
    .then(contents => {
        res.setHeader("Content-Type", "application/javascript");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
    });
});

server.post("/api", (req, res) => {
    const data = {[run++]: req.body};

    try {
        fs.appendFile(dataFile, JSON.stringify(data));
        res.writeHead(200);
        res.end(JSON.stringify(data));
    } catch (err) {
        res.writeHead(500);
        res.end(err.message);
    }
});