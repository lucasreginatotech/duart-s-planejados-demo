'use strict';
// Canal comercial publicado no diretório Solutudo; fontes documentadas no README.
const WHATSAPP_NUMBER = '5515981218533';
const WHATSAPP_MESSAGE = 'Olá! Conheci a Duart S Planejados pelo site e gostaria de conversar sobre um projeto de móveis planejados.';
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
});
const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  if (event.key === 'Tab' && menuButton.getAttribute('aria-expanded') === 'true') {
    const last = navigation.querySelector('a:last-child');
    if (event.shiftKey && document.activeElement === menuButton) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); menuButton.focus(); }
  }
});
const desktopQuery = matchMedia('(min-width:1000px)');
desktopQuery.addEventListener('change', () => setMenu(false));
let scrollScheduled = false;
function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 60); scrollScheduled = false; }
window.addEventListener('scroll', () => { if (!scrollScheduled) { requestAnimationFrame(updateHeader); scrollScheduled = true; } }, {passive:true});
updateHeader();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.body.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
const projects = Array.from(document.querySelectorAll('.project'));
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  projects.forEach(project => { project.hidden = category !== 'all' && project.dataset.category !== category; });
  document.querySelector('.gallery-grid').classList.toggle('is-filtered', category !== 'all');
}));
const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
let currentIndex = 0;
let opener;
function renderProject(index) {
  currentIndex = (index + projects.length) % projects.length;
  const project = projects[currentIndex];
  const image = project.querySelector('img');
  dialogImage.src = image.getAttribute('src');
  dialogImage.alt = image.alt;
  document.querySelector('#lightbox-title').textContent = project.dataset.title;
  dialog.querySelector('.lightbox-description').textContent = project.dataset.description;
  dialog.querySelector('.lightbox-count').textContent = `${String(currentIndex + 1).padStart(2, '0')} / 05`;
}
projects.forEach((project, index) => project.addEventListener('click', () => {
  opener = project;
  renderProject(index);
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.lightbox-prev').addEventListener('click', () => renderProject(currentIndex - 1));
dialog.querySelector('.lightbox-next').addEventListener('click', () => renderProject(currentIndex + 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); renderProject(currentIndex + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); renderProject(currentIndex - 1); }
});
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (opener) opener.focus(); });