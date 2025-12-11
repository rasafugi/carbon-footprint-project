# services/carbon_data.py
import requests
import csv
import io
import time

# ==========================================
# 設定區
# ==========================================
# 請將此網址換成你放在網路上的 JSON Raw URL
# 範例：GitHub Gist 的 Raw 連結
DATA_SOURCE_URL = "https://gist.githubusercontent.com/rasafugi/341375417c0ac852a67959f388b53b14/raw/carbon_data.json"

ENERGY_CSV_URL = "https://service.taipower.com.tw/data/opendata/apply/file/d061001/001.csv"

# 更新頻率 (秒) - 這裡設定為 1 小時 (3600秒) 更新一次
UPDATE_INTERVAL = 3600 

# ==========================================
# 預設備用資料 (Fallback Data)
# 當網路斷線或 API 掛掉時，使用這份資料以免程式崩潰
# ==========================================
DEFAULT_COEFFS = {
    "transport": {
        "scooter_gas": 0.046, 
        "scooter_electric": 0.015,
        "car_gas": 0.173,
        "car_electric": 0.050,
        "public": 0.035,
        "bike": 0.0
    },
    "diet": {
        "meat_heavy": 6.5,
        "balanced": 3.8,
        "convenience": 4.5,
        "vegetarian": 1.5
    },
    "consumption": {
        "low": 0.4,
        "medium": 0.6,
        "high": 0.9
    },
    "energy": {
        "electricity": 0.495,
        "water": 0.150,       # ✨ 新增：自來水係數 (台水 2024)
        "gas": 2.63
    }
}

# ==========================================
# 快取機制 (In-Memory Cache)
# ==========================================
_cache = None           # 儲存下載下來的資料
_last_update_time = 0   # 上次更新的時間戳記

def fetch_energy_coefficient():
    """
    從台電 Open Data 抓取最新的電力排碳係數
    回傳: float (例如 0.495)
    """
    try:
        print(f"⚡ 正在下載能源數據: {ENERGY_CSV_URL} ...")
        response = requests.get(ENERGY_CSV_URL, timeout=10)
        response.raise_for_status()
        
        # 處理編碼 (台灣政府資料常見 big5 或 utf-8-sig)
        response.encoding = 'utf-8-sig' 
        
        # 使用 csv 模組解析文字內容
        csv_data = csv.reader(io.StringIO(response.text))
        
        # 跳過標題列 (通常第一行是欄位名稱)
        header = next(csv_data, None)
        
        # 尋找最新年份的數據
        latest_year = 0
        latest_coeff = 0.495 # 預設值
        
        for row in csv_data:
            # 假設 CSV 格式為：[年度, 國家電力排放係數, 台電公司排放係數]
            # 例如: ['111', '0.495', '0.495']
            if len(row) >= 2:
                try:
                    year = int(row[0]) # 民國年
                    coeff = float(row[1])
                    
                    # 如果這一行的年份比較新，就更新
                    if year > latest_year:
                        latest_year = year
                        latest_coeff = coeff
                except ValueError:
                    continue # 跳過無法轉換的行 (例如備註)
                    
        print(f"✅ 成功取得 {latest_year} 年電力係數: {latest_coeff}")
        return latest_coeff

    except Exception as e:
        print(f"⚠️ 能源數據更新失敗: {e}")
        return None # 回傳 None 代表失敗，讓主程式決定用備用值

def get_latest_coeffs():
    """
    智慧取得係數函式：
    1. 檢查快取是否存在且未過期 -> 回傳快取 (速度快)
    2. 若過期 -> 上網下載 -> 更新快取 -> 回傳 (資料新)
    3. 若下載失敗 -> 回傳預設值 (系統穩)
    """
    global _cache, _last_update_time
    current_time = time.time()
    
    if _cache is None or (current_time - _last_update_time > UPDATE_INTERVAL):
        print("🔄 開始更新碳排係數...")
        new_data = DEFAULT_COEFFS.copy()
        
        # 1. 更新電力 (Live Data)
        elec_val = fetch_energy_coefficient()
        if elec_val:
            new_data['energy']['electricity'] = elec_val
            
        # 2. 更新水與瓦斯 (如果有 Gist API 則從那邊抓，否則維持預設)
        # 實作概念：你的 Gist JSON 應該包含 {"energy": {"water": 0.152, "gas": 2.1}}
        try:
            # 只有當你有真的 Gist URL 時才打開這段
            resp = requests.get(DATA_SOURCE_URL, timeout=3)
            if resp.status_code == 200:
                 remote_data = resp.json()
                 # 智慧合併：只更新有的欄位
                 if 'energy' in remote_data:
                     if 'water' in remote_data['energy']:
                         new_data['energy']['water'] = remote_data['energy']['water']
                     if 'gas' in remote_data['energy']:
                         new_data['energy']['gas'] = remote_data['energy']['gas']
            pass # 暫時跳過
        except Exception as e:
            print(f"⚠️ 雲端參數更新失敗: {e}")

        _cache = new_data
        _last_update_time = current_time
        print("✅ 係數更新完成")
    
    return _cache

# 建議資料庫維持靜態即可，通常不需頻繁更新，若要更新邏輯同上
SUGGESTIONS_DB = {
    "transport": [
        "您的交通碳排較高。建議每週一天改搭捷運或公車，每年可減少約 50kg 碳排。",
        "考慮將燃油機車汰換為電動機車，能降低約 60% 的通勤碳足跡。",
        "短程移動（2公里內）嘗試使用 YouBike，既健康又環保。"
    ],
    "diet": [
        "飲食碳排是您的主要來源。嘗試響應「週一無肉日」，減少紅肉攝取。",
        "選擇在地當季食材，減少食物里程帶來的隱含碳排。",
        "減少購買瓶裝水與手搖飲，自備環保杯是降低垃圾量的第一步。"
    ],
    "consumption": [
        "消費碳排偏高。購買電子產品前，思考是「需要」還是「想要」。",
        "嘗試二手衣物交換或購買二手良品，延長產品生命週期。",
        "支持提供碳足跡標籤的綠色商品。"
    ]
}