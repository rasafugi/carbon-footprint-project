from flask import Blueprint, request, jsonify
from db_manager import get_db_connection
import json

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/region', methods=['GET'])
def get_regional_stats():
    city = request.args.get('city')
    district = request.args.get('district')

    if not city:
        return jsonify({"error": "請選擇縣市"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1. 構建 SQL 查詢
        # 我們需要 JOIN users 表 (拿地區) 和 carbon_logs 表 (拿碳排數據)
        query = """
            SELECT l.total_carbon, l.breakdown, l.log_type
            FROM carbon_logs l
            JOIN users u ON l.user_id = u.id
            WHERE u.city = %s
        """
        params = [city]

        # 如果有選行政區，就多加一個篩選條件
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

        # 3. Python 端計算統計數據
        total_sum = 0
        breakdown_sums = {}
        valid_count = 0

        for log in logs:
            total_sum += log['total_carbon']
            valid_count += 1
            
            # 解析 JSON breakdown
            try:
                # 資料庫取出的可能是 dict 或 str (視 driver 而定)
                bd = log['breakdown']
                if isinstance(bd, str):
                    bd = json.loads(bd)
                
                for key, val in bd.items():
                    breakdown_sums[key] = breakdown_sums.get(key, 0) + val
            except:
                continue

        # 計算平均
        avg_total = round(total_sum / valid_count, 1)
        avg_breakdown = {k: round(v / valid_count, 1) for k, v in breakdown_sums.items()}

        # 找出最高排放源 (將英文轉中文)
        source_map = {
            "transport": "交通", "diet": "飲食", "energy": "能源", 
            "consumption": "消費", "waste": "廢棄物"
        }
        
        top_source_key = max(avg_breakdown, key=avg_breakdown.get) if avg_breakdown else "無"
        top_source_zh = source_map.get(top_source_key, top_source_key)

        # 準備圖表需要的陣列格式 (Recharts 用)
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