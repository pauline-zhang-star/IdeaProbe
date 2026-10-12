(() => {
  document.addEventListener('click', event => {
    const link = event.target.closest?.('[data-language]');
    if (link) try { localStorage.setItem('ideaprobe-site-language', link.dataset.language); } catch {}
  });
  if (!document.currentScript?.dataset.autoLanguage) return;
  let saved;
  try { saved = localStorage.getItem('ideaprobe-site-language'); } catch {}
  const primary = navigator.languages?.[0] || navigator.language || 'en';
  const language = ['en', 'zh'].includes(saved) ? saved : primary.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  location.replace(new URL(language + '/', location.href).href);
})();
