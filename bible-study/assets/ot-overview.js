(() => {
  const d = window.OT_DATA;
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
    footer:['舊約總覽 · 成人主日學教師版 · 請配合完整經文閱讀。','Old Testament Overview · Adult Sunday school teacher edition · Read alongside the full biblical text.'],
    intro:['先看全景，再進入書卷','See the whole before the parts'], lenses:['六個閱讀角度','Six reading lenses'], story:['六個故事轉折','Six narrative turns'], place:['三個地理座標','Three geographical anchors'], canon:['希伯來聖經與常見基督教舊約','The Hebrew Bible and the common Christian Old Testament'], method:['逐卷研讀的六個步驟','Six steps for reading each book'], notes:['教學時需要說清的地方','Points to clarify when teaching'], lessons:['八堂可直接使用的課程','Eight ready-to-use lessons'], discussion:['討論與教師提示','Discussion and teacher prompts'], question:['帶領提問','Teaching question'], aim:['課程目標','Aim'], flow:['課堂流程','Class flow'], watch:['教師提醒','Teacher note'], answer:['教師參考','Teacher prompt'], refs:['建議經文','Suggested passages'], sources:['延伸閱讀','Further reading'], sourcesLead:['以下資源提供不同的閱讀角度，可與經文本身及本站教材互相對照。','These resources offer different perspectives to compare with the biblical text and this study guide.'], compare:['常見新教編排：律法書 → 歷史書 → 詩歌智慧書 → 大先知書 → 小先知書。希伯來聖經的次序與分卷不同；天主教與東正教的舊約範圍亦有差異。','Common Protestant order: Law → History → Poetry & Wisdom → Major Prophets → Minor Prophets. The Hebrew Bible differs in order and division; Catholic and Orthodox Old Testament canons also differ.'],
    date:['時間軸是敘事導航，不是精確年代或成書日期。','This timeline navigates the narrative; it is not a precise chronology or a dating of composition.']
  };
  const U = key => ui[key][lang];
  const R = value => esc(value.split(' / ')[lang] || value);
  const card = (title, body, extra='') => `<article class="card content-card"><h3>${E(title)}</h3><p>${E(body)}</p>${extra}</article>`;
  const heading = (title, lead='') => `<div class="section-head"><h2>${esc(title)}</h2>${lead ? `<p>${esc(lead)}</p>` : ''}</div>`;
  const Bible = (book, chapter) => {
    const code = `${book}.${chapter}`;
    return lang === 0 ? `https://www.bible.com/zh-TW/bible/46/${code}.CUNP-%E7%A5%9E` : `https://www.bible.com/bible/2692/${code}.NASB2020`;
  };
  const links = () => `<div class="reading-links">${[['GEN',12,['創世記 12','Genesis 12']],['EXO',3,['出埃及記 3','Exodus 3']],['LEV',19,['利未記 19','Leviticus 19']],['2KI',25,['列王紀下 25','2 Kings 25']]].map(([b,c,label]) => `<a href="${Bible(b,c)}" target="_blank" rel="noopener noreferrer">${esc(label[lang])} ↗</a>`).join('')}</div>`;
  function renderPanel() {
    let html = '';
    if (tab === 'overview') html = `${heading(U('intro'), t(d.intro))}<div class="grid two">${d.ideas.map(x => card(x.title,x.body)).join('')}</div><section style="margin-top:34px">${heading(U('lenses'))}<div class="grid two">${d.lenses.map(x => card(x.title,x.body)).join('')}</div></section><div class="callout"><h3>${U('question')}</h3><p>${lang ? 'How might the meaning of a verse change when its book, speaker, and genre are ignored?' : '若忽略整卷書、說話者與文體，單節經文的意思可能如何改變？'}</p></div>${links()}`;
    if (tab === 'story') html = `${heading(U('story'),U('date'))}<div class="timeline stack">${d.arc.map(x => `<article class="movement"><div class="ref">${R(x.ref)}</div><h3>${E(x.name)}</h3><p>${E(x.body)}</p><p class="question"><strong>${U('question')}：</strong>${E(x.question)}</p></article>`).join('')}</div><section style="margin-top:36px">${heading(U('place'))}<div class="grid">${d.regions.map(x=>card(x.name,x.body)).join('')}</div></section>`;
    if (tab === 'canon') html = `${heading(U('canon'),U('compare'))}<div class="canon-banner"><span>Torah / 律法</span><span>Nevi’im / 先知</span><span>Ketuvim / 聖卷</span></div><div class="grid">${d.canon.map(x=>`<article class="card content-card"><h3>${E(x.name)}</h3><p><strong>${E(x.books)}</strong></p><p>${E(x.note)}</p></article>`).join('')}</div><div class="callout"><p>${lang?'The site lists biblical book studies in the common Protestant order. The overview comes first as an orientation, not as a Bible book.':'本站的逐卷教材依常見新教書卷次序排列；總覽置於最前作導覽，並非把它視作一卷聖經。'}</p></div>`;
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
