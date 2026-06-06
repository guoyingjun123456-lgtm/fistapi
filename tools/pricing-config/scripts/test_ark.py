# -*- coding: utf-8 -*-
"""
测试 BytePlus Ark / DeepSeek chat/completions 接口是否跑通 (Python 版)

用法:
    set ARK_API_KEY=你的key          # Windows CMD
    export ARK_API_KEY=你的key       # bash
    # 或在同目录建 .env 文件, 写一行: ARK_API_KEY=你的key

    python test_ark.py                       # 默认问题
    python test_ark.py "常见的十字花科植物有哪些?"   # 自定义问题
    MODEL=deepseek-v4-pro-260425 python test_ark.py # 覆盖模型
"""
import os
import sys
import json
import pathlib

import requests

# Windows 默认 stdout 是 GBK, 强制改成 UTF-8, 否则打印 ▶ / 中文会 UnicodeEncodeError
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

API_URL = "https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions"
MODEL = os.environ.get("MODEL", "deepseek-v4-pro-260425")
TIMEOUT = 60  # 秒


def load_api_key() -> str:
    """优先环境变量, 否则读取脚本同目录 .env 里的 ARK_API_KEY。"""
    key = os.environ.get("ARK_API_KEY", "").strip()
    if key:
        return key
    env_file = pathlib.Path(__file__).with_name(".env")
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("ARK_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


def main() -> int:
    api_key = load_api_key()
    if not api_key:
        print("❌ ARK_API_KEY 未设置。")
        print('   方式一: export ARK_API_KEY="你的key"  (bash) / set ARK_API_KEY=你的key (CMD)')
        print("   方式二: 在脚本同目录新建 .env 文件, 写一行 ARK_API_KEY=你的key")
        return 1

    question = sys.argv[1] if len(sys.argv) > 1 else "What are the common cruciferous plants?"

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "你是人工智能助手."},
            {"role": "user", "content": question},
        ],
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    print(f"▶ 接口: {API_URL}")
    print(f"▶ 模型: {MODEL}")
    print(f"▶ 问题: {question}")
    print("-" * 40)

    try:
        # 用 json= 参数, requests 自动以 UTF-8 编码请求体 (避免 Windows GBK 的 NonUTF8Body 问题)
        # trust_env=False: 忽略系统/注册表代理, 像 curl 一样直连 (否则 Windows 系统代理会导致 ProxyError)
        session = requests.Session()
        session.trust_env = False
        resp = session.post(API_URL, headers=headers, json=payload, timeout=TIMEOUT)
    except requests.RequestException as e:
        print(f"❌ 请求失败 (网络/TLS 错误): {e}")
        return 1

    print(f"▶ HTTP 状态码: {resp.status_code}")
    print("-" * 40)

    # 漂亮打印响应
    try:
        data = resp.json()
        print(json.dumps(data, ensure_ascii=False, indent=2))
    except ValueError:
        data = None
        print(resp.text)

    # 判定是否跑通
    if resp.status_code == 200 and data:
        try:
            content = data["choices"][0]["message"]["content"]
            print("\n========== 模型回答 ==========")
            print(content)
        except (KeyError, IndexError, TypeError):
            pass
        usage = data.get("usage")
        if usage:
            print(f"\n▶ tokens: {usage}")
        print("-" * 40)
        print("✅ 测试通过: 接口已跑通")
        return 0

    print("-" * 40)
    print(f"❌ 测试失败: HTTP={resp.status_code} (上面是接口返回的错误信息)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
