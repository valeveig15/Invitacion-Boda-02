(() => {
  'use strict';

  document.documentElement.classList.add('js');

  /* ============================================================
     CONFIGURACIÓN RÁPIDA
     Cambiá estos valores para personalizar la invitación.
     ============================================================ */
  const CONFIG = {
    couple: 'Martina & Federico',
    eventDateISO: '2026-11-22T19:00:00-03:00',
    durationHours: 6,
    location: 'Iglesia San Juan Bautista, Montevideo, Uruguay',
    timezone: 'America/Montevideo',
    giftAlias: 'NUESTRA.LUNA',
    giftBank: 'Banco Demo',
    giftAccount: 'Reemplazar por cuenta real antes de publicar'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* ---------------- Scroll / reveal ---------------- */
  $$('[data-scroll-to]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = $(button.dataset.scrollTo);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const progress = $('#scrollProgress');
  const updateProgress = () => {
    if (!progress) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = `${Math.min(100, (window.scrollY / max) * 100)}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const revealItems = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Cuenta regresiva ---------------- */
  const targetDate = new Date(CONFIG.eventDateISO);
  const countdown = {
    days: $('[data-days]'),
    hours: $('[data-hours]'),
    minutes: $('[data-minutes]'),
    seconds: $('[data-seconds]')
  };

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function updateCountdown() {
    if (!Number.isFinite(targetDate.getTime())) return;
    const diff = Math.max(0, targetDate.getTime() - Date.now());
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1_000);
    if (countdown.days) countdown.days.textContent = pad(days);
    if (countdown.hours) countdown.hours.textContent = pad(hours);
    if (countdown.minutes) countdown.minutes.textContent = pad(minutes);
    if (countdown.seconds) countdown.seconds.textContent = pad(seconds);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------- Música ---------------- */
  const musicButton = $('#musicFab');
  const audio = $('#bgMusic');
  let musicOn = false;

  function syncMusicButton() {
    if (!musicButton) return;
    musicButton.classList.toggle('is-playing', musicOn);
    musicButton.setAttribute('aria-pressed', String(musicOn));
    musicButton.setAttribute('aria-label', musicOn ? 'Pausar música' : 'Activar música');
  }

  musicButton?.addEventListener('click', async () => {
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      musicOn = false;
      syncMusicButton();
      return;
    }
    audio.volume = 0.32;
    try {
      await audio.play();
      musicOn = true;
    } catch (error) {
      musicOn = false;
      console.warn('El navegador bloqueó la reproducción hasta que exista interacción del usuario.', error);
    }
    syncMusicButton();
  });
  audio?.addEventListener('pause', () => {
    if (!audio.ended && musicOn && document.visibilityState === 'visible') return;
    musicOn = !audio.paused;
    syncMusicButton();
  });
  syncMusicButton();

  /* ---------------- Imágenes: fallback local ---------------- */
  $$('#gallery img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.src !== new URL(fallback, location.href).href) {
        img.src = fallback;
      }
    }, { once: true });
  });

  /* ---------------- Mapas ---------------- */
  $$('[data-map]').forEach((button) => {
    button.addEventListener('click', () => {
      const query = encodeURIComponent(button.dataset.map || '');
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
    });
  });

  /* ---------------- Modal ---------------- */
  const modal = $('#modal');
  const modalBody = $('#modalBody');
  let lastFocused = null;

  function openModal(html) {
    if (!modal || !modalBody) return;
    lastFocused = document.activeElement;
    modalBody.innerHTML = html;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => $('.modal-close', modal)?.focus());
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  $$('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));

  $$('[data-info]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(`
        <h2 id="modalTitle">${escapeHtml(button.dataset.title || 'Información')}</h2>
        <p>${escapeHtml(button.dataset.content || 'Información disponible para los invitados.')}</p>
        <div class="modal-actions">
          <button class="button button-primary" type="button" data-modal-ok>CERRAR</button>
        </div>
      `);
      $('[data-modal-ok]')?.addEventListener('click', closeModal);
    });
  });

  $$('[data-gift]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(`
        <h2 id="modalTitle">Luna de miel</h2>
        <p>Si querés colaborar, estos datos se pueden reemplazar por los reales antes de publicar.</p>
        <div class="bank-box">
          <strong>${escapeHtml(CONFIG.giftBank)}</strong><br>
          Alias: <strong>${escapeHtml(CONFIG.giftAlias)}</strong><br>
          ${escapeHtml(CONFIG.giftAccount)}
        </div>
        <div class="modal-actions">
          <button class="button button-primary" type="button" data-copy-alias>COPIAR ALIAS</button>
        </div>
        <p class="modal-note">Tip: editá los datos en la sección CONFIG de <code>script.js</code>.</p>
      `);
      $('[data-copy-alias]')?.addEventListener('click', async (event) => {
        const ok = await copyText(CONFIG.giftAlias);
        event.currentTarget.textContent = ok ? 'ALIAS COPIADO' : 'COPIÁ: ' + CONFIG.giftAlias;
      });
    });
  });

  /* ---------------- RSVP sin backend ----------------
     Funciona en GitHub Pages: guarda una copia local y permite
     compartir/copy-pastear el texto. Para recibir respuestas en
     una base central, conectá un servicio de formularios.
     -------------------------------------------------- */
  $$('[data-rsvp]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(`
        <h2 id="modalTitle">Confirmá tu asistencia</h2>
        <p>Completá tus datos. Al enviar, la invitación preparará un mensaje para compartir.</p>
        <form id="rsvpForm">
          <label for="rsvpName">NOMBRE Y APELLIDO</label>
          <input id="rsvpName" name="name" autocomplete="name" required placeholder="Tu nombre">
          <label for="rsvpStatus">ASISTENCIA</label>
          <select id="rsvpStatus" name="status">
            <option value="Sí, confirmo mi asistencia">Sí, confirmo mi asistencia</option>
            <option value="No podré asistir">No podré asistir</option>
          </select>
          <label for="rsvpFood">REQUERIMIENTO ALIMENTARIO</label>
          <textarea id="rsvpFood" name="food" placeholder="Opcional"></textarea>
          <button class="button button-primary button-large" type="submit">PREPARAR RESPUESTA</button>
        </form>
        <p class="modal-note">Esta versión no requiere servidor: usa la función de compartir del teléfono o copia el texto.</p>
      `);

      $('#rsvpForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const response = {
          name: String(data.get('name') || '').trim(),
          status: String(data.get('status') || ''),
          food: String(data.get('food') || '').trim(),
          savedAt: new Date().toISOString()
        };
        saveLocal('wedding-rsvp', response);
        const message = [
          `RSVP · ${CONFIG.couple}`,
          `Nombre: ${response.name}`,
          `Respuesta: ${response.status}`,
          response.food ? `Requerimiento alimentario: ${response.food}` : null
        ].filter(Boolean).join('\n');
        showShareResult('¡Gracias!', 'Tu confirmación quedó preparada.', message);
      });
    });
  });

  /* ---------------- Canciones ---------------- */
  $$('[data-song]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(`
        <h2 id="modalTitle">Sugerí una canción</h2>
        <p>Sumá una canción a la lista de imprescindibles para la fiesta.</p>
        <form id="songForm">
          <label for="songTitle">CANCIÓN</label>
          <input id="songTitle" name="song" required placeholder="Nombre de la canción">
          <label for="songArtist">ARTISTA</label>
          <input id="songArtist" name="artist" placeholder="Artista">
          <button class="button button-primary button-large" type="submit">PREPARAR SUGERENCIA</button>
        </form>
      `);
      $('#songForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const song = String(data.get('song') || '').trim();
        const artist = String(data.get('artist') || '').trim();
        const payload = { song, artist, savedAt: new Date().toISOString() };
        saveLocal('wedding-song', payload);
        const message = `Canción para ${CONFIG.couple}: ${song}${artist ? ` · ${artist}` : ''}`;
        showShareResult('¡Anotada!', 'Tu sugerencia quedó preparada para compartir.', message);
      });
    });
  });

  async function showShareResult(title, copy, text) {
    openModal(`
      <h2 id="modalTitle">${escapeHtml(title)}</h2>
      <p>${escapeHtml(copy)}</p>
      <div class="bank-box" id="shareText">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
      <div class="modal-actions">
        <button class="button button-primary" type="button" data-share>COMPARTIR</button>
        <button class="button button-outline" type="button" data-copy>COPIAR TEXTO</button>
      </div>
      <p class="modal-note">Para recibir respuestas automáticamente, conectá el formulario a Formspree, Google Forms u otro backend.</p>
    `);
    $('[data-share]')?.addEventListener('click', async (event) => {
      if (navigator.share) {
        try {
          await navigator.share({ title: CONFIG.couple, text });
          event.currentTarget.textContent = 'COMPARTIDO';
          return;
        } catch (error) {
          if (error?.name === 'AbortError') return;
        }
      }
      const ok = await copyText(text);
      event.currentTarget.textContent = ok ? 'TEXTO COPIADO' : 'COPIAR MANUALMENTE';
    });
    $('[data-copy]')?.addEventListener('click', async (event) => {
      const ok = await copyText(text);
      event.currentTarget.textContent = ok ? 'TEXTO COPIADO' : 'COPIAR MANUALMENTE';
    });
  }

  function saveLocal(key, value) {
    try {
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const list = Array.isArray(current) ? current : [];
      list.push(value);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (error) {
      console.warn('No se pudo guardar la respuesta localmente.', error);
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        return ok;
      } catch {
        return false;
      }
    }
  }

  /* ---------------- Calendario ---------------- */
  $$('[data-calendar]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(`
        <h2 id="modalTitle">Agendá la fecha</h2>
        <p>Elegí cómo querés guardar el evento.</p>
        <div class="modal-actions">
          <a class="button button-primary" id="googleCalendar" target="_blank" rel="noopener">GOOGLE CALENDAR</a>
          <button class="button button-outline" type="button" id="downloadIcs">DESCARGAR .ICS</button>
        </div>
      `);
      const google = $('#googleCalendar');
      if (google) google.href = googleCalendarUrl();
      $('#downloadIcs')?.addEventListener('click', downloadICS);
    });
  });

  function eventRange() {
    const start = new Date(CONFIG.eventDateISO);
    const end = new Date(start.getTime() + CONFIG.durationHours * 3_600_000);
    return { start, end };
  }

  function compactUTC(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  }

  function escapeICS(value = '') {
    return String(value)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function googleCalendarUrl() {
    const { start, end } = eventRange();
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Boda ${CONFIG.couple}`,
      dates: `${compactUTC(start)}/${compactUTC(end)}`,
      details: `Celebración de ${CONFIG.couple}`,
      location: CONFIG.location
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  }

  function downloadICS() {
    const { start, end } = eventRange();
    const body = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Invitacion Digital//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${start.getTime()}-martina-federico@invitacion.local`,
      `DTSTAMP:${compactUTC(new Date())}`,
      `DTSTART:${compactUTC(start)}`,
      `DTEND:${compactUTC(end)}`,
      `SUMMARY:${escapeICS(`Boda ${CONFIG.couple}`)}`,
      `DESCRIPTION:${escapeICS(`Celebración de ${CONFIG.couple}`)}`,
      `LOCATION:${escapeICS(CONFIG.location)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'boda-martina-federico.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  const galleryImages = $$('#gallery img');
  let lightboxIndex = 0;

  $$('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => openLightbox(Number(button.dataset.lightbox) || 0));
  });
  $('[data-close-lightbox]')?.addEventListener('click', closeLightbox);
  $$('.lightbox-backdrop[data-close-lightbox]').forEach((button) => button.addEventListener('click', closeLightbox));
  $('[data-lightbox-prev]')?.addEventListener('click', () => stepLightbox(-1));
  $('[data-lightbox-next]')?.addEventListener('click', () => stepLightbox(1));

  function openLightbox(index) {
    if (!lightbox || !galleryImages.length) return;
    lightboxIndex = Math.max(0, Math.min(galleryImages.length - 1, index));
    renderLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderLightbox() {
    const image = galleryImages[lightboxIndex];
    if (!image || !lightboxImage) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || '';
    if (lightboxCaption) lightboxCaption.textContent = image.alt || '';
  }

  function stepLightbox(delta) {
    if (!galleryImages.length) return;
    lightboxIndex = (lightboxIndex + delta + galleryImages.length) % galleryImages.length;
    renderLightbox();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage?.removeAttribute('src');
  }

  document.addEventListener('keydown', (event) => {
    if (lightbox?.classList.contains('open')) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') stepLightbox(-1);
      if (event.key === 'ArrowRight') stepLightbox(1);
      return;
    }
    if (modal?.classList.contains('open') && event.key === 'Escape') closeModal();
  });

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    })[character]);
  }
})();
