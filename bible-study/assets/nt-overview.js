(() => {
  const d = window.NT_DATA;
  let lang = 0; try { lang = (localStorage.getItem('site-language') || localStorage.getItem('bible-study-language')) === 'en' ? 1 : 0; } catch (e) {}
  let tab = 'overview';
  const $ = id => document.getElementById(id);
  const t = pair => Array.isArray(pair) ? pair[lang] : pair;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const E = value => esc(t(value));
  const ui = {
    tabs:[['overview','鷹眼總覽','Overview'],['story','歷史與地理','Story & place'],['canon','書卷編排','Book order'],['method','讀經方法','Reading method'],['notes','教師辨析','Teacher notes'],['lessons','八堂教案','Eight lessons'],['discussion','討論題庫','Discussion'],['resources','延伸閱讀','Further reading']],
    home:['← 個人首頁','← Personal home'], center:['← 聖經研讀','← Bible Study'], refresh:['↻ 更新','↻ Refresh'],
    edition:['中文經文：新標點和合本（神版）；英文經文：NASB 2020。','Scripture links: CUNP (Shen edition) in Chinese; NASB 2020 in English.'],
    footer:['新約總覽 · 成人主日學教師版 · 請配合完整經文閱讀。','New Testament Overview · Adult Sunday school teacher edition · Read alongside the full biblical text.'],
    intro:['先看全景，再進入書卷','See the whole before the parts'], lenses:['八個閱讀角度','Eight reading lenses'], story:['八個書卷脈絡','Eight book-group contexts'], place:['三個地理座標','Three geographical anchors'], canon:['新約 27 卷的常見編排','The common order of 27 New Testament books'], method:['逐卷研讀的六個步驟','Six steps for reading each book'], notes:['教學時需要說清的地方','Points to clarify when teaching'], lessons:['八堂可直接使用的課程','Eight ready-to-use lessons'], discussion:['討論與教師提示','Discussion and teacher prompts'], question:['帶領提問','Teaching question'], aim:['課程目標','Aim'], flow:['課堂流程','Class flow'], watch:['教師提醒','Teacher note'], answer:['教師參考','Teacher prompt'], refs:['建議經文','Suggested passages'], sources:['延伸閱讀','Further reading'], sourcesLead:['以下資源提供不同的閱讀角度，可與經文本身及本站教材互相對照。','These resources offer different perspectives to compare with the biblical text and this study guide.'], compare:['常見編排：四福音 → 使徒行傳 → 保羅書信 → 希伯來書與一般書信 → 啟示錄；此順序不是寫作年表。','Common order: Gospels → Acts → Pauline letters → Hebrews and General Epistles → Revelation; this is not a composition timeline.'],
    date:['以下是書卷間的敘事導航，不是精確年代或成書日期。','This narrative route is not a precise chronology or date of composition.']
  };
  const U = key => ui[key][lang];
  const R = value => esc(value.split(' / ')[lang] || value);
  const card = (title, body, extra='') => `<article class="card content-card"><h3>${E(title)}</h3><p>${E(body)}</p>${extra}</article>`;
  const heading = (title, lead='') => `<div class="section-head"><h2>${esc(title)}</h2>${lead ? `<p>${esc(lead)}</p>` : ''}</div>`;
  const Bible = (book, chapter) => {
    const code = `${book}.${chapter}`;
    return lang === 0 ? `https://www.bible.com/zh-TW/bible/46/${code}.CUNP-%E7%A5%9E` : `https://www.bible.com/bible/2692/${code}.NASB2020`;
  };
  const links = () => `<div class="reading-links">${[['MAT',1,['馬太福音 1','Matthew 1']],['ACT',1,['使徒行傳 1','Acts 1']],['ROM',1,['羅馬書 1','Romans 1']],['HEB',1,['希伯來書 1','Hebrews 1']],['JAS',1,['雅各書 1','James 1']],['1PE',1,['彼得前書 1','1 Peter 1']],['1JN',1,['約翰一書 1','1 John 1']],['JUD',1,['猶大書 1','Jude 1']],['REV',1,['啟示錄 1','Revelation 1']]].map(([b,c,label]) => `<a href="${Bible(b,c)}" target="_blank" rel="noopener noreferrer">${esc(label[lang])} ↗</a>`).join('')}</div>`;
  function renderPanel() {
    let html = '';
    if (tab === 'overview') html = `${heading(U('intro'), t(d.intro))}<div class="grid two">${d.ideas.map(x => card(x.title,x.body)).join('')}</div><section style="margin-top:34px">${heading(U('lenses'))}<div class="grid two">${d.lenses.map(x => card(x.title,x.body)).join('')}</div></section><div class="callout"><h3>${U('question')}</h3><p>${lang ? 'How might the meaning of a verse change when its book, speaker, and genre are ignored?' : '若忽略整卷書、說話者與文體，單節經文的意思可能如何改變？'}</p></div>${links()}`;
    if (tab === 'story') html = `${heading(U('story'),U('date'))}<div class="timeline stack">${d.arc.map(x => `<article class="movement"><div class="ref">${R(x.ref)}</div><h3>${E(x.name)}</h3><p>${E(x.body)}</p><p class="question"><strong>${U('question')}：</strong>${E(x.question)}</p></article>`).join('')}</div><section style="margin-top:36px">${heading(U('place'))}<div class="grid">${d.regions.map(x=>card(x.name,x.body)).join('')}</div></section>`;
    if (tab === 'canon') html = `${heading(U('canon'),U('compare'))}<div class="canon-banner"><span>Gospels / 福音書</span><span>Acts / 行傳</span><span>Pauline letters / 保羅書信</span><span>Hebrews & General Epistles / 希伯來書與一般書信</span><span>Revelation / 啟示錄</span></div><div class="grid">${d.canon.map(x=>`<article class="card content-card"><h3>${E(x.name)}</h3><p><strong>${E(x.books)}</strong></p><p>${E(x.note)}</p></article>`).join('')}</div><div class="callout"><p>${lang?'The site lists New Testament books in their common canonical order. This overview is an orientation, not a biblical book.':'本站的逐卷教材依常見新約書卷次序排列；總覽置於最前作導覽，並非把它視作一卷聖經。'}</p></div>`;
    if (tab === 'method') html = `${heading(U('method'))}<div class="grid two">${d.reading.map((x,i)=>card(x.title,x.body,`<span class="label">${String(i+1).padStart(2,'0')}</span>`)).join('')}</div>${links()}`;
    if (tab === 'notes') html = `${heading(U('notes'))}<div class="grid two">${d.teacherNotes.map(x=>card(x.title,x.body)).join('')}</div>`;
    if (tab === 'lessons') html = `${heading(U('lessons'))}<div class="grid two">${d.lessons.map((x,i)=>`<article class="lesson"><div class="number">LESSON ${String(i+1).padStart(2,'0')}</div><h3>${E(x.title)}</h3><div class="refs">${U('refs')}：${R(x.refs)}</div><p><strong>${U('aim')}：</strong>${E(x.aim)}</p><details><summary>${U('flow')}</summary><ol>${x.flow.map(step=>`<li>${E(step)}</li>`).join('')}</ol></details><p class="question"><strong>${U('question')}：</strong>${E(x.question)}</p><p class="small"><strong>${U('watch')}：</strong>${E(x.watch)}</p></article>`).join('')}</div>`;
    if (tab === 'discussion') html = `${heading(U('discussion'))}<div class="q-list">${d.discussion.map((x,i)=>`<article class="q-card"><strong>${i+1}. ${E(x.q)}</strong><p>${U('answer')}：${E(x.a)}</p></article>`).join('')}</div>`;
    if (tab === 'resources') html = `${heading(U('sources'),U('sourcesLead'))}<div class="grid two">${d.sources.map(x=>`<article class="card content-card"><h3>${E(x.title)}</h3><p>${E(x.desc)}</p><a class="read-link" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${lang?'Open resource':'開啟資源'} ↗</a></article>`).join('')}</div>`;
    $('panel').innerHTML = `<section class="tab-panel" id="${tab}-panel" role="tabpanel">${html}</section>`;
    document.querySelectorAll('.tab').forEach(button => {button.setAttribute('aria-selected',button.dataset.tab===tab?'true':'false');button.tabIndex=button.dataset.tab===tab?0:-1;});
  }
  function render() {
    document.documentElement.lang = lang ? 'en' : 'zh-Hant';
    document.title = `${E(d.title)}｜${lang?'Bible Study':'聖經研讀資源中心'}`;
    $('title').textContent=t(d.title); $('subtitle').textContent=t(d.subtitle);
    $('home-link').textContent=U('home'); $('center-link').textContent=U('center');
    $('edition').textContent=U('edition'); $('footer').textContent=U('footer');
    $('language').setAttribute('aria-checked',lang?'true':'false'); $('language').setAttribute('aria-label',lang?'Language: English; switch to Traditional Chinese':'語言：繁中，切換至英文'); $('refresh').textContent=U('refresh');
    $('tabs').innerHTML=ui.tabs.map(([id,zh,en])=>`<button type="button" class="tab" role="tab" data-tab="${id}" aria-controls="${id}-panel" aria-selected="${id===tab}">${esc(lang?en:zh)}</button>`).join('');
    $('tabs').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{tab=button.dataset.tab;renderPanel();window.scrollTo({top:document.querySelector('main').offsetTop-65,behavior:'smooth'});}));
    renderPanel();
  }
  $('language').addEventListener('click',()=>{lang=1-lang;try { localStorage.setItem('site-language',lang?'en':'zh'); } catch (e) {}render();});
  render();
})();
