/* Project preview: a browser-window mockup that auto-scrolls a full-page
   screenshot of the build, with the stack used underneath. */
const Preview = (() => {
  const PASS_SECONDS = 42;  // aim for one top-to-bottom pass in this long
  const MIN_SPEED = 22;     // …but never crawl or blur past (px per second)
  const MAX_SPEED = 130;
  const END_HOLD = 1300;    // ms paused at the top and bottom of the shot
  const IDLE_RESUME = 2200; // ms of no input before auto-scroll picks up again

  let overlay, dialog, viewport, shot, fallback, playBtn, iconPlay, iconPause;
  let raf = null, lastTs = 0, holdUntil = 0, dir = 1, speed = 40;
  let autoOn = true, nudged = false, idleTimer = null;
  let lastFocus = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(id) { return document.getElementById(id); }

  function tick(ts) {
    raf = requestAnimationFrame(tick);
    const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.1) : 0;
    lastTs = ts;
    if (!autoOn || nudged || ts < holdUntil) return;

    const max = viewport.scrollHeight - viewport.clientHeight;
    if (max < 8) return;

    let next = viewport.scrollTop + dir * speed * dt;
    if (next >= max) { next = max; dir = -1; holdUntil = ts + END_HOLD; }
    else if (next <= 0) { next = 0; dir = 1; holdUntil = ts + END_HOLD; }
    viewport.scrollTop = next;
  }

  // Long pages would take minutes at a fixed rate, so pace by page length instead.
  function measure() {
    const dist = viewport.scrollHeight - viewport.clientHeight;
    speed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, dist / PASS_SECONDS));
  }

  function startLoop() {
    measure();
    if (raf || reduceMotion) return;
    lastTs = 0;
    holdUntil = performance.now() + 700;
    raf = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    lastTs = 0;
  }

  function setAuto(on) {
    autoOn = on;
    iconPause.style.display = on ? 'block' : 'none';
    iconPlay.style.display = on ? 'none' : 'block';
    playBtn.setAttribute('aria-pressed', String(on));
    playBtn.setAttribute('aria-label', on ? 'Pause auto-scroll' : 'Resume auto-scroll');
  }

  // Any manual input inside the window suspends auto-scroll until the user settles.
  function nudge() {
    nudged = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { nudged = false; lastTs = 0; }, IDLE_RESUME);
  }

  function renderChips(stack) {
    const chips = el('pv-chips');
    chips.innerHTML = '';
    if (!stack || !stack.length) {
      const p = document.createElement('span');
      p.className = 'pv-chips-empty';
      p.textContent = 'Not documented yet.';
      chips.appendChild(p);
      return;
    }
    stack.forEach(item => {
      const span = document.createElement('span');
      span.className = 'pv-chip';
      span.textContent = item;
      chips.appendChild(span);
    });
  }

  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
  }

  function open(project) {
    if (!overlay) return;
    lastFocus = document.activeElement;

    el('pv-title').textContent = project.title;
    el('pv-status').textContent = project.status || '';
    el('pv-domain').textContent = hostOf(project.url);
    el('pv-window-url-text').textContent = hostOf(project.url);
    const visit = el('pv-visit');
    visit.href = project.url;
    renderChips(project.stack);

    // Case study
    const caseStudyEl = el('pv-case-study');
    const caseTextEl = el('pv-case-text');
    const caseLinkEl = el('pv-case-link');
    if (project.caseStudy && project.caseStudy.trim()) {
      caseTextEl.textContent = project.caseStudy;
      caseLinkEl.href = project.url;
      caseStudyEl.hidden = false;
    } else {
      caseStudyEl.hidden = true;
    }

    viewport.scrollTop = 0;
    dir = 1;
    setAuto(!reduceMotion);
    nudged = false;

    if (project.shot) {
      fallback.hidden = true;
      shot.hidden = false;
      shot.alt = `Full-page screenshot of ${project.title}`;
      shot.src = project.shot;
      playBtn.style.display = '';
      if (shot.complete) startLoop();
      else shot.addEventListener('load', startLoop, { once: true });
      shot.addEventListener('error', () => {
        shot.hidden = true;
        fallback.hidden = false;
        stopLoop();
      }, { once: true });
    } else {
      shot.hidden = true;
      shot.removeAttribute('src');
      fallback.hidden = false;
      playBtn.style.display = 'none';
      stopLoop();
    }

    overlay.hidden = false;
    document.body.classList.add('pv-locked');
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    el('pv-close').focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    stopLoop();
    clearTimeout(idleTimer);
    overlay.classList.remove('is-open');
    document.body.classList.remove('pv-locked');
    const finish = () => {
      overlay.hidden = true;
      shot.removeAttribute('src');
    };
    setTimeout(finish, reduceMotion ? 0 : 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    overlay = el('project-viewer');
    if (!overlay) return;
    dialog = overlay.querySelector('.pv-dialog');
    viewport = el('pv-viewport');
    shot = el('pv-shot');
    fallback = el('pv-fallback');
    playBtn = el('pv-play');
    iconPlay = el('pv-icon-play');
    iconPause = el('pv-icon-pause');

    el('pv-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });

    playBtn.addEventListener('click', () => {
      setAuto(!autoOn);
      if (autoOn) { nudged = false; lastTs = 0; startLoop(); }
    });

    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
      viewport.addEventListener(evt, nudge, { passive: true });
    });
    // Hover pauses — but keyed off movement, so a cursor that merely happens to be
    // under the dialog when it opens doesn't freeze the scroll.
    viewport.addEventListener('mousemove', () => { nudged = true; clearTimeout(idleTimer); }, { passive: true });
    viewport.addEventListener('mouseleave', nudge);

    window.addEventListener('resize', () => { if (!overlay.hidden) measure(); });
  }

  return { init, open, close };
})();

const App = (() => {
  const SOCIAL_ICONS = {
    github: '<svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>',
    spotify: '<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
    upwork: '<svg viewBox="0 0 24 24"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/></svg>',
    letterboxd: '<svg viewBox="0 0 24 24"><path d="M8.224 14.352a4.447 4.447 0 0 1-3.775 2.092C1.992 16.444 0 14.454 0 12s1.992-4.444 4.45-4.444c1.592 0 2.988.836 3.774 2.092-.427.682-.673 1.488-.673 2.352s.246 1.67.673 2.352zM15.101 12c0-.864.247-1.67.674-2.352-.786-1.256-2.183-2.092-3.775-2.092s-2.989.836-3.775 2.092c.427.682.674 1.488.674 2.352s-.247 1.67-.674 2.352c.786 1.256 2.183 2.092 3.775 2.092s2.989-.836 3.775-2.092A4.42 4.42 0 0 1 15.1 12zm4.45-4.444a4.447 4.447 0 0 0-3.775 2.092c.427.682.673 1.488.673 2.352s-.246 1.67-.673 2.352a4.447 4.447 0 0 0 3.775 2.092C22.008 16.444 24 14.454 24 12s-1.992-4.444-4.45-4.444z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
  };

  const SOCIAL_LABELS = {
    github: 'GitHub',
    spotify: 'Spotify',
    letterboxd: 'Letterboxd',
    upwork: 'Upwork',
    email: 'Email'
  };

  let typingWords = [];
  let typingIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingEl = null;

  function typeEffect() {
    if (!typingEl || !typingWords.length) return;
    const current = typingWords[typingIndex];
    if (isDeleting) {
      charIndex--;
      typingEl.textContent = current.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        typingIndex = (typingIndex + 1) % typingWords.length;
        setTimeout(typeEffect, 400);
        return;
      }
      setTimeout(typeEffect, 50);
    } else {
      charIndex++;
      typingEl.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
      setTimeout(typeEffect, 80);
    }
  }

  function renderSocials(socials) {
    const sidebar = document.getElementById('social-links');
    if (sidebar) {
      sidebar.innerHTML = '';
      Object.entries(socials).forEach(([key, url]) => {
        if (!url || !SOCIAL_ICONS[key]) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.target = key === 'email' ? '_self' : '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', key);
        a.innerHTML = SOCIAL_ICONS[key];
        li.appendChild(a);
        sidebar.appendChild(li);
      });
    }

    const aboutFooter = document.getElementById('about-social-footer');
    if (aboutFooter) {
      aboutFooter.innerHTML = '';
      Object.entries(socials).forEach(([key, url]) => {
        if (!url || !SOCIAL_ICONS[key]) return;
        const a = document.createElement('a');
        a.className = 'about-social-link';
        a.href = url;
        a.target = key === 'email' ? '_self' : '_blank';
        a.rel = 'noopener';
        a.innerHTML = `${SOCIAL_ICONS[key]} <span>${SOCIAL_LABELS[key] || key}</span>`;
        aboutFooter.appendChild(a);
      });
    }
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    const count = document.getElementById('project-count');
    if (!grid) return;
    count.textContent = `${projects.length} projects`;
    grid.innerHTML = '';
    projects.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal-line';

      const hasCaseStudy = p.caseStudy && p.caseStudy.trim();

      card.innerHTML = `
        <div class="project-row" data-index="${i}">
          <span class="project-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="project-title">${p.title}</span>
          <span class="project-preview-hint">Preview</span>
          <span class="project-status">${p.status}</span>
          <span class="project-actions">
            ${hasCaseStudy ? '<span class="project-case-link">View case study</span>' : ''}
            <svg class="project-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </span>
        </div>
      `;

      // Preview click on the row
      const row = card.querySelector('.project-row');
      row.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        Preview.open(p);
      });

      grid.appendChild(card);
    });
  }

  function renderHeroCard(data) {
    const nameEl = document.getElementById('card-name');
    const locEl = document.getElementById('card-location');
    const focusEl = document.getElementById('card-focus');
    const skillsEl = document.getElementById('card-skills');
    if (nameEl) nameEl.textContent = data.meta.fullName;
    if (locEl) locEl.textContent = data.meta.location;
    if (focusEl) focusEl.textContent = 'Web Development';
    if (skillsEl) {
      const allSkills = data.skills.flatMap(g => g.items).slice(0, 6);
      skillsEl.innerHTML = allSkills.map(s => `<span class="card-skill-tag">${s}</span>`).join('');
    }
  }

  function renderAbout(data) {
    const nameEl = document.getElementById('about-name');
    if (nameEl) nameEl.textContent = data.meta.fullName;

    const bioEl = document.getElementById('about-bio');
    if (bioEl && data.meta.aboutBio) {
      const paragraphs = data.meta.aboutBio.split('\n\n');
      bioEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
      if (paragraphs.length > 1) {
        const toggle = document.createElement('button');
        toggle.className = 'bio-toggle';
        toggle.textContent = 'Read more';
        toggle.addEventListener('click', () => {
          bioEl.classList.toggle('bio-expanded');
          toggle.textContent = bioEl.classList.contains('bio-expanded') ? 'Show less' : 'Read more';
        });
        bioEl.parentNode.insertBefore(toggle, bioEl.nextSibling);
      }
    }

    function initCarousel(containerId, items, prevId, nextId) {
      const el = document.getElementById(containerId);
      if (!el || !items.length) return;

      const PER_PAGE = 9;
      let page = 0;
      const totalPages = Math.ceil(items.length / PER_PAGE);

      function render() {
        const start = page * PER_PAGE;
        const visible = items.slice(start, start + PER_PAGE);
        el.innerHTML = visible.map(s => `<span class="tool-tag">${s}</span>`).join('');
        const prev = document.getElementById(prevId);
        const next = document.getElementById(nextId);
        if (prev) prev.disabled = page === 0;
        if (next) next.disabled = page >= totalPages - 1;
      }

      const prev = document.getElementById(prevId);
      const next = document.getElementById(nextId);
      if (prev) prev.addEventListener('click', () => { if (page > 0) { page--; render(); } });
      if (next) next.addEventListener('click', () => { if (page < totalPages - 1) { page++; render(); } });

      render();
    }

    const toolItems = data.skills.flatMap(g => g.items);
    const skillItems = data.skills.flatMap(g => g.items);

    initCarousel('about-tools', toolItems, 'tools-prev', 'tools-next');
    initCarousel('about-skills', skillItems, 'skills-prev', 'skills-next');
  }

  function renderTestimonials(testimonials) {
    const grid = document.getElementById('testimonials-grid');
    if (!grid || !testimonials || !testimonials.length) return;

    grid.innerHTML = testimonials.map(t => {
      const stars = t.rating
        ? Array.from({length: 5}, (_, i) =>
            `<svg class="${i < t.rating ? '' : 'empty'}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
          ).join('')
        : '';

      return `
        <div class="testimonial-card">
          <p class="testimonial-quote">${t.quote}</p>
          <div class="testimonial-footer">
            <div class="testimonial-author">
              <span class="testimonial-name">${t.name}</span>
              <span class="testimonial-project">${t.project}</span>
            </div>
            ${stars ? `<div class="testimonial-stars">${stars}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function populateSite(data) {
    document.getElementById('hero-name').textContent = data.meta.name;
    document.getElementById('hero-tagline').textContent = data.meta.tagline;
    document.getElementById('hero-status').textContent = data.meta.status;
    document.getElementById('contact-specialization').textContent = data.meta.specialization;

    const emailLink = document.getElementById('contact-email');
    emailLink.href = `mailto:${data.meta.email}`;
    document.getElementById('contact-email-text').textContent = data.meta.email;

    document.getElementById('footer-year').textContent = new Date().getFullYear();

    typingWords = data.meta.typing_words || [];
    typingEl = document.getElementById('typing-text');

    renderSocials(data.socials);
    renderProjects(data.projects);
    renderTestimonials(data.testimonials);
    renderHeroCard(data);
    renderAbout(data);
  }

  // --- URL Bar ---

  function updateUrlBar(section) {
    const urlText = document.querySelector('.browser-url-text');
    if (!urlText) return;
    urlText.textContent = section === 'hero' || !section ? 'dagm.dev' : section + '.dagm.dev';
  }

  // --- Tab Navigation ---

  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const sections = ['hero', 'about', 'projects', 'skills', 'contact'];

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.dataset.section;
        const section = document.getElementById(target);
        if (section) {
          const chrome = document.querySelector('.browser-chrome');
          const offset = chrome ? chrome.offsetHeight : 0;
          const top = section.offsetTop - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          const activeTab = document.querySelector(`.tab[data-section="${id}"]`);
          if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
          }
          updateUrlBar(id);
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-greeting', { opacity: 0, y: 20, duration: 0.6, delay: 0.2 });
    gsap.from('.hero-name', { opacity: 0, y: 30, duration: 0.8, delay: 0.35 });
    gsap.from('.hero-role', { opacity: 0, y: 20, duration: 0.6, delay: 0.5 });
    gsap.from('.hero-tagline', { opacity: 0, y: 20, duration: 0.6, delay: 0.6 });
    gsap.from('.hero-status', { opacity: 0, y: 15, duration: 0.5, delay: 0.7 });
    gsap.from('.hero-actions', { opacity: 0, y: 15, duration: 0.5, delay: 0.8 });
    gsap.from('.hero-card', { opacity: 0, y: 40, duration: 0.8, delay: 0.5, ease: 'power2.out' });

    gsap.from('.scrapbook-main', {
      opacity: 0, y: 30, duration: 0.7,
      scrollTrigger: { trigger: '.about', start: 'top 75%' }
    });
    gsap.from('.scrapbook-sidebar > *', {
      opacity: 0, y: 20, duration: 0.5, stagger: 0.1,
      scrollTrigger: { trigger: '.about', start: 'top 70%' }
    });

    ScrollTrigger.batch('.reveal-line', {
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
      },
      start: 'top 88%'
    });

    ScrollTrigger.batch('.reveal', {
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
      },
      start: 'top 85%'
    });

    gsap.from('.contact-heading', {
      opacity: 0, y: 40, duration: 0.8,
      scrollTrigger: { trigger: '.contact', start: 'top 75%' }
    });
    gsap.from('.contact-sub', {
      opacity: 0, y: 20, duration: 0.6,
      scrollTrigger: { trigger: '.contact', start: 'top 70%' }
    });
    gsap.from('.contact-email', {
      opacity: 0, y: 20, duration: 0.6,
      scrollTrigger: { trigger: '.contact', start: 'top 65%' }
    });
  }

  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const saved = localStorage.getItem('dagm-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeUI(saved);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('dagm-theme', next);
      updateThemeUI(next);
    });

    function updateThemeUI(theme) {
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  function hideLoader() {}

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#contact-name').value.trim();
      const email = form.querySelector('#contact-email-input').value.trim();
      const message = form.querySelector('#contact-message').value.trim();

      if (!name || !email || !message) return;

      const subject = encodeURIComponent(`Project inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Dagmawi,\n\nMy name is ${name}.\n\n${message}\n\nBest regards,\n${name}\n${email}`);
      const mailto = `mailto:Dagmawi.yoseph@icloud.com?subject=${subject}&body=${body}`;

      window.location.href =mailto;

      form.reset();
      const btn = form.querySelector('.btn');
      const original = btn.innerHTML;
      btn.innerHTML = 'Opening email...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 2000);
    });
  }

  async function init() {
    Router.register('#', () => {
      document.getElementById('site').style.display = 'grid';
      document.getElementById('admin').style.display = 'none';
    }, () => {
      document.getElementById('site').style.display = 'none';
    });

    Router.register('#admin', () => {
      document.getElementById('admin').style.display = 'block';
      document.getElementById('site').style.display = 'none';
      CMS.showDashboard();
    }, () => {
      document.getElementById('admin').style.display = 'none';
    });

    CMS.initDashboard();
    Preview.init();
    Router.init();

    const data = await CMS.fetchContent();
    populateSite(data);
    initThemeToggle();
    initTabs();
    initContactForm();
    hideLoader();
    initAnimations();
    typeEffect();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
