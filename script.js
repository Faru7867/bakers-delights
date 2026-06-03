/* ============================================================
   Baker's Delights — Main JavaScript
   ============================================================ */

// ── Loader ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Trigger hero animations after load
    document.querySelectorAll('.hero-content > *').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + i * 150);
    });
  }, 2200);
});

// ── Navbar ───────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);
  updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  links.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}

// ── Hero Slider ──────────────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;

function goToSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide)));
});

setInterval(() => goToSlide(current + 1), 5000);

// ── Scroll Reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same grid
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, i) => {
        if (sib === entry.target) delay = i * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Product Filters ──────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      if (show) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.display = 'block';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
            card.style.display = 'none';
          }
        }, 350);
      }
    });
  });
});

// Wishlist toggle
document.querySelectorAll('.product-wishlist').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
    btn.style.color = btn.textContent === '♥' ? '#ff4081' : '';
  });
});

// Add to cart flash
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', () => {
    const original = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = 'linear-gradient(135deg, #4CAF50, #2e7d32)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 1800);
  });
});

// ── Testimonials Slider ──────────────────────────────────────
const track      = document.getElementById('testimonialsTrack');
const testiCards = track.querySelectorAll('.testimonial-card');
const dotsWrap   = document.getElementById('testiDots');
let testiCurrent = 0;
let testiPerView = getTestiPerView();

function getTestiPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

// Build dots
function buildTestiDots() {
  dotsWrap.innerHTML = '';
  const total = Math.ceil(testiCards.length / testiPerView);
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToTesti(i));
    dotsWrap.appendChild(d);
  }
}

function goToTesti(n) {
  const total = Math.ceil(testiCards.length / testiPerView);
  testiCurrent = (n + total) % total;
  const cardWidth = testiCards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${testiCurrent * cardWidth * testiPerView}px)`;
  dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === testiCurrent);
  });
}

document.getElementById('testiPrev').addEventListener('click', () => goToTesti(testiCurrent - 1));
document.getElementById('testiNext').addEventListener('click', () => goToTesti(testiCurrent + 1));

// Auto-advance
setInterval(() => goToTesti(testiCurrent + 1), 4500);

buildTestiDots();
window.addEventListener('resize', () => {
  testiPerView = getTestiPerView();
  testiCurrent = 0;
  track.style.transform = 'translateX(0)';
  buildTestiDots();
});

// ── Contact Form ─────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    this.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');
  }, 1200);
});

// ── Newsletter ───────────────────────────────────────────────
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  btn.textContent = '✓ Subscribed!';
  btn.style.background = 'linear-gradient(135deg, #4CAF50, #2e7d32)';
  this.querySelector('input').value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 3000);
});

// ── Back To Top ──────────────────────────────────────────────
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Gallery Lightbox (simple) ────────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.92);
      z-index:9999;display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;padding:40px;
    `;
    const imgEl = document.createElement('img');
    imgEl.src = img.src.replace(/w=\d+/, 'w=1200');
    imgEl.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:16px;object-fit:contain;box-shadow:0 24px 60px rgba(0,0,0,0.5);';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position:absolute;top:24px;right:32px;color:white;font-size:2rem;
      background:none;border:none;cursor:pointer;font-weight:300;
    `;
    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());

    // Animate in
    overlay.style.opacity = '0';
    imgEl.style.transform = 'scale(0.9)';
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.3s';
      imgEl.style.transition   = 'transform 0.3s';
      overlay.style.opacity    = '1';
      imgEl.style.transform    = 'scale(1)';
    });
  });
});

