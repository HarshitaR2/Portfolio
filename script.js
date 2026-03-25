const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

menuBtn?.addEventListener("click", () => nav?.classList.toggle("open"));

document.querySelectorAll("#nav a").forEach((link) => {
  link.addEventListener("click", () => nav?.classList.remove("open"));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const animateCount = (el) => {
  const configuredTarget = el.dataset.target;
  const sourceText = el.textContent.trim();
  const suffix = el.dataset.suffix || (sourceText.match(/\D+$/) || [""])[0];
  const target = Number(configuredTarget ?? sourceText.replace(/[^\d.]/g, ""));
  const start = performance.now();
  const duration = 1100;

  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    if (Number.isNaN(target) || target === 0) {
      el.textContent = `0${suffix}`;
    } else {
      const current = target * (1 - (1 - progress) ** 3);
      const formatted = Number.isInteger(target)
        ? Math.floor(current)
        : current.toFixed(2);
      el.textContent = `${formatted}${suffix}`;
    }
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".stat-card h3").forEach((el) => statsObserver.observe(el));

document.querySelectorAll(".tilt, .skill-box, .stat-card, .cert-card, .contact-grid article, .edu-line article, .long-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -4;
    const rotateY = ((x / rect.width) - 0.5) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const initialTheme = localStorage.getItem("portfolio-theme");
const applyThemeUi = (isDark) => {
  if (themeIcon) themeIcon.textContent = isDark ? "☀️" : "🌙";
  if (themeLabel) themeLabel.textContent = isDark ? "Light" : "Dark";
};

if (initialTheme === "dark") {
  document.body.classList.add("dark");
}
applyThemeUi(document.body.classList.contains("dark"));

themeBtn?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  applyThemeUi(isDark);
});

// Custom cursor
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

window.addEventListener("mousemove", (event) => {
  if (!cursorDot || !cursorRing) return;
  const { clientX, clientY } = event;
  cursorDot.style.left = `${clientX}px`;
  cursorDot.style.top = `${clientY}px`;
  cursorRing.style.left = `${clientX}px`;
  cursorRing.style.top = `${clientY}px`;
});

document.querySelectorAll("a, button, .stat-card, .skill-box, .project-card, .cert-card, .contact-grid article, .edu-line article, .long-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (!cursorRing) return;
    cursorRing.style.width = "46px";
    cursorRing.style.height = "46px";
    cursorRing.style.borderColor = "var(--acc2)";
  });
  el.addEventListener("mouseleave", () => {
    if (!cursorRing) return;
    cursorRing.style.width = "32px";
    cursorRing.style.height = "32px";
    cursorRing.style.borderColor = "var(--acc)";
  });
});

// Animated background particles
const canvas = document.getElementById("bgCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const particles = [];
const particleCount = 60;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  if (!canvas) return;
  particles.length = 0;
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.7 + 0.6
    });
  }
}

function animateBackground() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const primary = getComputedStyle(document.body).getPropertyValue("--acc").trim();

  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `${primary}90`;
    ctx.fill();
  }

  requestAnimationFrame(animateBackground);
}

resizeCanvas();
createParticles();
animateBackground();
window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});
