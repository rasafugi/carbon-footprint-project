import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",      # 你的 MySQL 帳號
        password="Funny==1206_Do_1009*ro", # 你的 MySQL 密碼
        database="carbon_project"
    )
    print("✅ 成功連接到 MySQL 資料庫！環境設定完成！")
    conn.close()
except Exception as e:
    print(f"❌ 連接失敗: {e}")