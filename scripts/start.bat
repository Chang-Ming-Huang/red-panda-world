@echo off
:: 小熊貓網站 - Windows 啟動腳本

echo.
echo ========================================
echo    🐾 小熊貓網站本地伺服器 🐾
echo ========================================
echo.

:: 檢查 Python 是否已安裝
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤：未找到 Python
    echo 請先安裝 Python 3.x
    echo 下載網址：https://www.python.org/downloads/
    pause
    exit /b 1
)

:: 啟動伺服器
echo 🚀 正在啟動伺服器...
echo.
python server.py

pause