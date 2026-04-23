// Initialize Lucide icons
lucide.createIcons();

// Scroll Reveal Animation using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once the animation is triggered, we can stop observing the element
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all elements with data-reveal attribute
document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
});

// Subtle header parallax or background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(249, 247, 242, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)';
    } else {
        header.style.backgroundColor = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
