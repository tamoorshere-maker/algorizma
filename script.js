(() => {
  const story = document.querySelector(".story");
  const stage = document.querySelector(".story-stage");

  if (!story || !stage) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const gallery = stage.querySelector(".scene-gallery");
  const captions = [
    stage.querySelector(".caption-one"),
    stage.querySelector(".caption-two"),
    stage.querySelector(".caption-three")
  ];

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const ramp = (progress, start, end) =>
    clamp((progress - start) / (end - start));

  let scheduled = false;

  function updateStory() {
    const distance = story.offsetHeight - window.innerHeight;
    const travelled = -story.getBoundingClientRect().top;
    const progress = distance > 0 ? clamp(travelled / distance) : 0;

    /* Crossfade only the surroundings. The painting is untouched. */
    gallery.style.opacity = ramp(progress, 0.32, 0.72);

    const opacities = [
      1 - ramp(progress, 0.12, 0.32),
      ramp(progress, 0.23, 0.39) * (1 - ramp(progress, 0.58, 0.75)),
      ramp(progress, 0.68, 0.88)
    ];

    captions.forEach((caption, index) => {
      caption.style.opacity = opacities[index];
      caption.style.transform =
        `translateY(${Math.round((1 - opacities[index]) * 22)}px)`;
    });

    scheduled = false;
  }

  function requestUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateStory);
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateStory();
})();
