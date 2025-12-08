# app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db_manager import get_db_connection
from services.calculator import calculate_quick_footprint
import json
import os

app = Flask(__name__)

# --- 1. 設定 Session 安全性 (關鍵修正) ---
app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key_change_in_production")
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # ✅ 改為 None，允許跨域傳送
app.config['SESSION_COOKIE_SECURE'] = False     # ⚠️ 本機開發使用 HTTP 必須是 False
app.config['SESSION_COOKIE_HTTPONLY'] = True    # ✅ 防止 XSS 攻擊
app.config['SESSION_COOKIE_PATH'] = '/'         # ✅ 確保所有路徑都能存取

# --- 2. 設定 CORS (關鍵修正) ---
CORS(app, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # ✅ 明確列出前端網址
     supports_credentials=True,  # ✅ 允許傳送 Cookie
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# --- API 路由 ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    required_fields = ['username', 'email', 'password', 'fullName', 'gender', 'city', 'district', 'birthdate', 'occupation']
    if not all(k in data for k in required_fields):
        return jsonify({"error": "缺少必填欄位"}), 400

    gender_val = data['gender']
    gender_other_val = data.get('genderOther', None) if gender_val == 'Other' else None

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (data['username'], data['email']))
        if cursor.fetchone():
            return jsonify({"error": "帳號或 Email 已被註冊"}), 409

        hashed_password = generate_password_hash(data['password'])
        
        sql = """
            INSERT INTO users (username, email, password_hash, full_name, gender, gender_other, city, district, birthdate, occupation)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        val = (
            data['username'], data['email'], hashed_password, 
            data['fullName'], gender_val, gender_other_val,
            data['city'], data['district'], data['birthdate'], data['occupation']
        )
        cursor.execute(sql, val)
        conn.commit()
        
        return jsonify({"message": "註冊成功！請登入"}), 201

    except Exception as e:
        print(f"Register Error: {e}")
        return jsonify({"error": "伺服器錯誤"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password_hash'], password):
            # ✅ 登入成功，寫入 Session
            session.clear()  # 清除舊 session
            session['user_id'] = user['id']
            session['username'] = user['username']
            session.permanent = True  # ✅ 設定為永久 session
            
            print(f"✅ Login Success: User {username} logged in, session ID: {session.get('user_id')}")  # Debug
            
            return jsonify({
                "message": "登入成功",
                "user": {"username": user['username'], "fullName": user['full_name']}
            }), 200
        else:
            return jsonify({"error": "帳號或密碼錯誤"}), 401

    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ✅ 新增：檢查登入狀態 API
@app.route('/api/me', methods=['GET'])
def get_current_user():
    """檢查使用者是否已登入"""
    print(f"🔍 Session Check: {session}")  # Debug
    
    if 'user_id' in session:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT username, full_name FROM users WHERE id = %s", (session['user_id'],))
            user = cursor.fetchone()
            if user:
                return jsonify({
                    "is_logged_in": True,
                    "user": {"username": user['username'], "fullName": user['full_name']}
                }), 200
        finally:
            cursor.close()
            conn.close()
    
    return jsonify({"is_logged_in": False}), 401

@app.route('/api/calculate/quick', methods=['POST'])
def quick_calculation():
    """快速估算 API - 需要登入"""
    print(f"🔍 Quick Calc Session: {session}")  # ✅ Debug: 檢查 session 內容
    
    if 'user_id' not in session:
        print("❌ Unauthorized: No user_id in session")  # Debug
        return jsonify({"error": "請先登入"}), 401
    
    data = request.json
    print(f"📊 Calculation Input: {data}")  # Debug

    try:
        result = calculate_quick_footprint(data)
        
        # 儲存計算結果到資料庫
        conn = get_db_connection()
        cursor = conn.cursor()
        
        sql = """
            INSERT INTO carbon_logs (user_id, log_type, input_data, total_carbon, breakdown, suggestions)
            VALUES (%s, 'Quick', %s, %s, %s, %s)
        """
        val = (
            session['user_id'],
            json.dumps(data),
            result['total'],
            json.dumps(result['breakdown']),
            result['suggestion']
        )
        cursor.execute(sql, val)
        conn.commit()
        cursor.close()
        conn.close()

        print(f"✅ Calculation Success: {result}")  # Debug
        return jsonify(result), 200

    except Exception as e:
        print(f"❌ Calculation Error: {e}")
        return jsonify({"error": "計算失敗"}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    print("✅ User logged out")  # Debug
    return jsonify({"message": "已登出"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)