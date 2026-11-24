export function initDrag(grid, getLinks, setLinks) {
  let drag = null;
  let suppressClick = false;

  function startDrag() {
    const { card } = drag;
    const rect = card.getBoundingClientRect();

    drag.active = true;
    drag.offX = drag.x - rect.left;
    drag.offY = drag.y - rect.top;

    const ghost = card.cloneNode(true);
    ghost.classList.add("drag-ghost");
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    document.body.appendChild(ghost);

    drag.ghost = ghost;
    card.classList.add("dragging");
    document.body.classList.add("is-dragging");
    moveDrag();
  }

  function moveDrag() {
    const { ghost, card } = drag;
    ghost.style.left = `${drag.x - drag.offX}px`;
    ghost.style.top = `${drag.y - drag.offY}px`;

    const target = document.elementFromPoint(drag.x, drag.y)?.closest(".link-card");
    if (!target || target === card || !grid.contains(target)) return;

    const cards = [...grid.children];
    if (cards.indexOf(target) > cards.indexOf(card)) {
      target.after(card);
    } else {
      target.before(card);
    }
  }

  function endDrag() {
    if (!drag) return;

    window.clearTimeout(drag.timer);

    if (drag.active) {
      drag.ghost.remove();
      drag.card.classList.remove("dragging");
      document.body.classList.remove("is-dragging");

      const orderedLinks = [...grid.children]
        .map((element) => element._link)
        .filter(Boolean);

      if (orderedLinks.length === getLinks().length) {
        setLinks(orderedLinks);
      }

      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 80);
    }

    drag = null;
  }

  grid.addEventListener("dragstart", (event) => event.preventDefault());
  grid.addEventListener("contextmenu", (event) => {
    if (drag?.active) event.preventDefault();
  });

  grid.addEventListener("click", (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  grid.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".delete-link")) return;

    const card = event.target.closest(".link-card");
    if (!card) return;

    drag = {
      card,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      active: false,
      touch: event.pointerType !== "mouse",
      timer: null
    };

    if (drag.touch) {
      drag.timer = window.setTimeout(() => {
        if (drag) startDrag();
      }, 350);
    }
  });

  window.addEventListener("pointermove", (event) => {
    if (!drag) return;

    drag.x = event.clientX;
    drag.y = event.clientY;

    if (!drag.active) {
      const moved = Math.hypot(
        drag.x - drag.startX,
        drag.y - drag.startY
      );

      if (drag.touch && moved > 10) {
        window.clearTimeout(drag.timer);
        drag = null;
      } else if (!drag.touch && moved > 5) {
        startDrag();
      }
      return;
    }

    moveDrag();
  });

  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  document.addEventListener("touchmove", (event) => {
    if (drag?.active) event.preventDefault();
  }, { passive: false });
}
