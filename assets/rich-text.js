(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const markup = /<\/?[a-z][^>]*>|\*\*[^*]+\*\*|__[^_]+__|(?<!\w)\*[^*\n]+\*|(?<!\w)_[^_\n]+_|~~[^~]+~~|`[^`]+`|\[[^\]]+\]\([^)]+\)|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]|\$\$[\s\S]+?\$\$|(?<![\\\w])\$[^$\n]+\$|^\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```)/m;
  const block = /^\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```)|\n\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```)/m;
  const mathPattern = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([^\n]+?)\\\)|(?<![\\\w])\$([^$\n]+?)\$/g;
  const allowedTags = ['a','b','blockquote','br','code','del','div','em','h1','h2','h3','h4','h5','h6','hr','i','img','li','ol','p','pre','span','strong','sub','sup','table','tbody','td','th','thead','tr','u','ul'];
  const allowedAttrs = ['alt','colspan','height','href','rel','rowspan','src','target','title','width'];
  const ignored = 'a,button,code,pre,script,style,textarea,input,select,option,[contenteditable],[data-rich-rendered]';
  const hasFormatting = value => markup.test(String(value ?? ''));

  function render(value, mode = 'inline') {
    const source = String(value ?? '');
    if (!hasFormatting(source)) return escape(source);
    try {
      const equations = [];
      const protectedSource = source.replace(mathPattern, (whole, dollars, bracket, paren, inline) => {
        const expression = dollars ?? bracket ?? paren ?? inline;
        const id = `SYWANMATH${equations.length}END`;
        equations.push({id, expression, display: dollars !== undefined || bracket !== undefined, original: whole});
        return id;
      });
      const parsed = mode === 'block' ? window.marked.parse(protectedSource, {gfm:true, breaks:true}) : window.marked.parseInline(protectedSource, {gfm:true, breaks:true});
      const clean = window.DOMPurify.sanitize(parsed, {ALLOWED_TAGS:allowedTags, ALLOWED_ATTR:allowedAttrs, ALLOW_DATA_ATTR:false});
      const holder = document.createElement('div');
      holder.innerHTML = clean;
      if (equations.length) {
        const byId = new Map(equations.map(item => [item.id, item]));
        const textNodes = document.createTreeWalker(holder, NodeFilter.SHOW_TEXT);
        const candidates = [];
        while (textNodes.nextNode()) if (/SYWANMATH\d+END/.test(textNodes.currentNode.nodeValue)) candidates.push(textNodes.currentNode);
        for (const node of candidates) {
          if (node.parentElement?.closest('code,pre')) continue;
          const fragment = document.createDocumentFragment();
          const segments = node.nodeValue.split(/(SYWANMATH\d+END)/g);
          for (const segment of segments) {
            const item = byId.get(segment);
            if (!item) {fragment.append(document.createTextNode(segment)); continue}
            const span = document.createElement(item.display ? 'div' : 'span');
            span.className = item.display ? 'rich-math-display' : 'rich-math-inline';
            try {span.innerHTML = window.katex.renderToString(item.expression, {throwOnError:false, trust:false, strict:'ignore', displayMode:item.display})}
            catch (_) {span.textContent = item.original}
            fragment.append(span);
          }
          node.replaceWith(fragment);
        }
      }
      holder.querySelectorAll('a[target="_blank"]').forEach(link => {link.rel = 'noopener noreferrer'});
      return holder.innerHTML;
    } catch (_) {
      return escape(source);
    }
  }

  function enhance(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest(ignored) || !hasFormatting(node.nodeValue)) continue;
      nodes.push(node);
    }
    for (const node of nodes) {
      if (!node.isConnected || node.parentElement?.closest(ignored)) continue;
      try {
        const parent = node.parentElement;
        const useBlock = parent?.tagName === 'P' && parent.childNodes.length === 1 && block.test(node.nodeValue);
        const wrapper = document.createElement(useBlock ? 'div' : 'span');
        wrapper.className = useBlock ? 'rich-text-block' : 'rich-text-inline';
        wrapper.dataset.richRendered = '';
        wrapper.innerHTML = render(node.nodeValue, useBlock ? 'block' : 'inline');
        if (useBlock) parent.replaceWith(wrapper); else node.replaceWith(wrapper);
      } catch (_) {
        // One malformed field never prevents the rest of the page from rendering.
      }
    }
  }

  window.SiteRichText = {render, enhance, hasFormatting};
  const schedule = (() => {let queued = false;return () => {if (queued) return;queued = true;queueMicrotask(() => {queued = false;enhance(document.body)})}})();
  if (document.body) {
    enhance(document.body);
    new MutationObserver(schedule).observe(document.body, {childList:true, subtree:true});
  } else document.addEventListener('DOMContentLoaded', () => {
    enhance(document.body);
    new MutationObserver(schedule).observe(document.body, {childList:true, subtree:true});
  }, {once:true});
  window.dispatchEvent(new Event('site-rich-ready'));
})();
