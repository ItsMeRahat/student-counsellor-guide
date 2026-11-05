/* Professional Academy app shell and navigation */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const nav=$('#nav'),home=$('[data-home]'),dashboard=$('#academy-dashboard'),workspace=$('.w');
if(!nav||!workspace)return;
const cards=$$('.w>section.card'),order=['home',...cards.map(c=>c.id)];
let active='home',touch=null,searchMode=false;
function clearSearch(){const q=$('#sq'),r=$('#sr');if(q)q.value='';if(r)r.textContent='';searchMode=false}
function linkFor(id){return $$('a[href^="#"]',nav).find(a=>a.getAttribute('href')==='#'+id)}
function updateNav(id){
 $$('a[href^="#"]',nav).forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));
 home?.classList.toggle('active',id==='home');
 const link=linkFor(id);if(link&&window.matchMedia('(max-width:1099px)').matches)link.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
 const master=$('#master-nav');if(['s13','s14','s15'].includes(id))master?.setAttribute('open','');else master?.removeAttribute('open');
}
function updatePager(){
 const idx=order.indexOf(active),label=$('#page-count'),prev=$('#page-prev'),next=$('#page-next');
 if(label)label.textContent=active==='home'?'Dashboard':(idx)+' / 15';
 if(prev)prev.disabled=idx<=0;
 if(next)next.disabled=idx<0||idx>=order.length-1;
}
function showHome(push=true){
 active='home';clearSearch();cards.forEach(c=>c.hidden=true);if(dashboard)dashboard.hidden=false;
 updateNav('home');updatePager();if(push&&location.hash!=='#home')history.pushState(null,'','#home');
 window.scrollTo({top:0,behavior:'smooth'});
}
function showSection(id,push=true){
 const target=document.getElementById(id);if(!target||!target.classList.contains('card'))return;
 active=id;clearSearch();cards.forEach(c=>c.hidden=c!==target);if(dashboard)dashboard.hidden=true;
 target.classList.remove('c');updateNav(id);updatePager();
 if(push&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
 window.scrollTo({top:0,behavior:'smooth'});
}
function go(delta){const i=order.indexOf(active),n=Math.max(0,Math.min(order.length-1,i+delta));if(n===i)return;order[n]==='home'?showHome():showSection(order[n])}
nav.addEventListener('click',e=>{
 const a=e.target.closest('a');if(!a||a.matches('.op'))return;
 const href=a.getAttribute('href');if(a.hasAttribute('data-home')||href==='#home'){e.preventDefault();showHome();return}
 if(href&&href.startsWith('#s')){e.preventDefault();showSection(href.slice(1))}
});
$$('.nav-submenu a').forEach(a=>a.addEventListener('click',()=>$('#master-nav')?.removeAttribute('open')));
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(!id||id==='home')showHome(false);else showSection(id,false)});
window.addEventListener('popstate',()=>{const id=location.hash.slice(1);if(!id||id==='home')showHome(false);else showSection(id,false)});
const search=$('#sq');
if(search)search.addEventListener('input',()=>{
 const q=search.value.trim().toLocaleLowerCase('bn'),result=$('#sr');
 if(!q){if(result)result.textContent='';if(searchMode){const id=active;active='home';id==='home'?showHome(false):showSection(id,false)}return}
 const found=cards.filter(c=>(c.textContent||'').toLocaleLowerCase('bn').includes(q));
 searchMode=true;cards.forEach(c=>c.hidden=!found.includes(c));if(dashboard)dashboard.hidden=true;
 if(result)result.textContent=found.length?found.length+'টি Section-এ ফলাফল':'কোনো Section পাওয়া যায়নি';
 if(found.length){active=found[0].id;updateNav(active);updatePager()}
});
const continueBtn=$('#ac-continue');
if(continueBtn)continueBtn.onclick=()=>{
 let done=[];try{done=JSON.parse(localStorage.getItem('rahat-counsellor-academy-v1')||'{"done":[]}').done||[]}catch(e){}
 showSection(order.find(id=>id!=='home'&&!done.includes(id))||'s1');
};
workspace.addEventListener('touchstart',e=>{
 if(e.touches.length!==1)return;
 const t=e.target;
 if(t.closest('input,textarea,select,button,a,summary,details,.ms-language,.nav-submenu,.tw,.xq,.xr,[contenteditable="true"]')){touch=null;return}
 touch={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
workspace.addEventListener('touchend',e=>{
 if(!touch||!e.changedTouches.length)return;
 const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;
 if(Math.abs(dx)<75||Math.abs(dx)<Math.abs(dy)*1.3)return;
 go(dx<0?1:-1);
},{passive:true});
const prev=$('#page-prev'),next=$('#page-next');
if(prev)prev.addEventListener('click',()=>go(-1));if(next)next.addEventListener('click',()=>go(1));
document.addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;
 if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);
});
const initial=location.hash.slice(1);if(initial&&initial!=='home'&&document.getElementById(initial))showSection(initial,false);else showHome(false);
updatePager();
})();