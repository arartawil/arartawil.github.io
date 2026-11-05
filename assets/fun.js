(function(){
var cols=['#FF5D8F','#FFC93C','#3DB2FF','#36D399','#8B5CF6','#FF8A3D'];
var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function confetti(x,y){ if(calm) return;
 for(var i=0;i<34;i++)(function(i){ var d=document.createElement('div'); d.className='cf'; d.style.background=cols[i%6]; d.style.left=x+'px'; d.style.top=y+'px'; document.body.appendChild(d);
  var a=Math.random()*Math.PI*2, v=4+Math.random()*7, vx=Math.cos(a)*v, vy=Math.sin(a)*v-6, px=x, py=y, r=0, life=0;
  (function t(){ life++; vy+=.35; px+=vx; py+=vy; r+=12; d.style.transform='translate('+(px-x)+'px,'+(py-y)+'px) rotate('+r+'deg)'; d.style.opacity=1-life/70; if(life<70) requestAnimationFrame(t); else d.remove(); })(); })(i); }
document.addEventListener('click',function(ev){ var b=ev.target.closest&&ev.target.closest('.btn.play,.cf-btn'); if(b) confetti(ev.clientX,ev.clientY); });
// 3D tilt on cards (mouse only)
if(!calm && window.matchMedia && matchMedia('(hover:hover)').matches){
 document.querySelectorAll('.card').forEach(function(c){
  c.addEventListener('mousemove',function(ev){ var r=c.getBoundingClientRect(), x=(ev.clientX-r.left)/r.width-.5, y=(ev.clientY-r.top)/r.height-.5;
   c.style.transform='perspective(700px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg) translateY(-4px)'; });
  c.addEventListener('mouseleave',function(){ c.style.transform=''; }); }); }
// filters
document.querySelectorAll('.filters button').forEach(function(b){ b.addEventListener('click',function(){
 document.querySelectorAll('.filters button').forEach(function(x){ x.classList.toggle('on',x===b); });
 var f=b.getAttribute('data-f'); document.querySelectorAll('.grid .card').forEach(function(c){ c.classList.toggle('hide', f!=='all' && c.getAttribute('data-cat')!==f); }); }); });
// count-up
document.querySelectorAll('[data-count]').forEach(function(el){ var n=+el.getAttribute('data-count'), k=0; if(calm){ el.textContent=n+(el.getAttribute('data-suf')||''); return; }
 var t=setInterval(function(){ k++; el.textContent=Math.round(n*k/30)+(el.getAttribute('data-suf')||''); if(k>=30) clearInterval(t); },30); });
// world map
var map=document.getElementById('map'); if(!map) return;
var G=JSON.parse(document.getElementById('mapdata').textContent), walker=document.getElementById('walker'), pop=document.getElementById('pop'), cur=-1, tm=null, touring=null;
var $=function(id){ return document.getElementById(id); };
map.querySelectorAll('.pin').forEach(function(p){ var g=G[+p.getAttribute('data-i')]; p.style.right=(100-g.x/12)+'%'; p.style.top=(g.y/7.5)+'%'; p.addEventListener('click',function(){ stopTour(); go(+p.getAttribute('data-i'),true); }); });
var ms=map.parentNode; if(ms.scrollWidth>ms.clientWidth) ms.scrollLeft=-(ms.scrollWidth-ms.clientWidth)/2;
function go(i,open){ cur=(i+G.length)%G.length; var g=G[cur];
 map.querySelectorAll('.pin').forEach(function(p){ p.classList.toggle('active',+p.getAttribute('data-i')===cur); });
 walker.classList.add('walking'); walker.style.left=(g.x/12)+'%'; walker.style.top=(g.y/7.5)+'%';
 var pin=map.querySelector('.pin[data-i="'+cur+'"]'), pr=pin.getBoundingClientRect(), sr=ms.getBoundingClientRect();
 if(pr.left<sr.left+20||pr.right>sr.right-20) ms.scrollBy({left:(pr.left+pr.width/2)-(sr.left+sr.width/2),behavior:'smooth'});
 clearTimeout(tm); tm=setTimeout(function(){ walker.classList.remove('walking'); if(open) show(cur); },1150); }
function show(i){ var g=G[i]; $('box').style.setProperty('--c',g.c);
 $('pIco').src=g.ico; $('pName').textContent=g.n; $('pTag').textContent=g.k; $('pZone').textContent='📍 '+g.z; $('pText').textContent=g.t;
 $('pBtn').innerHTML=g.web?'<a class="btn play" href="'+g.web+'">▶ العبها أونلاين</a>':g.pkg?'<a class="btn play" href="https://play.google.com/store/apps/details?id='+g.pkg+'">▶ حمّلها من Google Play</a>':'<span class="btn soon">⏳ قريبًا على Google Play</span>';
 $('pMore').href='/'+g.s+'/'; pop.classList.add('on'); }
function hide(){ pop.classList.remove('on'); }
$('x').onclick=hide; pop.addEventListener('click',function(ev){ if(ev.target===pop) hide(); });
$('next').onclick=function(){ hide(); go(cur+1,true); }; $('prev').onclick=function(){ hide(); go(cur-1,true); };
document.addEventListener('keydown',function(ev){ if(ev.key==='Escape') hide(); });
function stopTour(){ if(touring){ clearInterval(touring); touring=null; $('tour').textContent='🚶 جولة بالخريطة'; } }
var tour=$('tour'); if(tour) tour.onclick=function(){ if(touring){ stopTour(); return; }
 hide(); map.scrollIntoView({behavior:'smooth',block:'center'}); tour.textContent='⏸ وقّف الجولة'; var k=cur<0?0:cur; go(k,false);
 touring=setInterval(function(){ k=(k+1)%G.length; go(k,false); },1500); };
var rnd=$('rand'); if(rnd) rnd.onclick=function(ev){ stopTour(); confetti(ev.clientX,ev.clientY); map.scrollIntoView({behavior:'smooth',block:'center'});
 var k; do{ k=Math.floor(Math.random()*G.length); }while(k===cur&&G.length>1); setTimeout(function(){ go(k,true); },350); };
})();
