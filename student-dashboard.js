const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeAnnouncement = document.getElementById('closeAnnouncement');
const announcement = document.getElementById('announcement');
const notificationButton = document.getElementById('notificationButton');
const globalSearch = document.getElementById('globalSearch');
const toast = document.getElementById('toast');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

if (closeAnnouncement && announcement) {
  closeAnnouncement.addEventListener('click', () => announcement.remove());
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

if (notificationButton) {
  notificationButton.addEventListener('click', () => {
    showToast('You are all caught up. No new notifications.');
  });
}

/* Dashboard cards and resource items remain clickable, but do not navigate
   or scroll to another section. */
document.querySelectorAll('[data-dashboard-action], [data-message]').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    item.classList.add('is-clicked');
    window.setTimeout(() => item.classList.remove('is-clicked'), 220);
    const message = item.dataset.message || 'This item is available in the student intranet. No separate page is connected yet.';
    showToast(message);
  });
});

/* Search provides feedback without moving the page. */
if (globalSearch) {
  globalSearch.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const query = globalSearch.value.trim().toLowerCase();
    if (!query) {
      showToast('Enter a keyword to search the student portal.');
      return;
    }
    const searchableItems = [...document.querySelectorAll(
      '.resource-card, .quick-card, .notice-item, .programme-column a, .programme-column button'
    )];
    const match = searchableItems.find((item) => item.textContent.toLowerCase().includes(query));
    if (match) {
      match.classList.add('search-highlight');
      window.setTimeout(() => match.classList.remove('search-highlight'), 1500);
      showToast('A matching item is available on this page.');
    } else {
      showToast('No matching items found. Try another keyword.');
    }
  });
}

/* Sidebar menu is the only in-page navigation. */
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    sidebar?.classList.remove('open');
  });
});

const dateElement = document.getElementById('todayDate');
if (dateElement) {
  dateElement.textContent = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date());
}
