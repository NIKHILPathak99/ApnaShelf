/* ============================================
   INKWELL — LITERARY PUBLISHING PLATFORM
   script.js
   ============================================ */

'use strict';

// ============================================
// LOADER
// ============================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger first reveal
    handleReveal();
  }, 2000);
});
document.body.style.overflow = 'hidden';


// ============================================
// CUSTOM CURSOR
// ============================================
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .book-card, .session-card, .upload-zone, .filter-btn, .check-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovered'));
});


// ============================================
// NAVBAR — scroll effect + active link
// ============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
  toggleBackTop();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.link === current) link.classList.add('active');
  });
}


// ============================================
// HAMBURGER MENU
// ============================================
const hamburger    = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
  });
});


// ============================================
// SCROLL REVEAL
// ============================================
function handleReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
}


// ============================================
// ANIMATED COUNTER (STATS)
// ============================================
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => animateCounter(num));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);


// ============================================
// GENRE FILTER (LIBRARY)
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const bookCards  = document.querySelectorAll('.book-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    bookCards.forEach(card => {
      if (filter === 'all' || card.dataset.genre === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


// ============================================
// UPLOAD ZONE
// ============================================
const uploadZone = document.getElementById('uploadZone');
const fileInput  = document.getElementById('fileInput');

if (uploadZone && fileInput) {
  uploadZone.addEventListener('click', (e) => {
    if (!e.target.closest('.upload-label')) fileInput.click();
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFileUpload(fileInput.files[0]);
  });
}

function handleFileUpload(file) {
  if (file.type !== 'application/pdf') {
    showToast('Please upload a PDF file only.');
    return;
  }
  if (file.size > 50 * 1024 * 1024) {
    showToast('File size must be under 50MB.');
    return;
  }
  const name = file.name.replace(/\.pdf$/i, '');
  showToast(`"${name}" ready for submission ✦`);
  if (uploadZone) {
    uploadZone.querySelector('.upload-title').textContent = file.name;
    uploadZone.querySelector('.upload-sub').textContent   = `${(file.size / 1024 / 1024).toFixed(2)} MB • Ready to submit`;
  }
}


// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs   = contactForm.querySelectorAll('input, textarea');
    let   allFilled = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        allFilled = false;
        input.style.borderColor = 'rgba(180,60,60,0.6)';
        setTimeout(() => input.style.borderColor = '', 2500);
      }
    });

    if (!allFilled) {
      showToast('Please fill in all fields.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled    = false;
      showToast('Your message has been sent. We\'ll reply within 24 hours. ✦');
    }, 1800);
  });
}


// ============================================
// BACK TO TOP
// ============================================
const backTop = document.getElementById('backTop');

function toggleBackTop() {
  backTop.classList.toggle('visible', window.scrollY > 500);
}

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ============================================
// SMOOTH ANCHOR SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});


// ============================================
// TOAST NOTIFICATION
// ============================================
let toastTimer = null;

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}


// ============================================
// PARALLAX — hero floating text
// ============================================
const floatingBg = document.querySelector('.floating-text-bg');
window.addEventListener('scroll', () => {
  if (floatingBg) {
    const scrollY = window.scrollY;
    floatingBg.style.transform = `translateY(${scrollY * 0.25}px)`;
  }
});


// ============================================
// STAGGER BOOK CARDS ON HOVER
// ============================================
document.querySelectorAll('.books-grid').forEach(grid => {
  const cards = grid.querySelectorAll('.book-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
});


// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Slight stagger for section reveal items
  document.querySelectorAll('.sessions-grid .session-card').forEach((card, i) => {
    card.dataset.delay = i * 120;
  });
  document.querySelectorAll('.testimonials-grid .testimonial-card').forEach((card, i) => {
    card.dataset.delay = i * 100;
  });
  document.querySelectorAll('.books-grid .book-card').forEach((card, i) => {
    card.dataset.delay = i * 80;
  });
});


// const cards = document.querySelectorAll('.quote-card');
// let current = 0;

// function showNext() {
//   cards[current].classList.remove('active');
//   current = (current + 1) % cards.length;
//   cards[current].classList.add('active');
// }

// setInterval(showNext, 4000);
const cards = document.querySelectorAll('.quote-card');
let current = 0;

function showNext() {
  const prev = current;
  current = (current + 1) % cards.length;

  // Purani card left mein exit karti hai
  cards[prev].classList.remove('active');
  cards[prev].classList.add('exit');

  // Nayi card right se aati hai
  cards[current].classList.add('active');

  // Exit class cleanup after animation
  setTimeout(() => {
    cards[prev].classList.remove('exit');
  }, 600);
}

setInterval(showNext, 8000);