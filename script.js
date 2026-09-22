(() => {
  'use strict';
  const invite = document.querySelector('.invite');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const musicFab = document.getElementById('musicFab');
  const audio = document.getElementById('siteAudio');
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => [...root.querySelectorAll(s)];
  let lightboxItems = [], lightboxIndex = 0;

  qsa('[data-next-section]').forEach(btn => btn.addEventListener('click', () => {
    const next = btn.closest('.section')?.nextElementSibling;
    next?.scrollIntoView({behavior:'smooth', block:'start'});
  }));

  function countdownData(target){
    const diff = Math.max(0,target-Date.now());
    return [['Días',Math.floor(diff/86400000)],['Horas',Math.floor(diff%86400000/3600000)],['Minutos',Math.floor(diff%3600000/60000)],['Segundos',Math.floor(diff%60000/1000)]];
  }
  function updateCountdown(){
    const target = new Date(invite?.dataset.date).getTime();
    if(!Number.isFinite(target)) return;
    qsa('[data-countdown="digital"]').forEach(el => {
      el.innerHTML = countdownData(target).map(([label,value]) => `<div class="unit"><b>${String(value).padStart(2,'0')}</b><span>${label==='Minutos'?'min':label==='Segundos'?'seg':label==='Horas'?'hrs':'días'}</span></div>`).join('');
    });
  }
  updateCountdown(); setInterval(updateCountdown,1000);

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const revealItems = qsa('.reveal-on-scroll,[data-animate-icon]');
  if(reduceMotion || !('IntersectionObserver' in window)) revealItems.forEach(el=>el.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target);}
    }),{threshold:.15,rootMargin:'0px 0px -7% 0px'});
    revealItems.forEach(el=>observer.observe(el));
  }

  function openModal(markup){ if(!modal||!modalBody)return; modalBody.innerHTML=markup; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeModal(){ if(!modal)return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  qsa('[data-close]').forEach(b=>b.addEventListener('click',closeModal));

  qsa('[data-map]').forEach(b=>b.addEventListener('click',()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.dataset.map||'')}`,'_blank','noopener')));
  qsa('[data-info]').forEach(b=>b.addEventListener('click',()=>openModal(`<h2>${b.dataset.infoTitle||'Información'}</h2><p>${b.dataset.infoContent||''}</p><button class="pill" data-close-inner>CERRAR</button>`)));
  document.addEventListener('click',e=>{if(e.target.matches('[data-close-inner]'))closeModal();});

  qsa('[data-gift]').forEach(b=>b.addEventListener('click',()=>openModal('<h2>Datos bancarios</h2><p><strong>Banco Demo</strong><br>Alias: NUESTRA.LUNA<br>Reemplazá estos datos por los reales antes de publicar.</p><button class="pill" data-close-inner>CERRAR</button>')));
  qsa('[data-rsvp]').forEach(b=>b.addEventListener('click',()=>{
    openModal(`<h2>Confirmación de asistencia</h2><p>Martina &amp; Federico</p><form id="rsvpForm"><input required autocomplete="name" placeholder="Nombre y apellido"><select><option>Confirmo asistencia</option><option>No podré asistir</option></select><textarea placeholder="Mensaje / requerimiento alimentario"></textarea><button class="pill" type="submit">ENVIAR</button></form>`);
    qs('#rsvpForm')?.addEventListener('submit',e=>{e.preventDefault();openModal('<h2>¡Gracias!</h2><p>Tu respuesta quedó registrada en esta demostración. Para producción, conectá el formulario a tu servicio preferido.</p><button class="pill" data-close-inner>CERRAR</button>');});
  }));
  qsa('[data-song]').forEach(b=>b.addEventListener('click',()=>{
    openModal(`<h2>¿Qué canción no puede faltar?</h2><form id="songForm"><input required placeholder="Canción"><input placeholder="Artista"><button class="pill" type="submit">ENVIAR SUGERENCIA</button></form>`);
    qs('#songForm')?.addEventListener('submit',e=>{e.preventDefault();openModal('<h2>¡Anotada! ♫</h2><p>Gracias por sumar tu canción a la fiesta.</p><button class="pill" data-close-inner>CERRAR</button>');});
  }));

  function eventRange(){const start=new Date(invite?.dataset.date); const hours=Number(invite?.dataset.duration||6); return {start,end:new Date(start.getTime()+hours*3600000)};}
  function compactUTC(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');}
  qsa('[data-calendar]').forEach(b=>b.addEventListener('click',()=>{
    const {start,end}=eventRange(); const p=new URLSearchParams({action:'TEMPLATE',text:'Boda Martina & Federico',dates:`${compactUTC(start)}/${compactUTC(end)}`,details:'Celebración de Martina & Federico',location:'Iglesia San Juan Bautista, Montevideo, Uruguay'});
    openModal(`<h2>Agendar evento</h2><p>Guardá la fecha en tu calendario.</p><a class="pill" style="display:inline-flex;text-decoration:none" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/render?${p.toString()}">GOOGLE CALENDAR</a>`);
  }));

  lightboxItems=qsa('.photo-grid img');
  lightboxItems.forEach((img,i)=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar foto');img.addEventListener('click',()=>openLightbox(i));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(i)}});});
  function openLightbox(i){if(!lightbox)return;lightboxIndex=i;renderLightbox();lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');}
  function renderLightbox(){const item=lightboxItems[lightboxIndex];if(!item||!lightboxImg)return;lightboxImg.src=item.currentSrc||item.src;if(lightboxCaption)lightboxCaption.textContent=item.alt||'';}
  function stepLightbox(d){if(!lightboxItems.length)return;lightboxIndex=(lightboxIndex+d+lightboxItems.length)%lightboxItems.length;renderLightbox();}
  function closeLightbox(){if(!lightbox)return;lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImg?.removeAttribute('src');}
  qsa('[data-lightbox-close]').forEach(el=>el.addEventListener('click',closeLightbox));qs('#lightboxPrev')?.addEventListener('click',()=>stepLightbox(-1));qs('#lightboxNext')?.addEventListener('click',()=>stepLightbox(1));

  function updateMusicButton(){if(!musicFab||!audio)return;const audible=!audio.paused&&!audio.muted;musicFab.classList.toggle('is-playing',audible);musicFab.setAttribute('aria-label',audible?'Silenciar música':'Activar música');musicFab.setAttribute('aria-pressed',String(audio.muted||audio.paused));}
  async function tryStartAudio(){if(!audio||!audio.paused)return true;try{audio.volume=.42;audio.muted=false;await audio.play();updateMusicButton();return true;}catch{updateMusicButton();return false;}}
  audio?.load();tryStartAudio();
  const unlockAudio=async()=>{if(await tryStartAudio()){document.removeEventListener('pointerdown',unlockAudio,true);document.removeEventListener('touchstart',unlockAudio,true);document.removeEventListener('keydown',unlockAudio,true);}};
  document.addEventListener('pointerdown',unlockAudio,true);document.addEventListener('touchstart',unlockAudio,true);document.addEventListener('keydown',unlockAudio,true);
  musicFab?.addEventListener('click',async e=>{e.stopPropagation();if(!audio)return;if(audio.paused){audio.muted=false;await tryStartAudio();}else audio.muted=!audio.muted;updateMusicButton();});
  ['play','pause','volumechange','canplay'].forEach(ev=>audio?.addEventListener(ev,updateMusicButton));updateMusicButton();

  document.addEventListener('keydown',e=>{if(lightbox?.classList.contains('open')){if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')stepLightbox(1);if(e.key==='ArrowLeft')stepLightbox(-1);return;}if(e.key==='Escape')closeModal();});
})();
