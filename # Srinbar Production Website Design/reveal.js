/* SRINBAR — quiet scroll-reveal + stat count-up.
   Fade-up 14px over 0.6s ease, once per element. No bounce, no parallax.
   Respects prefers-reduced-motion. Elements opt in via data-reveal /
   data-reveal-delay="ms" / data-countup (on the numeric element). */
(function () {
  if (window.__srinbarReveal) return;
  window.__srinbarReveal = true;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);
      var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
      setTimeout(function () {
        el.style.opacity = "1";
        el.style.transform = "translateY(0px)";
        startCounts(el);
      }, delay);
    });
  }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

  function prime(el) {
    if (el.__revealPrimed) return;
    el.__revealPrimed = true;
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    io.observe(el);
  }

  function startCounts(root) {
    var els = [];
    if (root.matches && root.matches("[data-countup]")) els.push(root);
    if (root.querySelectorAll) els = els.concat(Array.prototype.slice.call(root.querySelectorAll("[data-countup]")));
    els.forEach(function (el) {
      if (el.__counted) return;
      el.__counted = true;
      var text = el.textContent;
      var m = text.match(/([\d,]+)/);
      if (!m) return;
      var target = parseInt(m[1].replace(/,/g, ""), 10);
      if (!isFinite(target)) return;
      var prefix = text.slice(0, m.index);
      var suffix = text.slice(m.index + m[1].length);
      var start = null;
      var dur = 1000;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = text;
      }
      requestAnimationFrame(step);
    });
  }

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches && node.matches("[data-reveal]")) prime(node);
    if (node.querySelectorAll) node.querySelectorAll("[data-reveal]").forEach(prime);
  }

  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, scan);
    });
  });

  function init() {
    scan(document.body);
    mo.observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
