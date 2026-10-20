/* script.js */
document.addEventListener('DOMContentLoaded', () => {
  const storySection = document.querySelector('.story');
  const captions = document.querySelectorAll('.story-caption');

  if (storySection) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Toggle backgrounds at mid-scroll
      if (scrollPos > windowHeight * 0.8) {
        storySection.classList.add('scrolled');
      } else {
        storySection.classList.remove('scrolled');
      }

      // Simple scroll text switcher logic
      let activeIndex = 0;
      if (scrollPos > windowHeight * 1.5) {
        activeIndex = 2;
      } else if (scrollPos > windowHeight * 0.6) {
        activeIndex = 1;
      }

      captions.forEach((cap, idx) => {
        if (idx === activeIndex) {
          cap.classList.add('active');
        } else {
          cap.classList.remove('active');
        }
      });
    });
  }
});
