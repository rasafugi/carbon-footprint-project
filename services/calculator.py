# services/calculator.py
from .carbon_data import get_latest_coeffs, SUGGESTIONS_DB

def calculate_quick_footprint(data):
    """
    快速估算邏輯 (保持不變)
    """
    TAIWAN_COEFFS = get_latest_coeffs()

    # 1. 交通計算
    AVG_COMMUTE_KM_YEAR = 20 * 250 
    transport_coeff = TAIWAN_COEFFS["transport"].get(data.get("commute"), 0.046)
    transport_total = transport_coeff * AVG_COMMUTE_KM_YEAR

    # 2. 飲食計算
    diet_coeff = TAIWAN_COEFFS["diet"].get(data.get("diet"), 3.8)
    diet_total = diet_coeff * 365

    # 3. 消費計算
    shopping_map = {"low": 10000, "medium": 20000, "high": 40000}
    monthly_spend = shopping_map.get(data.get("shopping"), 20000)
    consumption_coeff = TAIWAN_COEFFS["consumption"].get(data.get("shopping"), 0.6)
    consumption_total = (monthly_spend * 12) * (consumption_coeff / 1000)

    # 4. 彙整
    total = transport_total + diet_total + consumption_total
    breakdown = {
        "transport": round(transport_total, 1),
        "diet": round(diet_total, 1),
        "consumption": round(consumption_total, 1)
    }

    # 5. 建議
    sorted_sources = sorted(breakdown.items(), key=lambda item: item[1], reverse=True)
    top_source = sorted_sources[0][0]
    import random
    suggestion = random.choice(SUGGESTIONS_DB.get(top_source, ["請持續關注您的碳排放。"]))

    return {
        "total": round(total, 1),
        "breakdown": breakdown,
        "top_source": top_source,
        "suggestion": suggestion
    }

def calculate_detailed_footprint(data):
    """
    詳細分析邏輯 (Module A-E)
    Input: {
        "energy": { "electricity": 300, "gas": 20, "water": 15 }, # 月平均
        "transport": { "km": 500, "type": "scooter_gas" },        # 月里程
        "diet": { "meat": 5, "veg": 10, "grain": 15 },            # 週攝取次數
        "consumption": { "clothes": 2000, "electronics": 5000 },  # 月支出
        "waste": { "bags": 10, "recycle": 5 }                     # 週垃圾量
    }
    """
    TAIWAN_COEFFS = get_latest_coeffs()
    # 1. 能源 (Module A) - 年化計算
    # 係數：電力 0.495 kg/度, 水 0.15 kg/度, 瓦斯 2.1 kg/m3 (概抓)
    elec_total = float(data['energy']['electricity']) * 12 * 0.495
    water_total = float(data['energy']['water']) * 12 * 0.15
    gas_total = float(data['energy']['gas']) * 12 * 2.1
    energy_sum = elec_total + water_total + gas_total

    # 2. 交通 (Module B) - 年化
    # 使用 carbon_data.py 定義的係數
    trans_type = data['transport']['type']
    trans_coeff = TAIWAN_COEFFS["transport"].get(trans_type, 0.046)
    trans_sum = float(data['transport']['km']) * 12 * trans_coeff

    # 3. 飲食 (Module C) - 年化
    # 假設每餐平均碳排：肉類 1.5kg, 素食 0.3kg, 澱粉 0.5kg
    # data['diet'] 是 "每週幾餐"
    meat_sum = float(data['diet']['meat']) * 52 * 1.5
    veg_sum = float(data['diet']['veg']) * 52 * 0.3
    diet_sum = meat_sum + veg_sum

    # 4. 消費 (Module D) - 年化
    # 係數：衣物 0.5 kg/千元, 電子 1.0 kg/千元
    clothes_sum = (float(data['consumption']['clothes']) * 12 / 1000) * 0.5
    elec_goods_sum = (float(data['consumption']['electronics']) * 12 / 1000) * 1.0
    cons_sum = clothes_sum + elec_goods_sum

    # 5. 廢棄物 (Module E) - 年化
    # 垃圾袋(14L)約 0.8 kgCO2e, 回收可減碳 (負值) -0.5 kg
    trash_sum = float(data['waste']['bags']) * 52 * 0.8
    recycle_sum = float(data['waste']['recycle']) * 52 * (-0.5)
    waste_sum = trash_sum + recycle_sum

    # 彙整
    total = energy_sum + trans_sum + diet_sum + cons_sum + waste_sum
    breakdown = {
        "energy": round(energy_sum, 1),
        "transport": round(trans_sum, 1),
        "diet": round(diet_sum, 1),
        "consumption": round(cons_sum, 1),
        "waste": round(waste_sum, 1)
    }

    # 找出最高排放源並給建議
    sorted_sources = sorted(breakdown.items(), key=lambda item: item[1], reverse=True)
    top_source = sorted_sources[0][0]
    
    # 針對詳細版給一些簡單建議 (也可擴充 SUGGESTIONS_DB)
    import random
    suggestion = random.choice(SUGGESTIONS_DB.get(top_source, ["您的生活方式已經相當環保！"]))

    return {
        "total": round(total, 1),
        "breakdown": breakdown,
        "top_source": top_source,
        "suggestion": suggestion
    }