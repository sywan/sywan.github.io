(() => {
  'use strict';
  const slug=location.pathname.split('/').filter(Boolean).pop();
  const host=document.querySelector('main')||document.body;
  if(!host)return;
  fetch('/data/study-resources.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(all=>{
    const entries=Array.isArray(all[slug])?all[slug]:[];
    if(!entries.length)return;
    const section=document.createElement('section');section.className='extra-study-resources';section.id='extra-study-resources';
    host.append(section);
    function render(){
      const en=document.documentElement.lang.startsWith('en');
      section.replaceChildren();
      const heading=document.createElement('h2');heading.textContent=en?'Additional study resources':'新增研讀資源';section.append(heading);
      const list=document.createElement('div');list.className='extra-study-resources__links';section.append(list);
      for(const entry of entries){
        if(!entry?.titleZh)continue;
        const article=document.createElement('article');article.className='extra-study-resources__item';
        const title=document.createElement('h3');title.textContent=en?entry.titleEn||entry.titleZh:entry.titleZh;article.append(title);
        const body=en?entry.bodyEn||entry.bodyZh:entry.bodyZh||entry.bodyEn;
        if(body){const p=document.createElement('p');p.textContent=body;article.append(p)}
        if(entry.url){
          let url;try{url=new URL(entry.url,location.href)}catch(e){continue}
          if(url.protocol!=='https:'&&url.origin!==location.origin)continue;
          const link=document.createElement('a');link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';
          link.textContent=en?'Open resource ↗':'開啟資源 ↗';article.append(link);
        }
        list.append(article);
      }
      section.hidden=!list.childElementCount;
    }
    render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }).catch(()=>{});
})();
