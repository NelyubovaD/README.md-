
document.addEventListener('DOMContentLoaded', function() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    updateButtonText(theme);
    localStorage.setItem('theme', theme);
  }

  function updateButtonText(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = `<span>${theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>`;
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  function addThemeToggleButton() {
    if (!document.getElementById('theme-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'theme-toggle';
      btn.className = 'theme-toggle-btn';
      btn.setAttribute('aria-label', 'Переключить тему оформления');
      btn.addEventListener('click', toggleTheme);
      document.body.appendChild(btn);
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  addThemeToggleButton();
});