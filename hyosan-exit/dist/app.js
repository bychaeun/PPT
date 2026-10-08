const $ = (s) => document.querySelector(s);
const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b,v));
const phase = (p,a,b) => clamp((p-a)/(b-a));
const ease = t => t*t*(3-2*t);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let scheduled=false, storyIndex=-1;
const stories=[['우리는 매일,<br>새로운 <span class="green">문</span>을 엽니다.','거래처에서 다음 거래처로.<br>수많은 문을 두드리는 영업사원의 하루.'],['문 앞에서 필요한 건,<br><span class="green">바로 꺼낼 수 있는 정보.</span>','제품을 설명하고, 패턴을 비교하고, 적용 정보를 확인할 때.<br>필요한 자료를 더 빠르게 찾을 수 있다면.'],['늘 손에 있는 휴대폰.<br>그 안에 <span class="green">효산의 지식</span>을.','외근 중에도 효산 LPM 자료를 효율적으로 보고 확인하도록.<br>효산 LPL 백과사전은 이 생각에서 시작했습니다.']];
function renderScroll(){
 scheduled=false;const vh=innerHeight;const opening=$('.opening');const p=clamp(-opening.getBoundingClientRect().top/(opening.offsetHeight-vh));
 if(!reduced.matches){
 const collapse=ease(phase(p,.06,.24));const door=ease(phase(p,.17,.34));const run=ease(phase(p,.34,.58));const zoom=ease(phase(p,.64,.94));
 $('.opening-title').style.opacity=1-phase(p,.13,.24);$('.opening-title').style.transform=`translate(-50%,-50%) scale(${1-collapse*.7},${1+collapse*2})`;
 const portal=$('.portal');portal.style.opacity=phase(p,.17,.27);portal.style.transform=`translate(-50%,-50%) scale(${1+zoom*19})`;
 $('.door-left').style.transform=`scaleY(${.06+door*.94})`;$('.door-right').style.transform=`scaleY(${.06+door*.94})`;
 $('.door-light').style.transform=`scaleX(${ease(phase(p,.53,.69))})`;
 const r=$('.opening-runner');r.style.opacity=phase(p,.30,.36)*(1-phase(p,.55,.61));r.style.transform=`translate(${(-innerWidth*.48)*(1-run)}px,${Math.sin(run*45)*6}px) scale(${1-phase(p,.51,.60)*.6})`;
 $('.opening-caption').style.opacity=phase(p,.23,.33)*(1-phase(p,.59,.68));$('.scroll-cue').style.opacity=1-phase(p,.02,.12);$('.opening-corner').style.opacity=(1-phase(p,.02,.12))*.6;
 }
 const headerVisible=opening.getBoundingClientRect().bottom<vh*.8;$('#site-header').classList.toggle('visible',headerVisible);$('#site-header').inert=!headerVisible;
 const purpose=$('.purpose');const sp=clamp(-purpose.getBoundingClientRect().top/(purpose.offsetHeight-vh));let idx=reduced.matches?0:Math.min(2,Math.floor(sp*3));
 if(idx!==storyIndex){storyIndex=idx;$('#purpose-title').innerHTML=stories[idx][0];$('.purpose-copy p').innerHTML=stories[idx][1];$('.chapter-fraction').textContent=`0${idx+1} — 03`;}
 renderDoors(reduced.matches?1:sp);
 renderFinale();
 if(!reduced.matches){const journal=$('.journal');const jp=clamp(-journal.getBoundingClientRect().top/(journal.offsetHeight-vh));updateJournal(Math.min(journalData.length-1,Math.floor(jp*journalData.length)));}
}
const categories={
 patterns:{name:'패턴 디자인',en:'PATTERN DESIGN',title:'소재를 이해하는 첫 번째 문.',copy:'목재부터 대리석, 스톤, 패브릭까지. 패턴의 특징과 용도를 살펴보고, 관련 LPM과 추천 경면판으로 이어집니다.',route:'패턴 → 관련 LPM → 추천 경면판',filters:['전체','목재','스톤','패브릭'],labels:['우드 패턴','스톤 패턴','패브릭','대리석 패턴','우드 패턴','스톤 패턴'],textures:['wood','stone','fabric','stone','darkwood','stone'],popup:'패턴의 특징과 용도',relation:'관련 LPM · 추천 경면판 ↗'},
 lpm:{name:'효산 LPM 디자인',en:'HYOSAN LPM',title:'제품 하나에서, 필요한 정보까지.',copy:'샘플북과 디자인 분류로 제품을 찾고, 종이번호·원지 회사·이전 제품번호까지 확인합니다. 필요한 제품 정보는 영업자료로 내보낼 수 있습니다.',route:'샘플북 → 제품 정보 → 자료 내보내기',filters:['전체','샘플북','우드','솔리드'],labels:['WOOD','STONE','SOLID','FABRIC','WOOD','SOLID'],textures:['wood','stone','solid','fabric','darkwood','white'],popup:'효산 LPM 제품 정보',relation:'종이번호 복사 · Slides 내보내기 ↗'},
 special:{name:'특별넘버',en:'SPECIAL SPECS',title:'특별한 스펙도, 헤매지 않도록.',copy:'별도로 관리하는 특판용 번호를 독립된 메뉴에서 찾습니다. 종이번호와 경면 종류, 관련 LPM을 한 번에 확인합니다.',route:'특별넘버 → 종이번호 · 경면 → 관련 LPM',filters:['전체','대분류','소분류'],labels:['특별넘버 · 예시','특별넘버 · 예시','특별넘버 · 예시','특별넘버 · 예시','특별넘버 · 예시','특별넘버 · 예시'],textures:['wood','solid','stone','darkwood','white','fabric'],popup:'특별넘버 상세',relation:'종이번호 · 경면 종류 · 관련 LPM ↗'},
 emboss:{name:'경면판',en:'EMBOSS PLATE',title:'표면의 차이까지, 더 깊이.',copy:'경면판의 종류, 광택과 특징을 이미지와 함께 살펴봅니다. 연결된 LPM 제품으로 이동하며 어울리는 조합을 검토할 수 있습니다.',route:'경면판 → 표면 특징 → 연결된 LPM',filters:['전체','종류','광택'],labels:['결감 · 예시','표면 · 예시','텍스처 · 예시','무늬 · 예시','표면 · 예시','결감 · 예시'],textures:['emboss','fabric','stone','emboss','fabric','emboss'],popup:'경면판의 표면 특징',relation:'추천 효산 LPM 살펴보기 ↗'},
 construction:{name:'건설사별 현장',en:'CONSTRUCTION SITES',title:'제품이 공간이 되는 순간.',copy:'건설사별 현장과 적용 스펙을 함께 확인합니다. 현장 사진에서 특별넘버와 제품 정보까지 이어지는 흐름으로 살펴봅니다.',route:'건설사 → 현장 → 적용 스펙 → 제품'},
 composer:{name:'조합하기',en:'MATERIAL COMPOSER',title:'경면을 조합하고, 원하는 컬러까지.',copy:'조합하기에서 다양한 경면을 LPM에 적용해 표면 조합을 살펴보고, 컬러리스트로 원하는 색과 유사한 제품까지 찾을 수 있습니다. 경면 적용하기와 컬러리스트를 한 메뉴에서 만나보세요. 조합 결과는 참고용입니다.',route:'조합하기 → 경면 적용하기 · 컬러리스트'},
 colorist:{name:'조합하기 · 컬러리스트',en:'COLOR EXPLORER',title:'떠올린 그 색에서, 제품으로.',copy:'색상환에서 원하는 색을 선택하면 등록된 색상값을 기준으로 유사한 LPM을 찾습니다. 화면의 색상은 실제 샘플과 함께 확인해 주세요.',route:'색상 선택 → 유사 컬러 → 효산 LPM'}
};
const categoryButtons=[...document.querySelectorAll('.category')];let activeCategory='';let motionPaused=reduced.matches;
function gridDemo(data){return `<div class="demo-filters">${data.filters.map(x=>`<span>${x}</span>`).join('')}</div><div class="sample-grid">${data.labels.map((label,i)=>`<div class="sample-card"><i class="sample-texture ${data.textures[i]}"></i><b>${label}</b><small>HYOSAN LPM Library</small></div>`).join('')}</div><div class="demo-popup"><i class="popup-texture ${data.textures[0]}"></i><div><h4>${data.popup}</h4><p>특징과 분류를 확인하고<br>연결된 자료로 이동합니다.</p><span class="relation-chip">${data.relation}</span></div></div><div class="demo-pointer"></div>`;}
function categoryDemo(key,data){
 if(data.labels)return gridDemo(data);
 if(key==='construction')return '<div class="demo-filters"><span>전체</span><span>건설사별</span></div><div class="site-image"></div><div class="site-example">현장 적용 사례<small>현장명 · 모델하우스 오픈일 · 완공일</small></div><div class="spec-link">적용 스펙 → 특별넘버 → 관련 LPM &nbsp; ↗</div><div class="demo-pointer"></div>';
 if(key==='composer')return '<div class="compose-demo"><div class="compose-controls"><div><i class="wood"></i>효산 LPM 선택</div><span class="compose-plus">＋</span><div><i class="emboss"></i>경면판 선택</div></div><div><div class="compose-result wood"></div><div class="demo-range"></div><p class="demo-small-note">엠보 강도 조절 · 표면 조합 미리보기</p></div></div><p class="demo-small-note">이미지 기반의 참고용 조합입니다. 실제 샘플을 확인해 주세요.</p>';
 return '<div class="color-demo"><div><div class="color-wheel"><span class="wheel-dot"></span></div><div class="demo-range"></div><p class="demo-small-note">색상환에서 컬러 선택</p></div><div class="color-recommend"><div></div><div></div><div></div><div></div></div></div><p class="demo-small-note">선택한 색상값을 기준으로 유사한 효산 LPM을 찾습니다.<br>실물 샘플과 색상이 다를 수 있습니다.</p>';
}
function positionRunner(){const active=$('.category.active');if(!active)return;const runner=$('.category-runner');if(innerWidth<=700){runner.style.transform=`translateX(${active.getBoundingClientRect().left-$('.category-list').getBoundingClientRect().left+active.offsetWidth/2-13}px)`;}else{runner.style.transform=`translateY(${active.getBoundingClientRect().top-$('.category-list').getBoundingClientRect().top}px)`;}}
function setCategory(key){if(activeCategory===key)return;activeCategory=key;$('#demo-browser').classList.toggle('composer-sequence',key==='composer');const data=categories[key];categoryButtons.forEach(b=>{const active=b.dataset.category===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$('#demo-browser').setAttribute('aria-label',data.name+' 실제 앱 화면');$('#actual-list').src='captures/'+(key==='emboss'?'emboss-hl-detail':key==='composer'?'composer-apply-current':key==='colorist'?'composer-color-current':key)+'.jpg';$('#actual-list').alt=key==='composer'?'조합하기 · 경면 적용하기 실제 화면':data.name+' 실제 목록 화면';$('#actual-detail').src='captures/'+(key==='emboss'?'emboss-hl-detail':key==='composer'?'composer-color-current':key==='colorist'?'composer-color-current':key+'-detail')+'.jpg';$('#actual-detail').alt=key==='composer'?'조합하기 · 컬러리스트 실제 화면':data.name+' 실제 상세 화면';$('#actual-detail').style.animation='none';void $('#actual-detail').offsetWidth;$('#actual-detail').style.animation='';$('#preview-kicker').textContent=data.en;$('#preview-title').textContent=data.title;$('#preview-copy').textContent=data.copy;$('#preview-route').textContent=data.route;$('.demo-bottom>span:first-child').textContent=key==='composer'?'실제 효산 앱 캡처 · 경면 적용하기 → 컬러리스트':'실제 효산 앱 캡처 · 목록에서 상세 화면으로';$('#demo-step').textContent=`0${Math.min(6,Object.keys(categories).indexOf(key)+1)} / 06`;positionRunner();}
categoryButtons.forEach((button,i)=>{button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setCategory(button.dataset.category)});button.addEventListener('focus',()=>setCategory(button.dataset.category));button.addEventListener('click',()=>setCategory(button.dataset.category));button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%categoryButtons.length;if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i-1+categoryButtons.length)%categoryButtons.length;if(e.key==='Home')next=0;if(e.key==='End')next=categoryButtons.length-1;if(next!==undefined){e.preventDefault();categoryButtons[next].focus();}});});
function updateMotion(){document.body.classList.toggle('motion-paused',motionPaused);$('#motion-toggle').textContent=motionPaused?'▷ 모션 재생':'Ⅱ 모션 멈춤';$('#motion-toggle').setAttribute('aria-pressed',String(motionPaused));}
$('#motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;updateMotion();});
const journalData=[{label:'A SINGLE SOURCE',title:'자료 관리는, Google Sheets로.',copy:'패턴, LPM, 특별넘버, 경면판 자료를 Google Sheets에서 관리합니다. 시트에 정리한 정보는 하나의 백과사전으로 연결되어 PC와 모바일에서 확인할 수 있습니다.'},{label:'SCAN TO HEIGHT MAP',title:'스캔한 경면을, 높이맵으로.',copy:'경면을 하나씩 스캔받으면 원래 색과 달리 녹색빛이 돌고 지문이 남아 있었습니다. 이미지마다 직접 지문과 불필요한 흔적을 제거하고, 표면의 결을 살려 높이맵으로 후가공했습니다. 이렇게 일일이 다듬은 자료를 경면 조합에 활용합니다.'}];let journalIndex=-1;
function updateJournal(idx){
 if(idx===journalIndex)return;
 journalIndex=idx;const d=journalData[idx];
 $('.journal-large-number').textContent=`0${idx+1}`;$('#journal-label').textContent=d.label;$('#journal-detail-title').textContent=d.title;$('#journal-detail-copy').textContent=d.copy;
 $('.sheets-demo').hidden=idx!==0;$('#journal-refinement').hidden=idx!==1;
 if(idx!==0&&$('#sheets-player').getAttribute('aria-pressed')==='true')playSheets(false);
 document.querySelectorAll('[data-journal]').forEach(b=>{const active=Number(b.dataset.journal)===idx;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}

document.querySelectorAll('[data-journal]').forEach(b=>b.addEventListener('click',()=>{const idx=Number(b.dataset.journal);if(reduced.matches){updateJournal(idx);return;}const el=$('.journal');scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*(idx/journalData.length+.05),behavior:'smooth'});}));
document.documentElement.classList.add('js-ready');const reveals=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveals.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>reveals.observe(el));
const demoVisibility=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;$('#demo-browser').classList.toggle('offscreen',!visible);},{threshold:0});demoVisibility.observe($('#demo-browser'));
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(renderScroll)}},{passive:true});addEventListener('resize',()=>{renderScroll();positionRunner();});reduced.addEventListener('change',()=>{motionPaused=reduced.matches;updateMotion();renderScroll();});
// Articulated character: head and torso preserve the supplied Illustrator SVG;
// rounded limb segments preserve its widths, lengths, and joint radii.
const limb=(kind,side,x,y,length,width,lower)=>`<g transform="translate(${x} ${y})"><g class="rig-${kind} ${side}"><rect x="${-width/2}" y="-5" width="${width}" height="${length+5}" rx="${width/2}"/><g transform="translate(0 ${length-5})"><g class="rig-${kind==='arm'?'forearm':'shin'}"><rect x="${-width/2}" y="-4" width="${width}" height="${lower}" rx="${width/2}"/></g></g></g></g>`;
document.querySelectorAll('svg:has(use[href="#runner-symbol"])').forEach(svg=>{svg.setAttribute('viewBox','80 188 125 150');svg.innerHTML=`<g class="rig-bounce"><g class="rig-body">${limb('arm','back',135,228,36,11.33,27.21)}${limb('leg','back',135,268,34,12.82,32.88)}<path d="M138.71,194.9c-6.08,0-10.98,5.1-10.98,11.18s4.9,10.99,10.98,10.99,11.19-4.9,11.19-10.99-5.1-11.18-11.19-11.18Z"/><rect x="123.6" y="218.57" width="30.65" height="58.44" rx="13.1"/>${limb('leg','front',145,268,34,12.45,32.88)}${limb('arm','front',145,228,36,11.33,27.21)}</g></g>`;});
let runnerStop;function runCharacters(){document.querySelectorAll('.opening-runner,.story-runner').forEach(r=>r.classList.remove('character-still'));clearTimeout(runnerStop);runnerStop=setTimeout(()=>document.querySelectorAll('.opening-runner,.story-runner').forEach(r=>r.classList.add('character-still')),180);}
addEventListener('scroll',runCharacters,{passive:true});
let categoryStop;categoryButtons.forEach(button=>{const animate=()=>{const r=$('.category-runner');r.classList.remove('character-still','character-wave');clearTimeout(categoryStop);categoryStop=setTimeout(()=>r.classList.add('character-still'),720);};button.addEventListener('pointerenter',animate);button.addEventListener('focus',animate);button.addEventListener('click',animate);});
document.querySelector('.exit-sign svg').classList.add('character-still');
setCategory('patterns');updateJournal(0);updateMotion();renderScroll();

// Snap between presentation frames; never snap inside a pinned animation track.
const presentationSections=[...document.querySelectorAll('main > section')];
let slideLocked=false,slideTimer,gestureTimer,gestureTotal=0,lastWheel=0,touchStartY=0;
function frameBounds(section){const top=section.getBoundingClientRect().top+scrollY;const pinned=section.matches('.opening,.purpose,.journal,.closing')&&!reduced.matches;return {top,end:top+Math.max(0,section.offsetHeight-innerHeight),pinned};}
function slideTo(top){slideLocked=true;scrollTo({top,behavior:reduced.matches?'instant':'smooth'});clearTimeout(slideTimer);slideTimer=setTimeout(()=>{slideLocked=false;gestureTotal=0;},850);}
function slideDestination(direction){const y=scrollY;const i=presentationSections.findIndex((s,j)=>{const b=frameBounds(s);return y>=b.top-3&&(j===presentationSections.length-1||y<frameBounds(presentationSections[j+1]).top-3);});if(i<0)return null;const b=frameBounds(presentationSections[i]);
 // The intro, purpose and journal own their internal scroll animation.
 if(b.pinned&&((direction>0&&y<b.end-3)||(direction<0&&y>b.top+3&&y<=b.end+3)))return null;
 // Long content stays naturally scrollable until the reader reaches its edge.
 if(!b.pinned&&b.end>b.top+5&&((direction>0&&y<b.end-3)||(direction<0&&y>b.top+3)))return null;
 if(direction>0)return i+1<presentationSections.length?frameBounds(presentationSections[i+1]).top:null;
 if(y>b.end+3)return b.end;
 return i>0?frameBounds(presentationSections[i-1]).end:0;
}
addEventListener('wheel',event=>{if(event.ctrlKey||event.altKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('input,textarea,select,dialog'))return;
 const now=performance.now();if(slideLocked){event.preventDefault();return;}if(now-lastWheel>180)gestureTotal=0;lastWheel=now;
 const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);const destination=slideDestination(Math.sign(delta));if(destination===null)return;
 event.preventDefault();gestureTotal+=delta;if(Math.abs(gestureTotal)>=28){gestureTotal=0;slideTo(destination);}
},{passive:false});
// Touch keeps native momentum. Settle only between frames, not within animations.
addEventListener('touchstart',e=>{touchStartY=e.touches[0].clientY;clearTimeout(gestureTimer);},{passive:true});
addEventListener('touchend',e=>{const direction=Math.sign(touchStartY-e.changedTouches[0].clientY);if(!direction)return;clearTimeout(gestureTimer);gestureTimer=setTimeout(()=>{if(slideLocked)return;const destination=slideDestination(direction);if(destination!==null&&Math.abs(destination-scrollY)<innerHeight*.9)slideTo(destination);},220);},{passive:true});
addEventListener('keydown',e=>{if(e.target.closest('button,a,input,textarea,select,dialog')||e.ctrlKey||e.metaKey||e.altKey)return;const direction=e.key==='PageDown'||(e.key===' '&&!e.shiftKey)?1:e.key==='PageUp'||(e.key===' '&&e.shiftKey)?-1:0;if(!direction)return;const destination=slideDestination(direction);if(destination!==null){e.preventDefault();if(!slideLocked)slideTo(destination);}});

const exitCharacter=$('.exit-sign svg');exitCharacter.classList.remove('character-still');
const exitObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('exit-visible',e.isIntersecting)),{threshold:.5});exitObserver.observe($('.exit-sign'));
// The portrait has its own shoulder pivots; the running rig stays unchanged.
const portrait=$('.celebrating-character');
portrait.setAttribute('viewBox','48 172 182 96');
portrait.innerHTML='<defs><clipPath id="portrait-waist"><rect x="40" y="165" width="200" height="98"/></clipPath></defs><g clip-path="url(#portrait-waist)"><g class="portrait-body">'+limb('arm','back',125,227,32,11.33,28)+'<circle cx="139" cy="206" r="11"/><path d="M124 232 Q124 219 137 219 H141 Q154 219 154 232 V272 H124Z"/>'+limb('arm','front',153,227,32,11.33,28)+'</g></g>';
$('.exit-sign>span')?.remove();

// Door thresholds follow the character's position, in either scroll direction.
function renderDoors(progress){
 const scene=$('.door-landscape'),runner=$('.story-runner');
 const w=scene.clientWidth,rw=runner.clientWidth;
 const x=-rw*.85+progress*(w*.78+rw*.85);
 runner.style.transform=`translateX(${x}px)`;
 scene.querySelectorAll('.outline-door').forEach(door=>{
  const arrival=phase(x+rw*.72,door.offsetLeft-rw*.08,door.offsetLeft+rw*.28);
  door.style.setProperty('--open',ease(arrival));
  door.classList.toggle('is-open',arrival>.1);
 });
}
function renderFinale(){
 const section=$('.closing'),scene=$('.finale-scene');if(!scene)return;
 const p=reduced.matches?1:clamp(-section.getBoundingClientRect().top/Math.max(1,section.offsetHeight-innerHeight));
 const approach=ease(phase(p,.06,.48)),enter=ease(phase(p,.44,.62));
 const zoom=ease(phase(p,.60,.82)),reveal=ease(phase(p,.82,.97));
 const sign=$('.exit-sign'),runner=$('.exit-sign>svg'),door=$('.exit-sign>div');
 const start=sign.clientWidth*.02,end=door.offsetLeft+door.clientWidth*.5-runner.clientWidth*.5;
 runner.style.transform=`translateX(${start+(end-start)*approach}px) scale(${1-enter*.3})`;
 runner.style.opacity=1-enter;
 door.style.setProperty('--door-turn',`${-106*ease(phase(p,.32,.49))}deg`);
 sign.style.transform=`scale(${1+zoom*18})`;
 scene.style.opacity=1-phase(p,.79,.85);
 $('.finale-hint').style.opacity=1-phase(p,.12,.28);
 $('.closing-reveal').style.opacity=reveal;
 $('.closing-reveal').style.transform=`translateY(${(1-reveal)*35}px)`;
 $('.closing-reveal').inert=reveal<.9;
 $('.closing-reveal').setAttribute('aria-hidden',String(reveal<.9));
 $('.closing-stage').style.background=`rgb(${Math.round(0+zoom*244)} ${Math.round(170+zoom*80)} ${Math.round(104+zoom*140)})`;
 section.classList.toggle('finale-complete',p>.81);
 if(reveal>.9&&!section.classList.contains('fireworks-fired')){section.classList.add('fireworks-fired');burstFireworks();}
 if(p<.72){section.classList.remove('fireworks-fired');$('.finale-fireworks').replaceChildren();}
}

// Local captures only: playback never changes the source spreadsheet.
const sheetFrames=[['patterns','PATTERN_DESIGN','패턴'],['lpm','HYOSAN_LPM','LPM'],['special','SPECIAL_SPECS','특별넘버'],['emboss','EMBOSS_PLATE','경면판']];
let sheetIndex=0,sheetsPlaying=false,sheetsTimer;
function showSheet(index){sheetIndex=index;const [file,name,label]=sheetFrames[index];$('#sheets-capture').src=`captures/sheets-${file}.jpg`;$('#sheets-capture').alt=`Google Sheets ${label} 자료 관리 화면`;$('#sheets-name').textContent=name;document.querySelectorAll('[data-sheet]').forEach(b=>{const active=Number(b.dataset.sheet)===index;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
function playSheets(play){sheetsPlaying=play;clearInterval(sheetsTimer);$('#sheets-player').setAttribute('aria-pressed',String(play));$('#sheets-player').setAttribute('aria-label',play?'자료 관리 시트 자동 넘김 멈춤':'자료 관리 시트 1초 자동 넘김 재생');$('.sheets-play-icon').textContent=play?'Ⅱ':'▶';$('#sheets-status').textContent=play?'1초마다 재생 중 · 클릭하면 멈춤':'클릭해서 재생 · 1초마다';if(play)sheetsTimer=setInterval(()=>showSheet((sheetIndex+1)%sheetFrames.length),1000);}
$('#sheets-player').addEventListener('click',()=>playSheets(!sheetsPlaying));
document.querySelectorAll('[data-sheet]').forEach(b=>b.addEventListener('click',()=>{playSheets(false);showSheet(Number(b.dataset.sheet));}));
const sheetVisibility=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)playSheets(false);},{threshold:.1});sheetVisibility.observe($('.sheets-demo'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)playSheets(false);});
sheetFrames.forEach(([file])=>{const img=new Image();img.src=`captures/sheets-${file}.jpg`;});
renderScroll();

// The character advances the story, with a short, deliberately simple cheer.
let cheerTimer;
$('#journal-character').addEventListener('click',()=>{
 const character=$('#journal-character');character.classList.remove('is-cheering');void character.offsetWidth;character.classList.add('is-cheering');
 clearTimeout(cheerTimer);cheerTimer=setTimeout(()=>character.classList.remove('is-cheering'),850);
 document.querySelector(`[data-journal="${(journalIndex+1)%journalData.length}"]`).click();
});
const scanFrames=[['indigo-material','상원 인디고 실물 경면','실물 경면의 색과 결을 확인하는 것부터 시작했습니다.'],['indigo-scan','녹색빛과 지문이 남은 상원 인디고 스캔','스캔받은 이미지에는 녹색빛이 돌고 지문이 남아 있었습니다.'],['indigo-cleaned','상원 인디고 지문 제거 후 이미지','이미지마다 직접 지문과 불필요한 흔적을 하나씩 제거했습니다.'],['indigo-heightmap','상원 인디고 높이맵 후가공 결과','표면의 결을 살려 높이맵으로 일일이 후가공했습니다.']];
document.querySelectorAll('[data-scan]').forEach(button=>button.addEventListener('click',()=>{const frame=scanFrames[Number(button.dataset.scan)];$('#scan-capture').src='captures/'+frame[0]+'.jpg';$('#scan-capture').alt=frame[1];$('#scan-caption').textContent=frame[2];document.querySelectorAll('[data-scan]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});}));
function burstFireworks(){
 const stage=$('.finale-fireworks');if(!stage||reduced.matches)return;stage.replaceChildren();
 [22,78].forEach((x,side)=>{
  const burst=document.createElement('div');burst.className='firework-burst';burst.style.left=x+'%';burst.style.top=(side?39:32)+'%';burst.style.setProperty('--burst-delay',side?'.18s':'0s');
  for(let i=0;i<14;i++){const piece=document.createElement('i');const a=i/14*Math.PI*2;const radius=58+(i%3)*18;piece.className=i%4===0?'firework-star':'firework-dot';piece.style.setProperty('--x',Math.cos(a)*radius+'px');piece.style.setProperty('--y',Math.sin(a)*radius+'px');piece.style.setProperty('--spin',(i*53)+'deg');burst.append(piece);}
  stage.append(burst);
 });
}
renderScroll();
