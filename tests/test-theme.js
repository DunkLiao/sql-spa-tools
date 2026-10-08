const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'theme.js'), 'utf8');

function runTheme(saved) {
  const store = new Map(saved == null ? [] : [['sql_spa_tools_theme', saved]]);
  const listeners = {};
  const button = {
    textContent: '',
    title: '',
    attrs: {},
    setAttribute(name, value) { this.attrs[name] = value; },
    addEventListener(name, callback) { listeners[name] = callback; },
  };
  const context = {
    document: {
      documentElement: { dataset: {} },
      getElementById() { return button; },
    },
    localStorage: {
      getItem(key) { return store.get(key) ?? null; },
      setItem(key, value) { store.set(key, value); },
    },
  };
  vm.runInNewContext(source, context);
  return { context, button, click: () => listeners.click() };
}

const first = runTheme(null);
assert.equal(first.context.document.documentElement.dataset.theme, 'dark');
first.click();
assert.equal(first.context.document.documentElement.dataset.theme, 'light');
assert.equal(first.button.textContent, '🌙 深色模式');

const restored = runTheme('light');
assert.equal(restored.context.document.documentElement.dataset.theme, 'light');
restored.click();
assert.equal(restored.context.document.documentElement.dataset.theme, 'dark');
assert.equal(restored.button.textContent, '☀️ 淺色模式');

console.log('Theme behavior passed: default dark, toggle, persistence');
