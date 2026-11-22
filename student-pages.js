
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const toast = document.getElementById('toast');
const notificationButton = document.getElementById('notificationButton');

function showPageToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showPageToast.timer);
  showPageToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
}

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}
if (notificationButton) {
  notificationButton.addEventListener('click', () => {
    showPageToast('You are all caught up. No new notifications.');
  });
}

/* Resource rows are intentionally clickable but do not navigate to another page. */
document.querySelectorAll('[data-resource-item]').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    item.classList.add('is-clicked');
    setTimeout(() => item.classList.remove('is-clicked'), 180);
    const label = item.textContent.trim().replace(/\s+/g, ' ');
    showPageToast(`${label} selected. No separate resource page is connected yet.`);
  });
});

/* Both search fields filter the resource cards on this page without scrolling. */
const searchFields = [
  document.getElementById('globalSearch'),
  document.getElementById('pageSearch')
].filter(Boolean);

function filterResources(query) {
  const normalized = query.trim().toLowerCase();
  const cards = [...document.querySelectorAll('.page-resource-card')];
  let visibleCount = 0;
  cards.forEach((card) => {
    let cardHasMatch = !normalized || card.textContent.toLowerCase().includes(normalized);
    card.querySelectorAll('[data-resource-item]').forEach((item) => {
      const match = !normalized || item.textContent.toLowerCase().includes(normalized);
      item.hidden = !match;
    });
    card.hidden = !cardHasMatch;
    if (cardHasMatch) visibleCount++;
  });
  if (document.getElementById('pageSearch')) {
    const status = document.querySelector('.resource-toolbar p');
    if (status) {
      status.textContent = normalized
        ? `${visibleCount} matching resource ${visibleCount === 1 ? 'category' : 'categories'}`
        : `${document.querySelectorAll('.page-resource-card').length} resource categories`;
    }
  }
}
searchFields.forEach((field) => {
  field.addEventListener('input', () => {
    const query = field.value;
    searchFields.forEach((other) => { if (other !== field) other.value = query; });
    filterResources(query);
  });
});

/* Keep the active sidebar item visually selected on this page. */
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => sidebar?.classList.remove('open'));
});
