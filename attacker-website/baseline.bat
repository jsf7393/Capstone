IF EXIST white_baseline.txt (
    del white_baseline.txt
)

IF EXIST black_baseline.txt (
    del black_baseline.txt
)

start /min node ./../victim-website/server.js baseline white
start /min node server.js white_baseline.txt
start /wait chrome --new-window --start-fullscreen "http://localhost:8000"
taskkill /f /im node.exe

start /min node ./../victim-website/server.js baseline black
start /min node server.js black_baseline.txt
start /wait chrome --new-window --start-fullscreen "http://localhost:8000"
taskkill /f /im node.exe