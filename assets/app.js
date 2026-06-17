// DYS home page behaviour. Loaded with `defer`, kept external so the page
// can ship a strict Content-Security-Policy (script-src 'self', no inline JS).

// Flip the deferred Google Fonts stylesheet from media="print" to "all"
// (replaces the old inline onload handler, which a strict CSP would block).
(function () {
  var f = document.getElementById('fontcss');
  if (f) { f.media = 'all'; }
})();

// Newsletter: the form posts natively into a hidden iframe (target="mc-target"),
// so the page never navigates away. We just swap in a confirmation message.
(function () {
  var form = document.querySelector('form.signup');
  if (!form) return;
  var done = document.querySelector('.signup-done');
  form.addEventListener('submit', function () {
    // belt-and-suspenders: only confirm if the email field is actually valid
    // (native validation already blocks invalid submits; this guards programmatic ones)
    if (!form.checkValidity()) return;
    // let the native POST reach the hidden iframe, then swap the UI
    setTimeout(function () {
      form.hidden = true;
      if (done) done.hidden = false;
    }, 0);
  });
})();

(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll-reveal (cheap, runs once per element)
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  if (reduce) return;

  // occasional slice-glitch on the mascot — timer only, no per-frame loop
  var m = document.getElementById('mascot');
  function burst() {
    m.classList.add('glitch');
    setTimeout(function () { m.classList.remove('glitch'); }, 260);
    setTimeout(burst, 2600 + Math.random() * 4200);
  }
  setTimeout(burst, 2000);

  // glitch on hover/tap too
  m.addEventListener('pointerenter', function () {
    m.classList.add('glitch');
    setTimeout(function () { m.classList.remove('glitch'); }, 260);
  });

  // ---- desktop-only eye tracking ----
  // Skip on touch / coarse pointers and small screens (perf + pointless on mobile).
  var fine = matchMedia('(pointer:fine)').matches && matchMedia('(min-width:700px)').matches;
  var pupils = document.getElementById('pupils');
  if (fine && pupils) {
    var MAX = 9;               // max px the pupils travel
    var tx = 0, ty = 0, queued = false;
    function apply() {
      queued = false;
      pupils.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
    }
    window.addEventListener('pointermove', function (e) {
      var r = m.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var len = Math.hypot(dx, dy) || 1;
      // normalize direction, scale by how close (closer = less travel feels natural)
      var reach = Math.min(1, len / (r.width));   // 0..1 ramp
      tx = (dx / len) * MAX * reach;
      ty = (dy / len) * MAX * reach;
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    }, { passive: true });
    // recenter when the cursor leaves the window
    window.addEventListener('pointerout', function (e) {
      if (!e.relatedTarget) { tx = ty = 0; if (!queued) { queued = true; requestAnimationFrame(apply); } }
    });
  }
})();
