const Router = (() => {
  const routes = {};
  let currentRoute = null;

  function register(hash, showFn, hideFn) {
    routes[hash] = { show: showFn, hide: hideFn };
  }

  function navigate() {
    const hash = window.location.hash || '#';
    const route = hash === '#admin' ? '#admin' : '#';

    if (route !== currentRoute) {
      if (currentRoute && routes[currentRoute]) {
        routes[currentRoute].hide();
      }
      if (routes[route]) {
        routes[route].show();
      }
      currentRoute = route;
    }

    // Dispatch ideas routing within the public site
    window.dispatchEvent(new CustomEvent('routechange', { detail: { hash } }));
  }

  function init() {
    window.addEventListener('hashchange', navigate);
    navigate();
  }

  return { register, init, navigate };
})();
