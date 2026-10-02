// =============================================
// YOUSEF MAMDOUH SALEH — PORTFOLIO SCRIPT
// Mechatronics Engineering x UI/UX Design
// =============================================

// ── PRELOADER ──────────────────────────────
(function () {
  const loader = document.getElementById('preloader');
  const fill = document.getElementById('preloader-fill');
  const pct = document.getElementById('preloader-pct');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initReveal();
      }, 400);
    }
    fill.style.width = progress + '%';
    if (pct) pct.textContent = Math.round(progress);
  }, 80);
  document.body.style.overflow = 'hidden';
})();

// ── CUSTOM CURSOR ──────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animateCursor() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    cursor.style.background = 'transparent';
    cursor.style.border = '1px solid var(--accent)';
    follower.style.width = '60px';
    follower.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--accent)';
    cursor.style.border = 'none';
    follower.style.width = '36px';
    follower.style.height = '36px';
  });
});

// ── SCROLL PROGRESS ───────────────────────
const scrollBar = document.createElement('div');
scrollBar.className = 'scroll-progress';
document.body.prepend(scrollBar);
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
});

// ── NAVIGATION ────────────────────────────
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── ACTIVE NAV LINK ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.nav-link[data-section="' + entry.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// ── REVEAL ON SCROLL ──────────────────────
function initReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach((el, i) => {
    el.style.transitionDelay = (i % 5 * 80) + 'ms';
    revealObserver.observe(el);
  });
}

// ── HERO CANVAS ───────────────────────────
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], lines = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  // Create floating circuit nodes
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function drawCircuitLines(ctx, W, H, t) {
    ctx.strokeStyle = 'rgba(30,110,244,0.08)';
    ctx.lineWidth = 1;
    // Horizontal/vertical circuit trace pattern
    const step = 80;
    for (let x = 0; x < W; x += step) {
      for (let y = 0; y < H; y += step) {
        if (Math.random() > 0.7) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          if (Math.random() > 0.5) {
            ctx.lineTo(x + step, y);
            ctx.lineTo(x + step, y + step);
          } else {
            ctx.lineTo(x, y + step);
            ctx.lineTo(x + step, y + step);
          }
          ctx.stroke();
          // Node dot
          ctx.fillStyle = 'rgba(30,110,244,0.15)';
          ctx.beginPath();
          ctx.arc(x + step, y + step, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.005;

    // Draw circuit traces (static, refresh rarely)
    if (Math.floor(t * 30) % 120 === 0) {
      drawCircuitLines(ctx, W, H, t);
    }

    // Animated particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(30,110,244,${p.alpha})`;
      ctx.fill();
    });

    // Connect nearby particles
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(30,110,244,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── PROJECT CANVAS DRAWINGS ────────────────
document.querySelectorAll('.proj-canvas').forEach(canvas => {
  const type = canvas.dataset.type;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  }
  
  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    
    if (type === 'robotics') drawRobotics(ctx, W, H);
    else if (type === 'automation') drawAutomation(ctx, W, H);
    else if (type === 'cad') drawCAD(ctx, W, H);
    else if (type === 'ux') drawUX(ctx, W, H);
  }
  
  let t = 0;
  function animate() {
    t += 0.01;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (type === 'robotics') drawRoboticsAnim(ctx, W, H, t);
    else if (type === 'automation') drawAutomationAnim(ctx, W, H, t);
    else if (type === 'cad') drawCADAnim(ctx, W, H, t);
    else if (type === 'ux') drawUXAnim(ctx, W, H, t);
    requestAnimationFrame(animate);
  }
  
  resize();
  window.addEventListener('resize', resize);
  animate();
});

function drawRoboticsAnim(ctx, W, H, t) {
  const cx = W * 0.45, cy = H * 0.75;
  // Grid
  ctx.strokeStyle = 'rgba(30,110,244,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  
  // Base
  ctx.fillStyle = 'rgba(30,110,244,0.3)';
  ctx.fillRect(cx - 30, cy, 60, 12);
  
  // Joint angles animated
  const a1 = Math.sin(t * 0.5) * 0.3;
  const a2 = Math.sin(t * 0.7 + 1) * 0.4;
  const a3 = Math.sin(t * 0.9 + 2) * 0.3;
  
  function drawArm(x0, y0, len, angle, color) {
    const x1 = x0 + Math.cos(angle) * len;
    const y1 = y0 + Math.sin(angle) * len;
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x0, y0, 8, 0, Math.PI * 2); ctx.fill();
    return [x1, y1];
  }
  
  const baseAngle = -Math.PI / 2 + a1;
  const [x1, y1] = drawArm(cx, cy, 80, baseAngle, 'rgba(30,110,244,0.8)');
  const [x2, y2] = drawArm(x1, y1, 70, baseAngle + a2 - 0.3, 'rgba(30,110,244,0.7)');
  const [x3, y3] = drawArm(x2, y2, 50, baseAngle + a2 + a3 - 0.6, 'rgba(30,110,244,0.6)');
  
  // Gripper
  ctx.strokeStyle = 'rgba(30,110,244,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x3, y3); ctx.lineTo(x3 + 12, y3 - 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x3, y3); ctx.lineTo(x3 + 12, y3 + 8); ctx.stroke();
  
  // Labels
  ctx.fillStyle = 'rgba(30,110,244,0.6)';
  ctx.font = '10px Space Mono, monospace';
  ctx.fillText('JOINT_1: ' + (a1 * 57.3).toFixed(1) + 'deg', 20, H - 50);
  ctx.fillText('JOINT_2: ' + (a2 * 57.3).toFixed(1) + 'deg', 20, H - 35);
  ctx.fillText('JOINT_3: ' + (a3 * 57.3).toFixed(1) + 'deg', 20, H - 20);
  
  // Top right label
  ctx.fillStyle = 'rgba(30,110,244,0.4)';
  ctx.font = '9px Space Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ROBOTIC ARM — 3DOF', W - 20, 25);
  ctx.fillText('STATUS: ACTIVE', W - 20, 40);
  ctx.textAlign = 'left';
}

function drawAutomationAnim(ctx, W, H, t) {
  // Grid
  ctx.strokeStyle = 'rgba(30,180,80,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  
  const convY = H * 0.55;
  // Conveyor belt
  ctx.strokeStyle = 'rgba(30,200,80,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(60, convY); ctx.lineTo(W - 60, convY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(60, convY + 20); ctx.lineTo(W - 60, convY + 20); ctx.stroke();
  
  // Belt rollers
  [80, W/2, W - 80].forEach(x => {
    ctx.strokeStyle = 'rgba(30,200,80,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, convY + 10, 12, 0, Math.PI * 2);
    ctx.stroke();
    // Rotation indicator
    ctx.beginPath();
    ctx.moveTo(x, convY + 10);
    ctx.lineTo(x + Math.cos(t * 2) * 10, convY + 10 + Math.sin(t * 2) * 10);
    ctx.strokeStyle = 'rgba(30,200,80,0.9)';
    ctx.stroke();
  });
  
  // Moving objects on belt
  const obj1x = ((t * 60) % (W - 80)) + 80;
  const obj2x = ((t * 60 + 150) % (W - 80)) + 80;
  
  // Object 1 - blue circle
  ctx.fillStyle = 'rgba(30,110,244,0.8)';
  ctx.beginPath(); ctx.arc(obj1x, convY - 12, 12, 0, Math.PI * 2); ctx.fill();
  
  // Object 2 - green square
  ctx.fillStyle = 'rgba(30,200,80,0.6)';
  ctx.fillRect(obj2x - 10, convY - 22, 20, 20);
  
  // Sensor beam at x=W*0.6
  const sensorX = W * 0.6;
  ctx.strokeStyle = 'rgba(255,180,0,0.3)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(sensorX, convY - 50); ctx.lineTo(sensorX, convY + 40); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,180,0,0.8)';
  ctx.font = '8px Space Mono, monospace';
  ctx.fillText('SENSOR', sensorX + 5, convY - 38);
  
  // PID display
  ctx.fillStyle = 'rgba(30,200,80,0.5)';
  ctx.font = '10px Space Mono, monospace';
  ctx.fillText('PID CONTROL', 20, 30);
  ctx.fillText('Kp: 1.2  Ki: 0.05  Kd: 0.8', 20, 48);
  ctx.fillText('ERROR: ' + (Math.sin(t) * 2.5).toFixed(2) + 'mm', 20, 64);
  
  // Status
  ctx.fillStyle = 'rgba(30,200,80,0.4)';
  ctx.font = '9px Space Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('SORTING SYSTEM — ACTIVE', W - 20, 25);
  ctx.textAlign = 'left';
}

function drawCADAnim(ctx, W, H, t) {
  const cx = W * 0.5, cy = H * 0.5;
  
  // Blueprint grid
  ctx.strokeStyle = 'rgba(120,80,200,0.06)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  
  // Main component - rotating gear
  const r1 = 70, r2 = 50, teeth = 12;
  ctx.save();
  ctx.translate(cx * 0.65, cy);
  ctx.rotate(t * 0.3);
  ctx.strokeStyle = 'rgba(150,100,255,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (i / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? r1 : r2;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(150,100,255,0.8)'; ctx.fill();
  ctx.restore();
  
  // Second smaller gear
  const sg = 35, sgt = 8;
  const sgx = cx * 0.65 + r1 + sg + 2, sgy = cy;
  ctx.save();
  ctx.translate(sgx, sgy);
  ctx.rotate(-t * 0.3 * (r1/sg));
  ctx.strokeStyle = 'rgba(150,100,255,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < sgt * 2; i++) {
    const angle = (i / (sgt * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? sg : sg - 12;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath(); ctx.stroke();
  ctx.restore();
  
  // Dimension lines
  ctx.strokeStyle = 'rgba(150,100,255,0.3)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx * 0.65 - r1, cy + r1 + 20); ctx.lineTo(cx * 0.65 + r1, cy + r1 + 20); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(150,100,255,0.5)';
  ctx.font = '9px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Ø140mm', cx * 0.65, cy + r1 + 35);
  
  // Title
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(150,100,255,0.4)';
  ctx.font = '9px Space Mono, monospace';
  ctx.fillText('SOLIDWORKS — MECHANICAL ASSEMBLY', 20, 25);
  ctx.fillText('MATERIAL: STEEL 1018', 20, 42);
  ctx.fillText('TOLERANCE: ±0.05mm', 20, 59);
  
  // Angle indicator
  ctx.fillStyle = 'rgba(150,100,255,0.3)';
  ctx.textAlign = 'right';
  ctx.fillText('ROT: ' + ((t * 0.3 * 57.3) % 360).toFixed(1) + 'deg', W - 20, 25);
  ctx.textAlign = 'left';
}

function drawUXAnim(ctx, W, H, t) {
  // Clean digital aesthetic
  ctx.fillStyle = 'rgba(30,110,244,0.03)';
  ctx.fillRect(0, 0, W, H);
  
  // Phone mockup
  const pw = 120, ph = 220, px = W * 0.3 - pw/2, py = H * 0.5 - ph/2;
  ctx.strokeStyle = 'rgba(30,110,244,0.5)';
  ctx.lineWidth = 2;
  roundRect(ctx, px, py, pw, ph, 14);
  ctx.stroke();
  
  // Screen
  ctx.fillStyle = 'rgba(30,110,244,0.08)';
  roundRect(ctx, px + 6, py + 20, pw - 12, ph - 40, 8);
  ctx.fill();
  
  // App UI elements inside
  const animated = Math.abs(Math.sin(t * 0.5));
  ctx.fillStyle = `rgba(30,110,244,${0.3 + animated * 0.4})`;
  ctx.fillRect(px + 14, py + 32, pw - 28, 18);
  
  ctx.fillStyle = 'rgba(30,110,244,0.2)';
  ctx.fillRect(px + 14, py + 58, pw - 28, 8);
  ctx.fillRect(px + 14, py + 72, (pw - 28) * 0.7, 8);
  
  ctx.strokeStyle = 'rgba(30,110,244,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 14, py + 90, (pw - 28) * 0.45, 40);
  ctx.strokeRect(px + 14 + (pw - 28) * 0.5, py + 90, (pw - 28) * 0.45, 40);
  
  // Navigation dots
  [0, 1, 2, 3].forEach((i) => {
    ctx.fillStyle = i === Math.floor(t * 0.5) % 4 ? 'rgba(30,110,244,0.8)' : 'rgba(30,110,244,0.2)';
    ctx.beginPath(); ctx.arc(px + 20 + i * 22, py + ph - 25, 5, 0, Math.PI * 2); ctx.fill();
  });
  
  // Second screen (wireframe style)
  const pw2 = 90, ph2 = 160, px2 = W * 0.6, py2 = H * 0.5 - ph2/2;
  ctx.strokeStyle = 'rgba(30,110,244,0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  roundRect(ctx, px2, py2, pw2, ph2, 10);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Wireframe lines
  ctx.strokeStyle = 'rgba(30,110,244,0.15)';
  [0.15, 0.3, 0.45, 0.6].forEach(frac => {
    ctx.beginPath();
    ctx.moveTo(px2 + 10, py2 + ph2 * frac);
    ctx.lineTo(px2 + pw2 - 10, py2 + ph2 * frac);
    ctx.stroke();
  });
  
  // Connection arrow between screens
  ctx.strokeStyle = 'rgba(30,110,244,0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(px + pw, H * 0.5);
  ctx.lineTo(px2, H * 0.5);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Labels
  ctx.fillStyle = 'rgba(30,110,244,0.4)';
  ctx.font = '9px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('UI DESIGN', px + pw/2, py + ph + 18);
  ctx.fillText('WIREFRAME', px2 + pw2/2, py2 + ph2 + 18);
  
  ctx.textAlign = 'left';
  ctx.font = '9px Space Mono, monospace';
  ctx.fillStyle = 'rgba(30,110,244,0.35)';
  ctx.fillText('FIGMA — UX/UI DESIGN', 20, 25);
  ctx.fillText('PROTOTYPE: INTERACTIVE', 20, 42);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── HERO STRIP MARQUEE ────────────────────
(function() {
  const strip = document.querySelector('.hero-strip');
  if (!strip) return;
  // Clone content for infinite scroll
  const content = strip.innerHTML;
  strip.innerHTML = content + content;
  let pos = 0;
  function marquee() {
    pos -= 0.4;
    if (pos < -strip.scrollWidth / 2) pos = 0;
    strip.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(marquee);
  }
  marquee();
})();

// ── PROJECT CARD HOVER ────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelectorAll('.tech-tag, .project-tech span').forEach(t => {
      t.style.borderColor = 'var(--accent)';
      t.style.color = 'var(--accent)';
    });
  });
  card.addEventListener('mouseleave', () => {
    card.querySelectorAll('.tech-tag, .project-tech span').forEach(t => {
      t.style.borderColor = '';
      t.style.color = '';
    });
  });
});

// ── SMOOTH ANCHOR SCROLL ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── SPEC PANEL COUNTER ANIMATION ─────────
const specNums = document.querySelectorAll('.spec-num');
const specObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = el.textContent.replace(/[^0-9]/g, '');
      if (!target || isNaN(target)) return;
      let current = 0;
      const end = parseInt(target);
      const step = end / 30;
      const suffix = el.textContent.replace(/[0-9]/g, '');
      const timer = setInterval(() => {
        current += step;
        if (current >= end) { current = end; clearInterval(timer); }
        el.textContent = Math.round(current) + suffix;
      }, 40);
      specObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
specNums.forEach(n => specObserver.observe(n));

console.log('%c YMS. Portfolio Loaded ', 'background: #1e6ef4; color: white; padding: 4px 8px; font-weight: bold;');
console.log('%c Yousef Mamdouh Saleh — Mechatronics Engineering x UI/UX Design', 'color: #1e6ef4;');
