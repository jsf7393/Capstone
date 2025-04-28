start /min node ./../victim-website/server.js alternate 1
start /min node server.js evaluate_leakage.txt alternate
start /wait chrome --new-window --start-fullscreen "http://localhost:8000"
taskkill /f /im node.exe