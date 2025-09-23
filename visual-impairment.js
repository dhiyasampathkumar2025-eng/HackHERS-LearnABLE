// visual-impairment.js - Class selection logic for LearnAble
// Backend can inject available_classes and URLs if needed

const classButtons = [
  { label: 'Class 1', url: 'visual-class1.html' },
  { label: 'Class 2', url: 'visual-class2.html' },
  { label: 'Class 3', url: 'visual-class3.html' },
  { label: 'Class 4', url: 'visual-class4.html' },
  { label: 'Class 5', url: 'visual-class5.html' }
];

function createClassCards() {
  const grid = document.querySelector('.vi-class-grid');
  classButtons.forEach(btn => {
    const card = document.createElement('div');
    card.className = 'vi-class-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', btn.label);
    card.textContent = btn.label;
    card.addEventListener('click', () => {
      // Placeholder: redirect or call backend
      console.log('Selected:', btn.label);
      window.location.href = btn.url;
      // Or: fetch(`/api/class/${btn.label}`)
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', createClassCards);
