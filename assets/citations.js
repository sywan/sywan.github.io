(() => {
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rich=s=>esc(s).replace(/&lt;(\/?)(strong|u|em)&gt;/gi,(_,slash,tag)=>`<${slash}${tag.toLowerCase()}>`);
  function original(item){
    const text=String(item.text||''),venue=String(item.citation?.journal||'');
    if(!venue)return rich(text);
    const at=text.toLocaleLowerCase().indexOf(venue.toLocaleLowerCase());
    if(at<0)return rich(text);
    return rich(text.slice(0,at))+'<em>'+rich(text.slice(at,at+venue.length))+'</em>'+rich(text.slice(at+venue.length));
  }
  function publication(item,style='original'){
    if((style==='original'&&item.text)||!item.citation?.title)return original(item);if(style==='original')style='apa';
    const c=item.citation,authors=rich(c.authors||''),title=rich(c.title||''),journal=rich(c.journal||'');
    const year=esc(item.year||''),month=esc(c.month||'');
    const volume=esc(c.volume||''),issue=esc(c.issue||''),pages=esc(c.pages||'');
    const venue=journal?`<em>${journal}</em>`:'';
    const volIssue=volume?`<em>${volume}</em>${issue?`(${issue})`:''}`:(issue?`(${issue})`:'');
    const pagePart=pages?(pages.toLowerCase().startsWith('article')?pages:`${style==='ieee'?'pp. ':''}${pages}`):'';
    const details=[venue,volIssue,pagePart].filter(Boolean).join(', ');
    const note=c.note?` ${rich(c.note)}`:'';
    if(style==='ieee')return `${authors}, “${title},” ${details}${details?',':''} ${month?month+' ':''}${year}.${note}`.replace(/\s+/g,' ').trim();
    return `${authors} (${year}${month?', '+month:''}). ${title}. ${details}.${note}`.replace(/\s+/g,' ').trim();
  }
  function funding(item){const c=item.citation||{};return [c.sponsor,c.grant].filter(Boolean).map(esc).join(' · ')}
  window.SywanCitations={publication,funding,rich};
})();
