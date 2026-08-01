function formatProjectCount(count) {
  return `${count} ${count === 1 ? "proyecto" : "proyectos"}`;
}

export function initializeProjectFilters({ container, count, toolbar }) {
  if (!container || !count || !toolbar) {
    return;
  }

  const buttons = [...toolbar.querySelectorAll("[data-project-filter]")];
  const cards = [...container.querySelectorAll("[data-project-card]")];

  function applyFilter(selectedCategory) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = card.dataset.categories?.split(" ") ?? [];
      const isVisible = selectedCategory === "all" || categories.includes(selectedCategory);
      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.projectFilter === selectedCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    count.textContent = formatProjectCount(visibleCount);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.projectFilter));
  });

  toolbar.hidden = false;
  applyFilter("all");
}
