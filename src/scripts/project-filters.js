import { message } from './locale.js';

function formatProjectCount(count) {
  return message(count === 1 ? 'projectSingular' : 'projectPlural', { count });
}

export function initializeProjectFilters({ container, count, toolbar }) {
  if (!container || !count || !toolbar) {
    return;
  }

  const buttons = [...toolbar.querySelectorAll("[data-project-filter]")];
  const cards = [...container.querySelectorAll("[data-project-card]")];

  buttons.forEach((button) => {
    const filterCategory = button.dataset.projectFilter;
    const badge = button.querySelector("[data-filter-count]");
    if (badge) {
      const matchCount = filterCategory === "all"
        ? cards.length
        : cards.filter((card) => {
            const categories = card.dataset.categories?.split(" ") ?? [];
            return categories.includes(filterCategory);
          }).length;
      badge.textContent = String(matchCount);
    }
  });

  function updateIndicator(activeButton) {
    if (!activeButton) return;
    const group = activeButton.closest('.filter-group');
    if (group) {
      group.style.setProperty('--indicator-left', `${activeButton.offsetLeft}px`);
      group.style.setProperty('--indicator-width', `${activeButton.offsetWidth}px`);
    }
  }

  function applyFilter(selectedCategory) {
    container.classList.add("is-filtering");

    setTimeout(() => {
      let visibleCount = 0;

      cards.forEach((card) => {
        const categories = card.dataset.categories?.split(" ") ?? [];
        const isVisible = selectedCategory === "all" || categories.includes(selectedCategory);
        card.hidden = !isVisible;

        if (isVisible) {
          visibleCount++;
        }
      });

      let activeButton = null;
      buttons.forEach((button) => {
        const isActive = button.dataset.projectFilter === selectedCategory;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
        if (isActive) {
          activeButton = button;
          updateIndicator(activeButton);
        }
      });

      count.textContent = formatProjectCount(visibleCount);

      // Force reflow before removing class to ensure transition plays
      container.offsetHeight;
      container.classList.remove("is-filtering");
    }, 150);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.projectFilter));
  });

  const handleResize = () => {
    const active = toolbar.querySelector(".filter-button.is-active");
    updateIndicator(active);
  };
  window.addEventListener("resize", handleResize, { passive: true });

  toolbar.hidden = false;
  applyFilter("all");

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}
