from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from db_manager import get_db_connection

# 定義藍圖，名稱為 'auth'
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
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

@auth_bp.route('/login', methods=['POST'])
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
            # 登入成功，寫入 Session
            session.clear()
            session['user_id'] = user['id']
            session['username'] = user['username']
            session.permanent = True
            
            print(f"✅ Login Success: User {username} logged in, session ID: {session.get('user_id')}")
            
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

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """檢查使用者是否已登入"""
    print(f"🔍 Session Check: {session}")
    
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

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    print("✅ User logged out")
    return jsonify({"message": "已登出"}), 200