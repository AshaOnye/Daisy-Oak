/* =========================================================
   Falling Leaves Effect
   Standalone, dependency-free, wrapped in an IIFE so nothing
   leaks into the global scope or clashes with theme scripts.
   Works together with assets/css/falling-leaves.css
   ========================================================= */
(function () {
  "use strict";

  // Prevent double initialisation if the script is included twice
  if (window.__flFallingLeavesInit) return;
  window.__flFallingLeavesInit = true;

  // ---- Settings (tweak here) -------------------------------------------
  var CONFIG = {
    desktopLeaves: 28,          // number of leaves on large screens
    mobileLeaves: 14,           // number of leaves on small screens (<768px)
    minSize: 16,                // px
    maxSize: 34,                // px
    minFallDuration: 10,        // seconds
    maxFallDuration: 20,        // seconds
    colors: [
      "#EE844A",                // orange
      "#FBCB0F",                // yellow
      "#8BC34A",                // light green
      "#2E7D32"                 // dark green
    ]
  };
  // -----------------------------------------------------------------------

  // A few different leaf silhouettes (viewBox 0 0 24 24), filled with
  // the colour passed in, plus a subtle vein line for realism.
  var LEAF_SHAPES = [
    // Classic pointed leaf
    '<path d="M12 1C6 6 3.5 11 5 16c1.2 3.6 4.4 6 7 7 2.6-1 5.8-3.4 7-7 1.5-5-1-10-7-15z" fill="{c}"/>' +
    '<path d="M12 4v19M12 10l-3.5-2.5M12 14l-4.5-3M12 10l3.5-2.5M12 14l4.5-3" stroke="rgba(0,0,0,.22)" stroke-width="0.9" fill="none" stroke-linecap="round"/>',

    // Rounded / birch-style leaf
    '<path d="M12 2c5 2 9 6 9 11 0 5-4 9-9 9s-9-4-9-9c0-5 4-9 9-11z" fill="{c}"/>' +
    '<path d="M12 5v17M12 11l-4-3M12 15l-5-3M12 11l4-3M12 15l5-3" stroke="rgba(0,0,0,.22)" stroke-width="0.9" fill="none" stroke-linecap="round"/>',

    // Maple-like leaf
    '<path d="M12 1l2.2 4.3 3.3-1-.8 4.6 4.6-.4-2.7 3.6 3.4 2.6-4.6.9.6 3.6-3.9-1.6L12 23l-.1-5.4-3.9 1.6.6-3.6-4.6-.9 3.4-2.6-2.7-3.6 4.6.4-.8-4.6 3.3 1L12 1z" fill="{c}"/>' +
    '<path d="M12 4v19M12 12l-4-3M12 12l4-3" stroke="rgba(0,0,0,.22)" stroke-width="0.9" fill="none" stroke-linecap="round"/>'
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createLeaf(container) {
    var leaf = document.createElement("span");
    leaf.className = "fl-leaf";

    var inner = document.createElement("span");
    inner.className = "fl-leaf__inner";

    var color = pick(CONFIG.colors);
    var shape = pick(LEAF_SHAPES).replace(/\{c\}/g, color);
    inner.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      shape +
      "</svg>";

    var size = rand(CONFIG.minSize, CONFIG.maxSize);
    var fallDuration = rand(CONFIG.minFallDuration, CONFIG.maxFallDuration);
    var startX = rand(-5, 100);            // vw
    var drift = rand(-15, 15);             // extra sideways travel in vw

    var style = leaf.style;
    style.setProperty("--fl-size", size.toFixed(1) + "px");
    style.setProperty("--fl-fall-duration", fallDuration.toFixed(2) + "s");
    // Negative delay so leaves are already spread across the screen on load
    style.setProperty("--fl-delay", (-rand(0, fallDuration)).toFixed(2) + "s");
    style.setProperty("--fl-x-start", startX.toFixed(2) + "vw");
    style.setProperty("--fl-x-end", (startX + drift).toFixed(2) + "vw");
    style.setProperty("--fl-sway-distance", rand(20, 70).toFixed(0) + "px");
    style.setProperty("--fl-sway-duration", rand(3, 6).toFixed(2) + "s");
    style.setProperty("--fl-spin-duration", rand(6, 14).toFixed(2) + "s");
    style.setProperty("--fl-spin-direction", Math.random() > 0.5 ? "normal" : "reverse");
    style.setProperty("--fl-opacity", rand(0.7, 0.95).toFixed(2));

    leaf.appendChild(inner);
    container.appendChild(leaf);
  }

  function init() {
    if (document.getElementById("fl-leaves-container")) return;

    var container = document.createElement("div");
    container.id = "fl-leaves-container";
    container.setAttribute("aria-hidden", "true");

    var count = window.innerWidth < 768 ? CONFIG.mobileLeaves : CONFIG.desktopLeaves;
    for (var i = 0; i < count; i++) {
      createLeaf(container);
    }

    document.body.appendChild(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
