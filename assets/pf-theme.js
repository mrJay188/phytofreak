(function () {
  'use strict';

  function formatMoney(cents) {
    if (window.Shopify && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents);
    }
    return '$' + (cents / 100).toFixed(2);
  }

  function initMobileNav() {
    var btn = document.getElementById('menu-btn');
    var nav = document.getElementById('main-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var hidden = nav.classList.toggle('hidden');
      nav.classList.toggle('flex', !hidden);
      btn.setAttribute('aria-expanded', String(!hidden));
    });
  }

  function initProductGallery() {
    var mainImg = document.getElementById('pd-main-img');
    if (!mainImg) return;
    document.querySelectorAll('.pd-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pd-thumb').forEach(function (t) {
          t.classList.remove('active');
        });
        btn.classList.add('active');
        if (mainImg && btn.dataset.src) mainImg.src = btn.dataset.src;
        if (mainImg && btn.dataset.srcset) mainImg.srcset = btn.dataset.srcset;
      });
    });
  }

  function initProductTabs() {
    document.querySelectorAll('.pd-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.dataset.tab;
        document.querySelectorAll('.pd-tab').forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.pd-tab-panel').forEach(function (p) {
          p.classList.remove('active');
          p.hidden = true;
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        var panel = document.getElementById('tab-' + id);
        if (panel) {
          panel.classList.add('active');
          panel.hidden = false;
        }
      });
    });
  }

  function initPromoTimer() {
    var h = document.getElementById('t-h');
    var m = document.getElementById('t-m');
    var s = document.getElementById('t-s');
    if (!h || !m || !s) return;
    var total = parseInt(h.textContent, 10) * 3600 + parseInt(m.textContent, 10) * 60 + parseInt(s.textContent, 10);
    setInterval(function () {
      total = Math.max(0, total - 1);
      h.textContent = String(Math.floor(total / 3600)).padStart(2, '0');
      m.textContent = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
      s.textContent = String(total % 60).padStart(2, '0');
    }, 1000);
  }

  function initProductQty() {
    var qty = 1;
    var qtyVal = document.getElementById('qty-val');
    var qtyInput = document.getElementById('qty-input') || document.querySelector('input[name="quantity"]');
    var minus = document.getElementById('qty-minus');
    var plus = document.getElementById('qty-plus');
    if (!qtyVal) return;
    function setQty(n) {
      qty = Math.max(1, n);
      qtyVal.textContent = String(qty);
      if (qtyInput) qtyInput.value = String(qty);
    }
    if (minus) minus.addEventListener('click', function () { setQty(qty - 1); });
    if (plus) plus.addEventListener('click', function () { setQty(qty + 1); });
  }

  function initVariantPicker() {
    var select = document.getElementById('pd-size');
    var variantsJson = document.getElementById('pf-variants-json');
    var priceEl = document.getElementById('pd-price-value');
    var addBtn = document.getElementById('pd-add-cart');
    var buyBtn = document.querySelector('.pd-buy-now');
    if (!select || !variantsJson) return;

    var variants = [];
    try {
      variants = JSON.parse(variantsJson.textContent);
    } catch (e) {
      return;
    }

    function updateVariant(variantId) {
      var variant = variants.find(function (v) { return String(v.id) === String(variantId); });
      if (!variant) return;
      if (priceEl) priceEl.textContent = formatMoney(variant.price);
      document.querySelectorAll('.pd-radio-price').forEach(function (el) {
        el.textContent = formatMoney(variant.price);
      });
      var disabled = !variant.available;
      if (addBtn) addBtn.disabled = disabled;
      if (buyBtn) buyBtn.disabled = disabled;
    }

    select.addEventListener('change', function () {
      updateVariant(select.value);
    });
    updateVariant(select.value);
  }

  function initProductForm() {
    var form = document.getElementById('product-form');
    if (!form || !window.routes) return;

    form.addEventListener('submit', function (e) {
      var submitter = e.submitter;
      if (!submitter || !submitter.classList.contains('pd-add-cart')) return;

      e.preventDefault();
      var formData = new FormData(form);
      var addBtn = document.getElementById('pd-add-cart');
      if (addBtn) {
        addBtn.disabled = true;
        addBtn.textContent = 'ADDING...';
      }

      fetch(window.routes.cart_add_url + '.js', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Add to cart failed');
          return res.json();
        })
        .then(function () {
          window.location.href = window.routes.cart_url;
        })
        .catch(function () {
          form.submit();
        })
        .finally(function () {
          if (addBtn) {
            addBtn.disabled = false;
            addBtn.textContent = 'ADD TO CART';
          }
        });
    });
  }

  function initBuyNow() {
    document.querySelectorAll('.pd-buy-now').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var form = btn.closest('form');
        if (!form) return;
        if (!form.querySelector('input[name="return_to"]')) {
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'return_to';
          input.value = '/checkout';
          form.appendChild(input);
        }
      });
    });
  }

  function initAll() {
    initMobileNav();
    initProductGallery();
    initProductTabs();
    initPromoTimer();
    initProductQty();
    initVariantPicker();
    initProductForm();
    initBuyNow();
  }

  document.addEventListener('DOMContentLoaded', initAll);
  document.addEventListener('shopify:section:load', initAll);
})();
