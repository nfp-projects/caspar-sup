git pull
START openbrowser.bat
CALL npm install
CALL npm run build
CALL npm run start:win
echo.
echo EXITED
echo.
PAUSE
