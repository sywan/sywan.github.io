"""Fetch YouVersion's verse of the day for a GitHub Pages deployment.

The App Key is supplied only as a GitHub Actions secret. This script writes
public verse data, never the key, to the deployment artifact.
"""
import html
import json
import os
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

API = "https://api.youversion.com/v1"
# Daily Chinese verse only: CCB Traditional. Study-page Scripture links stay CUNP.
VERSIONS = {"zh": (1392, "當代譯本"), "en": (2692, "NASB 2020")}
BOOKS_ZH = dict(zip(
    "GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split(),
    "創世記 出埃及記 利未記 民數記 申命記 約書亞記 士師記 路得記 撒母耳記上 撒母耳記下 列王紀上 列王紀下 歷代志上 歷代志下 以斯拉記 尼希米記 以斯帖記 約伯記 詩篇 箴言 傳道書 雅歌 以賽亞書 耶利米書 耶利米哀歌 以西結書 但以理書 何西阿書 約珥書 阿摩司書 俄巴底亞書 約拿書 彌迦書 那鴻書 哈巴谷書 西番雅書 哈該書 撒迦利亞書 瑪拉基書 馬太福音 馬可福音 路加福音 約翰福音 使徒行傳 羅馬書 哥林多前書 哥林多後書 加拉太書 以弗所書 腓立比書 歌羅西書 帖撒羅尼迦前書 帖撒羅尼迦後書 提摩太前書 提摩太後書 提多書 腓利門書 希伯來書 雅各書 彼得前書 彼得後書 約翰一書 約翰二書 約翰三書 猶大書 啟示錄".split()
))
OUTPUT = Path(__file__).resolve().parents[1] / "bible-study/data/verse-of-day.json"


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, value):
        self.parts.append(value)


def clean(value):
    parser = PlainText()
    parser.feed(str(value or ""))
    return html.unescape("".join(parser.parts)).strip()


def get_json(path, key):
    request = Request(API + path, headers={"X-YVP-App-Key": key, "Accept": "application/json"})
    with urlopen(request, timeout=25) as response:
        return json.load(response)


def chinese_reference(passage_id):
    book, _, location = passage_id.partition(".")
    return f"{BOOKS_ZH.get(book, book)} {location.replace('.', ':', 1)}"


def main():
    key = os.environ.get("YVP_APP_KEY", "").strip()
    if not key:
        raise SystemExit("YVP_APP_KEY repository secret is required")
    now = datetime.now(ZoneInfo("Asia/Taipei"))
    day = now.timetuple().tm_yday
    daily = get_json(f"/verse-of-the-days/{day}", key)
    passage_id = daily["passage_id"]
    print(f"YouVersion passage for day {day}: {passage_id}")
    result = {"date": now.date().isoformat(), "day": day, "verses": {}}
    for lang, (version_id, fallback_name) in VERSIONS.items():
        try:
            version = get_json(f"/bibles/{version_id}", key)
            passage_path = quote(passage_id, safe=".")
            passage = get_json(f"/bibles/{version_id}/passages/{passage_path}?format=text", key)
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")[:300].replace(key, "[redacted]")
            print(f"{lang}: Bible version {version_id} returned HTTP {error.code}: {detail}")
            if error.code in (403, 404):
                result["verses"][lang] = {
                    "available": False,
                    "reference": chinese_reference(passage_id) if lang == "zh" else passage_id,
                    "version_name": fallback_name,
                    "url": f"https://www.bible.com/bible/{version_id}/{quote(passage_id, safe='.')}",
                }
                continue
            raise
        attribution = clean(version.get("copyright") or version.get("promotional_content"))
        if not attribution:
            raise ValueError(f"Bible version {version_id} lacks required copyright attribution")
        result["verses"][lang] = {
            "available": True,
            "text": clean(passage["content"]),
            "reference": clean(passage["reference"]),
            "version_name": clean(version.get("title") or version.get("name") or fallback_name),
            "copyright": attribution,
            "url": f"https://www.bible.com/bible/{version_id}/{quote(passage_id, safe='.')}",
        }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated verse data for {result['date']} ({', '.join(k for k,v in result['verses'].items() if v.get('available')) or 'no licensed translations'})")


if __name__ == "__main__":
    main()
