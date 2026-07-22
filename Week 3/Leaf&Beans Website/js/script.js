/* =========================================================
   LEAF & BEANS — script.js
   Handles: mobile nav, lazy-loaded images (performance),
   menu tabs, gallery filtering, accessible form validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Performance: IntersectionObserver lazy loading ----------
     Images use data-src instead of src. The real file is only requested
     once the element is within 150px of the viewport (see Q1 answer,
     technique 1), so a first visit downloads only the images actually seen.
  */
  var lazyImages = document.querySelectorAll('img.lazy-img[data-src]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          img.addEventListener('load', function () { img.classList.add('loaded'); });
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '150px 0px' });
    lazyImages.forEach(function (img) { io.observe(img); });
  } else {
    lazyImages.forEach(function (img) {
      img.src = img.getAttribute('data-src');
      img.classList.add('loaded');
    });
  }

  /* ---------- Menu tabs (Services page) ---------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });
  }

  /* ---------- Gallery filtering (Portfolio page) ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterButtons.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.hidden = !match;
        });
      });
    });
  }

  /* ---------- Accessible form validation (Contact page) ---------- */
  var form = document.getElementById('reserve-form');
  if (form) {
    var fields = form.querySelectorAll('input[required], textarea[required]');

    function validateField(field) {
      field.setAttribute('data-touched', 'true');
      var errorEl = document.getElementById(field.id + '-error');
      var valid = field.checkValidity();
      if (errorEl) {
        errorEl.classList.toggle('show', !valid);
        field.setAttribute('aria-invalid', String(!valid));
      }
      return valid;
    }

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('data-touched') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (field) { if (!validateField(field)) allValid = false; });

      var status = document.getElementById('form-status');
      if (allValid) {
        status.textContent = "Thanks — we've noted your table request. (Static demo form; no data is transmitted.)";
        status.className = 'form-status show success';
        status.setAttribute('role', 'status');
        form.reset();
        fields.forEach(function (f) { f.removeAttribute('data-touched'); });
      } else {
        status.textContent = 'Please check the highlighted fields before submitting.';
        status.className = 'form-status show';
        status.setAttribute('role', 'alert');
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
