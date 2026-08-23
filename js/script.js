document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const pre = document.querySelector('.preloader');
  if (pre) {
    const pct = pre.querySelector('.pre-pct');
    const bar = pre.querySelector('.pre-bar-fill');
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) { p = 100; clearInterval(t); }
      if (pct) pct.textContent = Math.floor(p) + '%';
      if (bar) bar.style.width = p + '%';
      if (p === 100) {
        setTimeout(() => {
          pre.style.opacity = '0';
          setTimeout(() => pre.remove(), 500);
        }, 250);
      }
    }, 140);
  }

  /* ---------- Navbar scroll state ---------- */
  const nav = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 30) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
    const btt = document.querySelector('.back-to-top');
    if (window.scrollY > 600) btt?.classList.add('show');
    else btt?.classList.remove('show');
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile nav & Overlay ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  
  // Create overlay if not present
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  const closeNav = () => {
    links?.classList.remove('open');
    toggle?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openNav = () => {
    links?.classList.add('open');
    toggle?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  toggle?.addEventListener('click', () => {
    if (links?.classList.contains('open')) closeNav();
    else openNav();
  });

  overlay?.addEventListener('click', closeNav);

  // Dropdown toggles on mobile
  document.querySelectorAll('.nav-links .dropdown > a').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        const parent = a.parentElement;
        const isOpen = parent.classList.contains('open');
        // Close other dropdowns
        document.querySelectorAll('.nav-links .dropdown').forEach(d => {
          if (d !== parent) d.classList.remove('open');
        });
        parent.classList.toggle('open', !isOpen);
      }
    });
  });

  // Close nav on regular link click on mobile
  document.querySelectorAll('.nav-links a:not(.dropdown > a)').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 991) closeNav();
    });
  });

  /* ---------- Back to top ---------- */
  document.querySelector('.back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Hero slider ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let current = 0, heroTimer;
  const showSlide = (i) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };
  const nextSlide = () => showSlide(current + 1);
  const prevSlide = () => showSlide(current - 1);
  if (slides.length) {
    showSlide(0);
    heroTimer = setInterval(nextSlide, 5500);
    document.querySelector('.hero-arrow.next')?.addEventListener('click', () => { nextSlide(); resetTimer(); });
    document.querySelector('.hero-arrow.prev')?.addEventListener('click', () => { prevSlide(); resetTimer(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { showSlide(i); resetTimer(); }));
    function resetTimer() { clearInterval(heroTimer); heroTimer = setInterval(nextSlide, 5500); }
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Stat counters ---------- */
  const statCards = document.querySelectorAll('.stat-card');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const numEl = card.querySelector('.stat-num');
      if (!numEl) return;
      
      const target = parseInt(numEl.dataset.count, 10);
      const suffix = numEl.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      
      const step = (now) => {
        const progress = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(eased * target);
        numEl.textContent = currentVal.toLocaleString() + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          numEl.textContent = target.toLocaleString() + suffix;
        }
      };
      requestAnimationFrame(step);
      counterIO.unobserve(card);
    });
  }, { threshold: 0.25 });
  statCards.forEach(c => counterIO.observe(c));

  /* ---------- Gallery slider (Around the Hotel) ---------- */
  const track = document.querySelector('.gallery-track');
  if (track) {
    const slideEls = track.querySelectorAll('.gallery-slide');
    const perView = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 991 ? 2 : 3;
    let index = 0;
    const countLabel = document.querySelector('.gallery-current');
    const totalLabel = document.querySelector('.gallery-total');
    if (totalLabel) totalLabel.textContent = slideEls.length;
    const maxIndex = () => Math.max(slideEls.length - perView(), 0);
    const update = () => {
      const pct = (100 / perView()) * index;
      track.style.transform = `translateX(-${pct}%)`;
      if (countLabel) countLabel.textContent = index + 1;
    };
    document.querySelector('.gallery-next')?.addEventListener('click', () => {
      index = index < maxIndex() ? index + 1 : 0; update();
    });
    document.querySelector('.gallery-prev')?.addEventListener('click', () => {
      index = index > 0 ? index - 1 : maxIndex(); update();
    });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Filter tabs (Rooms / Restaurant) ---------- */
  document.querySelectorAll('.filter-tabs').forEach(tabWrap => {
    const targetSel = tabWrap.dataset.target;
    const grid = document.querySelector(targetSel);
    if (!grid) return;
    const items = grid.querySelectorAll('[data-category]');
    tabWrap.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabWrap.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.filter;
        items.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.classList.toggle('filtered-out', !match);
          if (match) {
            item.classList.remove('filter-anim');
            void item.offsetWidth;
            item.classList.add('filter-anim');
          }
        });
      });
    });
  });

  /* ---------- Simple form guard (no backend) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = f.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Sent ✓';
      setTimeout(() => btn.textContent = original, 2200);
      f.reset();
    });
  });

});
