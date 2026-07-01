/* =========================================================
   診断チャート — 5問1問ずつの対話型 + 振り分けロジック
   仕様: wireframe_spec 5章 / implementation_plan 3章
   ========================================================= */
(function () {
  "use strict";

  /* ---- 質問定義 ---- */
  var QUESTIONS = [
    {
      id: "q1",
      title: "今、ホームページはお持ちですか？",
      options: [
        { value: "A", label: "ない（これから初めてつくる）" },
        { value: "B", label: "あるが、古い・スマホ未対応" },
        { value: "C", label: "あるが、もっと魅力的にしたい" }
      ]
    },
    {
      id: "q2",
      title: "ホームページを一番見てほしいのは誰ですか？",
      options: [
        { value: "A", label: "入園・入会を検討している保護者" },
        { value: "B", label: "働きたい・関わりたい求職者" },
        { value: "C", label: "両方" }
      ]
    },
    {
      id: "q3",
      title: "ホームページで一番伝えたいことは何ですか？",
      options: [
        { value: "A", label: "雰囲気や温かさ（写真やイラストで）" },
        { value: "B", label: "教育方針やカリキュラムの内容" },
        { value: "C", label: "アクセスや料金などの実用的な情報" },
        { value: "D", label: "まだ整理できていない（一緒に考えてほしい）" }
      ]
    },
    {
      id: "q4",
      title: "ご予算のイメージに近いのはどちらですか？",
      options: [
        { value: "A", label: "月額費用だけで始めたい（初期費用なし）" },
        { value: "B", label: "しっかり投資して、納得のいくものをつくりたい" }
      ]
    },
    {
      id: "q5",
      title: "ホームページ以外にあったらいいなと思うものは？",
      hint: "複数選んでもOKです",
      multi: true,
      options: [
        { value: "flyer", label: "チラシ・パンフレット" },
        { value: "video", label: "紹介動画・ムービー" },
        { value: "sns", label: "SNS（Instagram等）の運用サポート" },
        { value: "none", label: "特になし（まずはホームページだけ）", exclusive: true }
      ]
    }
  ];

  var OPTION_INFO = {
    flyer: { name: "チラシ・パンフレット制作", price: "30,000円〜" },
    video: { name: "紹介動画・PR動画", price: "98,000円〜（HP同時契約時）" },
    sns:   { name: "SNS運用サポート", price: "月額19,800円・初期0円" }
  };

  /* ---- 状態 ---- */
  var answers = { q1: null, q2: null, q3: null, q4: null, q5: [] };
  var current = 0; // 0..4 = 質問, 5 = 結果
  var stage, fill, label;

  /* ---- 振り分けロジック（仕様 5-4） ---- */
  function decideCourse() {
    var q1 = answers.q1, q3 = answers.q3, q4 = answers.q4;
    var custom =
      q4 === "B" ||
      ((q1 === "B" || q1 === "C") && (q3 === "A" || q3 === "D")) ||
      q3 === "D";
    return custom ? "custom" : "template";
  }

  function buildReason(course) {
    var q1 = answers.q1, q2 = answers.q2, q3 = answers.q3, q4 = answers.q4;
    var parts = [];
    if (course === "template") {
      if (q1 === "A") parts.push("初めてのホームページづくりで");
      if (q4 === "A") parts.push("まずは月額費用だけで始めたいとのこと");
      var head = parts.length ? parts.join("、") + "。" : "気軽にスタートしたいとのこと。";
      return head + "テンプレートを選ぶだけで、最短1週間であなたの園の「顔」が完成します。";
    } else {
      if (q4 === "B") parts.push("しっかり投資して納得のいくものをつくりたい");
      if (q3 === "A") parts.push("雰囲気や温かさを大切に伝えたい");
      if (q3 === "D") parts.push("伝えたいことを一緒に整理したい");
      if (q1 === "B" || q1 === "C") parts.push("今のサイトをより魅力的にしたい");
      var head2 = parts.length ? parts.join("、") + "とのこと。" : "こだわって形にしたいとのこと。";
      var tail = "ヒアリングから丁寧に、世界観をオリジナルデザインで形にします。";
      if (q2 === "B" || q2 === "C") tail += "求職者にも届くよう、採用ページの同梱もおすすめです。";
      return head2 + tail;
    }
  }

  function recommendedOptions() {
    var picks = answers.q5.filter(function (v) { return v !== "none" && OPTION_INFO[v]; });
    return picks.map(function (v) { return OPTION_INFO[v]; });
  }

  /* ---- レンダリング ---- */
  function updateProgress() {
    var step = current >= QUESTIONS.length ? QUESTIONS.length : current + 1;
    fill.style.width = (step / QUESTIONS.length) * 100 + "%";
    label.textContent = current >= QUESTIONS.length ? "完了！" : step + " / " + QUESTIONS.length;
  }

  function renderQuestion() {
    var q = QUESTIONS[current];
    var html = '<div class="diag-q">';
    html += '<h3 class="diag-q__title">' + q.title + "</h3>";
    if (q.hint) html += '<p class="diag-q__hint">' + q.hint + "</p>";
    html += '<div class="diag-q__options">';
    q.options.forEach(function (opt) {
      var selected;
      if (q.multi) selected = answers[q.id].indexOf(opt.value) !== -1;
      else selected = answers[q.id] === opt.value;
      html +=
        '<button class="diag-opt' + (selected ? " is-selected" : "") + '" ' +
        'data-value="' + opt.value + '"' + (opt.exclusive ? ' data-exclusive="1"' : "") + ">" +
        (q.multi ? '<span class="diag-opt__check">' + (selected ? "✓" : "") + "</span>" : "") +
        "<span>" + opt.label + "</span></button>";
    });
    html += "</div>";

    // actions
    html += '<div class="diag-q__actions">';
    if (current > 0) html += '<button class="diag-back" data-back>← 戻る</button>';
    if (q.multi) html += '<button class="btn btn--primary" data-next-result>この内容で結果を見る →</button>';
    html += "</div></div>";

    stage.innerHTML = html;
    bindQuestionEvents(q);
    updateProgress();
  }

  function bindQuestionEvents(q) {
    var opts = stage.querySelectorAll(".diag-opt");
    opts.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var val = btn.getAttribute("data-value");
        if (q.multi) {
          toggleMulti(q, val, btn);
        } else {
          answers[q.id] = val;
          goNext();
        }
      });
    });
    var back = stage.querySelector("[data-back]");
    if (back) back.addEventListener("click", goBack);
    var nextResult = stage.querySelector("[data-next-result]");
    if (nextResult) nextResult.addEventListener("click", function () {
      if (answers.q5.length === 0) answers.q5 = ["none"];
      goNext();
    });
  }

  function toggleMulti(q, val, btn) {
    var arr = answers[q.id];
    var isExclusive = btn.getAttribute("data-exclusive") === "1";
    if (isExclusive) {
      answers[q.id] = arr.indexOf(val) !== -1 ? [] : [val];
    } else {
      // 除外肢が入っていたら外す
      arr = arr.filter(function (v) { return v !== "none"; });
      var i = arr.indexOf(val);
      if (i === -1) arr.push(val); else arr.splice(i, 1);
      answers[q.id] = arr;
    }
    renderQuestion(); // 選択状態を反映
  }

  function goNext() {
    current++;
    if (current >= QUESTIONS.length) renderResult();
    else renderQuestion();
  }

  function goBack() {
    if (current > 0) { current--; renderQuestion(); }
  }

  function renderResult() {
    updateProgress();
    var course = decideCourse();
    var meta = course === "template"
      ? { name: "テンプレートコース", price: ["制作費 <span>無料</span>", "月額 <span>5,500円〜</span>"] }
      : { name: "オーダーメイドコース", price: ["初期 <span>348,000円〜</span>", "月額 <span>14,800円</span>"] };
    var reason = buildReason(course);
    var opts = recommendedOptions();

    var html = '<div class="diag-result">';
    html += '<p class="diag-result__label">DIAGNOSIS RESULT</p>';
    html += '<h3 class="diag-result__head">あなたにおすすめのプラン</h3>';
    html += '<div class="result-card">';
    html += '<p class="result-card__star">★ おすすめ</p>';
    html += '<p class="result-card__name">' + meta.name + "</p>";
    html += '<p class="result-card__price">' + meta.price.map(function (p) { return "<span class='price-cell'>" + p + "</span>"; }).join("") + "</p>";
    html += '<p class="result-card__reason">' + reason + "</p>";
    html += "</div>";

    if (opts.length) {
      html += '<div class="result-opts"><h4>＋ あなたにおすすめのオプション</h4><ul>';
      opts.forEach(function (o) { html += "<li>" + o.name + "（" + o.price + "）</li>"; });
      html += "</ul></div>";
    }

    var cfg = window.KEEPON_CONFIG || {};
    var lineHref = cfg.LINE_URL && cfg.LINE_URL !== "#" ? cfg.LINE_URL : "contact.html";
    html += '<div class="diag-result__actions">';
    html += '<a href="' + lineHref + '" class="btn btn--line btn--lg"><span class="ico-line"></span>LINEで無料相談する</a>';
    html += '<button class="btn btn--ghost btn--lg" data-result-form>フォームで問い合わせ →</button>';
    html += "</div>";
    html += '<button class="diag-result__again" data-restart>↺ もう一度診断する</button>';
    html += "</div>";

    stage.innerHTML = html;

    stage.querySelector("[data-restart]").addEventListener("click", restart);
    var rf = stage.querySelector("[data-result-form]");
    if (rf) rf.addEventListener("click", function () {
      window.KeeponDiag.close();
      if (window.KeeponForm) window.KeeponForm.open();
    });
  }

  function restart() {
    answers = { q1: null, q2: null, q3: null, q4: null, q5: [] };
    current = 0;
    renderQuestion();
  }

  /* ---- 公開API ---- */
  window.KeeponDiag = {
    init: function () {
      stage = document.getElementById("diagStage");
      fill = document.getElementById("diagProgressFill");
      label = document.getElementById("diagProgressLabel");
    },
    start: function () {
      restart();
    }
  };
})();
