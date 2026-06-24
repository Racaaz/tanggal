/* ══════════════════════════════════════════════
   TANGGAL CANTIK — script.js
   ══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. PARTICLE SYSTEM (glitter + petals)
───────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  const isMob  = window.innerWidth < 480;
  const MAX    = isMob ? 22 : 35;

  const EMOJIS = ['🌸', '🌹', '🌷', '✨', '💕', '💗', '🌺', '💫'];
  const GLITTER = ['#F2B8C6', '#FFD6E7', '#C0392B', '#FFB3C6', '#FFC8DD', '#FFF'];

  let W, H;
  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makePetal() {
    const isGlitter = Math.random() < 0.55;
    return {
      type:    isGlitter ? 'glitter' : 'emoji',
      emoji:   EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      color:   GLITTER[Math.floor(Math.random() * GLITTER.length)],
      x:       Math.random() * (W || window.innerWidth),
      y:       -40 - Math.random() * 300,
      size:    isGlitter ? 2 + Math.random() * 4 : 14 + Math.random() * 16,
      speed:   0.35 + Math.random() * 0.65,
      drift:   (Math.random() - 0.5) * 0.5,
      rot:     Math.random() * 360,
      rotSpd:  (Math.random() - 0.5) * 2,
      sway:    Math.random() * Math.PI * 2,
      opacity: isGlitter ? 0.5 + Math.random() * 0.5 : 0.65 + Math.random() * 0.35,
      twinkle: isGlitter,
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

      if (p.type === 'glitter') {
        p.twinkleT += 0.06;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(p.twinkleT));
        ctx.globalAlpha = p.opacity * twinkle;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // star glint
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
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

      p.sway  += 0.016;
      p.x     += Math.sin(p.sway) * 0.8 + p.drift;
      p.y     += p.speed;
      p.rot   += p.rotSpd;

      if (p.y > H + 60 || p.x < -60 || p.x > W + 60) {
        Object.assign(p, makePetal());
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ─────────────────────────────────────────────
   2. CURSOR TRAIL (hearts follow mouse)
───────────────────────────────────────────── */
(function () {
  const HEARTS = ['💕', '💗', '✨', '🌸', '💖'];
  const trail  = document.getElementById('cursor-trail');
  let lastTime = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < 80) return; // throttle
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
function goToPage2() {
  const p1 = document.getElementById('page1');
  const p2 = document.getElementById('page2');

  p1.style.opacity   = '0';
  p1.style.transform = 'translateY(-40px)';
  p1.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  setTimeout(() => {
    p1.classList.add('hidden');
    p2.classList.remove('hidden');
    p2.style.opacity   = '0';
    p2.style.transform = 'translateY(40px)';
    p2.style.transition = 'none';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p2.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        p2.style.opacity    = '1';
        p2.style.transform  = 'translateY(0)';
        p2.scrollTo({ top: 0 });

        // start confetti burst on page 2 entry
        burstParticles();
      });
    });
  }, 550);
}

function goToPage1() {
  const p1 = document.getElementById('page1');
  const p2 = document.getElementById('page2');

  p2.style.opacity   = '0';
  p2.style.transform = 'translateY(40px)';
  p2.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  setTimeout(() => {
    p2.classList.add('hidden');
    p1.classList.remove('hidden');
    p1.style.opacity   = '0';
    p1.style.transform = 'translateY(-40px)';
    p1.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p1.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        p1.style.opacity    = '1';
        p1.style.transform  = 'translateY(0)';
      });
    });
  }, 480);
}

function burstParticles() {
  const flash = document.createElement('div');
  Object.assign(flash.style, {
    position:   'fixed',
    inset:      '0',
    background: 'radial-gradient(ellipse at center, rgba(249,218,218,0.65) 0%, transparent 70%)',
    zIndex:     '50',
    pointerEvents: 'none',
    opacity:    '0',
    transition: 'opacity 0.3s ease',
  });
  document.body.appendChild(flash);
  requestAnimationFrame(() => {
    flash.style.opacity = '1';
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 400);
    }, 400);
  });
}


/* ─────────────────────────────────────────────
   4. COUNTDOWN  →  26 Juni 2026 00:00 WIB
   Ganti TARGET untuk mengubah tanggal tujuan
───────────────────────────────────────────── */
(function () {
  // ── Ubah tanggal target di sini ──
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
      if (bar) bar.style.background = 'linear-gradient(90deg,#c6a020,#e8c547,#c6a020)';
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
   5. DODGE BUTTON LOGIC
   The "Nggak Mau" button escapes with messages
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
  let noSize = 0.88;   // rem
  let yesScale = 1;
  let cooldown = false;

  window.dodgeNo = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (cooldown) return;
    cooldown = true;

    dodgeCount++;

    const arenaRect = arena.getBoundingClientRect();
    const bw = btnNo.offsetWidth;
    const bh = btnNo.offsetHeight;

    // Pick random position inside arena, avoiding center
    let rx, ry, attempts = 0;
    do {
      rx = Math.random() * Math.max(arenaRect.width  - bw,  10);
      ry = Math.random() * Math.max(arenaRect.height - bh, 10);
      attempts++;
    } while (attempts < 10 && rx > arenaRect.width * 0.3 && rx < arenaRect.width * 0.7);

    btnNo.style.left = rx + 'px';
    btnNo.style.top  = ry + 'px';

    // Shrink No
    noSize   = Math.max(0.5, noSize - 0.065);
    yesScale = Math.min(1.7, yesScale + 0.07);

    btnNo.style.fontSize = noSize + 'rem';
    btnNo.style.opacity  = String(Math.max(0.22, 1 - dodgeCount * 0.06));
    btnNo.style.padding  = `${Math.max(5, 10 - Math.floor(dodgeCount/2))}px ${Math.max(10, 22 - dodgeCount)}px`;

    // Grow Yes
    btnYes.style.transform  = `scale(${yesScale})`;
    btnYes.style.boxShadow  = `0 ${4 + dodgeCount * 2}px ${20 + dodgeCount * 5}px rgba(192,57,43,${Math.min(0.7, 0.35 + dodgeCount * 0.035)})`;

    // Message
    hint.textContent = MSGS[Math.min(dodgeCount - 1, MSGS.length - 1)];

    // Vanish after enough tries
    if (dodgeCount >= 11) {
      btnNo.style.opacity = '0';
      setTimeout(() => { btnNo.style.display = 'none'; }, 300);
      hint.textContent = '* tombolnya udah menyerah 💨 tinggal satu pilihan~ 💕';
    }

    setTimeout(() => { cooldown = false; }, 280);
  };

  // also block actual click
  btnNo.addEventListener('click', (e) => { e.preventDefault(); window.dodgeNo(e); });
  btnNo.addEventListener('touchstart', (e) => { window.dodgeNo(e); }, { passive: false });

  // Make arena positioned
  arena.style.position = 'relative';
  btnNo.style.position = 'absolute';
  btnNo.style.top      = '10px';
  btnNo.style.right    = '10%';
  btnYes.style.position = 'relative';
  btnYes.style.zIndex   = '2';
})();


/* ─────────────────────────────────────────────
   6. YES RESPONSE
───────────────────────────────────────────── */
function handleYes() {
  const qWrap    = document.querySelector('.question-wrap');
  const confPhoto = document.querySelector('.conf-photo-wrap');
  const response = document.getElementById('responseWrap');

  qWrap.style.transition = 'opacity 0.4s ease';
  qWrap.style.opacity    = '0';

  setTimeout(() => {
    qWrap.style.display = 'none';
    response.classList.remove('hidden');
    response.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Love burst effect
    const burst = document.createElement('div');
    Object.assign(burst.style, {
      position: 'fixed', inset: '0', zIndex: '100',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      fontSize: '5rem',
      animation: 'burst-anim 1s ease forwards',
    });
    burst.textContent = '💕';
    if (!document.getElementById('burst-style')) {
      const s = document.createElement('style');
      s.id = 'burst-style';
      s.textContent = `@keyframes burst-anim {
        0%   { opacity: 0; transform: scale(0.4); }
        40%  { opacity: 1; transform: scale(1.4); }
        100% { opacity: 0; transform: scale(2.5); }
      }`;
      document.head.appendChild(s);
    }
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1100);
  }, 420);
}