/* Counsellor Academy — stable app navigation */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const nav=$('#nav'),workspace=$('.w'),home=$('[data-home]'),dashboard=$('#academy-dashboard');
if(!nav||!workspace)return;
const cards=$$('.w > section.card'),ids=cards.map(x=>x.id),order=['home',...ids];
let active='home',touch=null,searchMode=false;
const master=$('#master-nav'),masterSummary=master?.querySelector('summary');
const menuPanel=document.createElement('div');
menuPanel.id='master-menu-panel';menuPanel.hidden=true;
menuPanel.setAttribute('role','menu');
if(master){
 const original=master.querySelector('.nav-submenu');
 if(original){
  original.querySelectorAll('a').forEach(a=>{
   const item=a.cloneNode(true);item.setAttribute('role','menuitem');menuPanel.appendChild(item);
  });
  document.body.appendChild(menuPanel);
 }
}
function setMenu(open){
 if(!master||!menuPanel)return;
 master.open=!!open;menuPanel.hidden=!open;
 masterSummary?.setAttribute('aria-expanded',String(!!open));
}
masterSummary?.addEventListener('click',e=>{
 e.preventDefault();e.stopPropagation();setMenu(menuPanel.hidden);
});
menuPanel.addEventListener('click',e=>{
 const a=e.target.closest('a');if(!a)return;
 e.preventDefault();e.stopPropagation();
 const id=a.getAttribute('href')?.slice(1);
 if(ids.includes(id))setView(id);
 setMenu(false);
});
document.addEventListener('click',e=>{
 if(!menuPanel.hidden&&!menuPanel.contains(e.target)&&!master?.contains(e.target))setMenu(false);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);setView(ids.includes(id)?id:'home',{push:false,scroll:false})});
window.addEventListener('popstate',()=>{const id=location.hash.slice(1);setView(ids.includes(id)?id:'home',{push:false,scroll:false})});
const search=$('#sq');
search?.addEventListener('input',()=>{
 const q=search.value.trim().toLocaleLowerCase('bn'),result=$('#sr');
 if(!q){if(result)result.textContent='';if(searchMode)setView(active,{push:false,scroll:false});return}
 searchMode=true;const found=cards.filter(c=>(c.innerText||c.textContent||'').toLocaleLowerCase('bn').includes(q));
 cards.forEach(c=>c.hidden=!found.includes(c));if(dashboard)dashboard.hidden=true;
 if(result)result.textContent=found.length?found.length+'টি Section পাওয়া গেছে':'কোনো Section পাওয়া যায়নি';
 if(found.length){active=found[0].id;markNav(active);updatePager()}
});
$('#ac-continue')?.addEventListener('click',()=>{
 let done=[];try{done=JSON.parse(localStorage.getItem('rahat-counsellor-academy-v1')||'{"done":[]}').done||[]}catch(e){}
 setView(ids.find(id=>!done.includes(id))||ids[0]);
});
const pagerPrev=$('#page-prev'),pagerNext=$('#page-next');
pagerPrev?.addEventListener('click',()=>go(-1));pagerNext?.addEventListener('click',()=>go(1));
workspace.addEventListener('touchstart',e=>{
 if(e.touches.length!==1)return;
 if(e.target.closest('input,textarea,select,button,a,summary,details,.ms-language,.nav-submenu,.tw,.xq,.xr,[contenteditable="true"]')){touch=null;return}
 touch={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
workspace.addEventListener('touchend',e=>{
 if(!touch||!e.changedTouches.length)return;
 const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;
 if(Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy)*1.35)go(dx<0?1:-1);
},{passive:true});
document.addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;
 if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);
});
const initial=location.hash.slice(1);setView(ids.includes(initial)?initial:'home',{push:false,scroll:false});
})();