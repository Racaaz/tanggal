/* ══════════════════════════════════════════════
   TANGGAL CANTIK — Enhanced Edition script.js
   Performance-optimized for mobile
   ══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   0. DEVICE DETECTION & PERFORMANCE SETTINGS
───────────────────────────────────────────── */
const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
const isLowEnd = isMobile && (navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : true);

/* ─────────────────────────────────────────────
   1. PARTICLE SYSTEM (lightweight for mobile)
───────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  const MAX    = isLowEnd ? 10 : isMobile ? 15 : 35;

  const EMOJIS = ['🌸', '🌹', '🌷', '✨', '💕', '💗'];
  const GLITTER = ['#F2B8C6', '#FFD6E7', '#C0392B', '#FFB3C6', '#FFC8DD', '#FFF'];

  let W, H;
  let particles = [];
  let mouseX = -100, mouseY = -100;
  let animFrame;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makePetal() {
    const isGlitter = Math.random() < 0.5;
    const speedMul = isMobile ? 0.25 : 1; // Much slower on mobile
    const driftMul = isMobile ? 0.2 : 1;
    const rotMul = isMobile ? 0.2 : 1;
    return {
      type:    isGlitter ? 'glitter' : 'emoji',
      emoji:   EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      color:   GLITTER[Math.floor(Math.random() * GLITTER.length)],
      x:       Math.random() * (W || window.innerWidth),
      y:       -40 - Math.random() * 300,
      size:    isGlitter ? 2 + Math.random() * 3 : (isMobile ? 10 + Math.random() * 8 : 12 + Math.random() * 10),
      speed:   (0.3 + Math.random() * 0.5) * speedMul,
      drift:   (Math.random() - 0.5) * 0.3 * driftMul,
      rot:     Math.random() * 360,
      rotSpd:  (Math.random() - 0.5) * 1 * rotMul,
      sway:    Math.random() * Math.PI * 2,
      swayAmp: (isMobile ? 0.2 + Math.random() * 0.3 : 0.4 + Math.random() * 0.6),
      opacity: isGlitter ? 0.4 + Math.random() * 0.4 : 0.5 + Math.random() * 0.3,
      twinkleT: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < MAX; i++) {
      const p = makePetal();
      p.y = Math.random() * H;
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      ctx.save();

      // Mouse interaction (desktop only)
      if (!isMobile) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          const force = (80 - dist) / 80 * 0.3;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      if (p.type === 'glitter') {
        p.twinkleT += 0.06;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(p.twinkleT));
        ctx.globalAlpha = p.opacity * twinkle;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillText(p.emoji, 0, 0);
      }

      ctx.restore();

      p.sway  += isMobile ? 0.004 : 0.012;
      p.x     += Math.sin(p.sway) * p.swayAmp + p.drift;
      p.y     += p.speed;
      p.rot   += p.rotSpd;

      if (p.y > H + 50 || p.x < -50 || p.x > W + 50) {
        Object.assign(p, makePetal());
      }
    });

    animFrame = requestAnimationFrame(draw);
  }

  if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ─────────────────────────────────────────────
   2. CURSOR TRAIL (desktop only)
───────────────────────────────────────────── */
(function () {
  if (isMobile) return; // Skip on mobile for performance

  const HEARTS = ['💕', '💗', '✨', '🌸', '💖'];
  const trail  = document.getElementById('cursor-trail');
  let lastTime = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < 100) return;
    lastTime = now;

    const el = document.createElement('span');
    el.className = 'trail-heart';
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
    trail.appendChild(el);
    setTimeout(() => el.remove(), 900);
  });
})();


/* ─────────────────────────────────────────────
   3. PAGE TRANSITIONS
───────────────────────────────────────────── */
window.goToPage2 = goToPage2;
window.goToPage1 = goToPage1;
window.handleYes = handleYes;
window.toggleMusic = toggleMusic;

function goToPage2() {
  const p1 = document.getElementById('page1');
  const p2 = document.getElementById('page2');
  const dur = isMobile ? '1s' : '1.1s';
  const ease = 'cubic-bezier(0.25, 1, 0.5, 1)';
  const delay = isMobile ? 1000 : 1100;

  p1.style.opacity   = '0';
  p1.style.transform = 'translateY(-30px)';
  p1.style.transition = `opacity ${dur} ${ease}, transform ${dur} ${ease}`;

  setTimeout(() => {
    p1.classList.add('hidden');
    p2.classList.remove('hidden');
    p2.style.opacity   = '0';
    p2.style.transform = 'translateY(30px)';
    p2.style.transition = 'none';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p2.style.transition = `opacity ${dur} ${ease}, transform ${dur} ${ease}`;
        p2.style.opacity    = '1';
        p2.style.transform  = 'translateY(0)';
        p2.scrollTo({ top: 0 });
        if (!isMobile) burstParticles();
      });
    });
  }, delay);
}

function goToPage1() {
  const p1 = document.getElementById('page1');
  const p2 = document.getElementById('page2');
  const dur = isMobile ? '1s' : '1.1s';
  const ease = 'cubic-bezier(0.25, 1, 0.5, 1)';
  const delay = isMobile ? 1000 : 1100;

  p2.style.opacity   = '0';
  p2.style.transform = 'translateY(30px)';
  p2.style.transition = `opacity ${dur} ${ease}, transform ${dur} ${ease}`;

  setTimeout(() => {
    p2.classList.add('hidden');
    p1.classList.remove('hidden');
    p1.style.opacity   = '0';
    p1.style.transform = 'translateY(-30px)';
    p1.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p1.style.transition = `opacity ${dur} ${ease}, transform ${dur} ${ease}`;
        p1.style.opacity    = '1';
        p1.style.transform  = 'translateY(0)';
      });
    });
  }, delay);
}

function burstParticles() {
  const count = isMobile ? 4 : 8;
  for (let i = 0; i < count; i++) {
    const burst = document.createElement('div');
    const emojis = ['💕', '✨', '🌸', '💗', '🌹'];
    burst.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    Object.assign(burst.style, {
      position: 'fixed',
      left: (30 + Math.random() * 40) + '%',
      top: (30 + Math.random() * 40) + '%',
      fontSize: (18 + Math.random() * 16) + 'px',
      zIndex: '50',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'all 1s ease-out',
      transform: 'scale(0)',
    });
    document.body.appendChild(burst);

    requestAnimationFrame(() => {
      const angle = (i / count) * Math.PI * 2;
      const distance = 60 + Math.random() * 80;
      burst.style.opacity = '1';
      burst.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`;
      setTimeout(() => {
        burst.style.opacity = '0';
        setTimeout(() => burst.remove(), 400);
      }, 600);
    });
  }
}


/* ─────────────────────────────────────────────
   4. COUNTDOWN  →  26 Juni 2026 00:00 WIB
───────────────────────────────────────────── */
(function () {
  const TARGET = new Date('2026-06-26T00:00:00+07:00');

  const dd = document.getElementById('cd-d');
  const dh = document.getElementById('cd-h');
  const dm = document.getElementById('cd-m');
  const ds = document.getElementById('cd-s');
  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      [dd, dh, dm, ds].forEach(el => el && (el.textContent = '00'));
      const bar = document.querySelector('.countdown-bar');
      if (bar) bar.style.background = 'linear-gradient(90deg,#c6a020,#e8c547,#D4AF37,#e8c547,#c6a020)';
      return;
    }

    if (dd) dd.textContent = pad(Math.floor(diff / 86400000));
    if (dh) dh.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    if (dm) dm.textContent = pad(Math.floor((diff % 3600000) / 60000));
    if (ds) ds.textContent = pad(Math.floor((diff % 60000) / 1000));

    setTimeout(tick, 1000);
  }
  tick();
})();


/* ─────────────────────────────────────────────
   5. DODGE BUTTON LOGIC (fixed positioning)
───────────────────────────────────────────── */
(function () {
  const btnNo  = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const hint   = document.getElementById('btnHint');
  const arena  = document.getElementById('btnArena');
  if (!btnNo || !arena) return;

  const MSGS = [
    '* tombolnya agak pemalu 🙈',
    '* dia kabur lagi 😂',
    '* yakin mau ngejar? 😅',
    '* kamu nggak akan bisa! 🏃‍♀️',
    '* haha capek sendiri loh',
    '* oke fine dia sprinter 🏅',
    '* udah pasrah aja yuk 💕',
    '* masih mau coba? 😄',
    '* tombolnya udah bilang "please don\'t" 🥹',
    '* ok dia literally menghilang',
    '* yep. dia sudah menyerah 💨',
  ];

  let dodgeCount = 0;
  let noSize = 0.85;
  let yesScale = 1;
  let cooldown = false;

  // Position arena and buttons properly
  arena.style.position = 'relative';
  arena.style.display = 'flex';
  arena.style.flexDirection = 'column';
  arena.style.alignItems = 'center';
  arena.style.gap = '16px';
  arena.style.minHeight = '140px';
  arena.style.width = '100%';

  btnYes.style.position = 'relative';
  btnYes.style.zIndex = '2';

  // Position "Nggak Mau" BELOW "Mau Banget" initially
  btnNo.style.position = 'absolute';
  btnNo.style.bottom = '0';
  btnNo.style.left = '50%';
  btnNo.style.transform = 'translateX(-50%)';
  btnNo.style.top = 'auto';
  btnNo.style.right = 'auto';

  window.dodgeNo = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (cooldown) return;
    cooldown = true;

    dodgeCount++;

    const arenaRect = arena.getBoundingClientRect();
    const bw = btnNo.offsetWidth;
    const bh = btnNo.offsetHeight;

    // Move to random position within arena, but AVOID the center where "Mau Banget" is
    const yesRect = btnYes.getBoundingClientRect();
    const yesCenterX = yesRect.left - arenaRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top - arenaRect.top + yesRect.height / 2;

    let rx, ry, attempts = 0;
    do {
      rx = Math.random() * Math.max(arenaRect.width - bw, 10);
      ry = Math.random() * Math.max(arenaRect.height - bh, 10);
      attempts++;
      // Make sure it doesn't overlap with "Mau Banget"
      const distFromYes = Math.sqrt(
        Math.pow(rx + bw/2 - yesCenterX, 2) + Math.pow(ry + bh/2 - yesCenterY, 2)
      );
      if (distFromYes > 80) break; // Far enough from Yes button
    } while (attempts < 20);

    btnNo.style.left = rx + 'px';
    btnNo.style.top  = ry + 'px';
    btnNo.style.bottom = 'auto';
    btnNo.style.transform = 'none';
    btnNo.style.transition = 'left 0.3s cubic-bezier(.68,-.55,.27,1.55), top 0.3s cubic-bezier(.68,-.55,.27,1.55), font-size 0.3s, opacity 0.3s';

    noSize   = Math.max(0.55, noSize - 0.05);
    yesScale = Math.min(1.4, yesScale + 0.05);

    btnNo.style.fontSize = noSize + 'rem';
    btnNo.style.opacity  = String(Math.max(0.25, 1 - dodgeCount * 0.07));

    btnYes.style.transform  = `scale(${yesScale})`;
    btnYes.style.boxShadow  = `0 ${4 + dodgeCount}px ${16 + dodgeCount * 3}px rgba(192,57,43,${Math.min(0.6, 0.35 + dodgeCount * 0.03)})`;

    hint.textContent = MSGS[Math.min(dodgeCount - 1, MSGS.length - 1)];

    if (dodgeCount >= 11) {
      btnNo.style.opacity = '0';
      setTimeout(() => { btnNo.style.display = 'none'; }, 300);
      hint.textContent = '* tombolnya udah menyerah 💨 tinggal satu pilihan~ 💕';
    }

    setTimeout(() => { cooldown = false; }, 350);
  };

  btnNo.addEventListener('click', (e) => { e.preventDefault(); window.dodgeNo(e); });
  btnNo.addEventListener('touchstart', (e) => { window.dodgeNo(e); }, { passive: false });
})();


/* ─────────────────────────────────────────────
   6. YES RESPONSE
───────────────────────────────────────────── */
function handleYes() {
  const qWrap    = document.querySelector('.question-wrap');
  const response = document.getElementById('responseWrap');

  qWrap.style.transition = 'opacity 0.4s ease';
  qWrap.style.opacity    = '0';

  setTimeout(() => {
    qWrap.style.display = 'none';
    response.classList.remove('hidden');
    response.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Confetti (reduced for mobile)
    createConfetti();

    // Love burst (fewer on mobile)
    const burstCount = isMobile ? 8 : 16;
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        const emojis = ['💕', '💗', '💖', '❤️', '🌹', '✨'];
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        Object.assign(heart.style, {
          position: 'fixed',
          left: Math.random() * 100 + '%',
          top: '100%',
          fontSize: (18 + Math.random() * 20) + 'px',
          zIndex: '100',
          pointerEvents: 'none',
          transition: 'all 1.8s ease-out',
          opacity: '1',
        });
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
          heart.style.top = (-10 - Math.random() * 30) + '%';
          heart.style.opacity = '0';
          heart.style.transform = `rotate(${Math.random() * 360}deg)`;
          setTimeout(() => heart.remove(), 2000);
        });
      }, i * 100);
    }
  }, 420);
}

function createConfetti() {
  const container = document.getElementById('responseConfetti');
  if (!container) return;
  const colors = ['#C0392B', '#F2B8C6', '#D4AF37', '#FFD6E7', '#8B1A2E', '#FFF'];
  const count = isMobile ? 20 : 40;

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    const isCircle = Math.random() > 0.5;
    Object.assign(confetti.style, {
      position: 'absolute',
      width: isCircle ? '6px' : '3px',
      height: isCircle ? '6px' : '10px',
      borderRadius: isCircle ? '50%' : '2px',
      background: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100 + '%',
      top: '-10px',
      opacity: '0.8',
      animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-in ${Math.random() * 0.3}s forwards`,
    });
    container.appendChild(confetti);
  }

  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(300px) rotate(540deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}


/* ─────────────────────────────────────────────
   7. SCROLL REVEAL (simplified for mobile)
───────────────────────────────────────────── */
(function () {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity ${isMobile ? '0.9s' : '0.8s'} cubic-bezier(0.25, 1, 0.5, 1), transform ${isMobile ? '0.9s' : '0.8s'} cubic-bezier(0.25, 1, 0.5, 1)`;
    observer.observe(el);
  });
})();


/* ─────────────────────────────────────────────
   8. MUSIC PLAYER — HTML Audio (MP3 from GitHub)
   Song: Shape of My Heart — Backstreet Boys
   ⚠️ GANTI URL DI BAWAH dengan raw URL GitHub kamu
   Format: https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/0027.mp3
───────────────────────────────────────────── */

// ══ KONFIGURASI: Ganti URL ini setelah upload ke GitHub ══
const MUSIC_SRC = 'https://raw.githubusercontent.com/Racaaz/tanggal/main/0027.mp3';
// ══════════════════════════════════════════════════════════

let musicPlaying = false;
let audioPlayer = null;

function initAudioPlayer() {
  if (audioPlayer) return;

  audioPlayer = new Audio(MUSIC_SRC);
  audioPlayer.loop = true;        // Auto-replay saat lagu selesai
  audioPlayer.preload = 'auto';   // Preload audio di background
  audioPlayer.volume = 0.85;

  audioPlayer.addEventListener('error', (e) => {
    console.warn('Music load error. Pastikan file 0027.mp3 sudah diupload ke GitHub dan URL-nya benar.', e);
  });
}

function toggleMusic() {
  const btn = document.getElementById('musicToggle');

  // Inisiasi audio player jika belum ada (lazy init)
  if (!audioPlayer) initAudioPlayer();

  musicPlaying = !musicPlaying;
  if (btn) btn.classList.toggle('playing', musicPlaying);

  if (musicPlaying) {
    // .play() mengembalikan Promise — tangkap error jika browser blokir autoplay
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Playback gagal:', err);
        musicPlaying = false;
        if (btn) btn.classList.remove('playing');
      });
    }
  } else {
    audioPlayer.pause();
  }
}

// Pre-init audio object saat DOM siap (tidak autoplay, hanya siapkan objek)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAudioPlayer);
} else {
  initAudioPlayer();
}


/* ─────────────────────────────────────────────
   9. TYPEWRITER EFFECT FOR GREETING
───────────────────────────────────────────── */
(function () {
  const nameEl = document.getElementById('recipient-name');
  if (!nameEl) return;
  const name = nameEl.textContent;
  nameEl.textContent = '';
  nameEl.style.borderRight = '2px solid var(--crimson)';
  nameEl.style.paddingRight = '2px';

  let typed = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typed) {
        typed = true;
        let i = 0;
        const interval = setInterval(() => {
          nameEl.textContent += name[i];
          i++;
          if (i >= name.length) {
            clearInterval(interval);
            setTimeout(() => {
              nameEl.style.borderRight = 'none';
            }, 600);
          }
        }, 100);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(nameEl);
})();


/* ─────────────────────────────────────────────
   10. MOBILE PERFORMANCE: Disable heavy CSS
───────────────────────────────────────────── */
(function () {
  if (isMobile) {
    // Add mobile class to body for CSS optimizations
    document.body.classList.add('is-mobile');
  }
})();