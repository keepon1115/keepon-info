/* =========================================================
   共通レイアウト — ヘッダー / フッター / モーダル / フローティングCTA
   各ページの <body data-page=".." data-title=".." data-eyebrow=".."> を読んで
   ヘッダー・パンくず・ページ見出しを自動生成します。
   ========================================================= */
(function () {
  "use strict";

  var cfg = window.KEEPON_CONFIG || { LINE_URL: "#", FORM_ENDPOINT: "" };
  var lineHref = cfg.LINE_URL && cfg.LINE_URL !== "#" ? cfg.LINE_URL : "contact.html";
  var lineAttr = cfg.LINE_URL && cfg.LINE_URL !== "#" ? ' target="_blank" rel="noopener"' : "";

  var page = document.body.getAttribute("data-page") || "home";
  var title = document.body.getAttribute("data-title") || "";
  var eyebrow = document.body.getAttribute("data-eyebrow") || "";

  /* ナビ項目（順序は仕様準拠） */
  var NAV = [
    { id: "service", href: "service.html", label: "サービス・料金" },
    { id: "flow", href: "flow.html", label: "制作の流れ" },
    { id: "template", href: "template.html", label: "テンプレート" },
    { id: "works", href: "works.html", label: "制作事例" },
    { id: "about", href: "about.html", label: "会社概要" },
    { id: "contact", href: "contact.html", label: "お問い合わせ" }
  ];

  var LOGO_SVG =
    '<svg viewBox="0 0 40 40" width="36" height="36"><circle cx="20" cy="20" r="18" fill="#F2683F"/>' +
    '<path d="M13 21c2.5 3 5 4.5 7 4.5s4.5-1.5 7-4.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
    '<circle cx="14.5" cy="15" r="2.2" fill="#fff"/><circle cx="25.5" cy="15" r="2.2" fill="#fff"/></svg>';

  /* ---- ヘッダー ---- */
  function buildHeader() {
    var navItems = NAV.map(function (n) {
      var active = n.id === page ? ' class="is-active"' : "";
      return '<a href="' + n.href + '"' + active + ">" + n.label + "</a>";
    }).join("");

    return (
      '<header class="header" id="header"><div class="header__inner">' +
      '<a href="index.html" class="logo" aria-label="キープオン ホームへ">' +
      '<span class="logo__mark" aria-hidden="true">' + LOGO_SVG + "</span>" +
      '<span class="logo__text">キープオン<small>HP制作</small></span></a>' +
      '<nav class="nav" id="nav" aria-label="メインナビゲーション">' + navItems + "</nav>" +
      '<a href="' + lineHref + '"' + lineAttr + ' class="btn btn--line header__cta">' +
      '<span class="ico-line" aria-hidden="true"></span>LINEで相談する</a>' +
      '<button class="hamburger" id="hamburger" aria-label="メニューを開く" aria-expanded="false" aria-controls="nav">' +
      "<span></span><span></span><span></span></button>" +
      "</div></header>"
    );
  }

  /* ---- パンくず＋ページ見出し（下層のみ） ---- */
  function buildPageHead() {
    if (page === "home" || !title) return "";
    var crumb = '<nav class="breadcrumb" aria-label="パンくずリスト"><a href="index.html">ホーム</a><span>›</span><span aria-current="page">' + title + "</span></nav>";
    return (
      '<section class="page-head"><div class="container">' + crumb +
      (eyebrow ? '<p class="page-head__eyebrow">' + eyebrow + "</p>" : "") +
      '<h1 class="page-head__title">' + title + "</h1>" +
      "</div></section>"
    );
  }

  /* ---- フッター ---- */
  function buildFooter() {
    return (
      '<footer class="footer"><div class="container footer__inner">' +
      '<div class="footer__brand"><span class="logo logo--footer">' +
      '<span class="logo__mark">' + LOGO_SVG + "</span>" +
      '<span class="logo__text">キープオン<small>HP制作</small></span></span>' +
      '<p class="footer__tagline">子どもに関わるすべての場所に、ちゃんとした"顔"を。</p></div>' +
      '<nav class="footer__nav" aria-label="フッターナビゲーション">' +
      '<div><h4>メニュー</h4><a href="service.html">サービス・料金</a><a href="flow.html">制作の流れ</a><a href="template.html">テンプレート</a><a href="works.html">制作事例</a></div>' +
      '<div><h4>会社情報</h4><a href="about.html">会社概要</a><a href="faq.html">よくある質問</a><a href="contact.html">お問い合わせ</a>' +
      '<span class="footer__addr">〒581-0075<br>大阪府八尾市渋川町5-5-33</span></div>' +
      '<div><h4>関連サイト</h4><a href="#">キープオンショップ</a><a href="#">キープオンSTEAMスクール</a></div>' +
      "</nav></div>" +
      '<p class="footer__copy">© keepon. All Rights Reserved.</p></footer>'
    );
  }

  /* ---- フローティングCTA（SP） ---- */
  function buildFloating() {
    return '<a href="' + lineHref + '"' + lineAttr + ' class="floating-cta" aria-label="LINEで相談する"><span class="ico-line" aria-hidden="true"></span>LINEで相談する</a>';
  }

  /* ---- 診断モーダル ---- */
  function buildDiagModal() {
    return (
      '<div class="diag-modal" id="diagModal" role="dialog" aria-modal="true" aria-labelledby="diagHeading" hidden>' +
      '<div class="diag-modal__overlay" data-close-diagnosis></div>' +
      '<div class="diag-modal__panel"><button class="diag-modal__close" data-close-diagnosis aria-label="診断を閉じる">×</button>' +
      '<div class="diag-progress"><div class="diag-progress__bar"><span id="diagProgressFill"></span></div>' +
      '<span class="diag-progress__label" id="diagProgressLabel">1 / 5</span></div>' +
      '<h2 id="diagHeading" class="sr-only">あなたにぴったりのプラン診断</h2>' +
      '<div class="diag-stage" id="diagStage" aria-live="polite"></div></div></div>'
    );
  }

  /* ---- フォームモーダル ---- */
  function buildFormModal() {
    return (
      '<div class="form-modal" id="formModal" role="dialog" aria-modal="true" aria-labelledby="formHeading" hidden>' +
      '<div class="form-modal__overlay" data-close-form></div>' +
      '<div class="form-modal__panel"><button class="form-modal__close" data-close-form aria-label="閉じる">×</button>' +
      '<h2 id="formHeading" class="form-modal__title">フォームでお問い合わせ</h2>' +
      '<p class="form-modal__lead">必須は3項目だけ。お気軽にどうぞ。</p>' +
      '<form class="cform" id="contactForm" novalidate>' +
      '<label class="cform__field"><span>お名前 <em>必須</em></span><input type="text" name="name" required autocomplete="name" /></label>' +
      '<label class="cform__field"><span>施設名 <small>任意</small></span><input type="text" name="org" autocomplete="organization" /></label>' +
      '<label class="cform__field"><span>メールアドレス <em>必須</em></span><input type="email" name="email" required autocomplete="email" /></label>' +
      '<label class="cform__field"><span>電話番号 <small>任意</small></span><input type="tel" name="tel" autocomplete="tel" /></label>' +
      '<fieldset class="cform__field"><legend>興味のあるコース</legend>' +
      '<label class="cform__check"><input type="checkbox" name="course" value="template" /> テンプレートコース</label>' +
      '<label class="cform__check"><input type="checkbox" name="course" value="custom" /> オーダーメイドコース</label>' +
      '<label class="cform__check"><input type="checkbox" name="course" value="undecided" /> まだ決めていない</label></fieldset>' +
      '<label class="cform__field"><span>ご相談内容 <em>必須</em></span><textarea name="message" rows="4" required></textarea></label>' +
      '<button type="submit" class="btn btn--primary btn--block btn--lg">送信する</button>' +
      '<p class="cform__note">「しつこい営業は一切しません。」2営業日以内にお返事します。</p></form>' +
      '<div class="cform__done" id="formDone" hidden><span class="cform__done-ico">🎉</span>' +
      '<h3>送信ありがとうございます！</h3><p>2営業日以内にお返事します。<br>しつこい営業は一切しませんのでご安心ください。</p></div>' +
      "</div></div>"
    );
  }

  /* ---- 注入 ---- */
  document.body.insertAdjacentHTML("afterbegin", buildHeader());
  var main = document.querySelector("main");
  var headHtml = buildPageHead();
  if (main && headHtml) main.insertAdjacentHTML("afterbegin", headHtml);
  document.body.insertAdjacentHTML("beforeend",
    buildFooter() + buildFloating() + buildDiagModal() + buildFormModal());

  /* LINEボタン（ページ本文中に data-line-btn を置けば自動で href 設定） */
  document.querySelectorAll("[data-line-btn]").forEach(function (a) {
    a.setAttribute("href", lineHref);
    if (lineAttr) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
  });
})();
