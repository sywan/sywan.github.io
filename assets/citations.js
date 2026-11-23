(() => {
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function publication(item,style='apa'){
    const c=item?.citation||{},year=esc(c.year??item?.year??''),authors=esc(String(c.authors||'').trim().replace(/[.,;]+$/,'')),title=esc(c.title),venue=esc(c.journal),month=esc(c.month),volume=esc(c.volume),issue=esc(c.issue),pages=esc(c.pages);
    if(!title)return esc(item?.text||'');
    const journal=venue?`<em>${venue}</em>`:'';
    if(style==='ieee'){
      const details=[journal,volume?`vol. ${volume}`:'',issue?`no. ${issue}`:'',pages?`${/^article\b/i.test(pages)?'Art. no. ':'pp. '}${pages.replace(/^Article\s*(?:ID\s*)?/i,'')}`:'',[month,year].filter(Boolean).join(' ')].filter(Boolean).join(', ');
      return `${authors}${authors?', ':''}“${title},”${details?' '+details:''}.`;
    }
    const vol=volume?`<em>${volume}</em>${issue?`(${issue})`:''}`:(issue?`(${issue})`:'');
    const details=[journal,vol,pages].filter(Boolean).join(', ');
    return `${authors}${authors?' ':''}(${[year,month].filter(Boolean).join(', ')}). ${title}.${details?' '+details+'.':''}`.trim();
  }
  function funding(item){const c=item?.citation||{};return [c.sponsor,c.grant].filter(Boolean).map(esc).join(' · ')}
  function note(item){return esc(item?.citation?.note||'')}
  window.SywanCitations={publication,funding,note};
})();
