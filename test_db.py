import mysql.connector
import os
from dotenv import load_dotenv

# 1. 載入 .env 檔案中的變數
load_dotenv()

try:
    conn = mysql.connector.connect(
        # 2. 使用 os.getenv 讀取變數
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    print("✅ 成功連接到 MySQL 資料庫！(使用環境變數)")
    conn.close()
except Exception as e:
    print(f"❌ 連接失敗: {e}")