(function () {
  'use strict';
  var hosts = ['yunhaozheng.top', 'www.yunhaozheng.top', 'zheng-yunhao.github.io'];
  if (hosts.indexOf(location.hostname) === -1) return;
  var choice = new URLSearchParams(location.search).get('analytics'), excluded = false;
  try {
    if (choice === 'off') localStorage.setItem('homepage-analytics-exclude', '1');
    if (choice === 'on') localStorage.removeItem('homepage-analytics-exclude');
    excluded = localStorage.getItem('homepage-analytics-exclude') === '1';
  } catch (error) {}
  if (choice === 'off' || excluded || navigator.webdriver || navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' || navigator.globalPrivacyControl === true || window.__homepageAnalyticsInstalled) return;
  window.__homepageAnalyticsInstalled = true;

  function send(data) {
    try {
      data.event_id = crypto.randomUUID();
      data.path = location.pathname;
      fetch('https://pubs.yunhaozheng.top/public/traffic/', {
        method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true,
        headers: {'Content-Type': 'text/plain;charset=UTF-8'}, body: JSON.stringify(data)
      }).catch(function () {});
    } catch (error) {}
  }
  function record() {
    if (document.visibilityState !== 'visible' || window.__homepageAnalyticsSent) return;
    window.__homepageAnalyticsSent = true;
    var source = '';
    try { if (document.referrer) source = new URL(document.referrer).origin; } catch (error) {}
    send({kind: 'pageview', referrer: source});
  }
  function click(event) {
    if (document.visibilityState !== 'visible' || event.button > 1) return;
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    try {
      var url = new URL(link.href, location.origin);
      if (url.protocol !== 'https:') return;
      var text = (link.textContent || '').trim().toLowerCase(), action = '';
      if (url.hostname === 'pubs.yunhaozheng.top' && /^\/request\/\d+\/$/.test(url.pathname)) action = 'request';
      else if (/^\[?pdf\]?$/.test(text) || /\/public\/files\/\d+\/$/.test(url.pathname)) action = 'pdf';
      else if (/^\[?paper\]?$/.test(text) || /^(dx\.)?doi\.org$/.test(url.hostname)) action = 'paper';
      else if (/^\[?code\]?$/.test(text)) action = 'code';
      else if (/^\[?toolkit\]?$/.test(text) || (hosts.indexOf(url.hostname) !== -1 && url.pathname.indexOf('/toolkit/') === 0)) action = 'toolkit';
      else if (hosts.indexOf(url.hostname) !== -1 && (/^\/cv\/?$/.test(url.pathname) || /\bcv\b/i.test(text))) action = 'cv';
      if (!action) return;
      var paper = '', item = link.closest('li');
      var doi = item && item.querySelector('a[href*="doi.org/"]');
      if (doi) {
        var paperURL = new URL(doi.href);
        if (paperURL.protocol === 'https:' && /^(dx\.)?doi\.org$/.test(paperURL.hostname)) paper = paperURL.origin + paperURL.pathname;
      }
      send({kind: 'click', action: action, target: url.origin + url.pathname, paper: paper});
    } catch (error) {}
  }
  record();
  document.addEventListener('visibilitychange', record);
  document.addEventListener('click', click, true);
  document.addEventListener('auxclick', click, true);
}());
