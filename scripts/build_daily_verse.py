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
VERSIONS = {"zh": (46, "新標點和合本（神版）"), "en": (2692, "NASB 2020")}
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


def main():
    key = os.environ.get("YVP_APP_KEY", "").strip()
    if not key:
        raise SystemExit("YVP_APP_KEY repository secret is required")
    now = datetime.now(ZoneInfo("Asia/Taipei"))
    day = now.timetuple().tm_yday
    daily = get_json(f"/verse-of-the-days/{day}", key)
    passage_id = daily["passage_id"]
    result = {"date": now.date().isoformat(), "day": day, "verses": {}}
    for lang, (version_id, fallback_name) in VERSIONS.items():
        try:
            passage = get_json(f"/bibles/{version_id}/passages/{quote(passage_id, safe='.') }?format=text", key)
            version = get_json(f"/bibles/{version_id}", key)
        except HTTPError as error:
            if error.code == 403:
                print(f"{lang}: Bible version {version_id} is not licensed for this App Key")
                result["verses"][lang] = {"available": False}
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
