from flask import Blueprint, request, jsonify, session
from db_manager import get_db_connection
from services.calculator import calculate_quick_footprint
import json

# 定義藍圖，名稱為 'calculation'
calc_bp = Blueprint('calculation', __name__)

@calc_bp.route('/quick', methods=['POST'])
def quick_calculation():
    """快速估算 API - 需要登入"""
    print(f"🔍 Quick Calc Session: {session}")
    
    if 'user_id' not in session:
        print("❌ Unauthorized: No user_id in session")
        return jsonify({"error": "請先登入"}), 401
    
    data = request.json
    print(f"📊 Calculation Input: {data}")

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

        print(f"✅ Calculation Success: {result}")
        return jsonify(result), 200

    except Exception as e:
        print(f"❌ Calculation Error: {e}")
        return jsonify({"error": "計算失敗"}), 500