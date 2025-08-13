// --- Hero Typing Effect ---
const subHeadlines = [
    "Aspiring IT Support Specialist",
    "Database Administrator",
    "Tech Enthusiast"
];
let headlineIndex = 0;
let subIndex = 0;
let isDeleting = false;
let timeoutId;

function typeEffect() {
    const currentText = subHeadlines[headlineIndex];
    const targetElement = document.getElementById('hero-headline');
    if (!targetElement) return;

    if (isDeleting) {
        targetElement.textContent = currentText.substring(0, subIndex - 1);
        subIndex--;
        if (subIndex === 0) {
            isDeleting = false;
            headlineIndex = (headlineIndex + 1) % subHeadlines.length;
            timeoutId = setTimeout(typeEffect, 500);
        } else {
            timeoutId = setTimeout(typeEffect, 100);
        }
    } else {
        targetElement.textContent = currentText.substring(0, subIndex + 1);
        subIndex++;
        if (subIndex === currentText.length) {
            isDeleting = true;
            timeoutId = setTimeout(typeEffect, 2000);
        } else {
            timeoutId = setTimeout(typeEffect, 150);
        }
    }
}

export function startTypingEffect() {
    if (timeoutId) clearTimeout(timeoutId);
    typeEffect();
}


// --- Scroll Animations ---
export function initializeScrollAnimations() {
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: '0px 0px -100px 0px',
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });
}
