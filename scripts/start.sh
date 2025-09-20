#!/bin/bash
# 小熊貓網站 - Linux/Mac 啟動腳本

echo ""
echo "========================================"
echo "   🐾 小熊貓網站本地伺服器 🐾"
echo "========================================"
echo ""

# 檢查 Python 是否已安裝
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ 錯誤：未找到 Python"
        echo "請先安裝 Python 3.x"
        echo "Ubuntu/Debian: sudo apt install python3"
        echo "macOS: brew install python3"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# 檢查 Python 版本
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1-2)
echo "🐍 使用 Python $PYTHON_VERSION"

# 啟動伺服器
echo "🚀 正在啟動伺服器..."
echo ""
$PYTHON_CMD server.py

echo ""
echo "👋 感謝使用！"