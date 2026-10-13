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

  let topStateRequested = false;
  function onScrollTopState() {
    if (!topStateRequested) {
      window.requestAnimationFrame(() => {
        const firstSection = sections[0];
        if (firstSection && window.scrollY < firstSection.offsetTop - (window.innerHeight * 0.35)) {
          clearActiveSection();
        }
        topStateRequested = false;
      });
      topStateRequested = true;
    }
  }

  onScrollTopState();
  window.addEventListener("scroll", onScrollTopState, { passive: true });

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", onScrollTopState);
  };
}

export function initializeRevealMotion(elements) {
  const revealElements = [...elements];

  if (revealElements.length === 0) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Low-performance CSS already shows every reveal element; observers would only add work (PERF-014).
  const lowPerformance = document.documentElement.classList.contains("low-performance");

  if (reducedMotion || lowPerformance || !("IntersectionObserver" in window)) {
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
  
  // IntersectionObserver reports the initial state of every target, so no layout-reading fallback is needed.
  revealElements.forEach((element) => observer.observe(element));

  return () => {
    observer.disconnect();
  };
}

export function initializeEmailCopy({ button, status }) {
  if (!button || !status) {
    return () => {};
  }

  const { emailUser, emailDomain } = button.dataset;
  if (!emailUser || !emailDomain) {
    return () => {};
  }
  const address = `${emailUser}@${emailDomain}`;

  const onButtonClick = async () => {
    if (!navigator.clipboard) {
      status.textContent = message('copyUnavailable');
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      status.textContent = message('copySuccess');
      window.plausible && window.plausible('Contact Intent', { props: { type: 'Copy Email' } });
    } catch {
      status.textContent = message('copyError');
    }
  };

  button.addEventListener("click", onButtonClick);

  return () => {
    button.removeEventListener("click", onButtonClick);
  };
}
import { message } from './locale.js';
