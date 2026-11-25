(() => {
  'use strict';
  let data;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const language = () => { try { return localStorage.getItem('site-language') === 'en' ? 'en' : 'zh' } catch (_) { return 'zh' } };
  const safeHref = value => { try { const url = new URL(value, location.href); return ['https:', 'http:'].includes(url.protocol) ? value : '' } catch (_) { return '' } };
  function render() {
    if (!data) return;
    const lang = language();
    for (const [key, copy] of Object.entries(data.copy || {})) {
      const target = document.querySelector(`[data-i18n="${key}"]`);
      if (target) target.textContent = copy?.[lang] || copy?.zh || '';
    }
    for (const [group, cards] of Object.entries(data.groups || {})) {
      const grid = document.querySelector(`#${group} > .grid`);
      if (!grid || !Array.isArray(cards)) continue;
      grid.innerHTML = cards.map(card => {
        const href = safeHref(card.href);
        const text = key => escape(card[`${key}${lang === 'zh' ? 'Zh' : 'En'}`] || card[`${key}Zh`]);
        const content = `<span class="pill${card.kind === 'planned' ? ' future' : ''}">${text('pill')}</span><h3>${text('title')}</h3>${card.bodyZh || card.bodyEn ? `<p>${text('body')}</p>` : ''}<div class="arrow">${text('action')}</div>`;
        return href ? `<a class="card ${card.kind === 'planned' ? 'planned' : 'active'}" href="${escape(href)}"${card.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${content}</a>` : `<article class="card planned">${content}</article>`;
      }).join('');
    }
  }
  window.renderBiblePortal = render;
  fetch('/data/bible-portal.json', {cache:'no-store'}).then(response => { if (!response.ok) throw Error('Portal data unavailable'); return response.json() }).then(result => { data = result; render() }).catch(() => {});
})();
