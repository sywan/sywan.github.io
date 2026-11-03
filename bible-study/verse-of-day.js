(() => {
  const copy = {
    zh: {title:'每日經文',loading:'正在取得今日經文…',unavailable:'今日經文暫時無法顯示，請到 YouVersion 閱讀。',translationUnavailable:'當代譯本的經文請在 YouVersion 閱讀。',pending:'今日經文更新中，請稍後再試。',link:'在 YouVersion 閱讀 ↗'},
    en: {title:'Verse of the Day',loading:'Loading today’s verse…',unavailable:'Today’s verse is temporarily unavailable. Read it on YouVersion.',translationUnavailable:'Read this passage in YouVersion.',pending:'Today’s verse is updating. Please check back soon.',link:'Read on YouVersion ↗'}
  };
  const ids = ['date','title','text','reference','link','copyright'];
  const nodes = Object.fromEntries(ids.map(id => [id,document.getElementById(`daily-${id}`)]));
  const today = () => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(part => [part.type,part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  let record = null;
  let failed = false;
  const language = () => document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
  function render() {
    const lang = language();
    const c = copy[lang];
    const date = today();
    nodes.title.textContent = c.title;
    nodes.date.textContent = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date());
    nodes.link.textContent = c.link;
    nodes.link.href = 'https://www.bible.com/verse-of-the-day';
    nodes.reference.textContent = '';
    nodes.copyright.textContent = '';
    if (!record) { nodes.text.textContent = failed ? c.unavailable : c.loading; return; }
    if (record.date !== date) { nodes.text.textContent = c.pending; return; }
    const verse = record.verses?.[lang];
    if (!verse?.text) {
      nodes.text.textContent = verse?.available === false ? c.translationUnavailable : c.unavailable;
      if (verse?.reference) nodes.reference.textContent = `${verse.reference} · ${verse.version_name}`;
      if (verse?.url && /^https:\/\/www\.bible\.com\/bible\//.test(verse.url)) nodes.link.href = verse.url;
      return;
    }
    nodes.text.textContent = verse.text;
    nodes.reference.textContent = `${verse.reference} · ${verse.version_name}`;
    nodes.copyright.textContent = verse.copyright || '';
    if (verse.url && /^https:\/\/www\.bible\.com\/bible\//.test(verse.url)) nodes.link.href = verse.url;
  }
  render();
  document.getElementById('language')?.addEventListener('click',render);
  fetch(`./data/verse-of-day.json?date=${today()}`,{cache:'no-store'})
    .then(response => { if (!response.ok) throw new Error('Verse data unavailable'); return response.json(); })
    .then(data => { record = data; render(); })
    .catch(() => { failed = true; render(); });
})();
