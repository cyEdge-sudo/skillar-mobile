/* Skillar post-login mockups — Dashboard + navigation
   Vanilla JS, no dependencies. Refresh-friendly: state resets on reload. */
(function () {
  "use strict";

  var state = {
    variant: "minimal",   // minimal | warm
    mode: "phone",        // phone | desktop | compare
    homeState: "populated", // populated | empty
    screen: "dashboard"   // dashboard | explore | roadmap | step | learning | profile
  };

  var viewport = document.getElementById("viewport");
  var device = document.getElementById("device");
  var fit = document.getElementById("fit");
  var compare = document.getElementById("compare");
  var fitLabel = document.getElementById("fit-label");
  var stageTitle = document.getElementById("stage-title");
  var stageNote = document.getElementById("stage-note");
  var toast = document.getElementById("toast");
  var announce = document.getElementById("announce");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Screen registry: rail label, template id, and the heading to focus. */
  var SCREENS = {
    dashboard: { title: "Dashboard · Home", tpl: "tpl-dashboard", focus: ".greet-title" },
    explore:   { title: "Explore · Roadmaps", tpl: "tpl-explore", focus: ".screen-title" },
    roadmap:   { title: "Roadmap · Detail", tpl: "tpl-roadmap", focus: ".screen-title" },
    step:      { title: "Learning · Step", tpl: "tpl-step", focus: ".screen-title" },
    learning:  { title: "My learning", tpl: "tpl-learning", focus: ".screen-title" },
    profile:   { title: "Profile", tpl: "tpl-profile", focus: ".screen-title" }
  };

  /* Logical device size — must match --dev-w / --dev-h in styles.css */
  var DEV_W = 372;
  var DEV_H = 806;
  var DEV_SCREEN_W = DEV_W - 20; /* bezel padding */

  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-on");
    }, 3200);
  }

  function say(msg) {
    announce.textContent = "";
    // slight delay so repeated identical messages are re-announced
    setTimeout(function () { announce.textContent = msg; }, 40);
  }

  function templateId() {
    if (state.screen === "dashboard") {
      return state.homeState === "empty" ? "tpl-dashboard-empty" : "tpl-dashboard";
    }
    return SCREENS[state.screen].tpl;
  }

  function buildApp() {
    var tpl = document.getElementById(templateId());
    if (!tpl) return null;
    var node = tpl.content.firstElementChild.cloneNode(true);
    node.setAttribute("data-variant", state.variant);
    wireApp(node);
    return node;
  }

  /* ── Navigation ─────────────────────────────────────────── */
  function go(screen, opts) {
    opts = opts || {};
    if (!SCREENS[screen]) return;
    if (screen === state.screen && !opts.force) {
      say("Already on " + SCREENS[screen].title + ".");
      return;
    }
    state.screen = screen;
    render(true);
  }

  /* The rail ships placeholder spans until each screen lands. Upgrade
     them in place so the rail is usable without touching index.html. */
  var RAIL_KEYS = [
    ["explore", "explore"],
    ["roadmap", "roadmap"],
    ["learning step", "step"],
    ["step", "step"],
    ["my learning", "learning"],
    ["profile", "profile"]
  ];

  function upgradeRail() {
    var list = document.getElementById("screen-list");
    if (!list) return;
    list.querySelectorAll(".screen-soon").forEach(function (span) {
      var text = (span.textContent || "").toLowerCase();
      var key = null;
      for (var i = 0; i < RAIL_KEYS.length; i++) {
        if (text.indexOf(RAIL_KEYS[i][0]) !== -1) { key = RAIL_KEYS[i][1]; break; }
      }
      if (!key) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "screen-btn";
      btn.setAttribute("data-screen", key);
      btn.textContent = (span.textContent || "").replace(/\s*—\s*next pass\s*$/i, "");
      span.replaceWith(btn);
    });
  }

  /* Fallback routing for CTAs that still carry only a data-demo stub.
     Explicit data-nav / data-screen always wins; this keeps the
     Dashboard usable until the designer adds those attributes. */
  var CTA_ROUTES = {
    "continue": "step",
    "next step": "step",
    "roadmap details": "roadmap",
    "roadmap detail": "roadmap",
    "see all": "learning",
    "explore": "explore",
    "explore roadmaps": "explore",
    "learn": "learning",
    "my learning": "learning",
    "profile": "profile",
    "review": "roadmap",
    "resume": "step",
    "start": "roadmap"
  };

  function routeFor(btn) {
    var label = (btn.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    return CTA_ROUTES[label] || null;
  }

  /* Wire interactive controls inside a rendered app node.
     Delegation-free per-node so clones stay self-contained. */
  function wireApp(root) {
    root.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button");
      if (!btn || !root.contains(btn)) return;

      if (btn.hasAttribute("data-demo")) {
        var dest = routeFor(btn);
        if (dest) {
          ev.preventDefault();
          go(dest);
          return;
        }
        ev.preventDefault();
        showToast(btn.getAttribute("data-demo"));
        return;
      }
      if (btn.hasAttribute("data-nav")) {
        ev.preventDefault();
        go(btn.getAttribute("data-nav"));
        return;
      }
      if (btn.hasAttribute("data-screen")) {
        ev.preventDefault();
        go(btn.getAttribute("data-screen"));
        return;
      }
      if (btn.hasAttribute("data-toast")) {
        ev.preventDefault();
        showToast(btn.getAttribute("data-toast"));
        return;
      }
    });
  }

  /* ── Fit ─────────────────────────────────────────────────────
     Compare panels hold one fixed logical device (DEV_W × DEV_H).
     Scale it uniformly so the whole phone — bezel, corners and
     all — fits the panel, instead of squeezing a wide rendering
     into a phone-shaped hole. */
  function fitCompare() {
    if (state.mode !== "compare") return;
    var frames = compare.querySelectorAll(".cmp-frame");
    for (var i = 0; i < frames.length; i++) {
      var frame = frames[i];
      var scaleEl = frame.querySelector(".cmp-scale");
      if (!scaleEl) continue;
      var pad = 12;
      var w = frame.clientWidth - pad * 2;
      var h = frame.clientHeight - pad * 2;
      if (w <= 0 || h <= 0) continue;
      var s = Math.min(w / DEV_W, h / DEV_H);
      if (s > 1) s = 1;
      if (s < 0.2) s = 0.2;
      scaleEl.style.setProperty("--s", s.toFixed(4));
    }
  }

  /* Report the real rendered screen size so reviewers can see the
     preview is sitting at a genuine phone width. */
  function updateFitLabel() {
    var vp = viewport.getBoundingClientRect();
    if (state.mode === "compare") {
      fitLabel.textContent = "Compare · " + DEV_SCREEN_W + " × " + (DEV_H - 20) +
        " layout each · scaled to fit";
      return;
    }
    if (state.mode === "desktop") {
      fitLabel.textContent = "Desktop · responsive app shell";
      return;
    }
    if (vp.width < 2) {
      fitLabel.textContent = "Phone · " + DEV_SCREEN_W + " × " + (DEV_H - 20);
      return;
    }
    fitLabel.textContent = "Phone · " + Math.round(vp.width) + " × " +
      Math.round(vp.height) + " screen";
  }

  /* ── Render ─────────────────────────────────────────────── */
  function render(focusScreen) {
    document.documentElement.setAttribute("data-variant", state.variant);

    // Primary (single) view
    var primary = buildApp();
    if (primary) {
      viewport.replaceChildren(primary);
    } else {
      // Template not shipped yet — keep the stage honest, never blank.
      viewport.replaceChildren(missingScreenNotice());
    }

    // Compare clones: rendered but inert + hidden from AT (not duplicate live content)
    if (state.mode === "compare") {
      compare.querySelectorAll(".cmp-viewport").forEach(function (slot) {
        var v = slot.getAttribute("data-slot");
        var prev = state.variant;
        state.variant = v;
        var node = buildApp();
        state.variant = prev;
        if (!node) {
          slot.replaceChildren();
          return;
        }
        node.setAttribute("inert", "");
        node.setAttribute("aria-hidden", "true");
        // strip ids so clones don't duplicate the live DOM ids
        node.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
        node.querySelectorAll("[aria-labelledby]").forEach(function (el) {
          el.removeAttribute("aria-labelledby");
        });
        slot.replaceChildren(node);
      });
    }

    // Mode visibility
    var isCompare = state.mode === "compare";
    fit.classList.toggle("is-hidden", isCompare);
    compare.classList.toggle("is-hidden", !isCompare);
    compare.hidden = !isCompare;

    device.classList.toggle("is-desktop", state.mode === "desktop");

    // Stage chrome
    stageTitle.textContent = SCREENS[state.screen].title +
      (state.screen === "dashboard" && state.homeState === "empty" ? " · zero assigned" : "");
    stageNote.textContent = isCompare
      ? "Both variants render at a true " + DEV_SCREEN_W + " × " + (DEV_H - 20) +
        " phone width, then scale as whole devices to fit. Clones are visual-only — click a phone to open its full preview."
      : "Variant: " + (state.variant === "warm" ? "Warm modern" : "Minimal neutral") +
        " · Mode: " + state.mode +
        " · Every “Prototype: …” control shows its intended behaviour in the toast.";

    // Sync control pressed-states
    document.querySelectorAll(".variant").forEach(function (b) {
      var on = b.getAttribute("data-variant") === state.variant;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    document.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      var on = b.getAttribute("data-mode") === state.mode;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    document.querySelectorAll(".seg [data-state]").forEach(function (b) {
      var on = b.getAttribute("data-state") === state.homeState;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    document.querySelectorAll(".screen-btn").forEach(function (b) {
      var on = b.getAttribute("data-screen") === state.screen;
      b.classList.toggle("is-on", on);
      if (on) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });

    if (focusScreen) {
      var h = viewport.querySelector(SCREENS[state.screen].focus) ||
              viewport.querySelector("h2, h1, .screen-title");
      if (h) {
        if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
        h.focus({ preventScroll: true });
      }
      say(stageTitle.textContent + " rendered.");
    }

    // Size previews to the stage — compare needs an explicit scale pass.
    // Layout may not be final on the same tick (fonts/first paint), so re-fit
    // on the next frame instead of trusting a single synchronous measure.
    scheduleFit();
    updateFitLabel();
  }

  var fitRaf = 0;
  function scheduleFit() {
    if (fitRaf) return;
    fitRaf = window.requestAnimationFrame(function () {
      fitRaf = 0;
      fitCompare();
      updateFitLabel();
    });
  }

  function ensureFitObserver() {
    if (typeof ResizeObserver === "undefined") return;
    if (ensureFitObserver.done) return;
    ensureFitObserver.done = true;
    var ro = new ResizeObserver(function () { scheduleFit(); });
    ro.observe(compare);
    compare.querySelectorAll(".cmp-frame").forEach(function (f) { ro.observe(f); });
  }

  function missingScreenNotice() {
    var wrap = document.createElement("div");
    wrap.className = "app";
    wrap.setAttribute("data-screen", state.screen);
    var body = document.createElement("div");
    body.className = "app-body";
    var h = document.createElement("h2");
    h.className = "screen-title";
    h.setAttribute("tabindex", "-1");
    h.textContent = SCREENS[state.screen].title;
    var p = document.createElement("p");
    p.className = "empty-inline";
    p.textContent = "This screen is still being designed. Dashboard remains available.";
    var back = document.createElement("button");
    back.type = "button";
    back.className = "btn btn-primary";
    back.setAttribute("data-nav", "dashboard");
    back.textContent = "Back to Dashboard";
    body.appendChild(h);
    body.appendChild(p);
    body.appendChild(back);
    wrap.appendChild(body);
    wireApp(wrap);
    return wrap;
  }

  /* ── Rail / stage controls ──────────────────────────────── */
  document.querySelector(".variants").addEventListener("click", function (ev) {
    var btn = ev.target.closest(".variant");
    if (!btn) return;
    var v = btn.getAttribute("data-variant");
    if (v === state.variant) return;
    state.variant = v;
    render(false);
    say("Variant: " + (v === "warm" ? "Warm modern" : "Minimal neutral"));
  });

  document.querySelector(".seg[aria-label='Preview mode']").addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-mode]");
    if (!btn) return;
    state.mode = btn.getAttribute("data-mode");
    render(false);
    say("Preview mode: " + state.mode);
  });

  document.querySelector(".seg[aria-label='Dashboard state']").addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-state]");
    if (!btn) return;
    state.homeState = btn.getAttribute("data-state");
    state.screen = "dashboard";
    render(true);
    say(state.homeState === "empty" ? "Dashboard: zero assigned state." : "Dashboard: populated state.");
  });

  // Screen rail → open that screen template
  var screenList = document.getElementById("screen-list");
  if (screenList) {
    screenList.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-screen]");
      if (!btn) return;
      go(btn.getAttribute("data-screen"));
    });
  }

  // Compare panel → open full preview of that variant
  compare.addEventListener("click", function (ev) {
    var hit = ev.target.closest("[data-open-variant]");
    if (!hit) return;
    state.variant = hit.getAttribute("data-open-variant");
    state.mode = "phone";
    render(true);
    say("Opened full preview: " + (state.variant === "warm" ? "Warm modern" : "Minimal neutral"));
  });

  // Keyboard: 1/2 switch variant, P/D/C modes — only when not typing in a field
  document.addEventListener("keydown", function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    var t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    var k = ev.key.toLowerCase();
    if (k === "1") { state.variant = "minimal"; render(false); say("Variant: Minimal neutral"); }
    else if (k === "2") { state.variant = "warm"; render(false); say("Variant: Warm modern"); }
    else if (k === "p") { state.mode = "phone"; render(false); say("Mode: phone"); }
    else if (k === "d") { state.mode = "desktop"; render(false); say("Mode: desktop"); }
    else if (k === "c") { state.mode = "compare"; render(false); say("Mode: compare"); }
  });

  if (reduceMotion) {
    document.documentElement.style.setProperty("scroll-behavior", "auto");
  }

  /* Reviewer deep-links, so a URL can open a specific view:
     ?mode=phone|desktop|compare · ?variant=minimal|warm · ?state=populated|empty
     ?screen=dashboard|explore|roadmap|step|learning|profile */
  (function readQuery() {
    var q;
    try { q = new URLSearchParams(window.location.search); } catch (e) { return; }
    var m = q.get("mode");
    if (m === "phone" || m === "desktop" || m === "compare") state.mode = m;
    var v = q.get("variant");
    if (v === "minimal" || v === "warm") state.variant = v;
    var s = q.get("state");
    if (s === "populated" || s === "empty") state.homeState = s;
    var sc = q.get("screen");
    if (sc && SCREENS[sc]) state.screen = sc;
  })();

  /* Keep previews fitted when the stage changes size. */
  var rafId = 0;
  window.addEventListener("resize", function () {
    if (rafId) return;
    rafId = window.requestAnimationFrame(function () {
      rafId = 0;
      scheduleFit();
    });
  });
  window.addEventListener("load", scheduleFit);
  ensureFitObserver();

  // Initial paint
  upgradeRail();
  render(false);
  window.__postLoginReady = true;

  if (location.hash === "#measure") {
    var samples = [];
    var take = function () {
      var out = [];
      var f = document.querySelector(".cmp-frame");
      var sc = document.querySelector(".cmp-scale");
      var ph = document.querySelector(".device");
      var bev = document.querySelector(".device .bezel");
      var vpw = document.getElementById("viewport");
      var r = function (e) { return e ? Math.round(e.getBoundingClientRect().width) + "x" + Math.round(e.getBoundingClientRect().height) : "n/a"; };
      out.push("t=" + Date.now() % 100000);
      out.push("mode=" + state.mode);
      out.push("device=" + r(ph) + " bezel=" + r(bev) + " viewport=" + r(vpw));
      out.push("frame=" + r(f) + " scaleBox=" + r(sc) + " s=" + (sc ? sc.style.getPropertyValue("--s") : "-"));
      samples.push(out.join(" | "));
      if (samples.length > 6) samples.shift();
      var p = document.getElementById("measure-out");
      if (!p) {
        p = document.createElement("pre");
        p.id = "measure-out";
        p.style.cssText = "position:fixed;left:8px;top:8px;z-index:9999;background:#000;color:#0f0;font-size:13px;padding:6px;margin:0;max-width:90vw;";
        document.body.appendChild(p);
      }
      p.textContent = samples.join("\n");
    };
    take();
    var n = 0;
    var iv = setInterval(function () { take(); if (++n > 8) clearInterval(iv); }, 400);
  }
})();
