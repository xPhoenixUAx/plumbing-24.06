(function () {
  const config = window.SITE_CONFIG || {};
  const root = document.documentElement;

  function setText(selector, text) {
    if (!text) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = text;
    });
  }

  function setHref(selector, value, prefix) {
    if (!value) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.href = `${prefix}${value}`;
    });
  }

  function applyConfig() {
    setText("[data-company]", config.companyName);
    setText("[data-brand-tagline]", config.brandTagline);
    setText("[data-email]", config.email);
    setText("[data-website]", config.website);
    setText("[data-phone]", config.phone);
    setText("[data-phone-label]", config.phoneLabel);
    setText("[data-address]", config.address);
    setText("[data-service-area]", config.serviceArea);
    setText("[data-hours]", config.businessHours);
    setText("[data-company-id]", config.companyId);
    setText("[data-footer-text]", config.footerText);
    setText("[data-copyright]", config.copyright);
    setText("[data-footer-company-line]", `${config.companyName} - ${config.address} - ID ${config.companyId}`);
    setHref("[data-email-link]", config.email, "mailto:");
    setHref("[data-phone-link]", config.phone ? config.phone.replace(/[^\d+]/g, "") : "", "tel:");
    document.querySelectorAll("[data-website-link]").forEach((node) => {
      node.href = `https://${config.website}`;
    });
  }

  function initMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      root.classList.toggle("menu-open", isOpen);
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        root.classList.remove("menu-open");
      });
    });
  }

  function initHeadline() {
    const node = document.querySelector("[data-rotating-word]");
    if (!node) return;
    const words = ["Fast", "Local", "Safe"];
    let index = 0;
    setInterval(() => {
      node.classList.remove("word-in");
      node.classList.add("word-out");
      setTimeout(() => {
        index = (index + 1) % words.length;
        node.textContent = words[index];
        node.classList.remove("word-out");
        node.classList.add("word-in");
      }, 260);
    }, 1900);
  }

  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((item) => observer.observe(item));
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          const target = Number(node.dataset.count || 0);
          const suffix = node.dataset.suffix || "";
          const duration = 1200;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = `${Math.round(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.unobserve(node);
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach((counter) => observer.observe(counter));
  }

  function initLogos() {
    document.querySelectorAll(".logo-track").forEach((track) => {
      track.innerHTML += track.innerHTML;
    });
  }

  function initForms() {
    document.querySelectorAll("form[data-contact-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = form.querySelector(".success-message");
        if (message) {
          message.textContent = `${config.companyName} received your request. We will use the details you shared to help connect you with an independent local provider. Questions can be sent to ${config.email}.`;
          message.hidden = false;
        }
        form.reset();
      });
    });
  }

  function initParallax() {
    const sections = document.querySelectorAll("[data-parallax-section]");
    if (!sections.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    function update() {
      const viewport = window.innerHeight || 1;
      sections.forEach((section) => {
        const image = section.querySelector("[data-parallax-bg]");
        if (!image) return;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) return;
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        image.style.transform = `translate3d(0, ${progress * -42}px, 0)`;
      });
      ticking = false;
    }
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initMenu();
    initHeadline();
    initReveal();
    initCounters();
    initLogos();
    initForms();
    initParallax();
    if (window.lucide) window.lucide.createIcons();
  });
})();
