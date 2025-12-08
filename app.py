# app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db_manager import get_db_connection  # 引入剛剛寫的模組
from services.calculator import calculate_quick_footprint
import json
import os

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key") # 用於 Session 加密
CORS(app, supports_credentials=True) # 允許跨域請求與 Cookie

# --- API 路由 ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    # 1. 驗證必填欄位
    required_fields = ['username', 'email', 'password', 'fullName', 'gender', 'city', 'district', 'birthdate', 'occupation']
    if not all(k in data for k in required_fields):
        return jsonify({"error": "缺少必填欄位"}), 400

    # 2. 處理性別 (如果是 Other，讀取 genderOther)
    gender_val = data['gender']
    gender_other_val = data.get('genderOther', None) if gender_val == 'Other' else None

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 3. 檢查帳號或 Email 是否重複
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (data['username'], data['email']))
        if cursor.fetchone():
            return jsonify({"error": "帳號或 Email 已被註冊"}), 409

        # 4. 密碼加密與寫入資料庫
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
        print(f"Error: {e}")
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
        # 1. 撈取使用者
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        # 2. 比對密碼
        if user and check_password_hash(user['password_hash'], password):
            # 登入成功，寫入 Session
            session['user_id'] = user['id']
            session['username'] = user['username']
            return jsonify({
                "message": "登入成功",
                "user": {"username": user['username'], "fullName": user['full_name']}
            }), 200
        else:
            return jsonify({"error": "帳號或密碼錯誤"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/calculate/quick', methods=['POST'])
def quick_calculation():
    """ 快速估算 API """
    if 'user_id' not in session:
        return jsonify({"error": "請先登入"}), 401
    
    data = request.json
    # data 預期格式: { "commute": "scooter_gas", "diet": "balanced", "shopping": "medium" }

    try:
        # 1. 呼叫微服務進行計算
        result = calculate_quick_footprint(data)
        
        # 2. 儲存結果到資料庫
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

        return jsonify(result), 200

    except Exception as e:
        print(f"Calculation Error: {e}")
        return jsonify({"error": "計算失敗"}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "已登出"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)