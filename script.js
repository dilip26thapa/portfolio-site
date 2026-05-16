/* LOADER */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1900);
});

/* PARTICLE BG */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;
function resizeCanvas() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
class Particle {
  constructor() { this.reset(); }
  reset() { this.x = Math.random()*W; this.y = Math.random()*H; this.r = Math.random()*1.5+0.3; this.vx = (Math.random()-0.5)*0.3; this.vy = (Math.random()-0.5)*0.3; this.life = Math.random(); this.maxLife = Math.random()*0.02+0.003; this.growing = true; }
  update() { this.x+=this.vx; this.y+=this.vy; if(this.growing){this.life+=this.maxLife;if(this.life>=1)this.growing=false;}else{this.life-=this.maxLife;if(this.life<=0)this.reset();} }
  draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); const isDark=document.documentElement.getAttribute('data-theme')!=='light'; ctx.fillStyle=`rgba(${isDark?'130,140,248':'99,102,241'},${this.life*0.4})`; ctx.fill(); }
}
for(let i=0;i<120;i++) particles.push(new Particle());
function animateParticles() { ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(animateParticles); }
animateParticles();

/* THEME TOGGLE */
document.getElementById('themeToggle').addEventListener('click',()=>{
  const current=document.documentElement.getAttribute('data-theme');
  const next=current==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  document.getElementById('themeToggle').innerHTML=next==='dark'?'<i class="fa fa-moon"></i>':'<i class="fa fa-sun"></i>';
});

/* NAVBAR SCROLL */
const navbar=document.getElementById('navbar');
const backTop=document.getElementById('back-top');
window.addEventListener('scroll',()=>{
  const s=window.scrollY;
  navbar.classList.toggle('scrolled',s>50);
  backTop.classList.toggle('visible',s>400);
});

/* MOBILE MENU */
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mobileClose').addEventListener('click',closeMobile);
function closeMobile(){document.getElementById('mobileMenu').classList.remove('open');}

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

/* SCROLL REVEAL */
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ANIMATED COUNTERS */
function animateCounter(el){
  const target=parseFloat(el.dataset.target);
  const suffix=el.dataset.suffix||'';
  const isDecimal=target%1!==0;
  const duration=2000;
  const start=performance.now();
  function update(now){
    const elapsed=now-start;
    const progress=Math.min(elapsed/duration,1);
    const ease=1-Math.pow(1-progress,3);
    const current=target*ease;
    el.textContent=(isDecimal?current.toFixed(1):Math.floor(current).toLocaleString())+suffix;
    if(progress<1)requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){animateCounter(e.target);counterObserver.unobserve(e.target);}});
},{threshold:0.5});
document.querySelectorAll('.stat-number').forEach(el=>counterObserver.observe(el));

/* CONTACT FORM */
function submitContact(e){
  e.preventDefault();
  let valid=true;
  [['firstName','firstNameError'],['lastName','lastNameError'],['message','messageError']].forEach(([id,errId])=>{
    const el=document.getElementById(id);
    const err=document.getElementById(errId);
    if(!el.value.trim()){el.classList.add('error');err.classList.add('show');valid=false;}
    else{el.classList.remove('error');err.classList.remove('show');}
  });
  const email=document.getElementById('email');
  const emailErr=document.getElementById('emailError');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){email.classList.add('error');emailErr.classList.add('show');valid=false;}
  else{email.classList.remove('error');emailErr.classList.remove('show');}
  if(valid){
    document.getElementById('formSuccess').classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(()=>document.getElementById('formSuccess').classList.remove('show'),5000);
  }
}
document.querySelectorAll('.form-input,.form-textarea').forEach(el=>{
  el.addEventListener('input',()=>el.classList.remove('error'));
});
