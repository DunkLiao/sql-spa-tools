(() => {
  const STORAGE_KEY = 'sql_spa_tools_theme';
  const THEME_EVENT = 'sql-spa-tools-theme-change';
  const root = document.documentElement;
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved === 'dark' ? 'dark' : 'light';
  root.dataset.theme = initial;

  const render = () => {
    const button = document.getElementById('themeToggle');
    if (!button) return;
    const isDark = root.dataset.theme === 'dark';
    button.textContent = isDark ? '☀️ 淺色模式' : '🌙 深色模式';
    button.title = isDark ? '切換至淺色模式' : '切換至深色模式';
    button.setAttribute('aria-pressed', String(isDark));
  };

  const apply = theme => {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    render();
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme: next } }));
  };
  const setTheme = theme => {
    const next = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
    return next;
  };

  render();
  document.addEventListener('click', event => {
    if (!event.target?.closest?.('#themeToggle')) return;
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    apply(event.newValue);
  });
  window.SQLSpaToolsTheme = Object.freeze({
    getTheme: () => root.dataset.theme === 'dark' ? 'dark' : 'light',
    setTheme,
  });
})();
