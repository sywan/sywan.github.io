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

  window.addEventListener('pageshow', checkForUpdate);
  document.addEventListener('visibilitychange', checkForUpdate);
})();
