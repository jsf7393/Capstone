start /min node ./../victim-website/server.js attack %1
start /min node server.js %1_data.txt attack
start /wait chrome --new-window --start-fullscreen "http://localhost:8000"
taskkill /f /im node.exe