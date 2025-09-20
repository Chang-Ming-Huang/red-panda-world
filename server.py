#!/usr/bin/env python3
"""
小熊貓網站本地開發伺服器
Simple HTTP server for local development and testing
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import signal
from pathlib import Path

# 伺服器設定
DEFAULT_PORT = 8000
DEFAULT_HOST = "localhost"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自訂的 HTTP 請求處理器，支援 CORS 和更好的 MIME 類型"""

    def do_GET(self):
        """處理 GET 請求，支援根路徑重定向"""
        # 根路徑重定向到 pages/index.html
        if self.path == '/' or self.path == '/index.html':
            self.send_response(302)
            self.send_header('Location', '/pages/index.html')
            self.end_headers()
            return

        # 呼叫父類的 do_GET 方法
        super().do_GET()

    def end_headers(self):
        # 添加 CORS 標頭，允許跨域請求（用於 fetch API）
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def guess_type(self, path):
        """改進的 MIME 類型猜測"""
        # 確保 JSON 檔案有正確的 MIME 類型
        if path.endswith('.json'):
            return 'application/json'
        # 確保 JavaScript 檔案有正確的 MIME 類型
        elif path.endswith('.js'):
            return 'application/javascript'
        # 確保 CSS 檔案有正確的 MIME 類型
        elif path.endswith('.css'):
            return 'text/css'

        # 使用父類的方法作為預設
        return super().guess_type(path)

    def log_message(self, format, *args):
        """自訂日誌訊息格式"""
        print(f"[{self.address_string()}] {format % args}")

def find_available_port(start_port=DEFAULT_PORT, max_attempts=10):
    """尋找可用的端口"""
    import socket

    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((DEFAULT_HOST, port))
                return port
        except OSError:
            continue

    raise OSError(f"無法在 {start_port}-{start_port + max_attempts - 1} 範圍內找到可用端口")

def signal_handler(sig, frame):
    """處理 Ctrl+C 中斷信號"""
    print("\n\n🔴 伺服器已停止")
    print("感謝使用小熊貓開發伺服器！🐾")
    sys.exit(0)

def start_server(port=None, host=DEFAULT_HOST, auto_open=True):
    """啟動開發伺服器"""

    # 檢查是否在正確的目錄
    if not os.path.exists('pages/index.html'):
        print("❌ 錯誤：找不到 pages/index.html")
        print("請確保你在包含網站檔案的目錄中執行此腳本")
        return

    # 尋找可用端口
    if port is None:
        try:
            port = find_available_port()
        except OSError as e:
            print(f"❌ 錯誤：{e}")
            return

    # 設定中斷信號處理
    signal.signal(signal.SIGINT, signal_handler)

    try:
        # 創建伺服器
        with socketserver.TCPServer((host, port), CustomHTTPRequestHandler) as httpd:
            server_url = f"http://{host}:{port}"

            print("🌟 小熊貓網站開發伺服器")
            print("=" * 40)
            print(f"🚀 伺服器啟動成功！")
            print(f"📍 網址：{server_url}")
            print(f"📁 目錄：{os.getcwd()}")
            print("=" * 40)
            print("📱 功能頁面：")
            print(f"   主頁：{server_url}/")
            print(f"   亞種比較：{server_url}/pages/compare.html")
            print(f"   知識測驗：{server_url}/pages/quiz.html")
            print(f"   圖片藝廊：{server_url}/pages/gallery.html")
            print(f"   分佈地圖：{server_url}/pages/map.html")
            print("=" * 40)
            print("⏹️  按 Ctrl+C 停止伺服器")
            print()

            # 自動開啟瀏覽器
            if auto_open:
                print("🌐 正在開啟瀏覽器...")
                try:
                    webbrowser.open(server_url)
                except Exception as e:
                    print(f"⚠️  無法自動開啟瀏覽器：{e}")
                    print(f"請手動開啟：{server_url}")

            # 啟動伺服器
            httpd.serve_forever()

    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ 錯誤：端口 {port} 已被使用")
            print("請嘗試使用不同的端口：")
            print(f"python server.py --port {port + 1}")
        else:
            print(f"❌ 伺服器啟動失敗：{e}")

def main():
    """主函數"""
    import argparse

    parser = argparse.ArgumentParser(
        description="小熊貓網站本地開發伺服器",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用範例：
  python server.py                    # 使用預設設定啟動
  python server.py --port 3000        # 使用指定端口
  python server.py --no-browser       # 不自動開啟瀏覽器
  python server.py --host 0.0.0.0     # 允許外部連接
        """
    )

    parser.add_argument(
        '--port', '-p',
        type=int,
        help=f'伺服器端口 (預設: {DEFAULT_PORT})'
    )

    parser.add_argument(
        '--host',
        default=DEFAULT_HOST,
        help=f'伺服器主機 (預設: {DEFAULT_HOST})'
    )

    parser.add_argument(
        '--no-browser',
        action='store_true',
        help='不自動開啟瀏覽器'
    )

    args = parser.parse_args()

    # 啟動伺服器
    start_server(
        port=args.port,
        host=args.host,
        auto_open=not args.no_browser
    )

if __name__ == "__main__":
    main()