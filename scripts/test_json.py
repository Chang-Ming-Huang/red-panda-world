#!/usr/bin/env python3
"""
JSON 資料檔案驗證工具
Validates all JSON data files for syntax and structure
"""

import json
import os
from pathlib import Path

def test_json_file(file_path):
    """測試單個 JSON 檔案"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return True, data, None
    except json.JSONDecodeError as e:
        return False, None, f"JSON 語法錯誤：{e}"
    except Exception as e:
        return False, None, f"檔案讀取錯誤：{e}"

def validate_subspecies_json(data):
    """驗證 subspecies.json 結構"""
    required_keys = ['metadata', 'subspecies', 'comparisons', 'identification_guide', 'genetic_info']

    for key in required_keys:
        if key not in data:
            return False, f"缺少必要欄位：{key}"

    if len(data['subspecies']) != 2:
        return False, f"應該有 2 個亞種，但找到 {len(data['subspecies'])} 個"

    for i, subspecies in enumerate(data['subspecies']):
        required_subspecies_keys = ['id', 'name', 'image', 'characteristics']
        for key in required_subspecies_keys:
            if key not in subspecies:
                return False, f"亞種 {i+1} 缺少必要欄位：{key}"

    return True, "結構正確"

def validate_quiz_json(data):
    """驗證 quiz.json 結構"""
    required_keys = ['quiz_info', 'questions', 'score_feedback', 'categories']

    for key in required_keys:
        if key not in data:
            return False, f"缺少必要欄位：{key}"

    questions = data['questions']
    if len(questions) != 8:
        return False, f"應該有 8 道題目，但找到 {len(questions)} 道"

    for i, question in enumerate(questions):
        required_question_keys = ['id', 'question', 'options', 'explanation']
        for key in required_question_keys:
            if key not in question:
                return False, f"題目 {i+1} 缺少必要欄位：{key}"

        if len(question['options']) != 2:
            return False, f"題目 {i+1} 應該有 2 個選項，但找到 {len(question['options'])} 個"

        # 檢查是否有且只有一個正確答案
        correct_count = sum(1 for option in question['options'] if option.get('correct', False))
        if correct_count != 1:
            return False, f"題目 {i+1} 應該有且只有 1 個正確答案，但找到 {correct_count} 個"

    return True, "結構正確"

def main():
    """主函數"""
    print("🐾 小熊貓網站 JSON 資料驗證工具")
    print("=" * 50)

    data_dir = Path("data")
    if not data_dir.exists():
        print("❌ 錯誤：找不到 data 資料夾")
        return

    json_files = [
        ("subspecies.json", validate_subspecies_json),
        ("quiz.json", validate_quiz_json),
        ("animals.json", None)  # 只驗證語法，不驗證結構
    ]

    all_passed = True

    for filename, validator in json_files:
        file_path = data_dir / filename
        print(f"\n📄 檢查 {filename}...")

        if not file_path.exists():
            print(f"   ⚠️  檔案不存在：{file_path}")
            all_passed = False
            continue

        # 語法檢查
        is_valid, data, error = test_json_file(file_path)
        if not is_valid:
            print(f"   ❌ {error}")
            all_passed = False
            continue

        print(f"   ✅ JSON 語法正確")

        # 結構檢查
        if validator:
            is_valid, message = validator(data)
            if is_valid:
                print(f"   ✅ {message}")
            else:
                print(f"   ❌ 結構錯誤：{message}")
                all_passed = False
        else:
            print(f"   ℹ️  僅檢查語法（無結構驗證）")

    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 所有檢查通過！資料檔案準備就緒。")
        print("💡 現在可以啟動伺服器進行測試：python server.py")
    else:
        print("❌ 發現問題，請修正後再次檢查。")

    print("=" * 50)

if __name__ == "__main__":
    main()