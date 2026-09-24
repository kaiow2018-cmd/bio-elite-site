/**
 * Páginas Web • Hero Single Viewport + Below Fold
 * - Mobile menu (spec)
 * - Reveal / headline / count-up (spec + bio)
 * - Constellation canvas (monochrome, subtle) ported from bio-elite
 */
document.addEventListener('DOMContentLoaded', () => {
  // ===== MOBILE MENU (spec) =====
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  function openMenu() {
    burger.setAttribute('aria-expanded','true');
    if(menu) menu.hidden = false;
    if(overlay) overlay.hidden = false;
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    burger.setAttribute('aria-expanded','false');
    if(menu) menu.hidden = true;
    if(overlay) overlay.hidden = true;
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }
  // garante fechado no load (fix tela preta inicial)
  closeMenu();
  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu(); else openMenu();
    });
  }
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 720) closeMenu(); });

  // ===== REVEAL (bio + spec) =====
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('active')) {
        entry.target.style.transitionDelay = `${delay * 120}ms`;
        entry.target.classList.add('active');
        delay++;
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // ===== STATS COUNT-UP (spec exact) =====
  const statNums = document.querySelectorAll('.stat-num');
  const statsSection = document.querySelector('.stats');
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
  function animateStat(el, i) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500 + i * 80;
    const startDelay = 480 + i * 90;
    setTimeout(() => {
      let start = null;
      function step(ts){
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const e = easeOutCubic(p);
        const val = (e * target).toFixed(decimals);
        el.textContent = `${val}${suffix}`;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = `${target.toFixed(decimals)}${suffix}`;
      }
      requestAnimationFrame(step);
    }, startDelay);
  }
  if (statsSection && statNums.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNums.forEach((el, i) => animateStat(el, i));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  }

  // ===== BELOW-FOLD COUNTERS (20+, 45%) =====
  const altNums = document.querySelectorAll('.stat-number[data-target]');
  const altGrid = document.querySelector('.stats-grid');
  function animateAlt(el){
    const target = parseInt(el.getAttribute('data-target'),10);
    let start=null; const dur=2000;
    function step(ts){
      if(!start) start=ts;
      const p=Math.min((ts-start)/dur,1);
      const e=p*(2-p);
      el.textContent = Math.floor(e*target);
      if(p<1) requestAnimationFrame(step); else el.textContent=String(target);
    }
    requestAnimationFrame(step);
  }
  if (altGrid){
    const altObs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ altNums.forEach(animateAlt); altObs.unobserve(e.target); }
      });
    },{threshold:0.2});
    altObs.observe(altGrid);
  }

  // ===== BENTO GLOW & MODAL =====
  const bentoItems = document.querySelectorAll('.bento-item');
  bentoItems.forEach(item=>{
    let raf=null;
    item.addEventListener('mousemove', (e)=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const rect=item.getBoundingClientRect();
        item.style.setProperty('--mouse-x', `${e.clientX-rect.left}px`);
        item.style.setProperty('--mouse-y', `${e.clientY-rect.top}px`);
        raf=null;
      });
    });
  });
  const modal=document.getElementById('project-modal');
  const modalIframe=document.getElementById('modal-iframe');
  const modalLoader=modal ? modal.querySelector('.modal-loader') : null;
  const closeBtn=modal ? modal.querySelector('.modal-close') : null;
  function openModal(url){
    if(!url||!modal) return;
    modal.classList.add('active');
    document.body.style.overflow='hidden';
    if(modalLoader) modalLoader.classList.remove('hidden');
    modalIframe.src=url;
    modalIframe.onload=()=>{ if(modalLoader) modalLoader.classList.add('hidden'); };
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow='';
    setTimeout(()=>{ modalIframe.src=''; }, 400);
  }
  bentoItems.forEach(item=>{
    item.addEventListener('click', ()=>{
      const demo=item.getAttribute('data-demo');
      if(demo) openModal(demo);
    });
  });
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal && modal.classList.contains('active')) closeModal(); });

  // ===== SMOOTH ANCHOR (fix offset + fecha menu mobile) =====
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href=this.getAttribute('href');
      if(!href) return;
      if(href === '#'){
        e.preventDefault();
        window.scrollTo({ top: 0, behavior:'smooth'});
        if(typeof closeMenu === 'function') closeMenu();
        return;
      }
      if(href.length>1){
        const target=document.querySelector(href);
        if(target){
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top, behavior:'smooth'});
          if(typeof closeMenu === 'function') closeMenu();
        }
      }
    });
  });

  // ===== MAGNETIC CTA (subtle) =====
  document.querySelectorAll('.cta, .btn-premium').forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const r=btn.getBoundingClientRect();
      const x=e.clientX - r.left - r.width/2;
      const y=e.clientY - r.top - r.height/2;
      btn.style.transform=`translate(${x*0.08}px, ${y*0.12}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
  });
});

/* ==========================================================
   CONSTELLATION ENGINE (monochrome, subtle over video)
   ========================================================== */
(function initHeroCanvas(){
  function start(){
    const canvas=document.getElementById('hero-canvas');
    const hero=document.querySelector('.page');
    if(!canvas || !hero) return;
    const ctx=canvas.getContext('2d');
    let width=0,height=0,dpr=Math.min(window.devicePixelRatio||1,2);
    let animId=null; let visible=true; let time=0;
    const mouse={x:-1000,y:-1000,active:false,radius:190};
    function onMove(e){
      const r=canvas.getBoundingClientRect();
      mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; mouse.active=true;
    }
    function onLeave(){ mouse.x=-1000; mouse.y=-1000; mouse.active=false; }
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    function resize(){
      const rect=hero.getBoundingClientRect();
      width=rect.width; height=rect.height;
      canvas.width=width*dpr; canvas.height=height*dpr;
      ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr);
    }
    resize(); window.addEventListener('resize', resize, {passive:true});

    // white/gray particles, not cyan
    const count=Math.min(Math.floor((window.innerWidth*window.innerHeight)/16000), 64);
    const particles=[];
    for(let i=0;i<count;i++){
      particles.push({
        x:Math.random()*width, y:Math.random()*height,
        vx:(Math.random()-0.5)*0.55, vy:(Math.random()-0.5)*0.55,
        r: Math.random()*1.6+0.9,
        a: Math.random()*0.35+0.18,
        pulse: Math.random()*Math.PI*2,
        ps: Math.random()*0.02+0.012
      });
    }
    // subtle sine waves (white, ultra low)
    const waves=[
      { yRatio:0.38, amp:26, freq:0.0026, speed:0.012, color:'rgba(255,255,255,0.18)', w:1.2 },
      { yRatio:0.50, amp:36, freq:0.0020, speed:-0.010, color:'rgba(255,255,255,0.12)', w:1 },
      { yRatio:0.60, amp:28, freq:0.0029, speed:0.014, color:'rgba(255,255,255,0.10)', w:1 }
    ];
    function drawWave(w){
      const baseY=height*w.yRatio;
      ctx.beginPath(); ctx.lineWidth=w.w; ctx.strokeStyle=w.color;
      for(let x=0;x<=width;x+=10){
        let y=baseY + Math.sin(x*w.freq + time*w.speed)*w.amp;
        y+= Math.cos(x*0.0014 + time*0.008)*(w.amp*0.35);
        if(mouse.active){
          const dx=x-mouse.x, dy=y-mouse.y, dist=Math.hypot(dx,dy);
          if(dist<mouse.radius){
            const f=(mouse.radius-dist)/mouse.radius;
            y+=(mouse.y - y)*f*0.28;
          }
        }
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }

    function render(){
      if(!visible) return;
      time+=1;
      ctx.clearRect(0,0,width,height);
      // waves first (behind particles)
      for(const w of waves) drawWave(w);

      const maxDist=132;
      for(let i=0;i<particles.length;i++){
        const p=particles[i];
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0){p.x=0; p.vx*=-1} else if(p.x>width){p.x=width; p.vx*=-1}
        if(p.y<0){p.y=0; p.vy*=-1} else if(p.y>height){p.y=height; p.vy*=-1}
        p.pulse+=p.ps;
        const alpha=Math.max(0.15, p.a + Math.sin(p.pulse)*0.12);

        if(mouse.active){
          const dx=mouse.x-p.x, dy=mouse.y-p.y, dist=Math.hypot(dx,dy);
          if(dist<mouse.radius){
            const pull=(mouse.radius-dist)/mouse.radius;
            p.x+=(dx/dist)*pull*1.1; p.y+=(dy/dist)*pull*1.1;
            // faint beam to cursor
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y);
            ctx.strokeStyle=`rgba(255,255,255,${pull*0.22})`; ctx.lineWidth=0.9; ctx.stroke();
          }
        }
        // halo
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*2.4,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${alpha*0.18})`; ctx.fill();
        // core
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${alpha})`; ctx.fill();

        for(let j=i+1;j<particles.length;j++){
          const q=particles[j];
          const dx=p.x-q.x, dy=p.y-q.y, dist=Math.hypot(dx,dy);
          if(dist<maxDist){
            const a=(1-dist/maxDist)*0.18;
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
            ctx.strokeStyle=`rgba(255,255,255,${a})`; ctx.lineWidth=0.75; ctx.stroke();
          }
        }
      }
      animId=requestAnimationFrame(render);
    }

    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ visible=true; if(!animId) animId=requestAnimationFrame(render); }
        else { visible=false; if(animId){ cancelAnimationFrame(animId); animId=null; } }
      });
    },{threshold:0.05});
    obs.observe(hero);
    animId=requestAnimationFrame(render);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', start); else start();
})();


