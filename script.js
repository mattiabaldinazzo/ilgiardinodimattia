(function () {
  "use strict";

  // Dati di contatto: modifica solo qui (formato internazionale, solo cifre)
  var CONTACT = {
    whatsapp: "390000000000",
    email: "ilgiardinodimattia@gmail.com"
  };

  document.documentElement.classList.remove("no-js");

  // Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Logo: torna in cima alla pagina
  document.querySelector(".brand").addEventListener("click", function (e) {
    e.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
  });

  // Ombra header allo scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Animazioni allo scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Modulo preventivo: compone il messaggio per WhatsApp o email
  var form = document.getElementById("quote-form");
  var error = document.getElementById("form-error");
  var mailLink = document.getElementById("mail-fallback");

  function buildMessage() {
    var data = new FormData(form);
    var services = data.getAll("servizio");
    var lines = [
      "Ciao Mattia, vorrei un preventivo.",
      "Nome: " + (data.get("nome") || "").trim(),
      "Comune: " + (data.get("comune") || "").trim(),
      "Servizio: " + (services.length ? services.join(", ") : "da definire")
    ];
    var msg = (data.get("messaggio") || "").trim();
    if (msg) lines.push("Dettagli: " + msg);
    return lines.join("\n");
  }

  function validate() {
    var ok = true;
    ["f-name", "f-town"].forEach(function (id) {
      var input = document.getElementById(id);
      var valid = input.value.trim().length > 1;
      input.classList.toggle("is-invalid", !valid);
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid) ok = false;
    });
    error.hidden = ok;
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var url = "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(buildMessage());
    window.open(url, "_blank", "noopener");
  });

  mailLink.addEventListener("click", function (e) {
    if (!validate()) {
      e.preventDefault();
      return;
    }
    mailLink.href = "mailto:" + CONTACT.email +
      "?subject=" + encodeURIComponent("Richiesta preventivo giardinaggio") +
      "&body=" + encodeURIComponent(buildMessage());
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
