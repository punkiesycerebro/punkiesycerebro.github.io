'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('menu');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(isOpen));
  navigation.classList.toggle('open', isOpen);
});
navigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  navigation.querySelector('[aria-current]')?.removeAttribute('aria-current');
  link.setAttribute('aria-current', 'location');
  closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// Native dialog handles keyboard focus and Escape; original photographs stay intact.
const photoDialog = document.getElementById('photo-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogCaption = document.getElementById('dialog-caption');
for (const trigger of document.querySelectorAll('[data-full]')) {
  trigger.addEventListener('click', () => {
    dialogImage.src = trigger.dataset.full;
    dialogImage.alt = trigger.dataset.caption;
    dialogCaption.textContent = trigger.dataset.caption;
    photoDialog.showModal();
  });
}
photoDialog.querySelector('.dialog-close').addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('click', event => {
  if (event.target !== photoDialog) return;
  const box = photoDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) photoDialog.close();
});
