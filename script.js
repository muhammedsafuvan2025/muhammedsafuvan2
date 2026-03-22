// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Cursor spotlight (subtle, premium feel)
let spotlightRaf = null;
function setSpotlight(x, y) {
    document.body.classList.add('spotlight-on');
    const mx = `${(x / window.innerWidth) * 100}%`;
    const my = `${(y / window.innerHeight) * 100}%`;
    document.documentElement.style.setProperty('--mx', mx);
    document.documentElement.style.setProperty('--my', my);
}

window.addEventListener('mousemove', (e) => {
    if (spotlightRaf) return;
    spotlightRaf = requestAnimationFrame(() => {
        setSpotlight(e.clientX, e.clientY);
        spotlightRaf = null;
    });
});

window.addEventListener('mouseleave', () => {
    document.body.classList.remove('spotlight-on');
});

// Cinematic intro (Big Bang)
function initIntro() {
    const intro = document.getElementById('intro');
    if (!intro) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        intro.remove();
        return;
    }

    window.setTimeout(() => {
        intro.classList.add('fade-out');
        window.setTimeout(() => intro.remove(), 800);
    }, 1550);
}

// Command palette (Ctrl+K)
function initCommandPalette() {
    const cmdBtn = document.getElementById('cmdBtn');
    const cmdk = document.getElementById('cmdk');
    const cmdkInput = document.getElementById('cmdkInput');
    const cmdkList = document.getElementById('cmdkList');

    if (!cmdBtn || !cmdk || !cmdkInput || !cmdkList) return;

    const actions = [
        { id: 'resume', label: 'Open Résumé (PDF)', sub: 'assets/Muhammed-Safuvan-resume.pdf', icon: '📄', kbd: 'R', run: () => window.open('assets/Muhammed-Safuvan-resume.pdf', '_blank', 'noopener,noreferrer') },
        { id: 'email', label: 'Email Muhammed', sub: 'muhammedsafuvan1999@gmail.com', icon: '✉️', kbd: 'E', run: () => window.location.href = 'mailto:muhammedsafuvan1999@gmail.com' },
        { id: 'safesurf', label: 'Open Safe Surf website', sub: 'GitHub Pages demo', icon: '🔒', kbd: 'S', run: () => window.open('https://muhammedsafuvan2025.github.io/safeSurfWebsite/#', '_blank', 'noopener,noreferrer') },
        { id: 'home', label: 'Go to Home', sub: 'Hero section', icon: '🏠', kbd: 'H', run: () => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }) },
        { id: 'about', label: 'Go to About', sub: 'Summary & highlights', icon: '👤', kbd: 'A', run: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }) },
        { id: 'skills', label: 'Go to Skills', sub: 'Technical stack', icon: '🧠', kbd: 'K', run: () => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' }) },
        { id: 'experience', label: 'Go to Experience', sub: 'Roles & responsibilities', icon: '🧰', kbd: 'X', run: () => document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }) },
        { id: 'projects', label: 'Go to Projects', sub: 'Featured builds', icon: '🧪', kbd: 'P', run: () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) },
        { id: 'education', label: 'Go to Education', sub: 'Schools & programs', icon: '🎓', kbd: 'D', run: () => document.querySelector('#education')?.scrollIntoView({ behavior: 'smooth' }) },
        { id: 'contact', label: 'Go to Contact', sub: 'Get in touch', icon: '☎️', kbd: 'C', run: () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) },
    ];

    let filtered = [...actions];
    let activeIndex = 0;

    function render() {
        cmdkList.innerHTML = '';
        filtered.forEach((a, idx) => {
            const item = document.createElement('div');
            item.className = `cmdk-item${idx === activeIndex ? ' active' : ''}`;
            item.setAttribute('role', 'option');
            item.dataset.id = a.id;
            item.innerHTML = `
                <div class="left">
                    <div class="cmdk-icon">${a.icon}</div>
                    <div>
                        <div>${a.label}</div>
                        <div class="cmdk-sub">${a.sub}</div>
                    </div>
                </div>
                <div class="cmdk-kbd">${a.kbd}</div>
            `;
            item.addEventListener('click', () => {
                a.run();
                closeCmdk();
            });
            cmdkList.appendChild(item);
        });
    }

    function openCmdk() {
        cmdk.hidden = false;
        document.body.style.overflow = 'hidden';
        cmdkInput.value = '';
        filtered = [...actions];
        activeIndex = 0;
        render();
        setTimeout(() => cmdkInput.focus(), 0);
    }

    function closeCmdk() {
        cmdk.hidden = true;
        document.body.style.overflow = '';
    }

    function toggleCmdk() {
        if (cmdk.hidden) openCmdk();
        else closeCmdk();
    }

    cmdBtn.addEventListener('click', openCmdk);
    cmdk.addEventListener('click', (e) => {
        const t = e.target;
        if (t && t.getAttribute && t.getAttribute('data-cmdk-close') === 'true') {
            closeCmdk();
        }
    });

    cmdkInput.addEventListener('input', () => {
        const q = cmdkInput.value.trim().toLowerCase();
        filtered = actions.filter(a =>
            (a.label + ' ' + a.sub).toLowerCase().includes(q)
        );
        activeIndex = 0;
        render();
    });

    window.addEventListener('keydown', (e) => {
        const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
        if (isCmdK) {
            e.preventDefault();
            toggleCmdk();
            return;
        }
        if (cmdk.hidden) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeCmdk();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, Math.max(filtered.length - 1, 0));
            render();
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            render();
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            const a = filtered[activeIndex];
            if (a) {
                a.run();
                closeCmdk();
            }
            return;
        }

        const key = e.key.toUpperCase();
        const a = actions.find(x => x.kbd === key);
        if (a) {
            e.preventDefault();
            a.run();
            closeCmdk();
        }
    });
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background, scroll progress & scroll-to-top
const navbar = document.querySelector('.navbar');
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
const scrollTopBtn = document.getElementById('scrollTopBtn');
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;

    // Navbar shadow
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    // Scroll progress bar
    if (scrollProgressBar) {
        scrollProgressBar.style.width = `${progress}%`;
    }

    // Scroll-to-top visibility
    if (scrollTopBtn) {
        if (currentScroll > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleScroll);

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.skill-category, .timeline-item, .project-card, .education-card, .contact-item'
    );
    
    animateElements.forEach((el, idx) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${Math.min(idx * 35, 180)}ms, transform 0.6s ease ${Math.min(idx * 35, 180)}ms`;
        observer.observe(el);
    });

    initIntro();
    initCommandPalette();
});

// 3D tilt on hover (projects, skills, education, experience)
function attachTilt(el) {
    if (!el) return;
    el.classList.add('tilt');
    if (!el.querySelector('.tilt-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        el.appendChild(glare);
    }

    const max = 10; // deg
    function onMove(e) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -max;
        const ry = (px - 0.5) * max;

        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
        el.style.setProperty('--gx', `${px * 100}%`);
        el.style.setProperty('--gy', `${py * 100}%`);
    }

    function onLeave() {
        el.style.transform = '';
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card, .skill-category, .education-card, .timeline-content').forEach(attachTilt);
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--accent-primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Form validation (if contact form is added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Copy email to clipboard functionality
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Optional: Add copy to clipboard functionality
        const email = link.getAttribute('href').replace('mailto:', '');
        // You can add a toast notification here if needed
    });
});

// Performance optimization: Lazy load images if any are added
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add focus styles for accessibility
const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
);

focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--accent-primary)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});
