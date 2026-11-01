// Only remove the form-filler marker reported in the hydration trace, until React mounts.
export const extensionHydrationGuard = `(() => {
  const attribute = 'fdprocessedid';
  const selector = ['button', 'input', 'select', 'textarea']
    .map(tag => tag + '[' + attribute + ']').join(',');
  const clean = root => {
    if (root.nodeType === 1 && root.matches(selector)) root.removeAttribute(attribute);
    if (root.querySelectorAll) root.querySelectorAll(selector).forEach(node => node.removeAttribute(attribute));
  };
  clean(document);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') clean(record.target);
      else record.addedNodes.forEach(clean);
    }
  });
  observer.observe(document.documentElement, {
    subtree: true, childList: true, attributes: true, attributeFilter: [attribute]
  });
  const stop = () => {
    observer.disconnect();
    window.removeEventListener('tb:hydrated', stop);
    window.clearTimeout(timeout);
  };
  window.addEventListener('tb:hydrated', stop, {once: true});
  const timeout = window.setTimeout(stop, 10000);
})();`;
