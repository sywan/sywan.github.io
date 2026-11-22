(() => {
  'use strict';
  const labels={
    zh:{skip:'跳至主要內容',refresh:'↻ 更新',editSite:'編輯網站內容 ↗',navAbout:'簡介',navExperience:'經歷',navTeaching:'大學教學',navRecognition:'專利・獲獎',navResearch:'研究計畫',navPublications:'期刊論文',navApps:'實用 Apps',navBible:'聖經研讀',eyebrow:'個人學術網站 / ACADEMIC PROFILE',exploreResearch:'瀏覽研究計畫 ↓',openApps:'探索自行開發的 Apps ↗',education:'最高學歷',expertise:'研究專長',laboratory:'實驗室',contact:'聯絡方式',department:'長庚大學系所資料 ↗',experienceTitle:'經歷',experienceLead:'學術與行政服務經歷，依近至遠排列。',teachingTitle:'大學教學',teachingLead:'目前教授與規劃的課程領域。',materialsStatus:'課程教材整理中',teachingCourses:'教授課程',teachingFuture:'日後將逐步補上課程簡介、教學資源與學生作品。',recognitionTitle:'專利・獲獎・專業證照',recognitionLead:'專利、研究獎項與專業認證。',researchTitle:'研究計畫',researchLead:'包含主持與共同主持計畫，最新項目列於前方。',inPreparation:'規劃中',publicationsTitle:'期刊論文',publicationsLead:'期刊著作與預印本，依年份排列。',bibleTitle:'聖經研讀',bibleLead:'個人信仰研讀與成人主日學教材。',published:'已上線',bibleCard:'聖經研讀資源中心',bibleDesc:'由舊約、新約書卷進入研讀；教材與延伸資源在獨立網站中整理。',enterBible:'進入資源中心 →',footer:'個人學術網站',scanHome:'掃描 QR Code 開啟個人首頁',moreExperience:'查看較早經歷',moreProjects:'查看較早研究計畫',morePublications:'查看較早著作',hideExperience:'收起完整經歷',hideProjects:'收起完整研究計畫',hidePublications:'收起完整著作',loadError:'資料暫時無法載入，請重新整理頁面。'},
    en:{skip:'Skip to main content',refresh:'↻ Refresh',editSite:'Edit website ↗',navAbout:'About',navExperience:'Experience',navTeaching:'Teaching',navRecognition:'Patents & honors',navResearch:'Projects',navPublications:'Publications',navApps:'Useful Apps',navBible:'Bible Study',eyebrow:'ACADEMIC PROFILE',exploreResearch:'Explore research projects ↓',openApps:'Explore my apps ↗',education:'Education',expertise:'Research areas',laboratory:'Laboratory',contact:'Contact',department:'Chang Gung University profile ↗',experienceTitle:'Experience',experienceLead:'Academic and administrative appointments, newest first.',teachingTitle:'University Teaching',teachingLead:'Courses taught and planned.',materialsStatus:'Course materials in preparation',teachingCourses:'Courses',teachingFuture:'Course summaries, teaching resources, and student work will be added over time.',recognitionTitle:'Patents, Honors & Certifications',recognitionLead:'Patents, research awards, and professional credentials.',researchTitle:'Research Projects',researchLead:'Principal and co-principal investigator projects, newest first.',inPreparation:'In preparation',publicationsTitle:'Journal Articles & Preprints',publicationsLead:'Journal publications and preprints, arranged by year.',bibleTitle:'Bible Study',bibleLead:'Personal faith study and adult Sunday school resources.',published:'Published',bibleCard:'Bible Study Resource Center',bibleDesc:'Explore Old and New Testament books, lessons, and further resources on the separate study site.',enterBible:'Visit the resource center →',footer:'Personal academic website',scanHome:'Scan to open my homepage',moreExperience:'Show earlier appointments',moreProjects:'Show earlier projects',morePublications:'Show earlier publications',hideExperience:'Collapse all appointments',hideProjects:'Collapse all projects',hidePublications:'Collapse all publications',loadError:'Content could not load. Please refresh the page.'}
  };
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const publicationHtml=s=>h(s).replace(/&lt;(\/?)(strong|u)&gt;/gi,(_,slash,tag)=>`<${slash}${tag.toLowerCase()}>`);
  const $=s=>document.querySelector(s);
  let data=null,lang='zh';
  try{lang=localStorage.getItem('site-language')==='en'?'en':'zh'}catch(e){}
  function local(obj,key){return obj?.[`${key}${lang==='zh'?'Zh':'En'}`]||obj?.[`${key}Zh`]||''}
  function period(value){return lang==='en'?String(value||'').replaceAll('迄今','present'):value||''}
  function role(value){return lang==='en'?({'主持人':'PI','共同主持人':'Co-PI','參與研究':'Researcher'}[value]||value):value}
  function publicationType(value){return lang==='zh'?({'Journal':'期刊','Preprint':'預印本'}[value]||value):value}
  function card(meta,text,extra='',formatted=false){return `<article class="entry-card"><div class="entry-meta">${meta}</div><p>${formatted?publicationHtml(text):h(text)}</p>${extra}</article>`}
  function grouped(items,visible,moreLabel,renderItem){const first=items.slice(0,visible).map(renderItem).join('');const rest=items.slice(visible);const hideLabel=moreLabel.replace(/^more/,'hide');return `<div class="grouped-content"><div class="entry-list masonry-list preview-list" data-min-width="${moreLabel==='moreExperience'?390:420}">${first}</div>${rest.length?`<details class="more-items"><summary><span class="when-closed">${h(labels[lang][moreLabel])} (${rest.length})</span><span class="when-open">${h(labels[lang][hideLabel])} (${items.length})</span></summary><div class="entry-list masonry-list full-list" data-min-width="${moreLabel==='moreExperience'?390:420}">${items.map(renderItem).join('')}</div></details>`:''}</div>`}
  function layoutMasonry(list){
    if(!list||!list.getClientRects().length)return;
    const cards=[...list.children].filter(el=>el.classList.contains('entry-card'));
    if(!cards.length)return;
    const gap=14,width=list.clientWidth,minWidth=Number(list.dataset.minWidth)||420;
    if(width<1)return;
    const count=Math.min(cards.length,Math.max(1,Math.floor((width+gap)/(minWidth+gap))));
    const cardWidth=(width-gap*(count-1))/count,heights=Array(count).fill(0);
    cards.forEach(card=>{
      card.style.width=`${cardWidth}px`;
      let col=0;for(let i=1;i<count;i++)if(heights[i]<heights[col])col=i;
      card.style.transform=`translate(${col*(cardWidth+gap)}px,${heights[col]}px)`;
      heights[col]+=card.getBoundingClientRect().height+gap;
    });
    list.style.height=`${Math.max(...heights)-gap}px`;
  }
  function layoutAllMasonry(){document.querySelectorAll('.masonry-list').forEach(layoutMasonry)}
  let layoutFrame=0;
  addEventListener('resize',()=>{cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(layoutAllMasonry)});
  document.addEventListener('toggle',e=>{if(e.target.matches?.('.more-items'))requestAnimationFrame(layoutAllMasonry)},true);
  function renderData(){if(!data)return;
    const openGroups=Object.fromEntries(['experience-list','projects-list','publications-list'].map(id=>[id,document.querySelector(`#${id} .more-items`)?.open||false]));
    const p=data.profile;
    $('#profile-name').innerHTML=lang==='zh'?`${h(p.nameZh)} <small>${h(p.nameEn)}</small>`:`${h(p.nameEn)} <small>${h(p.nameZh)}</small>`;
    $('#profile-title').textContent=local(p,'title');$('#profile-intro').textContent=local(p,'intro');
    $('#profile-education').textContent=local(p,'education');$('#profile-expertise').textContent=local(p,'expertise');$('#profile-lab').textContent=local(p,'lab');
    $('#profile-email').textContent=p.email;$('#profile-email').href=`mailto:${p.email}`;$('#profile-phone').textContent=lang==='en'?p.phone.replace('轉','ext.'):p.phone;
    $('#department-link').href=p.departmentUrl;
    $('#experience-list').innerHTML=grouped(data.experience,8,'moreExperience',x=>card(`<span>${h(period(x.period))}</span>`,x.text));
    $('#courses-list').innerHTML=data.courses.map(x=>`<span>${h(x[lang]||x.zh||'')}</span>`).join('');
    $('#awards-list').innerHTML=data.awards.map(x=>card(`<span>${h(x.year)}</span>`,x.text)).join('');
    $('#projects-list').innerHTML=grouped(data.projects,6,'moreProjects',x=>card(`<span>${h(x.year)}</span><span class="tag">${h(role(x.role))}</span>${x.period?`<span>${h(x.period)}</span>`:''}`,x.title,`${x.sponsor||x.amount?`<p class="entry-more">${h([x.sponsor,x.amount].filter(Boolean).join(' · '))}</p>`:''}`));
    $('#publications-list').innerHTML=grouped(data.publications,6,'morePublications',x=>card(`<span>${h(x.year)}</span><span class="tag">${h(publicationType(x.type))}</span>`,x.text,x.doi?`<p class="entry-more"><a href="https://doi.org/${x.doi.split('/').map(encodeURIComponent).join('/')}" target="_blank" rel="noopener noreferrer">DOI ↗</a></p>`:'',true));
    $('#playground-title').textContent=local(data.research,'playgroundTitle');$('#playground-text').textContent=local(data.research,'playgroundText');for(const [id,open] of Object.entries(openGroups))if(open){const details=document.querySelector(`#${id} .more-items`);if(details)details.open=true}layoutAllMasonry()
  }
  function setLanguage(next){lang=next;document.documentElement.lang=lang==='zh'?'zh-Hant':'en';const dict={...labels[lang],...window.AppsCatalog.translations[lang]};document.querySelectorAll('[data-i18n]').forEach(el=>{if(Object.hasOwn(dict,el.dataset.i18n))el.textContent=dict[el.dataset.i18n]});const button=$('#language');button.setAttribute('aria-checked',lang==='en'?'true':'false');button.setAttribute('aria-label',lang==='zh'?'語言：繁中，切換至英文':'Language: English; switch to Traditional Chinese');document.title=lang==='zh'?'萬書言 · 個人學術網站':'Shu-Yen Wan · Academic Profile';try{localStorage.setItem('site-language',lang)}catch(e){}renderData();window.AppsCatalog.render?.(lang)}
  $('#language').addEventListener('click',()=>setLanguage(lang==='zh'?'en':'zh'));
  $('#year').textContent=new Date().getFullYear();document.querySelectorAll('.home-share img,.portal-entry-qr img').forEach(img=>{img.src=new URL(img.src).pathname+'?v='+Date.now()});setLanguage(lang);
  fetch('/data/site-content.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json()}).then(json=>{data=json;renderData()}).catch(()=>{$('#profile-intro').textContent=labels[lang].loadError});
})();
