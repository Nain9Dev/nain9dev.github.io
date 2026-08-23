function calculateScrollPercentage() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100));
}

export function initializeHeaderState({ header, progress }) {
  if (!header && !progress) {
    return () => {};
  }

  let updateRequested = false;

  function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);

    if (progress) {
      progress.value = calculateScrollPercentage();
    }

    updateRequested = false;
  }

  function requestUpdate() {
    if (!updateRequested) {
      window.requestAnimationFrame(updateHeader);
      updateRequested = true;
    }
  }

  updateHeader();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  return () => {
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

export function initializeSectionNavigation(links) {
  if (!("IntersectionObserver" in window)) {
    return () => {};
  }

  const navigationLinks = [...links];
  const sections = navigationLinks
    .map((link) => {
      try {
        const href = link.getAttribute("href");
        if (!href) return null;
        
        const hashIndex = href.indexOf('#');
        if (hashIndex !== -1) {
          const id = href.substring(hashIndex + 1);
          return id ? document.getElementById(id) : null;
        }
        return null;
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  function clearActiveSection() {
    navigationLinks.forEach((link) => link.removeAttribute("aria-current"));
  }

  function setActiveSection(sectionId) {
    navigationLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    const visibleSection = entries.find((entry) => entry.isIntersecting);

    if (visibleSection) {
      setActiveSection(visibleSection.target.id);
    }
  }, {
    rootMargin: "-32% 0px -58%",
    threshold: 0
  });

  sections.forEach((section) => observer.observe(section));

  function updateTopState() {
    const firstSection = sections[0];

    if (firstSection && window.scrollY < firstSection.offsetTop - (window.innerHeight * 0.35)) {
      clearActiveSection();
    }
  }

  updateTopState();
  window.addEventListener("scroll", updateTopState, { passive: true });

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", updateTopState);
  };
}

export function initializeRevealMotion(elements) {
  const revealElements = [...elements];

  if (revealElements.length === 0) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return () => {};
  }

  document.documentElement.classList.add("motion-ready");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -8%",
    threshold: 0.12
  });
  
  revealElements.forEach((element) => observer.observe(element));

  const fallbackTimeout = setTimeout(() => {
    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0 && !element.classList.contains("is-visible")) {
        element.classList.add("is-visible");
        observer.unobserve(element);
      }
    });
  }, 2000);

  return () => {
    observer.disconnect();
    clearTimeout(fallbackTimeout);
  };
}

export function initializeEmailCopy({ button, emailLink, status }) {
  if (!button || !emailLink || !status) {
    return () => {};
  }

  const onButtonClick = async () => {
    if (!navigator.clipboard) {
      status.textContent = "Tu navegador no permite copiar automáticamente.";
      return;
    }

    try {
      await navigator.clipboard.writeText(emailLink.textContent.trim());
      status.textContent = "Email copiado al portapapeles.";
      window.plausible && window.plausible('Contact Intent', { props: { type: 'Copy Email' } });
    } catch {
      status.textContent = "No se ha podido copiar. Puedes abrir el enlace de email.";
    }
  };

  button.addEventListener("click", onButtonClick);

  return () => {
    button.removeEventListener("click", onButtonClick);
  };
}
