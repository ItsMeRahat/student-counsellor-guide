/* Counsellor Academy — stable app navigation */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const nav=$('#nav'),workspace=$('.w'),home=$('[data-home]'),dashboard=$('#academy-dashboard');
if(!nav||!workspace)return;
const cards=$$('.w > section.card'),ids=cards.map(x=>x.id),order=['home',...ids];
let active='home',touch=null,searchMode=false;
const master=$('#master-nav');
function setMenu(open){if(master)master.open=!!open}
function markNav(id){
 $$('a[href^="#"]',nav).forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));
 home?.classList.toggle('active',id==='home');
 const isMaster=['s13','s14','s15'].includes(id);
 if(isMaster)setMenu(true);
 else setMenu(false);
 const link=$$('a[href^="#"]',nav).find(a=>a.getAttribute('href')==='#'+id);
 if(link&&innerWidth<1100)link.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
}
function updatePager(){
 const i=order.indexOf(active),label=$('#page-count'),prev=$('#page-prev'),next=$('#page-next');
 if(label)label.textContent=active==='home'?'Dashboard':(i)+' / '+ids.length;
 if(prev)prev.disabled=i<=0;
 if(next)next.disabled=i<0||i>=order.length-1;
}
function setView(id,{push=true,scroll=true}={}){
 const valid=id==='home'||ids.includes(id);if(!valid)return;
 active=id;searchMode=false;
 const q=$('#sq'),result=$('#sr');if(q)q.value='';if(result)result.textContent='';
 cards.forEach(c=>{c.hidden=id==='home'||c.id!==id});
 if(dashboard)dashboard.hidden=id!=='home';
 markNav(id);updatePager();
 if(push&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
 if(scroll)window.scrollTo({top:0,behavior:'smooth'});
}
function go(step){const i=order.indexOf(active),n=Math.max(0,Math.min(order.length-1,i+step));if(n!==i)setView(order[n])}
nav.addEventListener('click',e=>{
 const link=e.target.closest('a');if(!link)return;
 if(link.classList.contains('op'))return;
 const href=link.getAttribute('href');
 if(link.hasAttribute('data-home')||href==='#home'){e.preventDefault();setView('home');return}
 if(href&&ids.includes(href.slice(1))){e.preventDefault();setView(href.slice(1));setMenu(false)}
});
if(master){
 const summary=master.querySelector('summary');
 summary?.addEventListener('click',e=>{e.preventDefault();setMenu(!master.open)});
 master.querySelectorAll('.nav-submenu a').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();const id=a.getAttribute('href').slice(1);if(ids.includes(id))setView(id);setMenu(false);
 }));
}
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