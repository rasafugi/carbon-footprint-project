from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# 引入我們剛剛建立的藍圖
from routes.auth import auth_bp
from routes.calculation import calc_bp
from routes.stats import stats_bp

# 載入環境變數
load_dotenv()

app = Flask(__name__)

# --- 1. 設定 Session 與 安全性 ---
app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key_change_in_production")
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # 開發環境 (HTTP) 設為 False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_PATH'] = '/'

# --- 2. 設定 CORS ---
# 允許前端 (Port 5173) 跨域存取後端
CORS(app, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# --- 3. 註冊藍圖 (Blueprints) ---
# 將 auth.py 的路由掛載到 /api 下 (例如: /api/login)
app.register_blueprint(auth_bp, url_prefix='/api')

# 將 calculation.py 的路由掛載到 /api/calculate 下 (例如: /api/calculate/quick)
app.register_blueprint(calc_bp, url_prefix='/api/calculate')

app.register_blueprint(stats_bp, url_prefix='/api/stats')

# 測試用首頁
@app.route('/')
def home():
    return "Carbon Footprint API is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')