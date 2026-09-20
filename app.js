function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.id) node.id = opts.id;
  if (opts.href) node.href = opts.href;
  if (opts.src) node.src = opts.src;
  if (opts.alt !== undefined) node.alt = opts.alt;
  if (opts.text) node.textContent = opts.text;
  if (opts.html) node.innerHTML = opts.html;
  if (opts.target) node.target = opts.target;
  if (opts.rel) node.rel = opts.rel;
  if (opts.loading) node.loading = opts.loading;
  if (opts.type) node.type = opts.type;
  if (opts.label) node.setAttribute("aria-label", opts.label);
  children.forEach((c) => node.appendChild(c));
  return node;
}

function initials(name) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function renderHero(data) {
  document.title = data.name + ", " + data.title;
  document.getElementById("hero-kicker").textContent = data.title;
  document.getElementById("hero-name").textContent = data.name;
  document.getElementById("hero-tagline").textContent = data.tagline;
  document.getElementById("hero-location").textContent = data.location;

  // The compact header identity (photo + name), always visible in the
  // sticky header, not just the hero.
  document.getElementById("brand-name").textContent = data.name;
  const brandPhoto = document.getElementById("brand-photo");
  if (data.photo) {
    brandPhoto.src = data.photo;
    brandPhoto.alt = data.name;
  } else {
    brandPhoto.hidden = true;
  }

  const bioEl = document.getElementById("hero-bio");
  bioEl.innerHTML = ""; // clear the static fallback paragraphs baked into index.html for crawlers
  data.bio.forEach((para) => bioEl.appendChild(el("p", { text: para })));

  const photoMount = document.getElementById("hero-photo");
  photoMount.innerHTML = "";
  if (data.photo) {
    photoMount.appendChild(el("img", { src: data.photo, alt: data.name, class: "hero-photo-img" }));
  } else {
    photoMount.appendChild(el("div", { class: "hero-photo-fallback", text: initials(data.name) }));
  }

  const linksEl = document.getElementById("hero-links");
  linksEl.innerHTML = ""; // clear the static fallback links baked into index.html for crawlers
  data.links.forEach((l) => {
    linksEl.appendChild(el("a", {
      href: l.href,
      text: l.label,
      target: l.href.startsWith("http") ? "_blank" : "",
      rel: "noopener",
      class: l.primary ? "links-primary" : "",
    }));
  });
}

// "What I've built": five ranked projects, rendered into the Selected Work
// carousel as short text cards.
function renderSelectedWork(items) {
  const mount = document.getElementById("work-list");
  items.forEach((w) => {
    mount.appendChild(
      el("div", { class: "feature-card" }, [
        el("span", { class: "feature-number", text: w.number + " / " + w.label }),
        el("h3", { text: w.title }),
        el("p", { text: w.body }),
      ])
    );
  });
}

function renderExperience(items) {
  const timeline = document.getElementById("timeline");
  items.forEach((job) => {
    const metaParts = [job.location, job.dates].filter(Boolean).join(" | ");
    const children = [
      el("p", { class: "role", text: job.title + ", " + job.company }),
      el("p", { class: "meta", text: metaParts }),
    ];
    if (job.note) children.push(el("p", { class: "note", text: job.note }));
    timeline.appendChild(el("div", { class: "timeline-item" }, children));
  });
}

// A compact, contained version of the same carousel mechanism used for
// Publications and Media/Events (see setupCarousel below), sized for a row of
// small badges inside a card rather than full-width thumbnail cards. This is
// what lets Affiliations and Certifications keep growing over time without
// the card getting taller, new badges just join the row instead of wrapping
// onto more lines.
function badgeCarousel(items, carouselId) {
  const track = el(
    "div",
    { class: "carousel-track" },
    items.map((text) => el("span", { class: "badge", text }))
  );
  const carousel = el("div", { id: carouselId, class: "carousel carousel-compact" }, [track]);
  return el("div", { class: "carousel-wrap" }, [carousel]);
}

function metaCard(title, children) {
  return el("div", { class: "card meta-card" }, [el("h3", { text: title }), ...children]);
}

// Education, Affiliations, Volunteer Affiliations, and Certifications each
// render as their own full-width row, stacked one below the other. The three
// badge lists are each their own independent carousel, since they grow at
// different times and shouldn't be forced to loop together.
function renderEduCert(education, affiliations, volunteerAffiliations, certifications) {
  const stack = document.getElementById("edu-cert");

  stack.appendChild(
    metaCard("Education", [
      el("p", { class: "meta-primary", text: education.degree }),
      el("p", { class: "meta-sub", text: education.school + ", " + education.year }),
    ])
  );

  if (affiliations.length) {
    stack.appendChild(metaCard("Affiliations", [badgeCarousel(affiliations, "aff-carousel")]));
  }
  if (volunteerAffiliations.length) {
    stack.appendChild(
      metaCard("Volunteer Affiliations", [badgeCarousel(volunteerAffiliations, "vol-carousel")])
    );
  }
  stack.appendChild(metaCard("Certifications", [badgeCarousel(certifications, "cert-carousel")]));

  setupCarousel("aff-carousel", affiliations.length, 5);
  setupCarousel("vol-carousel", volunteerAffiliations.length, 5);
  setupCarousel("cert-carousel", certifications.length, 5);
}

function pubCard(imgSrc, imgAlt, titleNode, statusText, description) {
  const body = [
    el("p", { class: "pub-title" }, [titleNode]),
    el("span", { class: "pub-status", text: statusText }),
  ];
  if (description) body.push(el("p", { text: description }));

  const children = [];
  if (imgSrc) {
    children.push(el("img", { src: imgSrc, alt: imgAlt, class: "pub-thumb", loading: "lazy" }));
  }
  children.push(el("div", { class: "pub-body" }, body));
  return el("div", { class: "pub-item" + (imgSrc ? " has-thumb" : "") }, children);
}

// Adds always-visible previous/next buttons around a carousel, so it can be
// moved by click as well as by touch or trackpad scroll. The buttons are
// appended to `.carousel`'s parent (`.carousel-wrap`, see index.html and
// badgeCarousel above), not to `.carousel` itself: `.carousel` is the
// scrolling element, and a position:absolute child still scrolls along with
// its own scrolling ancestor's content, so an overlay button placed inside
// `.carousel` would drift out of view as scrollLeft changes. The wrap is
// never scrolled, only positioned, so buttons anchored to it stay put.
// `pauseAuto` is called synchronously before the scroll starts, so the
// auto-advance loop (if any) stops writing to scrollLeft immediately
// instead of fighting the button's own smooth-scroll on the next frame.
function addCarouselArrows(carousel, pauseAuto) {
  const wrap = carousel.parentElement;
  const scrollByCard = (dir) => {
    pauseAuto();
    const firstCard = carousel.querySelector(".carousel-track > *");
    const amount = firstCard ? firstCard.getBoundingClientRect().width + 18 : 300;
    carousel.scrollBy({ left: dir * amount, behavior: "auto" });
  };
  const prev = el("button", { class: "carousel-arrow carousel-arrow-prev", type: "button", text: "‹", label: "Scroll left" });
  const next = el("button", { class: "carousel-arrow carousel-arrow-next", type: "button", text: "›", label: "Scroll right" });
  prev.addEventListener("click", () => scrollByCard(-1));
  next.addEventListener("click", () => scrollByCard(1));
  wrap.appendChild(prev);
  wrap.appendChild(next);
}

// Turns a populated track into a slow, seamless, auto-scrolling carousel
// that the visitor can still move by hand at any time: real horizontal
// scrolling (trackpad, touch swipe), plus click arrows. Duplicates the
// rendered cards once so the loop has no visible seam, pauses on
// hover/keyboard-focus/touch/manual-scroll so a visitor can always stop and
// read or click, and does nothing (leaves a normal manually-scrollable row)
// if the visitor has asked the OS for reduced motion.
function setupCarousel(carouselId, itemCount, secondsPerItem = 7) {
  const carousel = document.getElementById(carouselId);
  const track = carousel.querySelector(".carousel-track");
  if (itemCount < 2) return; // not enough content to scroll meaningfully

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    addCarouselArrows(carousel, () => {}); // manually scrollable row, nothing to pause
    return; // no automatic motion, no duplicated content
  }

  // Duplicate the rendered cards once, so scrolling exactly past the first
  // copy's width lands on an identical second copy, resetting scrollLeft
  // back by that same width is then invisible. The clones are hidden from
  // assistive tech and keyboard tabbing, since they are a visual repeat,
  // not new content.
  [...track.children].forEach((child) => {
    const clone = child.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button").forEach((a) => a.setAttribute("tabindex", "-1"));
    track.appendChild(clone);
  });

  const half = track.scrollWidth / 2;
  const pxPerSecond = half / (itemCount * secondsPerItem);

  let paused = false;
  let ownScroll = false; // true only for the instant we set scrollLeft ourselves
  let lastTs = null;

  function step(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (!paused) {
      ownScroll = true;
      carousel.scrollLeft += pxPerSecond * dt;
      while (carousel.scrollLeft >= half) carousel.scrollLeft -= half;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  let touchResumeTimer, scrollResumeTimer;
  const pause = () => { paused = true; };
  const resume = () => { paused = false; };
  carousel.addEventListener("mouseenter", pause);
  carousel.addEventListener("mouseleave", resume);
  carousel.addEventListener("focusin", pause);
  carousel.addEventListener("focusout", resume);
  carousel.addEventListener("touchstart", () => {
    clearTimeout(touchResumeTimer);
    pause();
  }, { passive: true });
  carousel.addEventListener("touchend", () => {
    touchResumeTimer = setTimeout(resume, 2500);
  }, { passive: true });
  // A manual scroll (trackpad, wheel, or an arrow-button's smooth scroll)
  // also pauses the automatic advance for a moment, so it doesn't fight the
  // visitor's own movement. `ownScroll` tells the handler apart from the
  // scroll events our own step() function generates every frame.
  carousel.addEventListener("scroll", () => {
    if (ownScroll) { ownScroll = false; return; }
    pause();
    clearTimeout(scrollResumeTimer);
    scrollResumeTimer = setTimeout(resume, 2000);
  }, { passive: true });

  // The arrow buttons call `pause` directly and synchronously, rather than
  // relying on the scroll listener above to notice, so there is no race
  // between the auto-advance step() loop and an arrow's own smooth-scroll
  // both writing to scrollLeft on the same frame.
  addCarouselArrows(carousel, pause);
}

function renderPublications(items, mountId) {
  const list = document.getElementById(mountId);
  items.forEach((p) => {
    const titleNode = p.href
      ? el("a", { href: p.href, text: p.title, target: "_blank", rel: "noopener" })
      : el("span", { text: p.title });
    list.appendChild(pubCard(p.image, p.title, titleNode, p.status, p.description));
  });
}

function renderMediaCoverage(items) {
  const list = document.getElementById("media-list");
  if (!items.length) {
    list.appendChild(
      el("p", { class: "empty-note", text: "No press mentions yet, check back soon." })
    );
    return;
  }
  items.forEach((m) => {
    const titleNode = m.href
      ? el("a", { href: m.href, text: m.title, target: "_blank", rel: "noopener" })
      : el("span", { text: m.title });
    list.appendChild(
      pubCard(m.image, m.title, titleNode, m.outlet + (m.date ? ", " + m.date : ""), "")
    );
  });
}

// Shared by Open Source and Beyond Work, both are just a card grid of
// {title, body, href}.
function renderProjects(items, mountId) {
  const grid = document.getElementById(mountId);
  items.forEach((p) => {
    const link = p.href ? el("a", { href: p.href, target: "_blank", rel: "noopener", text: "View on GitHub" }) : null;
    grid.appendChild(
      el("div", { class: "card" }, [
        el("h3", { text: p.title }),
        el("p", { text: p.body }),
        ...(link ? [link] : []),
      ])
    );
  });
}

function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const stored = (() => {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  })();
  if (stored) root.setAttribute("data-theme", stored);

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

// Tilts each main section up into place, like a card being set down
// flat, the first time it crosses into the viewport, so a long page
// reveals itself card by card as you scroll instead of presenting as one
// flat, static wall of content from the start (the actual tilt/scale
// transform lives in style.css under .reveal and .reveal-item, this
// function only ever toggles classes). Cards, timeline entries, and
// credential cards inside that section cascade in with a small stagger
// on top of the section's own tilt, rather than everything in the
// section landing as one flat block. Skips itself entirely under
// prefers-reduced-motion, leaving every section and item at full opacity
// with nothing to observe.
function setupScrollReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const itemSelector = ".timeline-item, .card-grid > .card, .meta-stack > .meta-card";
  const sections = document.querySelectorAll("main > section:not(.hero)");

  sections.forEach((s) => {
    s.classList.add("reveal");
    s.querySelectorAll(itemSelector).forEach((item) => item.classList.add("reveal-item"));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(itemSelector).forEach((item, i) => {
          item.style.transitionDelay = (i * 80) + "ms";
          item.classList.add("is-visible");
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

  sections.forEach((s) => observer.observe(s));
}

// Highlights whichever nav link matches the section currently occupying
// the middle of the viewport, so the header nav doubles as a "you are
// here" indicator while scrolling, not just a set of jump links.
function setupScrollSpy() {
  const navLinks = [...document.querySelectorAll(".nav ul a")];
  const sectionToLink = new Map();
  navLinks.forEach((link) => {
    const section = document.getElementById(link.getAttribute("href").slice(1));
    if (section) sectionToLink.set(section, link);
  });
  if (!sectionToLink.size) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting);
    if (!visible.length) return;
    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    navLinks.forEach((l) => l.classList.remove("active"));
    sectionToLink.get(visible[0].target)?.classList.add("active");
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sectionToLink.forEach((_, section) => observer.observe(section));
}

(function init() {
  const d = SITE_DATA;
  renderHero(d.profile);
  renderExperience(d.experience);
  renderSelectedWork(d.selectedWork);
  renderPublications(d.publications, "publications-list");
  renderMediaCoverage(d.mediaCoverage);
  renderProjects(d.openSource, "opensource-grid");
  renderProjects(d.projects, "projects-grid");
  renderEduCert(d.education, d.affiliations, d.volunteerAffiliations, d.certifications);
  setupCarousel("work-carousel", d.selectedWork.length, 6);
  setupCarousel("publications-carousel", d.publications.length);
  setupCarousel("media-carousel", d.mediaCoverage.length);
  document.getElementById("year").textContent = new Date().getFullYear();
  setupThemeToggle();
  setupScrollReveal();
  setupScrollSpy();
})();
