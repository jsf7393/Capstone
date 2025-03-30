const express = require("express");
const fs = require("fs").promises;

const server = express();

const PORT = 8001;

server.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});

server.get("/", (req, res) => {
    fs.readFile(__dirname + "/index.html")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
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

server.get("*.png", (req, res) => {
    fs.readFile(__dirname + req.url)
    .then(contents => {
        res.setHeader("Content-Type", "image/png");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
    });
});

server.get("/args", (req, res) => {
    res.send(process.argv.slice(2));
});