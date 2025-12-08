# services/calculator.py
from .carbon_data import TAIWAN_COEFFS, SUGGESTIONS_DB

def calculate_quick_footprint(data):
    """
    快速估算邏輯
    Input: { "commute": "scooter_gas", "diet": "meat_heavy", "shopping": "high" }
    Output: { total, breakdown, top_source, suggestions }
    """
    
    # 1. 交通計算 (假設每日通勤 20km * 365天)
    # 快速版假設平均值，詳細版才讓使用者填公里數
    AVG_COMMUTE_KM_YEAR = 20 * 250 # 上班日
    transport_coeff = TAIWAN_COEFFS["transport"].get(data.get("commute"), 0.046)
    transport_total = transport_coeff * AVG_COMMUTE_KM_YEAR

    # 2. 飲食計算 (係數 * 365天)
    diet_coeff = TAIWAN_COEFFS["diet"].get(data.get("diet"), 3.8)
    diet_total = diet_coeff * 365

    # 3. 消費計算 (假設月支出 * 12個月)
    # low: 10000元, medium: 20000元, high: 40000元
    shopping_map = {"low": 10000, "medium": 20000, "high": 40000}
    monthly_spend = shopping_map.get(data.get("shopping"), 20000)
    consumption_coeff = TAIWAN_COEFFS["consumption"].get(data.get("shopping"), 0.6)
    # 係數是以 "每1000元" 為單位大致估算 (除以1000)
    consumption_total = (monthly_spend * 12) * (consumption_coeff / 1000)

    # 4. 彙整結果
    total = transport_total + diet_total + consumption_total
    breakdown = {
        "transport": round(transport_total, 1),
        "diet": round(diet_total, 1),
        "consumption": round(consumption_total, 1)
    }

    # 5. 找出最大來源並給建議
    sorted_sources = sorted(breakdown.items(), key=lambda item: item[1], reverse=True)
    top_source = sorted_sources[0][0] # e.g., "diet"
    
    # 隨機或固定選取該類別的建議
    import random
    suggestion = random.choice(SUGGESTIONS_DB[top_source])

    return {
        "total": round(total, 1),
        "breakdown": breakdown,
        "top_source": top_source,
        "suggestion": suggestion
    }