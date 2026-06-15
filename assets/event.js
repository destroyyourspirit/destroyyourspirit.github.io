// DYS event page behaviour. External (defer) so the page can ship a strict
// Content-Security-Policy (script-src 'self', no inline JS).

// Flip the deferred Google Fonts stylesheet from media="print" to "all".
(function () {
  var f = document.getElementById('fontcss');
  if (f) { f.media = 'all'; }
})();

(function () {
  // one-shot scroll reveal — cheap, no idle loop (matches app.js)
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
