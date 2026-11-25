(() => {
  'use strict';
  const slug = location.pathname.split('/').filter(Boolean).at(-1);
  if (!slug || slug === 'bible-study') return;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const language = () => { try { return localStorage.getItem('site-language') === 'en' ? 'en' : 'zh' } catch (_) { return 'zh' } };
  let cards = [];
  function editLink() {
    const crumbs = document.querySelector('.crumbs,.breadcrumbs');
    if (!crumbs) return;
    let link = document.getElementById('study-editor-link');
    if (!link) { link = document.createElement('a'); link.id = 'study-editor-link'; link.href = `/site-editor/?scope=study&book=${encodeURIComponent(slug)}`; crumbs.append(link) }
    const label = language() === 'zh' ? '編輯本卷研讀內容' : 'Edit this study page';
    if (link.textContent !== label) link.textContent = label;
  }
  function render() {
    editLink();
    let section = document.getElementById('editor-study-cards');
    if (!cards.length) { section?.remove(); return }
    const main = document.querySelector('main');
    if (!main) return;
    if (!section) { section = document.createElement('section'); section.id = 'editor-study-cards'; section.className = 'editor-study-cards'; main.append(section) }
    const lang = language(), label = lang === 'zh' ? '補充研讀' : 'Additional study';
    section.innerHTML = `<h2>${label}</h2><div class="editor-study-grid">${cards.map(card => {
      const title = card[`title${lang === 'zh' ? 'Zh' : 'En'}`] || card.titleZh;
      const body = card[`body${lang === 'zh' ? 'Zh' : 'En'}`] || card.bodyZh;
      let link = '';
      if (card.url) { try { const url = new URL(card.url, location.href); if (url.protocol === 'https:' || url.origin === location.origin) link = `<a href="${escape(url.href)}" target="_blank" rel="noopener noreferrer">${lang === 'zh' ? '開啟連結' : 'Open link'}</a>` } catch (_) {} }
      return `<article class="editor-study-card"><h3>${escape(title)}</h3><p>${escape(body)}</p>${link}</article>`;
    }).join('')}</div>`;
  }
  const style = document.createElement('style');
  style.textContent = '.editor-study-cards{margin:30px 0}.editor-study-cards h2{font-size:clamp(24px,2.4vw,34px)}.editor-study-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:15px}.editor-study-card{min-width:0;background:#fff;border:1px solid #d8e2e7;border-radius:15px;padding:20px;overflow-wrap:anywhere}.editor-study-card h3{margin:0 0 8px;color:#20577a}.editor-study-card p{white-space:pre-line;margin:0 0 8px}.editor-study-card a{font-weight:700}';
  document.head.append(style);
  editLink();
  new MutationObserver(() => { if (!document.getElementById('study-editor-link')) editLink() }).observe(document.body,{childList:true,subtree:true});
  fetch('/data/study-cards.json', {cache:'no-store'}).then(response => response.ok ? response.json() : {}).then(data => { cards = Array.isArray(data[slug]) ? data[slug] : []; render() }).catch(() => {});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
