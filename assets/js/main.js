/* =========================================================
   キープオン — サイト全体のインタラクション
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initNav();
    initReveal();
    initDiagnosis();
    initForm();
    initSmoothAnchors();
  });

  /* ---- ヘッダー固定時の背景切替（スクロール50pxで発動） ---- */
  function initHeader() {
    var header = document.getElementById("header");
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- ハンバーガーメニュー（SP） ---- */
  function initNav() {
    var burger = document.getElementById("hamburger");
    var nav = document.getElementById("nav");
    if (!burger || !nav) return;
    var toggle = function (open) {
      burger.classList.toggle("is-open", open);
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      toggle(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") toggle(false);
    });
  }

  /* ---- スクロール連動フェードイン ---- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- 診断チャート モーダル制御 ---- */
  function initDiagnosis() {
    var modal = document.getElementById("diagModal");
    if (!modal) return;
    window.KeeponDiag.init();

    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      window.KeeponDiag.start();
      var closeBtn = modal.querySelector("[data-close-diagnosis]");
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    window.KeeponDiag.close = close;

    document.querySelectorAll("[data-open-diagnosis]").forEach(function (b) {
      b.addEventListener("click", open);
    });
    modal.querySelectorAll("[data-close-diagnosis]").forEach(function (b) {
      b.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) close();
    });
  }

  /* ---- 問い合わせフォーム（モーダル＋ページ内フォーム共通） ---- */
  function initForm() {
    // すべての .cform を送信処理に接続
    document.querySelectorAll("form.cform").forEach(function (form) {
      var done = form.parentElement.querySelector(".cform__done");
      wireSubmit(form, done);
    });

    // モーダルの開閉
    var modal = document.getElementById("formModal");
    if (modal) {
      var form = document.getElementById("contactForm");
      var done = document.getElementById("formDone");
      var lastFocus = null;
      var open = function () {
        lastFocus = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        if (form) { form.hidden = false; form.reset(); }
        if (done) done.hidden = true;
        var first = modal.querySelector("input");
        if (first) first.focus();
      };
      var close = function () {
        modal.hidden = true;
        document.body.style.overflow = "";
        if (lastFocus) lastFocus.focus();
      };
      window.KeeponForm = { open: open, close: close };
      document.querySelectorAll("[data-open-form]").forEach(function (b) { b.addEventListener("click", open); });
      modal.querySelectorAll("[data-close-form]").forEach(function (b) { b.addEventListener("click", close); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });
    }
  }

  function wireSubmit(form, done) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;

      var cfg = window.KEEPON_CONFIG || {};
      var endpoint = cfg.FORM_ENDPOINT;
      var submitBtn = form.querySelector('button[type="submit"]');
      var showDone = function () { form.hidden = true; if (done) done.hidden = false; };

      // 送信先未設定 → デモ動作（完了表示のみ）
      if (!endpoint) { showDone(); return; }

      // 送信先設定済み → 実送信（Formspree 互換）
      submitBtn.disabled = true;
      submitBtn.textContent = "送信中…";
      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (res) {
        if (res.ok) { showDone(); } else { throw new Error("送信に失敗しました"); }
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "送信する";
        alert("送信に失敗しました。お手数ですが、LINEまたはお電話でお問い合わせください。");
      });
    });
  }

  function validate(form) {
    var ok = true;
    ["name", "email", "message"].forEach(function (n) {
      var field = form.querySelector('[name="' + n + '"]');
      var wrap = field.closest(".cform__field");
      var valid = field.value.trim() !== "" &&
        (n !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
      wrap.classList.toggle("invalid", !valid);
      if (!valid && ok) { field.focus(); ok = false; }
    });
    return ok;
  }

  /* ---- ページ内アンカーのヘッダー分オフセット ---- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }
})();
