document.addEventListener('DOMContentLoaded', () => {



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

  /* ---------- Navbar & Dropdown Interactions ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const dropdowns = document.querySelectorAll('.nav-links .dropdown');
  
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
    dropdowns.forEach(d => d.classList.remove('open'));
  };

  const openNav = () => {
    links?.classList.add('open');
    toggle?.classList.add('open');
    overlay?.classList.add('active');
  };

  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (links?.classList.contains('open')) closeNav();
    else openNav();
  });

  overlay?.addEventListener('click', closeNav);

  // Desktop dropdown hover handling
  dropdowns.forEach(li => {
    li.addEventListener('mouseenter', () => {
      if (window.innerWidth > 991) li.classList.add('open');
    });
    li.addEventListener('mouseleave', () => {
      if (window.innerWidth > 991) li.classList.remove('open');
    });
  });

  // Mobile & click dropdown toggles
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 991 || trigger.getAttribute('href') === '#' || trigger.getAttribute('href') === 'javascript:void(0)') {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('open');
        dropdowns.forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        if (!isOpen) {
          dropdown.classList.add('open');
        } else {
          dropdown.classList.remove('open');
        }
      }
    });
  });

  // Close dropdowns on clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(d => d.classList.remove('open'));
    }
    if (!e.target.closest('.nav-links') && !e.target.closest('.nav-toggle')) {
      if (links?.classList.contains('open')) {
        closeNav();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
      dropdowns.forEach(d => d.classList.remove('open'));
    }
  });

  // Close nav on non-dropdown link and dropdown child item clicks
  document.querySelectorAll('.nav-links a:not(.dropdown > a), .dropdown-menu a').forEach(a => {
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

  /* ---------- Restaurant menu slider (native scrollbar) ---------- */
  /* Menu now uses native browser scrollbar - no custom arrow navigation needed */

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

  /* ============================================
     PHOTO SPOTLIGHT GALLERY SLIDER
     ============================================ */
  (function(){
    const track      = document.getElementById('spotlightTrack');
    if (!track) return;

    const cards      = Array.from(track.querySelectorAll('.spotlight-card'));
    const prevBtn    = document.getElementById('spotlightPrev');
    const nextBtn    = document.getElementById('spotlightNext');
    const counterEl  = document.getElementById('spotlightCurrent');
    const totalEl    = document.getElementById('spotlightTotal');
    const lightbox   = document.getElementById('spotlightLightbox');
    const lbImg      = document.getElementById('lightboxImg');
    const lbLabel    = document.getElementById('lightboxLabel');
    const lbClose    = document.getElementById('lightboxClose');
    const lbBackdrop = document.getElementById('lightboxBackdrop');
    const lbPrev     = document.getElementById('lightboxPrev');
    const lbNext     = document.getElementById('lightboxNext');

    const total = cards.length;
    let activeIdx = 1;   // start on card index 1 (second card = centre)
    let lbActiveIdx = 0;

    if (totalEl) totalEl.textContent = total;

    /* ---- Build image data for lightbox ---- */
    const cardData = cards.map(c => ({
      src:   c.querySelector('img').src,
      label: c.querySelector('.spotlight-label').textContent.trim()
    }));

    /* ---- Compute card width + gap for translate ---- */
    function getCardWidth() {
      if (!cards[0]) return 0;
      const style = getComputedStyle(track);
      const gap   = parseFloat(style.gap) || 20;
      return cards[0].offsetWidth + gap;
    }

    /* ---- Position track so active card is centred ---- */
    function setActive(idx) {
      activeIdx = ((idx % total) + total) % total;
      cards.forEach((c, i) => c.classList.toggle('active', i === activeIdx));

      const wrap      = track.parentElement;
      const wrapW     = wrap.offsetWidth;
      const cardW     = getCardWidth();
      const gap       = parseFloat(getComputedStyle(track).gap) || 20;
      // offset = left padding of track + number of cards before active * (card+gap) - centering offset
      const offsetX   = -(activeIdx * cardW) + (wrapW / 2) - (cards[0].offsetWidth / 2);
      track.style.transform = `translateX(${offsetX}px)`;

      if (counterEl) counterEl.textContent = activeIdx + 1;
    }

    /* ---- Click any card to make it active; if already active, open lightbox ---- */
    cards.forEach((c, i) => {
      c.addEventListener('click', () => {
        if (i === activeIdx) {
          openLightbox(i);
        } else {
          setActive(i);
        }
      });
    });

    /* ---- Prev / Next buttons ---- */
    prevBtn && prevBtn.addEventListener('click', () => setActive(activeIdx - 1));
    nextBtn && nextBtn.addEventListener('click', () => setActive(activeIdx + 1));

    /* ---- Auto-play ---- */
    let autoTimer = setInterval(() => setActive(activeIdx + 1), 4500);
    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => setActive(activeIdx + 1), 4500);
    }
    prevBtn && prevBtn.addEventListener('click', resetAuto);
    nextBtn && nextBtn.addEventListener('click', resetAuto);

    /* ---- Touch / swipe support ---- */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { dx < 0 ? setActive(activeIdx+1) : setActive(activeIdx-1); resetAuto(); }
    });

    /* ---- Lightbox ---- */
    function openLightbox(idx) {
      lbActiveIdx = idx;
      lbImg.src   = cardData[idx].src;
      lbImg.alt   = cardData[idx].label;
      lbLabel.textContent = cardData[idx].label;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    function lbGo(dir) {
      lbActiveIdx = ((lbActiveIdx + dir + total) % total);
      lbImg.style.opacity = '0';
      lbImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        lbImg.src = cardData[lbActiveIdx].src;
        lbImg.alt = cardData[lbActiveIdx].label;
        lbLabel.textContent = cardData[lbActiveIdx].label;
        lbImg.style.opacity = '1';
        lbImg.style.transform = 'scale(1)';
      }, 200);
    }

    lbImg.style.transition = 'opacity 0.2s, transform 0.2s';
    lbImg.style.opacity = '1'; lbImg.style.transform = 'scale(1)';

    lbClose    && lbClose.addEventListener('click', closeLightbox);
    lbBackdrop && lbBackdrop.addEventListener('click', closeLightbox);
    lbPrev     && lbPrev.addEventListener('click', () => lbGo(-1));
    lbNext     && lbNext.addEventListener('click', () => lbGo(1));

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')       closeLightbox();
      if (e.key === 'ArrowLeft')    lbGo(-1);
      if (e.key === 'ArrowRight')   lbGo(1);
    });

    /* ---- Init ---- */
    setActive(activeIdx);
    window.addEventListener('resize', () => setActive(activeIdx));
  })();

});
