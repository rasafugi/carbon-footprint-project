from flask import Blueprint, request, jsonify, session
from db_manager import get_db_connection
# 引入計算服務
from services.calculator import calculate_quick_footprint, calculate_detailed_footprint
import json

# 定義藍圖，名稱為 'calculation'
calc_bp = Blueprint('calculation', __name__)

@calc_bp.route('/quick', methods=['POST'])
def quick_calculation():
    """快速估算 API - 需要登入"""
    # 1. 檢查登入狀態
    if 'user_id' not in session:
        return jsonify({"error": "請先登入"}), 401
    
    data = request.json
    
    try:
        # 2. 呼叫快速計算邏輯 (來自 services/calculator.py)
        result = calculate_quick_footprint(data)
        
        # 3. 寫入資料庫
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "資料庫連線失敗"}), 500
            
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

        # 4. 回傳結果給前端 (這行最重要，之前就是少了回傳)
        return jsonify(result), 200

    except Exception as e:
        print(f"❌ Quick Calc Error: {e}")
        return jsonify({"error": "計算失敗"}), 500

@calc_bp.route('/detailed', methods=['POST'])
def detailed_calculation():
    """詳細估算 API - 需要登入"""
    print(f"🔍 Detailed Calc Session: {session}")
    
    if 'user_id' not in session:
        return jsonify({"error": "請先登入"}), 401
    
    data = request.json
    print(f"📊 Detailed Input: {data}")

    try:
        # 呼叫詳細計算邏輯
        result = calculate_detailed_footprint(data)
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "資料庫連線失敗"}), 500

        cursor = conn.cursor()
        
        # 寫入資料庫，log_type 設為 'Detailed'
        sql = """
            INSERT INTO carbon_logs (user_id, log_type, input_data, total_carbon, breakdown, suggestions)
            VALUES (%s, 'Detailed', %s, %s, %s, %s)
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
        print(f"❌ Detailed Calc Error: {e}")
        return jsonify({"error": "計算失敗"}), 500

# ✨ 新增：取得歷史紀錄 API
@calc_bp.route('/history', methods=['GET'])
def get_history():
    """取得使用者歷史紀錄"""
    if 'user_id' not in session:
        return jsonify({"error": "請先登入"}), 401

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "資料庫連線失敗"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        # 依照時間倒序排列 (最新的在最上面)
        sql = "SELECT * FROM carbon_logs WHERE user_id = %s ORDER BY created_at DESC"
        cursor.execute(sql, (session['user_id'],))
        logs = cursor.fetchall()
        
        return jsonify(logs), 200

    except Exception as e:
        print(f"❌ History Error: {e}")
        return jsonify({"error": "無法取得紀錄"}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()