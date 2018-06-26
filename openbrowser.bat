@ECHO OFF

:start

timeout 3

curl localhost:3000

IF %errorlevel% NEQ 0 GOTO :start

"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --start-fullscreen http://localhost:3000/status.html

EXIT