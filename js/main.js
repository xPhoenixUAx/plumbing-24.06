(function () {
  const config = window.SITE_CONFIG || {};
  const root = document.documentElement;
  let pageLoader;

  function ensurePageLoader() {
    if (pageLoader) return pageLoader;
    pageLoader = document.createElement("div");
    pageLoader.className = "page-loader is-visible";
    pageLoader.setAttribute("aria-live", "polite");
    pageLoader.setAttribute("aria-label", "Loading page");
    pageLoader.innerHTML = '<div class="loader-mark" aria-hidden="true"><span></span><span></span><span></span></div>';
    document.body.appendChild(pageLoader);
    root.classList.add("page-is-loading");
    return pageLoader;
  }

  function showPageLoader() {
    const loader = ensurePageLoader();
    loader.hidden = false;
    requestAnimationFrame(() => {
      loader.classList.add("is-visible");
      root.classList.add("page-is-loading");
    });
  }

  function hidePageLoader() {
    if (!pageLoader) return;
    pageLoader.classList.remove("is-visible");
    root.classList.remove("page-is-loading");
    pageLoader.addEventListener(
      "transitionend",
      () => {
        if (!pageLoader.classList.contains("is-visible")) {
          pageLoader.hidden = true;
        }
      },
      { once: true }
    );
  }

  if (document.body) {
    ensurePageLoader();
  } else {
    document.addEventListener("DOMContentLoaded", ensurePageLoader, { once: true });
  }

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
    if (config.companyName) {
      document.title = document.title.replace(/FlowCore Plumbing/g, config.companyName);
      document.querySelectorAll("meta[name='description']").forEach((node) => {
        node.setAttribute("content", node.getAttribute("content").replace(/FlowCore Plumbing/g, config.companyName));
      });
    }
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
        showConfirmationModal(form);
        form.reset();
      });
    });
  }

  function showConfirmationModal(form) {
    const modal = document.querySelector("[data-confirmation-modal]");
    const fallback = form.querySelector(".success-message");
    const data = new FormData(form);
    const name = data.get("name") || "Your request";
    const phone = data.get("phone") || "Not provided";
    const service = data.get("service") || "Plumbing request";
    const message = data.get("message") || "No extra details provided";

    if (!modal) {
      if (fallback) {
        fallback.textContent = `${config.companyName} received your request. We will use the details you shared to help connect you with an independent local provider. Questions can be sent to ${config.email}.`;
        fallback.hidden = false;
      }
      return;
    }

    const summary = modal.querySelector("[data-confirmation-summary]");
    const text = modal.querySelector("[data-confirmation-text]");
    if (text) {
      text.textContent = `${config.companyName} received your details. We will use them to help route your request to an independent local provider.`;
    }
    if (summary) {
      summary.innerHTML = `
        <div><strong>Name</strong><span>${escapeHtml(name)}</span></div>
        <div><strong>Phone</strong><span>${escapeHtml(phone)}</span></div>
        <div><strong>Service</strong><span>${escapeHtml(service)}</span></div>
        <div><strong>Details</strong><span>${escapeHtml(message).replace(/\n/g, "<br>")}</span></div>
      `;
    }
    openModal(modal);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function openModal(modal) {
    const closeButtons = modal.querySelectorAll("[data-modal-close]");
    const firstClose = closeButtons[0];
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      firstClose?.focus();
    });

    function closeModal() {
      modal.classList.remove("is-open");
      modal.addEventListener(
        "transitionend",
        () => {
          if (!modal.classList.contains("is-open")) modal.hidden = true;
        },
        { once: true }
      );
      document.removeEventListener("keydown", onKeydown);
      modal.removeEventListener("click", onBackdropClick);
    }

    function onKeydown(event) {
      if (event.key === "Escape") closeModal();
    }

    function onBackdropClick(event) {
      if (event.target === modal) closeModal();
    }

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeModal, { once: true });
    });
    modal.addEventListener("click", onBackdropClick);
    document.addEventListener("keydown", onKeydown);
  }

  const searchIndex = [
      {
        title: "Residential Plumbing",
        type: "Service",
        url: "services/residential-plumbing.html",
        description: "Whole-home plumbing repairs, leak review, fixture work, shutoffs, supply lines, and inspection requests.",
        terms: ["home", "house", "residential", "leak", "pipe", "sink", "repair", "shutoff"]
      },
      {
        title: "Commercial Plumbing",
        type: "Service",
        url: "services/commercial-plumbing.html",
        description: "Provider matching for offices, retail spaces, light facilities, service windows, and maintenance lists.",
        terms: ["commercial", "business", "office", "retail", "facility", "property"]
      },
      {
        title: "Drain Cleaning",
        type: "Service",
        url: "services/drain-cleaning.html",
        description: "Help for clogs, slow drains, backups, kitchen drains, bath drains, laundry lines, and prevention guidance.",
        terms: ["drain", "clog", "blocked", "backup", "slow", "cleaning", "laundry"]
      },
      {
        title: "Water Heater Service",
        type: "Service",
        url: "services/water-heater-service.html",
        description: "Water heater repair, replacement planning, flushing, valve checks, safety review, and hot-water problems.",
        terms: ["water heater", "hot water", "heater", "tank", "flush", "lukewarm"]
      },
      {
        title: "Sewer Line Repair",
        type: "Service",
        url: "services/sewer-line-repair.html",
        description: "Sewer diagnostics, camera inspection, cleanout access, recurring backups, odors, roots, and repair planning.",
        terms: ["sewer", "camera", "cleanout", "odor", "main line", "roots"]
      },
      {
        title: "Fixture Installation",
        type: "Service",
        url: "services/fixture-installation.html",
        description: "Request matching for faucets, toilets, valves, disposals, fixture replacement, and finish plumbing.",
        terms: ["fixture", "faucet", "toilet", "valve", "disposal", "install"]
      },
      {
        title: "How Provider Matching Works",
        type: "About",
        url: "about.html",
        description: "Learn how FlowCore Plumbing helps organize requests and connect homeowners with independent providers.",
        terms: ["about", "company", "who", "provider matching", "independent"]
      },
      {
        title: "Contact And Request A Match",
        type: "Contact",
        url: "contact.html",
        description: "Submit a request, call the priority line, or share details about urgent plumbing issues.",
        terms: ["contact", "quote", "estimate", "request", "emergency", "help", "call"]
      },
      {
        title: "Privacy Policy",
        type: "Legal",
        url: "privacy-policy.html",
        description: "How request information may be collected, used, and shared when responding to provider inquiries.",
        terms: ["privacy", "data", "information", "sharing"]
      },
      {
        title: "Terms And Conditions",
        type: "Legal",
        url: "terms-and-conditions.html",
        description: "Website terms, service request limitations, estimates, customer responsibilities, and provider availability.",
        terms: ["terms", "conditions", "responsibilities", "estimates"]
      },
      {
        title: "Cookie Policy",
        type: "Legal",
        url: "cookie-policy.html",
        description: "How browser storage and cookies may support site performance and approved analytics configuration.",
        terms: ["cookie", "cookies", "browser", "analytics"]
      }
    ];

  function normalizeSearchText(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function getSearchResults(query) {
    const normalized = normalizeSearchText(query);
    const tokens = normalized.split(" ").filter(Boolean);
    if (!tokens.length) return [];

    return searchIndex
      .map((item) => {
        const title = normalizeSearchText(item.title);
        const type = normalizeSearchText(item.type);
        const description = normalizeSearchText(item.description);
        const terms = item.terms.map(normalizeSearchText);
        let score = 0;

        tokens.forEach((token) => {
          if (title.includes(token)) score += 6;
          if (type.includes(token)) score += 3;
          if (description.includes(token)) score += 2;
          if (terms.some((term) => term.includes(token) || token.includes(term))) score += 5;
        });

        if (title.includes(normalized)) score += 8;
        if (terms.includes(normalized)) score += 8;
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }

  function initSearch() {
    document.querySelectorAll(".search-box").forEach((form) => {
      const input = form.querySelector("input");
      const icon = form.querySelector("[data-lucide='search']");
      if (!input) return;
      const dropdown = document.createElement("div");
      const listId = `search-suggestions-${Math.random().toString(36).slice(2)}`;
      dropdown.className = "search-suggestions";
      dropdown.id = listId;
      dropdown.hidden = true;
      dropdown.setAttribute("role", "listbox");
      form.appendChild(dropdown);
      input.setAttribute("autocomplete", "off");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-controls", listId);
      input.setAttribute("aria-expanded", "false");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = input.value.trim().toLowerCase();
        if (!query) {
          input.focus();
          return;
        }
        const target = `search.html?q=${encodeURIComponent(query)}`;
        const prefix = window.location.pathname.includes("/services/") ? "../" : "";
        showPageLoader();
        window.location.href = `${prefix}${target}`;
      });

      function hideSuggestions() {
        dropdown.hidden = true;
        input.setAttribute("aria-expanded", "false");
      }

      function renderSuggestions() {
        const query = input.value.trim();
        const results = getSearchResults(query).slice(0, 5);
        const prefix = window.location.pathname.includes("/services/") ? "../" : "";
        if (!query || !results.length) {
          hideSuggestions();
          return;
        }
        dropdown.innerHTML = results
          .map(
            (item) =>
              `<a class="suggestion-item" role="option" href="${prefix}${item.url}"><span>${item.type}</span><strong>${item.title}</strong><small>${item.description}</small></a>`
          )
          .join("");
        dropdown.hidden = false;
        input.setAttribute("aria-expanded", "true");
      }

      input.addEventListener("input", renderSuggestions);
      input.addEventListener("focus", renderSuggestions);
      input.addEventListener("keydown", (event) => {
        const items = Array.from(dropdown.querySelectorAll(".suggestion-item"));
        const active = document.activeElement;
        const activeIndex = items.indexOf(active);

        if (event.key === "Escape") {
          hideSuggestions();
          input.focus();
        }
        if (event.key === "ArrowDown" && !dropdown.hidden && items.length) {
          event.preventDefault();
          items[Math.min(activeIndex + 1, items.length - 1)].focus();
        }
      });
      dropdown.addEventListener("keydown", (event) => {
        const items = Array.from(dropdown.querySelectorAll(".suggestion-item"));
        const activeIndex = items.indexOf(document.activeElement);
        if (event.key === "ArrowDown") {
          event.preventDefault();
          items[Math.min(activeIndex + 1, items.length - 1)]?.focus();
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          if (activeIndex <= 0) input.focus();
          else items[activeIndex - 1]?.focus();
        }
        if (event.key === "Escape") {
          hideSuggestions();
          input.focus();
        }
      });
      document.addEventListener("click", (event) => {
        if (!form.contains(event.target)) hideSuggestions();
      });

      if (icon) {
        icon.setAttribute("role", "button");
        icon.setAttribute("tabindex", "0");
        icon.setAttribute("aria-label", "Search site");
        icon.addEventListener("click", () => form.requestSubmit());
        icon.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            form.requestSubmit();
          }
        });
      }
    });
  }

  function initSearchPage() {
    const resultsNode = document.querySelector("[data-search-results]");
    const summaryNode = document.querySelector("[data-search-summary]");
    const termNode = document.querySelector("[data-search-term]");
    if (!resultsNode || !summaryNode) return;

    const query = new URLSearchParams(window.location.search).get("q") || "";
    const results = getSearchResults(query);
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) searchInput.value = query;
    if (termNode) termNode.textContent = query ? `"${query}"` : "site content";

    if (!query.trim()) {
      summaryNode.textContent = "Enter a service, symptom, or question to search the site.";
      resultsNode.innerHTML = searchIndex
        .slice(0, 6)
        .map((item) => searchResultTemplate(item))
        .join("");
      return;
    }

    summaryNode.textContent = results.length
      ? `${results.length} result${results.length === 1 ? "" : "s"} found for "${query}".`
      : `No exact results found for "${query}". Try a service name, symptom, or plumbing category.`;

    resultsNode.innerHTML = results.length
      ? results.map((item) => searchResultTemplate(item)).join("")
      : `<div class="empty-results"><h3>No matching pages found</h3><p>Try searching for drain, leak, water heater, sewer, faucet, commercial, estimate, or emergency.</p><a class="btn" href="services.html">Browse Services</a></div>`;
  }

  function searchResultTemplate(item) {
    return `<article class="result-card"><span>${item.type}</span><h3><a href="${item.url}">${item.title}</a></h3><p>${item.description}</p><a class="text-link" href="${item.url}">Open Page</a></article>`;
  }

  function initRequestRouter() {
    const router = document.querySelector("[data-request-router]");
    if (!router) return;

    const issueData = {
      leak: {
        title: "Active leak support",
        summary: "Ask for provider follow-up for visible leaking, shutoff review, source tracing, and repair planning.",
        details: [
          "Affected area and visible water source",
          "Whether the shutoff valve is accessible",
          "Photos of the leak, stains, or damaged materials"
        ]
      },
      drain: {
        title: "Drain clearing request",
        summary: "Share where the blockage is happening so a provider can discuss line clearing, access, and prevention.",
        details: [
          "Which drain is slow, blocked, or backing up",
          "Whether other fixtures are affected",
          "Any plunging, chemicals, or prior clearing attempts"
        ]
      },
      "water-heater": {
        title: "Hot water request",
        summary: "Prepare unit details for repair, flushing, valve checks, or replacement planning.",
        details: [
          "Tank age, size, and fuel type if known",
          "Whether water is cold, lukewarm, rusty, or leaking",
          "Photos of the unit label, valves, and surrounding area"
        ]
      },
      sewer: {
        title: "Sewer diagnostic request",
        summary: "Flag whole-property symptoms so a provider can discuss cleanout access, camera inspection, and repair planning.",
        details: [
          "Which fixtures are backing up or gurgling",
          "Whether sewer odor or yard wet spots are present",
          "Location of any accessible cleanout"
        ]
      },
      fixture: {
        title: "Fixture installation request",
        summary: "Prepare product and access details for faucet, toilet, valve, disposal, or finish plumbing work.",
        details: [
          "Fixture type, brand, and model if available",
          "Whether old fixture removal is needed",
          "Photos of supply lines, shutoffs, and mounting area"
        ]
      },
      commercial: {
        title: "Commercial plumbing request",
        summary: "Share site constraints so a provider can discuss scheduling, access, and documentation needs.",
        details: [
          "Business type and affected area",
          "Preferred service window or access restrictions",
          "Whether tenants, staff, or customers are affected"
        ]
      }
    };

    const urgencyData = {
      routine: "Scheduled provider match",
      today: "Same-day request",
      emergency: "Call priority line"
    };

    const titleNode = router.querySelector("[data-router-title]");
    const summaryNode = router.querySelector("[data-router-summary]");
    const detailsNode = router.querySelector("[data-router-details]");
    const urgencyNode = router.querySelector("[data-router-urgency-label]");
    const meterNode = router.querySelector(".urgency-meter");
    const submitLink = router.querySelector("[data-router-submit]");
    const issueButtons = Array.from(router.querySelectorAll("[data-issue]"));

    function currentIssue() {
      return router.querySelector("[data-issue].is-active")?.dataset.issue || "leak";
    }

    function currentUrgency() {
      return router.querySelector("input[name='router-urgency']:checked")?.value || "today";
    }

    function currentSymptoms() {
      return Array.from(router.querySelectorAll(".symptom-grid input:checked")).map((input) => input.value);
    }

    function updateRouter() {
      const issue = issueData[currentIssue()];
      const urgency = currentUrgency();
      const symptoms = currentSymptoms();
      const details = symptoms.length ? [...issue.details, ...symptoms] : issue.details;

      titleNode.textContent = issue.title;
      summaryNode.textContent = issue.summary;
      detailsNode.innerHTML = details.map((detail) => `<li>${detail}</li>`).join("");
      urgencyNode.textContent = urgencyData[urgency];
      meterNode.dataset.urgencyLevel = urgency;
    }

    function buildRouterRequest() {
      const issueKey = currentIssue();
      const issue = issueData[issueKey];
      const urgency = currentUrgency();
      const symptoms = currentSymptoms();
      return {
        issueKey,
        title: issue.title,
        summary: issue.summary,
        urgency,
        urgencyLabel: urgencyData[urgency],
        symptoms,
        details: symptoms.length ? [...issue.details, ...symptoms] : issue.details
      };
    }

    issueButtons.forEach((button) => {
      button.addEventListener("click", () => {
        issueButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        updateRouter();
      });
    });
    router.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", updateRouter);
    });
    if (submitLink) {
      submitLink.addEventListener("click", () => {
        sessionStorage.setItem("flowcoreRouterRequest", JSON.stringify(buildRouterRequest()));
      });
    }
    updateRouter();
  }

  function initRouterDropdowns() {
    const dropdowns = Array.from(document.querySelectorAll(".router-dropdown"));
    if (!dropdowns.length) return;
    const mobileQuery = window.matchMedia("(max-width: 640px)");

    function syncDropdowns() {
      dropdowns.forEach((dropdown, index) => {
        if (mobileQuery.matches) {
          dropdown.removeAttribute("open");
        } else {
          dropdown.setAttribute("open", "");
        }
      });
    }

    dropdowns.forEach((dropdown) => {
      const summary = dropdown.querySelector("summary");
      if (!summary) return;
      summary.addEventListener("click", (event) => {
        if (!mobileQuery.matches) event.preventDefault();
      });
    });
    syncDropdowns();
    mobileQuery.addEventListener("change", syncDropdowns);
  }

  function initRouterContactFill() {
    const form = document.querySelector("form[data-contact-form]");
    if (!form) return;
    const saved = sessionStorage.getItem("flowcoreRouterRequest");
    if (!saved) return;

    let request;
    try {
      request = JSON.parse(saved);
    } catch (error) {
      sessionStorage.removeItem("flowcoreRouterRequest");
      return;
    }

    const serviceMap = {
      leak: "Residential Plumbing",
      drain: "Drain Cleaning",
      "water-heater": "Water Heater Service",
      sewer: "Sewer Line Repair",
      fixture: "Fixture Installation",
      commercial: "Commercial Plumbing"
    };
    const service = form.querySelector("#service");
    const message = form.querySelector("#message");
    if (service && serviceMap[request.issueKey]) {
      service.value = serviceMap[request.issueKey];
    }
    if (message && !message.value.trim()) {
      const symptoms = request.symptoms?.length ? request.symptoms.join("; ") : "No extra symptoms selected";
      const details = request.details?.length ? request.details.map((item) => `- ${item}`).join("\n") : "";
      message.value = `${request.title}\nUrgency: ${request.urgencyLabel}\n\nSummary: ${request.summary}\n\nVisible signs: ${symptoms}\n\nDetails to share:\n${details}`;
    }
    sessionStorage.removeItem("flowcoreRouterRequest");
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const summary = item.querySelector("summary");
      const answer = item.querySelector(".faq-answer");
      if (!summary || !answer) return;

      summary.addEventListener("click", (event) => {
        event.preventDefault();
        const isOpen = item.hasAttribute("open");
        answer.style.transition = "height 0.32s ease";

        if (isOpen) {
          answer.style.height = `${answer.scrollHeight}px`;
          requestAnimationFrame(() => {
            answer.style.height = "0px";
          });
          answer.addEventListener(
            "transitionend",
            () => {
              item.removeAttribute("open");
            },
            { once: true }
          );
          return;
        }

        item.setAttribute("open", "");
        answer.style.height = "0px";
        requestAnimationFrame(() => {
          answer.style.height = `${answer.scrollHeight}px`;
        });
        answer.addEventListener(
          "transitionend",
          () => {
            answer.style.height = "auto";
          },
          { once: true }
        );
      });
    });
  }

  function initPageTransitions() {
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target && link.target !== "_self") return;
        if (link.hasAttribute("download")) return;

        const rawHref = link.getAttribute("href") || "";
        if (!rawHref || rawHref.startsWith("#")) return;
        if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

        const url = new URL(rawHref, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

        event.preventDefault();
        showPageLoader();
        window.setTimeout(() => {
          window.location.href = url.href;
        }, 220);
      });
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) hidePageLoader();
    });
    window.addEventListener("load", () => {
      window.setTimeout(hidePageLoader, 180);
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
    if (window.lucide) window.lucide.createIcons();
    initSearch();
    initSearchPage();
    initRequestRouter();
    initRouterDropdowns();
    initRouterContactFill();
    initFaq();
    initPageTransitions();
    initParallax();
  });
})();
