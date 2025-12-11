from flask import Blueprint, request, jsonify
from db_manager import get_db_connection
import json

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/region', methods=['GET'])
def get_regional_stats():
    city = request.args.get('city')
    district = request.args.get('district')

    # ✨ 修改 1：不再強制檢查 city
    # if not city: return jsonify({"error": "請選擇縣市"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # ✨ 修改 2：使用動態 SQL 組裝
        # WHERE 1=1 是一個常用的技巧，方便後面動態串接 AND
        query = """
            SELECT l.total_carbon, l.breakdown, l.log_type
            FROM carbon_logs l
            JOIN users u ON l.user_id = u.id
            WHERE 1=1
        """
        params = []

        # 如果有指定城市，才加入篩選條件
        if city:
            query += " AND u.city = %s"
            params.append(city)

        # 如果有指定行政區，才加入篩選條件
        if district:
            query += " AND u.district = %s"
            params.append(district)

        cursor.execute(query, tuple(params))
        logs = cursor.fetchall()

        # 2. 如果沒數據，回傳空結果
        if not logs:
            return jsonify({
                "sample_count": 0,
                "avg_total": 0,
                "breakdown_avg": {},
                "top_source": "無資料"
            })

        # 3. Python 端計算統計數據 (邏輯保持不變)
        total_sum = 0
        breakdown_sums = {}
        valid_count = 0

        for log in logs:
            total_sum += log['total_carbon']
            valid_count += 1
            
            try:
                bd = log['breakdown']
                if isinstance(bd, str):
                    bd = json.loads(bd)
                
                for key, val in bd.items():
                    breakdown_sums[key] = breakdown_sums.get(key, 0) + val
            except:
                continue

        avg_total = round(total_sum / valid_count, 1)
        avg_breakdown = {k: round(v / valid_count, 1) for k, v in breakdown_sums.items()}

        source_map = {
            "transport": "交通", "diet": "飲食", "energy": "能源", 
            "consumption": "消費", "waste": "廢棄物"
        }
        
        top_source_key = max(avg_breakdown, key=avg_breakdown.get) if avg_breakdown else "無"
        top_source_zh = source_map.get(top_source_key, top_source_key)

        chart_data = [
            {"name": source_map.get(k, k), "value": v} 
            for k, v in avg_breakdown.items()
        ]

        return jsonify({
            "sample_count": valid_count,
            "avg_total": avg_total,
            "breakdown_avg": avg_breakdown,
            "top_source": top_source_zh,
            "chart_data": chart_data
        })

    except Exception as e:
        print(f"Stats Error: {e}")
        return jsonify({"error": "統計失敗"}), 500
    finally:
        cursor.close()
        conn.close()