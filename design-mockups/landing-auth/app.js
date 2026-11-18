/* Skillar welcome & auth mockups — prototype interactions.
   Mock only: no network, no backend, no exact API contract asserted. */

(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ── Screen registry (drives the rail index) ── */
  const SCREENS = [
    { group: "Start",          id: "landing",  label: "Welcome screen" },
    { group: "Sign in",        id: "login",    label: "Login" },
    { group: "Recovery paths", id: "verify",   label: "Email verification (OTP)" },
    { group: "Recovery paths", id: "verified", label: "Verification success" },
    { group: "Recovery paths", id: "forgot",   label: "Forgot password" },
    { group: "Recovery paths", id: "sent",     label: "Reset email sent" },
    { group: "Recovery paths", id: "reset",    label: "Set new password" },
    { group: "Recovery paths", id: "done",     label: "Password updated" },
  ];

  const device    = $("#device");
  const fitEl     = $("#fit");
  const canvas    = $("#canvas");
  const compareEl = $("#compare");
  const toastEl   = $("#toast");

  let current = "landing";
  let variant = "warm";
  let mode    = "phone"; // phone | desktop | compare
  let toastTimer = null;

  /* ── Rail index ── */
  function buildRail() {
    const list = $("#screen-list");
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

    $$(".screen").forEach(function (s) { s.classList.remove("is-active"); });
    next.classList.add("is-active");
    current = id;

    restartAnims(next);

    const page = $(".page", next);
    if (page) page.scrollTop = 0;

    $$("#screen-list button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.goto === id);
    });

    const meta = SCREENS.filter(function (s) { return s.id === id; })[0];
    $("#stage-title").textContent = meta ? meta.label : id;

    if (id === "verify") startResend();
    if (id === "reset") resetStrength();

    if (mode === "compare") renderCompare();

    try { localStorage.setItem("skillar.mock.screen", id); } catch (e) {}
  }

  function restartAnims(screen) {
    $$(".anim", screen).forEach(function (el, i) {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
      el.style.animationDelay = (i * 65) + "ms";
    });
  }

  /* ── Variant ── */
  function setVariant(v) {
    variant = v;
    document.documentElement.dataset.variant = v;
    $$(".variant").forEach(function (b) {
      b.classList.toggle("active", b.dataset.variant === v);
    });
    $$(".cmp-frame").forEach(function (f) {
      f.classList.toggle("focused", f.dataset.variant === v);
    });
    if (mode === "compare") renderCompare();
    try { localStorage.setItem("skillar.mock.variant", v); } catch (e) {}
  }

  /* ── Viewport mode: phone / desktop / compare ── */
  function setMode(m) {
    mode = m;
    device.classList.toggle("mode-phone", m !== "desktop");
    device.classList.toggle("mode-desktop", m === "desktop");
    $$(".seg button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.mode === m);
    });

    const comparing = m === "compare";
    compareEl.classList.toggle("on", comparing);
    fitEl.classList.toggle("hidden", comparing);

    $("#mode-hint").textContent = comparing
      ? "Compare: same screen in all three variants · pick a variant for the full clickthrough"
      : "Click the buttons inside the preview to walk the real flow";

    if (comparing) {
      renderCompare();
    } else {
      requestAnimationFrame(fit);
    }
    try { localStorage.setItem("skillar.mock.mode", m); } catch (e) {}
  }

  function stripIds(root) {
    if (root.id) root.removeAttribute("id");
    $$("[id]", root).forEach(function (el) { el.removeAttribute("id"); });
    $$("[data-peek]", root).forEach(function (el) { el.removeAttribute("data-peek"); });
  }

  /* Clone the live device into each compare frame with its own variant */
  function renderCompare() {
    $$(".cmp-frame").forEach(function (frame) {
      const stage = $(".cmp-stage", frame);
      const clone = device.cloneNode(true);
      clone.removeAttribute("id");
      stripIds(clone);
      clone.classList.remove("mode-desktop");
      clone.classList.add("mode-phone");
      clone.style.transform = "";
      stage.innerHTML = "";
      stage.appendChild(clone);
    });
    layoutCompare();
    $$(".cmp-frame").forEach(function (f) {
      f.classList.toggle("focused", f.dataset.variant === variant);
    });
  }

  function layoutCompare() {
    const frames = $$(".cmp-frame");
    if (!frames.length || mode !== "compare") return;
    const stage = frames[0].querySelector(".cmp-stage");
    const frameW = stage.clientWidth || 300;
    const availH = canvas.clientHeight - 110; // label + padding
    const scale = Math.max(0.18, Math.min((frameW - 6) / 390, availH / 844));
    frames.forEach(function (f) {
      const st = f.querySelector(".cmp-stage");
      const dev = st.querySelector(".device");
      if (!dev) return;
      dev.style.transform = "scale(" + scale + ")";
      st.style.width = (390 * scale) + "px";
      st.style.height = (844 * scale) + "px";
      st.style.margin = "0 auto";
    });
  }

  function fit() {
    if (mode === "compare") { layoutCompare(); return; }
    const isPhone = mode !== "desktop";
    const W = isPhone ? 390 : 1180;
    const H = isPhone ? 844 : 760;
    const availW = canvas.clientWidth - 8;
    const availH = canvas.clientHeight - 8;
    const scale = Math.min(1, availW / W, availH / H);
    device.style.transform = "scale(" + scale + ")";
    fitEl.style.width  = (W * scale) + "px";
    fitEl.style.height = (H * scale) + "px";
  }

  /* ── Toast ── */
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }

  /* ── OTP (one-time email code, 6 digits) ── */
  function otpInputs() { return $$("#otp input"); }

  function wireOtp() {
    const inputs = otpInputs();
    inputs.forEach(function (inp, i) {
      inp.addEventListener("input", function () {
        inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
        inp.classList.toggle("filled", inp.value !== "");
        if (inp.value && i < inputs.length - 1) inputs[i + 1].focus();
      });
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !inp.value && i > 0) {
          inputs[i - 1].focus();
          inputs[i - 1].value = "";
          inputs[i - 1].classList.remove("filled");
        }
        if (e.key === "ArrowLeft"  && i > 0) inputs[i - 1].focus();
        if (e.key === "ArrowRight" && i < inputs.length - 1) inputs[i + 1].focus();
      });
      inp.addEventListener("paste", function (e) {
        e.preventDefault();
        const digits = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
        digits.split("").forEach(function (d, k) {
          if (inputs[k]) { inputs[k].value = d; inputs[k].classList.add("filled"); }
        });
        inputs[Math.min(digits.length, inputs.length - 1)].focus();
      });
    });
  }

  function verifyOtp() {
    const inputs = otpInputs();
    const code = inputs.map(function (i) { return i.value; }).join("");
    if (code.length < 6) {
      const box = $("#otp");
      box.classList.remove("shake");
      void box.offsetWidth;
      box.classList.add("shake");
      toast("Enter all 6 digits to continue (any code works in this prototype).");
      return;
    }
    toast("Email verified — mock. You can sign in now.");
    goto("verified");
  }

  /* ── Resend countdown ── */
  let resendTimer = null;
  function startResend() {
    clearInterval(resendTimer);
    let left = 28;
    const timer = $("#resend-timer");
    const btn = $("#resend-btn");
    if (!timer || !btn) return;
    timer.hidden = false;
    btn.hidden = true;
    timer.textContent = "Resend code in 0:" + String(left).padStart(2, "0");
    resendTimer = setInterval(function () {
      left -= 1;
      if (left <= 0) {
        clearInterval(resendTimer);
        timer.hidden = true;
        btn.hidden = false;
        return;
      }
      timer.textContent = "Resend code in 0:" + String(left).padStart(2, "0");
    }, 1000);
  }

  /* ── Password strength ── */
  function scorePassword(pw) {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (/\d/.test(pw) && /[a-zA-Z]/.test(pw)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 1;
    return Math.min(score, 4);
  }

  const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

  function updateStrength() {
    const pw = $("#reset-new") ? $("#reset-new").value : "";
    const score = pw ? scorePassword(pw) : 0;
    const box = $("#strength");
    if (!box) return;
    box.className = "strength" + (score ? " s" + score : "");
    $("#strength-label").textContent = STRENGTH_LABELS[score];

    $$("#reqs li").forEach(function (li) {
      const r = li.dataset.req;
      let ok = false;
      if (r === "len") ok = pw.length >= 8;
      if (r === "num") ok = /\d/.test(pw);
      if (r === "sym") ok = /[^a-zA-Z0-9]/.test(pw);
      li.classList.toggle("met", ok);
    });
  }

  function resetStrength() {
    if (!$("#reset-new")) return;
    $("#reset-new").value = "";
    $("#reset-confirm").value = "";
    updateStrength();
  }

  function submitReset() {
    const pw = $("#reset-new").value;
    const confirm = $("#reset-confirm").value;
    if (pw.length < 8)  { toast("Password must be at least 8 characters."); return; }
    if (!/\d/.test(pw)) { toast("Add at least one number to the password."); return; }
    if (!/[^a-zA-Z0-9]/.test(pw)) { toast("Add at least one symbol to the password."); return; }
    if (pw !== confirm) {
      const f = $("#reset-confirm").closest(".field");
      f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake");
      toast("Passwords don't match yet.");
      return;
    }
    toast("Password updated — mock success.");
    goto("done");
  }

  /* ── Global click handling ── */
  document.addEventListener("click", function (e) {
    const triggerStep5 = e.target.closest(".btn-trigger-step5");
    if (triggerStep5 && !e.target.closest("[data-goto]")) {
      const drawer = document.getElementById("step5-drawer");
      if (drawer) {
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
      }
      return;
    }

    const closeDrawerBtn = e.target.closest("#btn-close-drawer, #drawer-backdrop");
    if (closeDrawerBtn) {
      const drawer = document.getElementById("step5-drawer");
      if (drawer) {
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
      }
      return;
    }

    const bookmarkToggle = e.target.closest("[data-bookmark-toggle]");
    if (bookmarkToggle) {
      const on = bookmarkToggle.classList.toggle("is-active");
      toast(on ? "Roadmap saved to bookmarks!" : "Roadmap removed from bookmarks.");
      return;
    }

    const darkToggle = e.target.closest("#profile-dark-mode-toggle");
    if (darkToggle) {
      const wasChecked = darkToggle.getAttribute("aria-checked") === "true";
      const isNowDark = !wasChecked;
      $$("#profile-dark-mode-toggle, [id^='profile-dark-mode-toggle']").forEach(function(btn) {
        btn.setAttribute("aria-checked", String(isNowDark));
        btn.classList.toggle("is-checked", isNowDark);
        const icon = btn.querySelector(".switch-thumb-icon");
        if (icon) icon.textContent = isNowDark ? "🌙" : "☀️";
      });
      $$(".page-profile").forEach(function(p) { p.classList.toggle("dark-mode", isNowDark); });
      $$(".screen[data-screen='profile']").forEach(function(s) { s.classList.toggle("dark-mode", isNowDark); });
      if (device) device.classList.toggle("dark-mode", isNowDark);
      toast(isNowDark ? "Dark theme activated 🌙" : "Light theme activated ☀️");
      return;
    }

    const offlineToggle = e.target.closest("#profile-offline-toggle");
    if (offlineToggle) {
      const wasChecked = offlineToggle.getAttribute("aria-checked") === "true";
      const isNowChecked = !wasChecked;
      $$("#profile-offline-toggle, [id^='profile-offline-toggle']").forEach(function(btn) {
        btn.setAttribute("aria-checked", String(isNowChecked));
        btn.classList.toggle("is-checked", isNowChecked);
      });
      toast(isNowChecked ? "Offline caching enabled for active roadmaps" : "Offline downloads paused");
      return;
    }

    const editPhotoBtn = e.target.closest("#profile-edit-photo-btn");
    if (editPhotoBtn) {
      toast("Photo upload: Camera & Photo Library chooser (mock)");
      return;
    }

    const gotoBtn = e.target.closest("[data-goto]");
    if (gotoBtn) { goto(gotoBtn.dataset.goto); return; }

    const mockBtn = e.target.closest("[data-mock]");
    if (mockBtn) { toast(mockBtn.dataset.mock); return; }

    const variantBtn = e.target.closest(".variant");
    if (variantBtn) {
      setVariant(variantBtn.dataset.variant);
      // picking a variant from compare drops you into its full clickthrough
      if (mode === "compare") setMode("phone");
      return;
    }

    const modeBtn = e.target.closest(".seg button");
    if (modeBtn) { setMode(modeBtn.dataset.mode); return; }

    const peek = e.target.closest("[data-peek]");
    if (peek) {
      const inp = document.getElementById(peek.dataset.peek);
      if (!inp) return;
      const showing = inp.type === "text";
      inp.type = showing ? "password" : "text";
      peek.textContent = showing ? "Show" : "Hide";
      return;
    }
  });

  /* ── Form submits (mock only) ── */
  document.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    if (form.id === "login-form") {
      const email = form.querySelector('input[type="email"]').value.trim();
      const pw = $("#login-pw").value;
      if (!email || !pw) { toast("Complete all required fields."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast("Enter a valid email address."); return; }
      toast("Signed in — mock (no network request).");
      return;
    }
    if (form.id === "forgot-form") {
      const email = form.querySelector('input[type="email"]').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast("Enter a valid email address."); return; }
      toast("Reset instructions queued — mock (no email is sent).");
      setTimeout(function () { goto("sent"); }, 550);
      return;
    }
    if (form.id === "reset-form") { submitReset(); }
  });

  /* ── Stage controls ── */
  function step(dir) {
    const ids = SCREENS.map(function (s) { return s.id; });
    let i = ids.indexOf(current);
    i = (i + dir + ids.length) % ids.length;
    goto(ids[i]);
  }

  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "ArrowLeft")  step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ── Boot ── */
  buildRail();
  wireOtp();
  $("#verify-btn").addEventListener("click", verifyOtp);
  $("#resend-btn").addEventListener("click", function () {
    toast("New code sent — mock (no email is sent).");
    startResend();
  });
  $("#reset-new").addEventListener("input", updateStrength);
  $("#prev").addEventListener("click", function () { step(-1); });
  $("#next").addEventListener("click", function () { step(1); });
  window.addEventListener("resize", fit);

  let savedVariant = null, savedScreen = null, savedMode = null;
  try {
    savedVariant = localStorage.getItem("skillar.mock.variant");
    savedScreen  = localStorage.getItem("skillar.mock.screen");
    savedMode    = localStorage.getItem("skillar.mock.mode");
  } catch (e) {}

  setVariant(["warm", "playful", "minimal"].indexOf(savedVariant) >= 0 ? savedVariant : "warm");
  setMode(["phone", "desktop", "compare"].indexOf(savedMode) >= 0 ? savedMode : "compare");
  goto(savedScreen && document.querySelector('.screen[data-screen="' + savedScreen + '"]') ? savedScreen : "landing");
  updateStrength();
  requestAnimationFrame(fit);
  setTimeout(fit, 400); // after webfonts settle
})();
