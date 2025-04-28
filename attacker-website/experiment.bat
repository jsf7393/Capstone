start /min node ./../victim-website/server.js alternate %1
start /min node server.js %2 alternate
for /l %%x in (1, 1, 100) do (
	echo %%x
	start /wait chrome --new-window --start-fullscreen "http://localhost:8000"
)
taskkill /f /im node.exe