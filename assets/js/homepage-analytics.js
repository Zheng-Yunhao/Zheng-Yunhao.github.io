(function () {
  'use strict';
  var allowedHosts = ['yunhaozheng.top', 'www.yunhaozheng.top', 'zheng-yunhao.github.io'];
  if (allowedHosts.indexOf(location.hostname) === -1 || navigator.webdriver ||
      navigator.doNotTrack === '1' || window.doNotTrack === '1' ||
      navigator.globalPrivacyControl === true ||
      new URLSearchParams(location.search).get('analytics') === 'off') return;

  function record() {
    if (document.visibilityState !== 'visible' || window.__homepageAnalyticsSent) return;
    window.__homepageAnalyticsSent = true;
    var id, source = '';
    try {
      id = crypto.randomUUID();
      if (document.referrer) source = new URL(document.referrer).origin;
    } catch (error) { return; }
    fetch('https://pubs.yunhaozheng.top/public/traffic/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      keepalive: true,
      headers: {'Content-Type': 'text/plain;charset=UTF-8'},
      body: JSON.stringify({event_id: id, path: location.pathname, referrer: source})
    }).catch(function () {});
  }

  record();
  document.addEventListener('visibilitychange', record);
}());
