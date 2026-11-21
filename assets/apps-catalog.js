// Shared catalog for the homepage and independent Apps portal.
(() => {
  'use strict';
  const guideMarkup="<div class=\"install-guide\" id=\"install-guide\">\n      <h3 data-i18n=\"installTitle\">像 App 一樣從主畫面開啟</h3>\n      <p data-i18n=\"installIntro\">這些工具的網頁版可直接使用，也能加入手機主畫面或電腦桌面；之後點圖示就能開啟。</p>\n      <details><summary data-i18n=\"installSummary\">查看 iPhone、iPad、Android、Mac 與 Windows 的操作方式</summary>\n        <div class=\"install-platforms\">\n          <div class=\"install-platform\"><h4 data-i18n=\"installIOSHead\">iPhone／iPad · Safari</h4><p data-i18n=\"installIOSText\">開啟工具 → 分享 →「加入主畫面」；若看到「作為網頁 App 開啟」，可選取後按「加入」。</p><p class=\"install-icon-note\" data-i18n=\"installIconNote\">想自訂圖示？可用「捷徑」App 建立開啟網址的捷徑，加入主畫面時選擇自己的圖片。</p></div>\n          <div class=\"install-platform\"><h4 data-i18n=\"installAndroidHead\">Android · Chrome</h4><p data-i18n=\"installAndroidText\">開啟工具 → 右上角 ⋮ →「安裝及建立捷徑」→ 選「安裝」或「建立捷徑」。</p></div>\n          <div class=\"install-platform\"><h4 data-i18n=\"installChromeHead\">Windows／Mac · Chrome</h4><p data-i18n=\"installChromeText\">開啟工具 → 右上角 ⋮ → 找「將網頁安裝為應用程式」；也可選擇建立捷徑。</p></div>\n          <div class=\"install-platform\"><h4 data-i18n=\"installEdgeHead\">Windows／Mac · Edge</h4><p data-i18n=\"installEdgeText\">開啟工具 → 右上角 ⋯ →「更多工具」→「應用程式」→「將此網站安裝為應用程式」。</p></div>\n          <div class=\"install-platform\"><h4 data-i18n=\"installSafariHead\">Mac · Safari</h4><p data-i18n=\"installSafariText\">在 Safari 開啟工具 → 分享 →「加入 Dock」（macOS Sonoma 14 或更新版本）。</p></div>\n        </div>\n        <p class=\"install-note\" data-i18n=\"installNote\">選單名稱可能因瀏覽器版本而異；加入圖示不代表所有功能都能離線使用。</p>\n      </details>\n    </div>";
  const translations={
  "zh": {
    "appsTitle": "實用 Apps",
    "appsLead": "這裡收錄我自行設計與開發的實用 Apps。",
    "installTitle": "像 App 一樣從主畫面開啟",
    "installIntro": "這些工具的網頁版可直接使用，也能加入手機主畫面或電腦桌面；之後點圖示就能開啟。",
    "installSummary": "查看 iPhone、iPad、Android、Mac 與 Windows 的操作方式",
    "installIOSHead": "iPhone／iPad · Safari",
    "installIOSText": "開啟工具 → 分享 →「加入主畫面」；若看到「作為網頁 App 開啟」，可選取後按「加入」。",
    "installIconNote": "想自訂圖示？可用「捷徑」App 建立開啟網址的捷徑，加入主畫面時選擇自己的圖片。",
    "installAndroidHead": "Android · Chrome",
    "installAndroidText": "開啟工具 → 右上角 ⋮ →「安裝及建立捷徑」→ 選「安裝」或「建立捷徑」。",
    "installChromeHead": "Windows／Mac · Chrome",
    "installChromeText": "開啟工具 → 右上角 ⋮ → 找「將網頁安裝為應用程式」；也可選擇建立捷徑。",
    "installEdgeHead": "Windows／Mac · Edge",
    "installEdgeText": "開啟工具 → 右上角 ⋯ →「更多工具」→「應用程式」→「將此網站安裝為應用程式」。",
    "installSafariHead": "Mac · Safari",
    "installSafariText": "在 Safari 開啟工具 → 分享 →「加入 Dock」（macOS Sonoma 14 或更新版本）。",
    "installNote": "選單名稱可能因瀏覽器版本而異；加入圖示不代表所有功能都能離線使用。",
    "webApp": "跨平台網頁 App",
    "timeDesc": "記錄每天的時間，回看分配與選擇，讓生活更靠近重視的事。",
    "installHint": "可加入手機主畫面或電腦桌面，從圖示像 App 一樣開啟。",
    "openTime": "開啟 Time Audit ↗",
    "installLink": "查看各平台的操作方式 ↑",
    "scan": "掃描 QR Code 開啟",
    "quteDesc": "在自己的裝置上為照片轉換風格；照片留在瀏覽器中，不需上傳或註冊。",
    "openQute": "開啟 Qute ↗",
    "quteScan": "掃描 QR Code 開啟",
    "qrTag": "跨平台網頁 App ＋ Chrome 擴充功能",
    "qrDesc": "在瀏覽器中製作可自訂顏色、樣式、中央圖像與文字的 QR Code。",
    "qrWebTitle": "方式一｜網頁版・跨平台",
    "qrWebText": "點開或掃描 QR Code。iPhone／iPad 可用 Safari 的「分享 → 加入主畫面」；桌機可從瀏覽器選單安裝為 App 或建立捷徑。",
    "qrWebButton": "開啟 QR Studio 網頁版 ↗",
    "qrScan": "掃描開啟網頁版",
    "qrExtensionTitle": "方式二｜Chrome 擴充功能",
    "qrExtensionText": "使用桌面版 Chrome，從 Chrome 線上應用程式商店安裝。iPhone／iPad 無法安裝此擴充功能。",
    "openQR": "前往 Chrome 線上應用程式商店 ↗",
    "randoTag": "跨平台網頁 App ＋ Chrome 擴充功能",
    "randoDesc": "匯入名單後，隨機抽選、排列順序或平均分組；支援繁中與英文。",
    "randoWebTitle": "方式一｜網頁版・跨平台",
    "randoWebText": "點開或掃描 QR Code。iPhone／iPad 可用 Safari 的「分享 → 加入主畫面」；桌機可從瀏覽器選單建立捷徑，或在支援時安裝為 App。",
    "randoWebButton": "開啟 RandoPal 網頁版 ↗",
    "randoQRText": "掃描開啟網頁版",
    "randoExtensionTitle": "方式二｜Chrome 擴充功能",
    "randoExtensionText": "使用桌面版 Chrome，從 Chrome 線上應用程式商店安裝。iPhone／iPad 無法安裝此擴充功能。",
    "randoExtensionButton": "前往 Chrome 線上應用程式商店 ↗",
    "randoDataNote": "名單儲存在各瀏覽器本機，不會自動跨裝置或版本同步。",
    "portalLink": "開啟獨立 Apps 入口 ↗",
    "portalScan": "也可掃描右側 QR Code，直接前往 Apps 入口。"
  },
  "en": {
    "appsTitle": "Useful Apps",
    "appsLead": "Explore practical apps I designed and developed.",
    "installTitle": "Open from your home screen like an app",
    "installIntro": "The web versions of all four tools open directly and can be added to a phone home screen or computer desktop for quick access from an icon.",
    "installSummary": "See steps for iPhone, iPad, Android, Mac, and Windows",
    "installIOSHead": "iPhone / iPad · Safari",
    "installIOSText": "Open the tool → Share → Add to Home Screen. If offered, turn on Open as Web App, then tap Add.",
    "installIconNote": "Want a custom icon? Create a shortcut that opens the URL in Apple Shortcuts, then choose your own image when adding it to the Home Screen.",
    "installAndroidHead": "Android · Chrome",
    "installAndroidText": "Open the tool → ⋮ → Install and create shortcut → choose Install or Create shortcut.",
    "installChromeHead": "Windows / Mac · Chrome",
    "installChromeText": "Open the tool → ⋮ → look for Install page as app. You can also create a shortcut.",
    "installEdgeHead": "Windows / Mac · Edge",
    "installEdgeText": "Open the tool → ⋯ → More tools → Apps → Install this site as an app.",
    "installSafariHead": "Mac · Safari",
    "installSafariText": "Open the tool in Safari → Share → Add to Dock (macOS Sonoma 14 or later).",
    "installNote": "Menu names may vary by browser version. Adding an icon does not mean every feature works offline.",
    "webApp": "Cross-platform web app",
    "timeDesc": "Record your days and review how you spend time, so your choices align with what matters.",
    "installHint": "Add it to your phone home screen or computer desktop and open it from an icon like an app.",
    "openTime": "Open Time Audit ↗",
    "installLink": "See the steps for your device ↑",
    "scan": "Scan to open the web app",
    "quteDesc": "Restyle photos on your device. Photos stay in your browser, with no upload or account needed.",
    "openQute": "Open Qute ↗",
    "quteScan": "Scan to open Qute",
    "qrTag": "Cross-platform web app + Chrome extension",
    "qrDesc": "Make QR codes in your browser with customizable colors, styles, center images, and text.",
    "qrWebTitle": "Option 1 | Web app · any platform",
    "qrWebText": "Open the link or scan the QR code. On iPhone or iPad, use Safari’s Share → Add to Home Screen. On desktop, install the page as an app or create a shortcut from your browser menu.",
    "qrWebButton": "Open QR Studio web app ↗",
    "qrScan": "Scan to open the web app",
    "qrExtensionTitle": "Option 2 | Chrome extension",
    "qrExtensionText": "Install from the Chrome Web Store in desktop Chrome. This extension cannot be installed on iPhone or iPad.",
    "openQR": "View in Chrome Web Store ↗",
    "randoTag": "Cross-platform web app + Chrome extension",
    "randoDesc": "Import a roster to pick names, set a random order, or make balanced groups. Available in Chinese and English.",
    "randoWebTitle": "Option 1 | Web app · any platform",
    "randoWebText": "Open the link or scan the QR code. On iPhone or iPad, use Safari’s Share → Add to Home Screen. On desktop, create a browser shortcut or install the page as an app when available.",
    "randoWebButton": "Open RandoPal web app ↗",
    "randoQRText": "Scan to open the web app",
    "randoExtensionTitle": "Option 2 | Chrome extension",
    "randoExtensionText": "Install from the Chrome Web Store in desktop Chrome. This extension cannot be installed on iPhone or iPad.",
    "randoExtensionButton": "View in Chrome Web Store ↗",
    "randoDataNote": "Rosters are saved locally in each browser and do not automatically sync across devices or versions.",
    "portalLink": "Open the Apps portal ↗",
    "portalScan": "Or scan the QR code on the right to open it directly."
  }
};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let catalog=[],language='zh';
  const local=(item,key)=>item[`${key}${language==='zh'?'Zh':'En'}`]||item[`${key}Zh`]||'';
  function safeUrl(value){try{const u=new URL(value,location.origin);return u.protocol==='https:'||u.origin===location.origin?esc(u.href):'#'}catch{return '#'}}
  function card(item){
    const dict=translations[language],name=esc(item.name),url=safeUrl(item.webUrl),extension=item.extensionUrl?safeUrl(item.extensionUrl):'',qr=item.qrSrc?safeUrl(item.qrSrc):'';
    const qrBlock=qr?`<div class="qr-wrap"><a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name}"><img src="${qr}" width="720" height="720" alt="${name} QR Code" loading="lazy"></a><small>${esc(dict.scan)}</small></div>`:'';
    return `<article class="card catalog-card"><div class="catalog-copy"><span class="tag">${esc(extension?dict.qrTag:dict.webApp)}</span><h3>${name}</h3><p>${esc(local(item,'summary'))}</p><p class="app-install-hint">${esc(dict.installHint)}</p><div class="catalog-actions"><a class="button primary" href="${url}" target="_blank" rel="noopener noreferrer">${esc(language==='zh'?'開啟網頁版 ↗':'Open web app ↗')}</a>${extension?`<a class="button secondary" href="${extension}" target="_blank" rel="noopener noreferrer">${esc(language==='zh'?'安裝 Chrome 擴充功能 ↗':'Install Chrome extension ↗')}</a>`:''}</div><p class="guide-link-row"><a href="#install-guide">${esc(dict.installLink)}</a></p>${local(item,'note')?`<p class="catalog-note">${esc(local(item,'note'))}</p>`:''}</div>${qrBlock}</article>`;
  }
  function render(next){if(next)language=next;document.querySelectorAll('[data-apps-catalog]').forEach(root=>{root.innerHTML=guideMarkup+`<div class="apps-grid">${catalog.map(card).join('')}</div>`;root.querySelectorAll('[data-i18n]').forEach(el=>{const text=translations[language][el.dataset.i18n];if(text)el.textContent=text})})}
  window.AppsCatalog={translations,render};
  render();
  fetch('/data/apps.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json()}).then(data=>{catalog=Array.isArray(data.apps)?data.apps:[];render()}).catch(()=>{document.querySelectorAll('[data-apps-catalog] .apps-grid').forEach(root=>root.textContent=language==='zh'?'Apps 暫時無法載入，請重新整理。':'Apps could not load. Please refresh.')});
})();
