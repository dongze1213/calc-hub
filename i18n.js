// CalcHub i18n - Multi-Language Switcher
(function() {
  var STORAGE_KEY = 'calchub-lang';
  var LANGS = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'zh', label: '中文', short: '中' },
    { code: 'ja', label: '日本語', short: '日' },
    { code: 'ko', label: '한국어', short: '한' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'pt', label: 'Português', short: 'PT' },
    { code: 'fr', label: 'Français', short: 'FR' },
  ];

  function detectLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGS.some(function(l) { return l.code === saved; })) return saved;
    var bl = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (bl.startsWith('zh')) return 'zh';
    if (bl.startsWith('ja')) return 'ja';
    if (bl.startsWith('ko')) return 'ko';
    if (bl.startsWith('es')) return 'es';
    if (bl.startsWith('pt')) return 'pt';
    if (bl.startsWith('fr')) return 'fr';
    return 'en';
  }

  var originals = {};
  function saveOriginals() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (!originals[key]) originals[key] = el.textContent;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (!originals[key]) originals[key] = el.getAttribute('placeholder');
    });
  }

  function getPageId() {
    var path = window.location.pathname;
    if (window.I18N_PAGE_ID) return window.I18N_PAGE_ID;
    if (path.indexOf('/tools/') >= 0) {
      var m = path.match(/\/tools\/(.+?)\.html/);
      if (m) return m[1];
    }
    if (path.indexOf('privacy') >= 0) return '_privacy';
    return '_home';
  }

  function applyTranslations(lang) {
    var dict;
    if (window.I18N_ALL && window.I18N_GET) {
      var pageId = getPageId();
      dict = window.I18N_GET(pageId, lang);
    } else {
      dict = {};
    }

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'en') {
        if (originals[key]) el.textContent = originals[key];
      } else {
        var text = dict[key];
        if (text) el.textContent = text;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (lang === 'en') {
        if (originals[key]) el.setAttribute('placeholder', originals[key]);
      } else {
        var text = dict[key];
        if (text) el.setAttribute('placeholder', text);
      }
    });

    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    updateSelector(lang);
  }

  function updateSelector(lang) {
    var sel = document.getElementById('langSelect');
    if (!sel) return;
    sel.value = lang;
  }

  function buildSelector(currentLang) {
    var existing = document.getElementById('langSelect');
    if (existing) return;

    var sel = document.createElement('select');
    sel.id = 'langSelect';
    sel.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;font-weight:600;padding:4px 8px;cursor:pointer;margin-left:8px;outline:none;';
    LANGS.forEach(function(l) {
      var opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = l.short + ' ' + l.label;
      if (l.code === currentLang) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function() {
      applyTranslations(this.value);
    });

    var nav = document.querySelector('.nav');
    if (nav) nav.appendChild(sel);
  }

  function init() {
    saveOriginals();
    var lang = detectLang();
    buildSelector(lang);
    applyTranslations(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
