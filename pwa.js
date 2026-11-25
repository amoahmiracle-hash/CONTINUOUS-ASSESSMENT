/* Install button, update notice, offline support and data-safety helpers.
 * Loaded by index.html. Everything here is optional: the app itself works without it. */
(function () {
  "use strict";
  var STORAGE_KEY = "ghCAApp_v1";

  // 1. Ask the browser not to clear the saved data when it is short of space.
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  // 2. Home-screen shortcuts open a particular tab, e.g. index.html?tab=entry
  try {
    var tab = new URLSearchParams(location.search).get("tab");
    if (tab) {
      var tb = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
      if (tb) tb.click();
    }
  } catch (e) {}

  // small notice bar at the bottom of the screen
  function toast(id, message, actionLabel, onAction) {
    var old = document.getElementById(id);
    if (old) old.parentNode.removeChild(old);
    var box = document.createElement("div");
    box.className = "pwa-toast"; box.id = id; box.setAttribute("role", "status");
    var span = document.createElement("span"); span.textContent = message; box.appendChild(span);
    var btn = document.createElement("button"); btn.type = "button"; btn.textContent = actionLabel;
    btn.addEventListener("click", function () { onAction(box); });
    box.appendChild(btn);
    var x = document.createElement("button"); x.type = "button"; x.className = "pwa-toast-x"; x.setAttribute("aria-label", "Dismiss"); x.textContent = "×";
    x.addEventListener("click", function () { if (box.parentNode) box.parentNode.removeChild(box); });
    box.appendChild(x);
    document.body.appendChild(box);
  }

  // 3. Install button (Chrome / Edge / Android). iPhone and iPad install from Safari's Share menu instead.
  var installBtn = document.getElementById("installBtn");
  var deferred = null;
  function isStandalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    if (installBtn && !isStandalone()) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener("click", function () {
      if (!deferred) return;
      deferred.prompt();
      var done = function () { deferred = null; installBtn.hidden = true; };
      if (deferred.userChoice && deferred.userChoice.then) deferred.userChoice.then(done, done); else done();
    });
  }
  window.addEventListener("appinstalled", function () { deferred = null; if (installBtn) installBtn.hidden = true; });

  // 4. Offline support + "new version" notice
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    var refreshRequested = false;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        function offer(worker) {
          toast("updateToast", "A new version of the app is ready. Finish what you are typing, then update.", "Update now", function (box) {
            refreshRequested = true;
            worker.postMessage({ type: "SKIP_WAITING" });
            if (box.parentNode) box.parentNode.removeChild(box);
          });
        }
        if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
        reg.addEventListener("updatefound", function () {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", function () {
            if (nw.state === "installed" && navigator.serviceWorker.controller) offer(nw);
          });
        });
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState === "visible") { try { reg.update(); } catch (e) {} }
        });
      }).catch(function () { /* offline support just stays off */ });
    });
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshRequested) location.reload();
    });
  }

  // 5. Two windows open at once would overwrite each other's scores, so warn if the data changes elsewhere.
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      toast("syncToast", "The records were changed in another window or tab. Reload this one so you do not overwrite them.", "Reload", function () { location.reload(); });
    }
  });
})();
