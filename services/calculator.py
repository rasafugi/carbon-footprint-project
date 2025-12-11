# services/calculator.py
from .carbon_data import get_latest_coeffs

def generate_smart_suggestion(total, breakdown, data, mode):
    """
    智慧建議產生器
    params:
      total: 總碳排量 (float)
      breakdown: 各類別佔比 (dict)
      data: 使用者原始輸入 (dict)
      mode: 'Quick' 或 'Detailed'
    """
    
    # 1. 總量評級 (Total Assessment)
    # 參考標準：台灣人均約 10~11噸，但個人生活(不含工業)約 2~3噸
    # 這裡設定比較嚴格的標準來鼓勵減碳
    prefix = ""
    if total > 5000:
        prefix = "⚠️ 您的年度碳排顯著高於平均！建議您採取積極行動。"
    elif total > 2500:
        prefix = "您的碳排略高於平均水準，仍有進步空間。"
    elif total < 1000:
        prefix = "🌟 太棒了！您的生活方式相當環保，是減碳模範生！"
    else:
        prefix = "您的碳排控制在合理範圍內，請繼續保持。"

    # 2. 找出最大排放源 (Top Source)
    sorted_sources = sorted(breakdown.items(), key=lambda x: x[1], reverse=True)
    if not sorted_sources:
        return "資料不足，無法提供建議。"
    
    top_source, top_amount = sorted_sources[0]
    suggestion = ""

    # 3. 針對不同類別與「使用者輸入細節」給出精準建議
    
    # === 情境 A: 飲食 (Diet) ===
    if top_source == 'diet':
        # 判斷是否為素食者
        is_veg = False
        if mode == 'Quick' and data.get('diet') == 'vegetarian':
            is_veg = True
        elif mode == 'Detailed' and float(data['diet'].get('meat', 0)) == 0:
            is_veg = True
            
        if is_veg:
            suggestion = "雖然您已是蔬食者，但飲食仍佔最高比例。這可能來自加工食品、進口食材的運輸碳排。建議多選擇「在地、原型」食物，減少隱形成本。"
        else:
            suggestion = "飲食是您最大的碳排來源。畜牧業（尤其是牛肉）碳排極高，建議嘗試「每週一日蔬食」，或將紅肉替換為碳排較低的雞肉或魚肉。"

    # === 情境 B: 交通 (Transport) ===
    elif top_source == 'transport':
        # 判斷交通工具類型
        trans_type = data.get('commute') if mode == 'Quick' else data['transport'].get('type')
        
        if trans_type in ['scooter_gas', 'car_gas']:
            suggestion = "交通通勤是您的最大負擔。燃油車輛效率較低，建議每週 1-2 天改搭大眾運輸，或在未來換車時優先考慮電動車 (EV)。"
        elif trans_type in ['public', 'bus', 'mrt', 'train', 'hsr']:
            suggestion = "交通佔比較高。雖然您已使用大眾運輸，但長距離移動仍會累積碳排。建議檢視是否能減少不必要的長途行程，或嘗試遠距辦公。"
        else: # 電動車或走路
            suggestion = "您的交通工具已經很環保，但移動距離可能過長。請繼續保持低碳移動習慣！"

    # === 情境 C: 能源 (Energy) - Detailed Only ===
    elif top_source == 'energy':
        suggestion = "家庭能源（水電瓦斯）是最大來源。台灣電力排碳係數較高，建議將家中老舊電器更換為一級能效產品，並將冷氣設定在 26-28 度搭配電扇。"

    # === 情境 D: 消費 (Consumption) ===
    elif top_source == 'consumption':
        suggestion = "生活消費佔比最高。製造一支手機或一件衣服都會產生大量「隱含碳排」。建議「以修代買」延長產品壽命，或優先購買二手良品。"
        
    # === 情境 E: 廢棄物 (Waste) ===
    elif top_source == 'waste':
        suggestion = "廢棄物處理佔比最高。請確實做好資源回收（紙類、塑膠），並嘗試自備購物袋與容器，以此減少一次性垃圾的產生。"

    return f"{prefix} {suggestion}"

def calculate_quick_footprint(data):
    """
    快速估算邏輯
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

    # ✨ 5. 使用新的智慧建議函式
    suggestion = generate_smart_suggestion(total, breakdown, data, mode='Quick')

    return {
        "total": round(total, 1),
        "breakdown": breakdown,
        "suggestion": suggestion
    }

def calculate_detailed_footprint(data):
    """
    詳細分析邏輯
    """
    TAIWAN_COEFFS = get_latest_coeffs()
    
    # 1. 能源 (Module A)
    elec_coeff = TAIWAN_COEFFS['energy'].get('electricity', 0.495)
    water_coeff = TAIWAN_COEFFS['energy'].get('water', 0.15)
    gas_coeff = TAIWAN_COEFFS['energy'].get('gas', 2.1)
    
    elec_total = float(data['energy']['electricity']) * 12 * elec_coeff
    water_total = float(data['energy']['water']) * 12 * water_coeff
    gas_total = float(data['energy']['gas']) * 12 * gas_coeff
    energy_sum = elec_total + water_total + gas_total

    # 2. 交通 (Module B)
    trans_type = data['transport']['type']
    trans_coeff = TAIWAN_COEFFS["transport"].get(trans_type, 0.046)
    trans_sum = float(data['transport']['km']) * 12 * trans_coeff

    # 3. 飲食 (Module C)
    meat_sum = float(data['diet']['meat']) * 52 * 1.5
    veg_sum = float(data['diet']['veg']) * 52 * 0.3
    grain_sum = float(data['diet']['grain']) * 52 * 0.5
    diet_sum = meat_sum + veg_sum + grain_sum

    # 4. 消費 (Module D)
    clothes_sum = (float(data['consumption']['clothes']) * 12 / 1000) * 0.5
    elec_goods_sum = (float(data['consumption']['electronics']) * 12 / 1000) * 1.0
    cons_sum = clothes_sum + elec_goods_sum

    # 5. 廢棄物 (Module E)
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

    # ✨ 6. 使用新的智慧建議函式
    suggestion = generate_smart_suggestion(total, breakdown, data, mode='Detailed')

    return {
        "total": round(total, 1),
        "breakdown": breakdown,
        "suggestion": suggestion
    }