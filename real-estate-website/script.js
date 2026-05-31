// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

// ── NAV SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── SKYLINE GENERATION ──
const skyline = document.getElementById('skyline');
const heights = [60,90,140,200,260,180,220,300,250,190,170,240,280,210,160,230,270,200,150,220,260,180,140,190,250,300,220,170,200,240];
heights.forEach((h, i) => {
  const b = document.createElement('div');
  b.className = 'bldg';
  const w = Math.random() * 18 + 16;
  b.style.cssText = `width:${w}px;height:${h}px;animation-delay:${i*0.06}s;`;
  skyline.appendChild(b);
});

// ── PARTICLES ──
const pc = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    animation-duration:${Math.random()*12+8}s;
    animation-delay:${Math.random()*8}s;
  `;
  pc.appendChild(p);
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── INVESTMENT CALCULATOR ──
function fmt(n) {
  if (n >= 10000000) return '₹' + (n/10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n/100000).toFixed(1) + ' L';
  return '₹' + n.toLocaleString('en-IN');
}
function calcEMI() {
  const P = parseFloat(document.getElementById('price').value) || 10000000;
  const t = parseInt(document.getElementById('tenure').value);
  const r = parseFloat(document.getElementById('irate').value) / 100 / 12;
  const n = t * 12;
  const appr = parseFloat(document.getElementById('appr').value) / 100;
  const emi = P * r * Math.pow(1+r,n) / (Math.pow(1+r,n) - 1);
  document.getElementById('emi-result').textContent = fmt(Math.round(emi));
  document.getElementById('total-result').textContent = fmt(Math.round(emi * n));
  document.getElementById('val5-result').textContent = fmt(Math.round(P * Math.pow(1+appr, 5)));
  document.getElementById('val10-result').textContent = fmt(Math.round(P * Math.pow(1+appr, 10)));
  document.getElementById('val20-result').textContent = fmt(Math.round(P * Math.pow(1+appr, 20)));
}
['price','tenure','irate','appr'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    if (id === 'tenure') document.getElementById('tenure-val').textContent = el.value;
    if (id === 'irate') document.getElementById('rate-val').textContent = el.value;
    if (id === 'appr') document.getElementById('appr-val').textContent = el.value;
    calcEMI();
    // Update range background
    if (el.type === 'range') {
      const pct = (el.value - el.min) / (el.max - el.min) * 100;
      el.style.setProperty('--val', pct + '%');
    }
  });
});
calcEMI();

// ── CHATBOT ──
const responses = {
  'projects': "We have 4 project categories: 🏙️ High-Rise Apartments, 🌴 Luxury Villas, 🏝️ Resorts, and 🏢 Commercial Buildings. Which interests you?",
  'book': "I'd be happy to schedule a consultation! Our advisors are available Mon–Sat, 10AM–7PM. Please call +91 22 4000 9000 or fill the contact form below.",
  'emi': "For our average 2BHK at ₹1.5 Cr with 20-year tenure at 8.5%, your EMI would be approx ₹1.30 L/month. Use our calculator above for exact figures!",
  'delhi': "🚀 We're expanding to Delhi in 2025! Pre-launch registrations are open. Expect 800+ premium units in prime NCR locations. Register your interest now!",
  'default': "Thank you for your query! Our team will get back to you shortly. For immediate assistance, call +91 22 4000 9000. Is there anything else I can help with?"
};
function toggleChat() {
  document.getElementById('chatPanel').classList.toggle('open');
}
function quickReply(text) {
  addMsg(text, 'user');
  const key = text.toLowerCase().includes('project') ? 'projects' : text.toLowerCase().includes('book') || text.toLowerCase().includes('consult') ? 'book' : text.toLowerCase().includes('emi') ? 'emi' : 'delhi';
  showTyping(responses[key]);
}
function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, 'user');
  input.value = '';
  const lower = text.toLowerCase();
  const key = lower.includes('project') || lower.includes('property') ? 'projects' : lower.includes('book') || lower.includes('consult') || lower.includes('appoint') ? 'book' : lower.includes('emi') || lower.includes('loan') || lower.includes('calc') ? 'emi' : lower.includes('delhi') ? 'delhi' : 'default';
  showTyping(responses[key]);
}
function addMsg(text, type) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg msg-${type}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function showTyping(response) {
  const msgs = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'msg-typing';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => {
    msgs.removeChild(typing);
    addMsg(response, 'bot');
  }, 1400);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// 3D tilt on project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});