(() => {
  'use strict';

  const refreshKey = 'sywan-last-refresh:' + location.pathname;
  const versionKey = 'sywan-page-version:' + location.pathname;
  const standalone = navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  let checking = false;

  function freshUrl() {
    const url = new URL(location.href);
    url.searchParams.set('_fresh', String(Date.now()));
    return url.href;
  }

  function reloadFresh() {
    location.replace(freshUrl());
  }

  document.querySelectorAll('[data-refresh-page]').forEach(button => {
    button.addEventListener('click', reloadFresh);
  });

  async function checkForUpdate() {
    if (!standalone || document.visibilityState !== 'visible' || checking || navigator.onLine === false) return;
    const now = Date.now();
    const queryRefresh = Number(new URLSearchParams(location.search).get('_fresh')) || 0;
    let lastCheck = queryRefresh;
    try { lastCheck = Math.max(lastCheck, Number(sessionStorage.getItem(refreshKey)) || 0); } catch (_) {}
    if (now - lastCheck < 15000) return;

    checking = true;
    try { sessionStorage.setItem(refreshKey, String(now)); } catch (_) {}
    try {
      const probe = new URL(location.pathname, location.origin);
      probe.searchParams.set('_check', String(now));
      const response = await fetch(probe.href, { method: 'HEAD', cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) return;
      const version = response.headers.get('etag') || response.headers.get('last-modified');
      let previous = null;
      try {
        previous = sessionStorage.getItem(versionKey);
        if (version) sessionStorage.setItem(versionKey, version);
      } catch (_) {}
      if (!previous || !version || previous !== version) reloadFresh();
    } catch (_) {
      // Keep the current page usable when offline or the check cannot complete.
    } finally {
      checking = false;
    }
  }

  if (/^\/bible-study\/[^/]+\/?$/.test(location.pathname)) {
    const script=document.createElement('script');script.src='/assets/study-bento.js?v=20261125-book-editor-fix';script.defer=true;document.head.append(script);
  }
  if (!window.SiteRichText && !document.querySelector('script[data-site-rich-loader]')) {
    const css=document.createElement('link');css.rel='stylesheet';css.href='/assets/vendor/katex.min.css?v=0.19.1';document.head.append(css);
    const style=document.createElement('link');style.rel='stylesheet';style.href='/assets/rich-text.css?v=20261127';document.head.append(style);
    const scripts=['/assets/vendor/marked.umd.js?v=18.3.0','/assets/vendor/purify.min.js?v=3.5.0','/assets/vendor/katex.min.js?v=0.19.1','/assets/rich-text.js?v=20261127'];
    const next=index=>{if(index>=scripts.length)return;const script=document.createElement('script');script.src=scripts[index];script.dataset.siteRichLoader='';script.onload=()=>next(index+1);script.onerror=()=>next(index+1);document.head.append(script)};
    next(0);
  }
  window.addEventListener('pageshow', checkForUpdate);
  document.addEventListener('visibilitychange', checkForUpdate);
})();
