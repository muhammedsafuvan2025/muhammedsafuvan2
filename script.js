// ============================================================
//  THEME
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
const html        = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const t = html.getAttribute('data-theme');
    const next = t === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    playSound('click');
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================================
//  SOUND ENGINE
// ============================================================
let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioCtx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        if (type === 'click') {
            o.type = 'sine';
            o.frequency.setValueAtTime(880, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
            g.gain.setValueAtTime(0.08, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.08);
        } else if (type === 'hover') {
            o.type = 'sine';
            o.frequency.setValueAtTime(660, ctx.currentTime);
            g.gain.setValueAtTime(0.04, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.05);
        } else if (type === 'whoosh') {
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(200, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
            g.gain.setValueAtTime(0.06, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15);
        } else if (type === 'particle') {
            o.type = 'sine';
            o.frequency.setValueAtTime(1200, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
            g.gain.setValueAtTime(0.05, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2);
        }
    } catch(e) {}
}

// ============================================================
//  MUTE TOGGLE
// ============================================================
function initMuteToggle() {
    const btn = document.createElement('button');
    btn.id = 'muteBtn';
    btn.setAttribute('aria-label', 'Toggle sound');
    btn.innerHTML = '🔊';
    btn.style.cssText = 'position:fixed;bottom:8.5rem;right:1.5rem;z-index:9999;width:44px;height:44px;border-radius:50%;border:1px solid var(--border-color);background:var(--glass-bg);backdrop-filter:blur(10px);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;box-shadow:var(--shadow-md);';
    btn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        btn.innerHTML = soundEnabled ? '🔊' : '🔇';
        playSound('click');
    });
    document.body.appendChild(btn);
}

// ============================================================
//  PORTRAIT PARALLAX + BRIGHTNESS REACT
// ============================================================
function initPortraitParallax() {
    const portrait = document.querySelector('.portrait-bg');
    if (!portrait) return;
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    function tick() {
        cx += (mx - cx) * 0.04;
        cy += (my - cy) * 0.04;
        portrait.style.transform = `translate(${cx * 18}px, ${cy * 12}px) scale(1.06)`;
        const rawX = (mx + 1) / 2;
        const prox = Math.max(0, rawX - 0.35) / 0.65;
        portrait.style.filter  = `grayscale(100%) blur(0.5px) brightness(${(1 + prox * 1.4).toFixed(2)})`;
        portrait.style.opacity = (0.18 + prox * 0.18).toFixed(3);
        requestAnimationFrame(tick);
    }
    tick();
}

// ============================================================
//  SPOTLIGHT
// ============================================================
let spotlightRaf = null;
window.addEventListener('mousemove', (e) => {
    if (spotlightRaf) return;
    spotlightRaf = requestAnimationFrame(() => {
        document.body.classList.add('spotlight-on');
        document.documentElement.style.setProperty('--mx', `${(e.clientX/window.innerWidth)*100}%`);
        document.documentElement.style.setProperty('--my', `${(e.clientY/window.innerHeight)*100}%`);
        spotlightRaf = null;
    });
});
window.addEventListener('mouseleave', () => document.body.classList.remove('spotlight-on'));

// ============================================================
//  GLITCH EFFECT
// ============================================================
function initGlitch() {
    const nameEl = document.querySelector('.gradient-text');
    if (!nameEl) return;
    nameEl.setAttribute('data-text', nameEl.textContent);
    nameEl.classList.add('glitch-name');
    function doGlitch() {
        nameEl.classList.add('glitching');
        setTimeout(() => nameEl.classList.remove('glitching'), 400);
        setTimeout(doGlitch, 3000 + Math.random() * 4000);
    }
    setTimeout(doGlitch, 2500);
}

// ============================================================
//  SCRAMBLE TEXT
// ============================================================
function scrambleText(el, finalText, duration) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
    const steps = 30;
    let frame = 0;
    const timer = setInterval(() => {
        frame++;
        const progress = frame / steps;
        let result = '';
        for (let i = 0; i < finalText.length; i++) {
            if (finalText[i] === ' ') { result += ' '; continue; }
            if (i / finalText.length < progress) result += finalText[i];
            else result += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = result;
        if (frame >= steps) { clearInterval(timer); el.textContent = finalText; }
    }, duration / steps);
}

function initScramble() {
    const nameEl = document.querySelector('.gradient-text');
    if (!nameEl) return;
    const original = nameEl.textContent;
    setTimeout(() => scrambleText(nameEl, original, 1400), 1900);
}

// ============================================================
//  PARTICLE EXPLOSION
// ============================================================
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(canvas);
    const ctx2 = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 1.5;
            this.life = 1;
            this.decay = 0.02 + Math.random() * 0.025;
            this.size = 2 + Math.random() * 4;
            this.color = `hsla(${240 + Math.random() * 60}, 80%, 65%,`;
        }
        update() { this.x += this.vx; this.y += this.vy; this.vy += 0.15; this.life -= this.decay; }
        draw() {
            ctx2.beginPath();
            ctx2.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx2.fillStyle = this.color + this.life + ')';
            ctx2.fill();
        }
    }
    document.addEventListener('click', (e) => {
        playSound('particle');
        for (let i = 0; i < 28; i++) particles.push(new Particle(e.clientX, e.clientY));
    });
    function loop() {
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
}

// ============================================================
//  SKILL CHARGE-UP
// ============================================================
function initSkillChargeUp() {
    const tags = document.querySelectorAll('.skill-tag');
    tags.forEach(tag => tag.classList.add('skill-tag-chargeable'));
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tag = entry.target;
                setTimeout(() => tag.classList.add('charged'), parseFloat(tag.dataset.delay || 0));
                obs.unobserve(tag);
            }
        });
    }, { threshold: 0.3 });
    tags.forEach((tag, i) => { tag.dataset.delay = (i % 6) * 80; obs.observe(tag); });
    tags.forEach(tag => tag.addEventListener('mouseenter', () => playSound('hover')));
}

// ============================================================
//  TERMINAL BLOCK
// ============================================================
function initTerminal() {
    const skillsSection = document.querySelector('#skills .container');
    if (!skillsSection) return;
    const terminal = document.createElement('div');
    terminal.className = 'terminal-block';
    terminal.innerHTML = '<div class="terminal-header"><span class="t-dot t-red"></span><span class="t-dot t-yellow"></span><span class="t-dot t-green"></span><span class="t-title">safuvan@portfolio:~$</span></div><div class="terminal-body" id="terminalBody"></div>';
    skillsSection.appendChild(terminal);
    const lines = [
        { text: 'whoami', type: 'cmd' },
        { text: 'Muhammed Safuvan — System Administrator & IT Support Specialist', type: 'out' },
        { text: 'ls skills/', type: 'cmd' },
        { text: 'Python  JavaScript  SQL  AWS  Docker  Azure  Active-Directory  Linux  PowerBI', type: 'out' },
        { text: 'cat certifications.txt', type: 'cmd' },
        { text: 'AWS Cloud Practitioner (in progress) | Azure Fundamentals | Fanshawe PGC', type: 'out' },
        { text: 'ping future-employer.com', type: 'cmd' },
        { text: '64 bytes from future-employer.com: icmp_seq=1 ttl=64 time=0.1ms ✓', type: 'out' },
        { text: 'echo "Hire me?"', type: 'cmd' },
        { text: 'Yes. Absolutely.', type: 'out' },
    ];
    const body = document.getElementById('terminalBody');
    let lineIdx = 0;
    const termObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { termObs.disconnect(); typeLines(); }
    }, { threshold: 0.4 });
    termObs.observe(terminal);
    function typeLines() {
        if (lineIdx >= lines.length) return;
        const { text, type } = lines[lineIdx++];
        const row = document.createElement('div');
        row.className = 't-line t-' + type;
        row.innerHTML = type === 'cmd' ? '<span class="t-prompt">$ </span><span class="t-content"></span>' : '<span class="t-content"></span>';
        body.appendChild(row);
        const content = row.querySelector('.t-content');
        let ci = 0;
        const speed = type === 'cmd' ? 38 : 12;
        const typer = setInterval(() => {
            content.textContent += text[ci++];
            body.scrollTop = body.scrollHeight;
            if (ci >= text.length) { clearInterval(typer); setTimeout(typeLines, type === 'cmd' ? 300 : 180); }
        }, speed);
    }
}

// ============================================================
//  MATRIX EMAIL DECODE
// ============================================================
function initMatrixEmail() {
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        const original = link.textContent;
        let decoding = false;
        link.addEventListener('mouseenter', () => {
            if (decoding) return;
            decoding = true;
            playSound('whoosh');
            let frame = 0;
            const totalFrames = 18;
            const timer = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                let result = '';
                for (let i = 0; i < original.length; i++) {
                    if (['@', '.', ' '].includes(original[i])) { result += original[i]; continue; }
                    if (i / original.length < progress) result += original[i];
                    else result += matrixChars[Math.floor(Math.random() * matrixChars.length)];
                }
                link.textContent = result;
                if (frame >= totalFrames) { clearInterval(timer); link.textContent = original; decoding = false; }
            }, 45);
        });
    });
}

// ============================================================
//  CINEMATIC INTRO
// ============================================================
function initIntro() {
    const intro = document.getElementById('intro');
    if (!intro) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { intro.remove(); return; }
    setTimeout(() => { intro.classList.add('fade-out'); setTimeout(() => intro.remove(), 800); }, 1550);
}

// ============================================================
//  COMMAND PALETTE
// ============================================================
function initCommandPalette() {
    const cmdBtn = document.getElementById('cmdBtn');
    const cmdk = document.getElementById('cmdk');
    const cmdkInput = document.getElementById('cmdkInput');
    const cmdkList = document.getElementById('cmdkList');
    if (!cmdBtn || !cmdk || !cmdkInput || !cmdkList) return;
    const actions = [
        { id:'resume', label:'Open Résumé (PDF)', sub:'assets/Muhammed-Safuvan-resume.pdf', icon:'📄', kbd:'R', run:()=>window.open('assets/Muhammed-Safuvan-resume.pdf','_blank','noopener,noreferrer') },
        { id:'email', label:'Email Muhammed', sub:'muhammedsafuvan1999@gmail.com', icon:'✉️', kbd:'E', run:()=>window.location.href='mailto:muhammedsafuvan1999@gmail.com' },
        { id:'safesurf', label:'Open Safe Surf website', sub:'GitHub Pages demo', icon:'🔒', kbd:'S', run:()=>window.open('https://muhammedsafuvan2025.github.io/safeSurfWebsite/#','_blank','noopener,noreferrer') },
        { id:'home', label:'Go to Home', sub:'Hero section', icon:'🏠', kbd:'H', run:()=>document.querySelector('#home')?.scrollIntoView({behavior:'smooth'}) },
        { id:'about', label:'Go to About', sub:'Summary', icon:'👤', kbd:'A', run:()=>document.querySelector('#about')?.scrollIntoView({behavior:'smooth'}) },
        { id:'skills', label:'Go to Skills', sub:'Technical stack', icon:'🧠', kbd:'K', run:()=>document.querySelector('#skills')?.scrollIntoView({behavior:'smooth'}) },
        { id:'experience', label:'Go to Experience', sub:'Roles', icon:'🧰', kbd:'X', run:()=>document.querySelector('#experience')?.scrollIntoView({behavior:'smooth'}) },
        { id:'projects', label:'Go to Projects', sub:'Featured builds', icon:'🧪', kbd:'P', run:()=>document.querySelector('#projects')?.scrollIntoView({behavior:'smooth'}) },
        { id:'education', label:'Go to Education', sub:'Schools', icon:'🎓', kbd:'D', run:()=>document.querySelector('#education')?.scrollIntoView({behavior:'smooth'}) },
        { id:'contact', label:'Go to Contact', sub:'Get in touch', icon:'☎️', kbd:'C', run:()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}) },
    ];
    let filtered = [...actions], activeIndex = 0;
    function render() {
        cmdkList.innerHTML = '';
        filtered.forEach((a, idx) => {
            const item = document.createElement('div');
            item.className = 'cmdk-item' + (idx===activeIndex?' active':'');
            item.setAttribute('role','option'); item.dataset.id = a.id;
            item.innerHTML = '<div class="left"><div class="cmdk-icon">'+a.icon+'</div><div><div>'+a.label+'</div><div class="cmdk-sub">'+a.sub+'</div></div></div><div class="cmdk-kbd">'+a.kbd+'</div>';
            item.addEventListener('click', () => { a.run(); closeCmdk(); playSound('click'); });
            cmdkList.appendChild(item);
        });
    }
    function openCmdk() { cmdk.hidden=false; document.body.style.overflow='hidden'; cmdkInput.value=''; filtered=[...actions]; activeIndex=0; render(); setTimeout(()=>cmdkInput.focus(),0); playSound('whoosh'); }
    function closeCmdk() { cmdk.hidden=true; document.body.style.overflow=''; }
    function toggleCmdk() { cmdk.hidden ? openCmdk() : closeCmdk(); }
    cmdBtn.addEventListener('click', openCmdk);
    cmdk.addEventListener('click', e => { if (e.target?.getAttribute?.('data-cmdk-close')==='true') closeCmdk(); });
    cmdkInput.addEventListener('input', () => { const q=cmdkInput.value.trim().toLowerCase(); filtered=actions.filter(a=>(a.label+' '+a.sub).toLowerCase().includes(q)); activeIndex=0; render(); });
    window.addEventListener('keydown', e => {
        if ((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k') { e.preventDefault(); toggleCmdk(); return; }
        if (cmdk.hidden) return;
        if (e.key==='Escape') { e.preventDefault(); closeCmdk(); return; }
        if (e.key==='ArrowDown') { e.preventDefault(); activeIndex=Math.min(activeIndex+1,Math.max(filtered.length-1,0)); render(); return; }
        if (e.key==='ArrowUp') { e.preventDefault(); activeIndex=Math.max(activeIndex-1,0); render(); return; }
        if (e.key==='Enter') { e.preventDefault(); filtered[activeIndex]?.run(); closeCmdk(); return; }
        const a=actions.find(x=>x.kbd===e.key.toUpperCase());
        if (a) { e.preventDefault(); a.run(); closeCmdk(); }
    });
}

// ============================================================
//  NAV + SCROLL + MOBILE
// ============================================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('active'); playSound('click'); });
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { hamburger.classList.remove('active'); navMenu.classList.remove('active'); });
    link.addEventListener('mouseenter', () => playSound('hover'));
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

const navbar = document.querySelector('.navbar');
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    const s = window.pageYOffset;
    const d = document.documentElement.scrollHeight - window.innerHeight;
    navbar.style.boxShadow = s > 100 ? '0 4px 6px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)';
    if (scrollProgressBar) scrollProgressBar.style.width = (d>0?(s/d)*100:0) + '%';
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', s > 400);
    document.querySelectorAll('section[id]').forEach(section => {
        const top = section.offsetTop - 100;
        if (s > top && s <= top + section.offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
            document.querySelector('.nav-link[href="#'+section.id+'"]')?.classList.add('active');
        }
    });
});
scrollTopBtn?.addEventListener('click', () => { window.scrollTo({top:0,behavior:'smooth'}); playSound('click'); });

// ============================================================
//  INTERSECTION OBSERVER
// ============================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.style.opacity='1'; entry.target.style.transform='translateY(0)'; }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// ============================================================
//  3D TILT
// ============================================================
function attachTilt(el) {
    if (!el) return;
    el.classList.add('tilt');
    if (!el.querySelector('.tilt-glare')) { const glare=document.createElement('div'); glare.className='tilt-glare'; el.appendChild(glare); }
    const max = 10;
    el.addEventListener('mousemove', e => {
        const r=el.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        el.style.transform=`perspective(900px) rotateX(${((py-0.5)*-max).toFixed(2)}deg) rotateY(${((px-0.5)*max).toFixed(2)}deg) translateY(-2px)`;
        el.style.setProperty('--gx',px*100+'%'); el.style.setProperty('--gy',py*100+'%');
    });
    el.addEventListener('mouseleave', () => el.style.transform='');
    el.addEventListener('mouseenter', () => playSound('hover'));
}

// ============================================================
//  BUTTON SOUNDS
// ============================================================
function initButtonSounds() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => playSound('hover'));
        btn.addEventListener('click', () => playSound('click'));
    });
}

// Active nav style
const styleEl = document.createElement('style');
styleEl.textContent = '.nav-link.active{color:var(--accent-primary)}.nav-link.active::after{width:100%}';
document.head.appendChild(styleEl);

// ============================================================
//  BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-category,.timeline-item,.project-card,.education-card,.contact-item').forEach((el, idx) => {
        el.style.opacity='0'; el.style.transform='translateY(30px)';
        el.style.transition=`opacity 0.6s ease ${Math.min(idx*35,180)}ms, transform 0.6s ease ${Math.min(idx*35,180)}ms`;
        observer.observe(el);
    });
    document.querySelectorAll('.project-card,.skill-category,.education-card,.timeline-content').forEach(attachTilt);
    initIntro();
    initCommandPalette();
    initPortraitParallax();
    initGlitch();
    initScramble();
    initParticles();
    initTerminal();
    initMatrixEmail();
    initMuteToggle();
    initButtonSounds();
});
