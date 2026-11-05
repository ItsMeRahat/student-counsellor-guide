/* Student Counsellor Academy — personal, browser-local progress */
(()=>{
'use strict';
const KEY='rahat-counsellor-academy-v1';
const modules=[
['s1','সম্পূর্ণ Workflow'],['s2','Student Calling'],['s3','Profile Assessment'],['s4','University Research'],
['s5','Documentation'],['s6','Application & Visa'],['s7','CRM & Reporting'],['s8','Software'],
['s9','CRM Document Handling'],['s10','Excel, PDF & Email'],['s11','৫ দিনের Schedule'],['s12','Excel Guide'],['s13','Malaysia Counselling Roleplay'],['s14','Sweden Masterclass'],['s15','Norway Masterclass']
];
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{done:[]}}catch(e){return{done:[]}}};
let state=read();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}};
const $=s=>document.querySelector(s);
const hero=$('.hero');if(!hero)return;
const panel=document.createElement('section');
panel.className='academy';panel.id='academy-dashboard';
panel.setAttribute('aria-label','Personal learning dashboard');
panel.innerHTML=
'<div class="academy-head"><div><h2 class="academy-title">🎓 My Learning Dashboard</h2><p class="academy-sub">Personal progress • এই ব্রাউজারেই অগ্রগতি সংরক্ষিত হবে</p></div><span class="academy-badge">PERSONAL MODE</span></div>'+
'<div class="academy-grid"><div class="academy-stat"><b id="ac-done">0</b><span>Completed Modules</span></div><div class="academy-stat"><b id="ac-left">12</b><span>Remaining Modules</span></div><div class="academy-stat"><b id="ac-percent">0%</b><span>Overall Progress</span></div><div class="academy-stat"><b id="ac-days">0/5</b><span>Study Plan</span></div></div>'+
'<div class="academy-track"><i id="ac-bar"></i></div><div class="academy-progress-label"><span>Learning progress</span><strong id="ac-label">0 of 12 modules</strong></div>'+
'<div class="academy-actions"><button class="academy-btn primary" id="ac-continue">▶ Continue Learning</button><button class="academy-btn" id="ac-expand">Open All Sections</button><button class="academy-btn" id="ac-reset">Reset Progress</button></div>'+
'<div class="academy-modules" id="ac-modules"></div><p class="academy-note">Local Storage ব্যবহৃত হচ্ছে। একই Browser ও Device-এ Progress থাকবে; Browser data মুছলে Progress হারাতে পারে। এটি Cloud Sync বা Backup নয়।</p>';
hero.insertAdjacentElement('afterend',panel);
const render=()=>{
 const count=state.done.length,pct=Math.round(count/modules.length*100);
 $('#ac-done').textContent=count;$('#ac-left').textContent=modules.length-count;
 $('#ac-percent').textContent=pct+'%';$('#ac-bar').style.width=pct+'%';
 $('#ac-label').textContent=count+' of '+modules.length+' modules';
 let dayCount=0;
 try{const p=JSON.parse(localStorage.getItem('ahz-site')||'{}');dayCount=(p.m&&p.m.plan||[]).length}catch(e){}
 $('#ac-days').textContent=dayCount+'/5';
 $('#ac-modules').innerHTML=modules.map(([id,label])=>'<label class="academy-module '+(state.done.includes(id)?'done':'')+'"><input type="checkbox" data-module="'+id+'" '+(state.done.includes(id)?'checked':'')+'><span>'+label+'</span>'+(state.done.includes(id)?'<b aria-label="Completed">✓</b>':'')+'</label>').join('');
};
$('#ac-modules').addEventListener('change',e=>{
 const id=e.target.dataset.module;if(!id)return;
 state.done=e.target.checked?[...new Set([...state.done,id])]:state.done.filter(x=>x!==id);
 save();render();syncCards();
});
function syncCards(){
 modules.forEach(([id])=>{
  const section=document.getElementById(id);if(!section)return;
  section.classList.toggle('academy-done',state.done.includes(id));
  const input=section.querySelector('[data-section="'+id+'"]');if(input)input.checked=state.done.includes(id);
 });
}
modules.forEach(([id])=>{
 const section=document.getElementById(id);if(!section)return;
 const body=section.querySelector('.bd');if(!body)return;
 const label=document.createElement('label');label.className='academy-complete';
 label.innerHTML='<input type="checkbox" data-section="'+id+'" '+(state.done.includes(id)?'checked':'')+'><span>Mark this module as completed</span>';
 body.insertBefore(label,body.firstChild);
 section.classList.toggle('academy-done',state.done.includes(id));
 label.querySelector('input').addEventListener('change',e=>{
  state.done=e.target.checked?[...new Set([...state.done,id])]:state.done.filter(x=>x!==id);
  save();syncCards();render();
 });
});
$('#ac-continue').onclick=()=>{
 const next=modules.find(([id])=>!state.done.includes(id))||modules[0];
 const target=document.getElementById(next[0]);target.classList.remove('c');
 target.scrollIntoView({behavior:'smooth',block:'start'});
};
$('#ac-expand').onclick=()=>document.querySelectorAll('section.card').forEach(s=>s.classList.remove('c'));
$('#ac-reset').onclick=()=>{
 if(!confirm('সব Module Completion Progress মুছে ফেলতে চান?'))return;
 state.done=[];save();syncCards();render();
};
render();
})();