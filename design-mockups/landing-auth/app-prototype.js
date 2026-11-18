/* Skillar Mobile — Learner App Interactive Prototype Controller */

(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ── Screen registry ── */
  const SCREENS = [
    { group: "Core Experience", id: "dashboard",      label: "Learner Dashboard" },
    { group: "Core Experience", id: "explore",        label: "Explore Roadmaps" },
    { group: "Core Experience", id: "learning",       label: "My Learning" },
    { group: "Core Experience", id: "journeys",       label: "Learning Journeys" },
    { group: "Core Experience", id: "profile",        label: "Profile & Settings" },
    { group: "Deep Learning",   id: "roadmap-detail", label: "Roadmap Details" },
    { group: "Deep Learning",   id: "step-content",   label: "Step Lesson & Quiz" },
    { group: "Deep Learning",   id: "journey-detail", label: "Journey Cohort Detail" },
  ];

  const VARIANT_NAMES = ["playful", "warm", "minimal", "neo-brutalist"];

  const device    = $("#device");
  const fitEl     = $("#fit");
  const canvas    = $("#canvas");
  const compareEl = $("#compare");
  const toastEl   = $("#toast");

  let current = "dashboard";
  let variant = "playful"; // Default initial variant to "playful"
  let mode    = "phone";   // phone | desktop | compare
  let toastTimer = null;

  /* ── Rail index ── */
  function buildRail() {
    const list = $("#screen-list");
    list.innerHTML = "";
    let lastGroup = null;
    let n = 0;
    SCREENS.forEach(function (s) {
      if (s.group !== lastGroup) {
        lastGroup = s.group;
        const g = document.createElement("li");
        g.className = "grp";
        g.textContent = s.group;
        list.appendChild(g);
      }
      n += 1;
      const li = document.createElement("li");
      const b  = document.createElement("button");
      b.type = "button";
      b.dataset.goto = s.id;
      b.innerHTML = '<span class="idx">' + String(n).padStart(2, "0") + "</span><span>" + s.label + "</span>";
      li.appendChild(b);
      list.appendChild(li);
    });
    $("#screen-count").textContent = String(SCREENS.length);
  }

  /* ── Navigation ── */
  function goto(id) {
    const next = document.querySelector('.screen[data-screen="' + id + '"]');
    if (!next) return;

    current = id;
    $$(".screen").forEach(function (s) { s.classList.remove("is-active"); });
    next.classList.add("is-active");
    next.dataset.variant = variant;
    VARIANT_NAMES.forEach(function (name) { next.classList.remove("variant-" + name); });
    next.classList.add("variant-" + variant);

    // Sync rail buttons
    $$("#screen-list button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.goto === id);
    });

    // Sync bottom tab bars in all screens
    $$(".tab-item, .nav-tab, .bottom-tab, .dash-tab, .profile-nav-tab, .journeys-nav-tab, .learn-nav-tab, .explore-nav-tab").forEach(function (tab) {
      const tabTarget = tab.dataset.goto;
      tab.classList.toggle("is-active", tabTarget === id || tab.classList.contains("tab-" + id));
    });

    const item = SCREENS.find(function (s) { return s.id === id; });
    if (item) {
      $("#stage-title").textContent = item.label;
    }

    try { localStorage.setItem("skillar.learner.screen", id); } catch (e) {}

    if (mode === "compare") renderCompare();
  }

  /* ── Visual variant ── */
  function setVariant(v) {
    variant = v;
    document.documentElement.dataset.variant = v;
    if (document.body) document.body.dataset.variant = v;

    VARIANT_NAMES.forEach(function (name) {
      document.documentElement.classList.remove("variant-" + name);
      if (document.body) document.body.classList.remove("variant-" + name);
    });
    document.documentElement.classList.add("variant-" + v);
    if (document.body) document.body.classList.add("variant-" + v);

    if (device) {
      device.dataset.variant = v;
      VARIANT_NAMES.forEach(function (name) { device.classList.remove("variant-" + name); });
      device.classList.add("variant-" + v);
    }

    const vp = $("#viewport");
    if (vp) {
      vp.dataset.variant = v;
      VARIANT_NAMES.forEach(function (name) { vp.classList.remove("variant-" + name); });
      vp.classList.add("variant-" + v);
    }

    const activeScreen = document.querySelector('.screen[data-screen="' + current + '"]');
    if (activeScreen) {
      activeScreen.dataset.variant = v;
      VARIANT_NAMES.forEach(function (name) { activeScreen.classList.remove("variant-" + name); });
      activeScreen.classList.add("variant-" + v);
    }

    $$(".variant").forEach(function (b) {
      b.classList.toggle("active", b.dataset.variant === v);
    });

    $$(".cmp-frame").forEach(function (f) {
      f.classList.toggle("focused", f.dataset.variant === v);
    });

    if (mode === "compare") renderCompare();
    try { localStorage.setItem("skillar.learner.variant", v); } catch (e) {}
  }

  /* ── View mode ── */
  function setMode(m) {
    mode = m;
    $$(".seg button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.mode === m);
    });

    const isCompare = m === "compare";
    if (isCompare) {
      fitEl.style.display = "none";
      compareEl.classList.add("on");
      const hint = $("#mode-hint");
      if (hint) hint.textContent = "Compare: all 4 variants side by side · click a frame to activate that variant";
      renderCompare();
    } else {
      compareEl.classList.remove("on");
      fitEl.style.display = "";
      device.className = "device mode-" + m + " variant-" + variant;
      const hint = $("#mode-hint");
      if (hint) hint.textContent = "Compare shows all four variants at once · click a variant for the full clickthrough";
      fit();
    }
    try { localStorage.setItem("skillar.learner.mode", m); } catch (e) {}
  }

  /* ── Compare view: renders all 4 frames with explicit variant classes and data-variant ── */
  function renderCompare() {
    const active = document.querySelector('.screen[data-screen="' + current + '"]');
    if (!active) return;

    $$(".cmp-frame").forEach(function (frame) {
      const v = frame.dataset.variant || "playful";

      // 1. Apply variant class and data-variant attribute directly to .cmp-frame
      frame.dataset.variant = v;
      VARIANT_NAMES.forEach(function (name) { frame.classList.remove("variant-" + name); });
      frame.classList.add("variant-" + v);
      frame.classList.toggle("focused", v === variant);

      const stage = frame.querySelector(".cmp-stage");
      if (!stage) return;
      stage.innerHTML = "";

      // Device shell for compare preview
      const dev = document.createElement("div");
      dev.className = "device mode-phone variant-" + v;
      dev.dataset.variant = v;

      // Status bar
      const sb = document.createElement("div");
      sb.className = "statusbar";
      sb.setAttribute("aria-hidden", "true");
      sb.innerHTML = '<span class="sb-time">9:41</span><span class="sb-icons"><svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg><svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 9.6 9.7 7.3a3.1 3.1 0 0 0-4.4 0L7.5 9.6Zm0-4.4c1.7 0 3.3.6 4.5 1.8l1.4-1.4a8.4 8.4 0 0 0-11.8 0l1.4 1.4a6.3 6.3 0 0 1 4.5-1.8Z"/></svg><svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="20" height="11" rx="3.2" fill="none" stroke="currentColor" stroke-opacity=".45"/><rect x="2" y="2" width="15" height="8" rx="2"/><path d="M22.5 4v4a2.2 2.2 0 0 0 0-4Z" fill-opacity=".45"/></svg></span>';
      dev.appendChild(sb);

      // Viewport with variant attributes
      const vp = document.createElement("div");
      vp.className = "viewport variant-" + v;
      vp.dataset.variant = v;

      // 2. Clone active screen and apply variant class and data-variant attribute directly to cloned .screen
      const clone = active.cloneNode(true);
      clone.removeAttribute("id");
      $$("[id]", clone).forEach(function (el) { el.removeAttribute("id"); });
      clone.classList.add("is-active");
      VARIANT_NAMES.forEach(function (name) { clone.classList.remove("variant-" + name); });
      clone.classList.add("variant-" + v);
      clone.dataset.variant = v;

      vp.appendChild(clone);
      dev.appendChild(vp);
      stage.appendChild(dev);
    });

    layoutCompare();
  }

  function layoutCompare() {
    const frames = $$(".cmp-frame");
    if (!frames.length || mode !== "compare") return;
    const firstStage = frames[0].querySelector(".cmp-stage");
    const frameW = (firstStage && firstStage.clientWidth) || 300;
    const availH = Math.max(320, (canvas.clientHeight || 800) - 130);
    const scale = Math.max(0.2, Math.min((frameW - 6) / 390, availH / 844));
    frames.forEach(function (f) {
      const st = f.querySelector(".cmp-stage");
      if (!st) return;
      const dev = st.querySelector(".device");
      if (!dev) return;
      dev.style.transform = "scale(" + scale + ")";
      st.style.width = (390 * scale) + "px";
      st.style.height = (844 * scale) + "px";
      st.style.margin = "0 auto";
    });
  }

  /* ── Auto fit to stage ── */
  function fit() {
    if (mode === "compare") {
      layoutCompare();
      return;
    }
    const w = mode === "desktop" ? 1180 : 390;
    const h = mode === "desktop" ? 760  : 844;
    const pad = 36;
    const cw = canvas.clientWidth  - pad * 2;
    const ch = canvas.clientHeight - pad * 2;
    if (cw <= 0 || ch <= 0) return;
    const scale = Math.min(1, cw / w, ch / h);
    device.style.transform = "scale(" + scale + ")";
    fitEl.style.width  = (w * scale) + "px";
    fitEl.style.height = (h * scale) + "px";
  }

  /* ── Toast notification ── */
  function toast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  /* ── Event delegation ── */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-goto]");
    if (btn) {
      e.preventDefault();
      goto(btn.dataset.goto);
      return;
    }

    const varBtn = e.target.closest(".variant");
    if (varBtn) {
      setVariant(varBtn.dataset.variant);
      return;
    }

    const modeBtn = e.target.closest(".seg button");
    if (modeBtn) {
      setMode(modeBtn.dataset.mode);
      return;
    }

    // Clicking a compare frame header/outer area selects that variant
    const cmpFrame = e.target.closest(".cmp-frame");
    if (cmpFrame && mode === "compare" && !e.target.closest(".screen")) {
      const v = cmpFrame.dataset.variant;
      if (v) {
        setVariant(v);
        toast("Switched to " + v.replace("-", " ") + " variant");
      }
      return;
    }

    // Knowledge check quiz option click
    const quizOpt = e.target.closest(".quiz-option, .quiz-choice, .option-card");
    if (quizOpt) {
      const parent = quizOpt.closest(".quiz-options, .quiz-card");
      if (parent) {
        parent.querySelectorAll(".quiz-option, .quiz-choice, .option-card").forEach(o => o.classList.remove("is-selected"));
      }
      quizOpt.classList.add("is-selected");
      if (quizOpt.dataset.correct === "true" || quizOpt.classList.contains("correct")) {
        toast("✓ Correct! +15 XP awarded");
      } else {
        toast("Incorrect. Review the lesson concept and try again.");
      }
      return;
    }

    // Bookmark toggle
    const bmBtn = e.target.closest(".bookmark-btn, .action-bookmark, .card-bookmark");
    if (bmBtn) {
      bmBtn.classList.toggle("is-bookmarked");
      toast(bmBtn.classList.contains("is-bookmarked") ? "Saved to your bookmarks" : "Removed from bookmarks");
      return;
    }

    // Generic mock button click with feedback
    const mock = e.target.closest("[data-mock]");
    if (mock) {
      toast(mock.dataset.mock);
      return;
    }
  });

  /* ── Search filtering in Explore ── */
  document.addEventListener("input", function (e) {
    if (e.target.matches(".search-input, .explore-search input")) {
      const q = e.target.value.toLowerCase().trim();
      $$(".explore-card, .roadmap-card").forEach(function (card) {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? "" : "none";
      });
    }
  });

  /* ── Boot ── */
  buildRail();
  $("#prev").addEventListener("click", function () {
    const ids = SCREENS.map(s => s.id);
    let i = (ids.indexOf(current) - 1 + ids.length) % ids.length;
    goto(ids[i]);
  });
  $("#next").addEventListener("click", function () {
    const ids = SCREENS.map(s => s.id);
    let i = (ids.indexOf(current) + 1) % ids.length;
    goto(ids[i]);
  });
  window.addEventListener("resize", fit);

  let savedVariant = "playful", savedScreen = "dashboard", savedMode = "phone";
  try {
    savedVariant = localStorage.getItem("skillar.learner.variant") || "playful";
    savedScreen  = localStorage.getItem("skillar.learner.screen") || "dashboard";
    savedMode    = localStorage.getItem("skillar.learner.mode") || "phone";
  } catch (e) {}

  setVariant(savedVariant);
  setMode(savedMode);
  goto(savedScreen);
  requestAnimationFrame(fit);
  setTimeout(fit, 300);
})();
