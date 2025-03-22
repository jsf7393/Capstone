start /min node server.js %1
for /l %%x in (1, 1, 100) do (
	echo %%x
	start /wait chrome --new-window --start-fullscreen "http://localhost:8000"
)