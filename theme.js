(() => {
  const STORAGE_KEY = 'sql_spa_tools_theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved === 'light' ? 'light' : 'dark';
  root.dataset.theme = initial;

  const button = document.getElementById('themeToggle');
  if (!button) return;

  const render = () => {
    const isDark = root.dataset.theme !== 'light';
    button.textContent = isDark ? '☀️ 淺色模式' : '🌙 深色模式';
    button.title = isDark ? '切換至淺色模式' : '切換至深色模式';
    button.setAttribute('aria-pressed', String(isDark));
  };

  render();
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
    render();
  });
})();
