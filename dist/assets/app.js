"use strict";
const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
function closeMenu() {
    if (navigation && typeof bootstrap !== 'undefined')
        bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
}
navigation?.addEventListener('show.bs.collapse', () => menu?.setAttribute('aria-label', 'Fechar menu'));
navigation?.addEventListener('hidden.bs.collapse', () => menu?.setAttribute('aria-label', 'Abrir menu'));
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menu.focus();
    }
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
const year = document.querySelector('#year');
if (year)
    year.textContent = String(new Date().getFullYear());
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.benefits article, .class-card, .steps article, .split, .cta, .whatsapp-panel').forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
        element.addEventListener('focusin', () => element.classList.add('is-visible'));
    });
    motion.addEventListener('change', event => {
        if (event.matches) {
            observer.disconnect();
            document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
        }
    });
}
const experienceTrack = document.querySelector('.experience-track');
const previousExperience = document.querySelector('[data-slide="previous"]');
const nextExperience = document.querySelector('[data-slide="next"]');
function updateExperienceArrows() {
    if (!experienceTrack)
        return;
    if (previousExperience)
        previousExperience.disabled = experienceTrack.scrollLeft <= 2;
    if (nextExperience)
        nextExperience.disabled = experienceTrack.scrollLeft >= experienceTrack.scrollWidth - experienceTrack.clientWidth - 2;
}
function moveExperience(direction) {
    if (!experienceTrack)
        return;
    const card = experienceTrack.querySelector('.experience-card');
    const gap = parseFloat(getComputedStyle(experienceTrack).columnGap) || 0;
    experienceTrack.scrollBy({ left: direction * ((card?.offsetWidth || experienceTrack.clientWidth) + gap), behavior: motion.matches ? 'instant' : 'smooth' });
}
previousExperience?.addEventListener('click', () => moveExperience(-1));
nextExperience?.addEventListener('click', () => moveExperience(1));
experienceTrack?.addEventListener('scroll', updateExperienceArrows, { passive: true });
experienceTrack?.addEventListener('keydown', event => {
    if (event.target !== experienceTrack)
        return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveExperience(event.key === 'ArrowRight' ? 1 : -1);
    }
});
window.addEventListener('resize', updateExperienceArrows);
updateExperienceArrows();
