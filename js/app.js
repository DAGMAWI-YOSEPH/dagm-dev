const App = (() => {
  const SOCIAL_ICONS = {
    github: '<svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>',
    spotify: '<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
    upwork: '<svg viewBox="0 0 24 24"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/></svg>',
    letterboxd: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4.5 7a5 5 0 0 0 0 10 5 5 0 0 0 3.02-1.02A5.97 5.97 0 0 1 6 12c0-1.52.57-2.91 1.52-3.98A4.98 4.98 0 0 0 4.5 7zm7.5 0a5.97 5.97 0 0 0-4.02 1.55A5.97 5.97 0 0 1 9.5 12a5.97 5.97 0 0 1-1.52 3.98A5.98 5.98 0 0 0 12 17a5.98 5.98 0 0 0 4.02-1.55A5.97 5.97 0 0 1 14.5 12c0-1.52.57-2.91 1.52-3.98A5.98 5.98 0 0 0 12 7zm7.5 0a4.98 4.98 0 0 0-3.02 1.02A5.97 5.97 0 0 1 18 12c0 1.52-.57 2.91-1.52 3.98A4.98 4.98 0 0 0 19.5 17a5 5 0 0 0 0-10z"/></svg>',
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

    const aboutLinks = document.getElementById('about-social-links');
    if (aboutLinks) {
      aboutLinks.innerHTML = '';
      Object.entries(socials).forEach(([key, url]) => {
        if (!url || !SOCIAL_ICONS[key]) return;
        const a = document.createElement('a');
        a.className = 'about-social-link';
        a.href = url;
        a.target = key === 'email' ? '_self' : '_blank';
        a.rel = 'noopener';
        a.innerHTML = `${SOCIAL_ICONS[key]} <span>${SOCIAL_LABELS[key] || key}</span>`;
        aboutLinks.appendChild(a);
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
      const row = document.createElement('a');
      row.className = 'project-row reveal-line';
      row.href = p.url;
      row.target = '_blank';
      row.rel = 'noopener';
      row.innerHTML = `
        <span class="project-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="project-title">${p.title}</span>
        <span class="project-status">${p.status}</span>
        <svg class="project-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      `;
      grid.appendChild(row);
    });
  }

  function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const VISIBLE = 3;
    skills.forEach((group, i) => {
      const div = document.createElement('div');
      div.className = 'skill-group reveal';
      if (i >= VISIBLE) div.classList.add('skill-hidden');
      div.innerHTML = `
        <h3>${group.category}</h3>
        <div class="skill-tags">
          ${group.items.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      `;
      grid.appendChild(div);
    });
    if (skills.length > VISIBLE) {
      const btn = document.createElement('button');
      btn.className = 'skills-toggle';
      btn.textContent = `Show all ${skills.length} categories`;
      btn.addEventListener('click', () => {
        const hidden = grid.querySelectorAll('.skill-hidden');
        const isExpanded = btn.classList.toggle('expanded');
        hidden.forEach(el => el.style.display = isExpanded ? '' : 'none');
        btn.textContent = isExpanded ? 'Show less' : `Show all ${skills.length} categories`;
      });
      grid.parentNode.insertBefore(btn, grid.nextSibling);
      grid.querySelectorAll('.skill-hidden').forEach(el => el.style.display = 'none');
    }
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

    const toolsEl = document.getElementById('about-tools');
    if (toolsEl) {
      const allSkills = data.skills.flatMap(g => g.items);
      toolsEl.innerHTML = allSkills.map(s => `<span class="tool-tag">${s}</span>`).join('');
    }
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
    renderSkills(data.skills);
    renderHeroCard(data);
    renderAbout(data);
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
    Router.init();

    const data = await CMS.fetchContent();
    populateSite(data);
    initThemeToggle();
    initTabs();
    hideLoader();
    initAnimations();
    typeEffect();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
