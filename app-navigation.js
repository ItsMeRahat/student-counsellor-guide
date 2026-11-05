/* Student Counsellor Academy — app-style navigation */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const nav=$('#nav'),home=$('[data-home]'),dashboard=$('#academy-dashboard');
if(!nav)return;
const cards=$$('.w > section.card'),links=$$('#nav a[href^="#s"]');
let active='home';
function setActiveLink(id){
 $$('#nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));
 home?.classList.toggle('active',id==='home');
 if(id==='s13'||id==='s14'||id==='s15')$('#master-nav')?.setAttribute('open','');
}
function clearSearch(){const q=$('#sq');if(q)q.value='';const r=$('#sr');if(r)r.textContent='';}
function showHome(update=true){
 active='home';clearSearch();cards.forEach(s=>s.hidden=true);
 if(dashboard)dashboard.hidden=false;
 setActiveLink('home');
 if(update&&location.hash!=='#home')history.pushState(null,'',location.pathname+location.search+'#home');
 window.scrollTo({top:0,behavior:'smooth'});
}
function showSection(id,update=true){
 const target=document.getElementById(id);if(!target||!target.classList.contains('card'))return;
 active=id;clearSearch();cards.forEach(s=>s.hidden=s!==target);
 if(dashboard)dashboard.hidden=true;
 target.classList.remove('c');setActiveLink(id);
 if(update&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
 window.scrollTo({top:0,behavior:'smooth'});
}
nav.addEventListener('click',e=>{
 const a=e.target.closest('a');if(!a)return;
 if(a.matches('.op'))return;
 const href=a.getAttribute('href');
 if(a.hasAttribute('data-home')||href==='#home'){e.preventDefault();showHome();return}
 if(href&&href.startsWith('#s')){e.preventDefault();showSection(href.slice(1))}
});
window.addEventListener('hashchange',()=>{
/* Touch swipe navigation: one page per gesture */
const pageOrder=['home','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13','s14','s15'];
let touchStart=null;
const workspace=$('.w');
if(workspace){
 workspace.addEventListener('touchstart',e=>{
  if(e.touches.length!==1)return;
  const t=e.target;
  if(t.closest('input,textarea,select,button,a,summary,details,.ms-language,.nav-submenu,.tw,.xq,.xr,[contenteditable="true"]')){touchStart=null;return}
  touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
 },{passive:true});
 workspace.addEventListener('touchend',e=>{
  if(!touchStart||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
  touchStart=null;
  if(Math.abs(dx)<75||Math.abs(dx)<Math.abs(dy)*1.35)return;
  const index=pageOrder.indexOf(active);if(index<0)return;
  const next=pageOrder[index+(dx<0?1:-1)];if(!next)return;
  if(next==='home')showHome();else showSection(next);
 },{passive:true});
}
const id=location.hash.slice(1);if(id==='home'||!id)showHome(false);else showSection(id,false)});
window.addEventListener('popstate',()=>{const id=location.hash.slice(1);if(id==='home'||!id)showHome(false);else showSection(id,false)});
const search=$('#sq');
if(search)search.oninput=()=>{
 const q=search.value.trim().toLocaleLowerCase('bn');
 const result=$('#sr');
 if(!q){result.textContent='';if(active==='home')showHome(false);else showSection(active,false);return}
 const found=cards.filter(s=>(s.textContent||'').toLocaleLowerCase('bn').includes(q));
 cards.forEach(s=>s.hidden=!found.includes(s));if(dashboard)dashboard.hidden=true;
 result.textContent=found.length+'টি Section-এ ফলাফল';
 found.forEach(s=>s.classList.remove('c'));
 if(found.length){active=found[0].id;setActiveLink(active)}
};
const continueBtn=$('#ac-continue');
if(continueBtn)continueBtn.onclick=()=>{
 let done=[];try{done=JSON.parse(localStorage.getItem('rahat-counsellor-academy-v1')||'{"done":[]}').done||[]}catch(e){}
 const ids=['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13','s14','s15'];
 showSection(ids.find(id=>!done.includes(id))||'s1');
};
$$('.nav-submenu a').forEach(a=>a.addEventListener('click',()=>$('#master-nav')?.removeAttribute('open')));
const id=location.hash.slice(1);if(id&&id!=='home'&&document.getElementById(id))showSection(id,false);else showHome(false);
})();