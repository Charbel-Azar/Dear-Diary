document.addEventListener('DOMContentLoaded', () => {
  const notebook = document.querySelector('.notebook');
  const pages = Array.from(document.querySelectorAll('.page'));
  const spacer = document.querySelector('.scroll-spacer');
  const storySection = document.querySelector('.story-section');

  let currentZ = pages.length;
  let lastScrollPos = window.scrollY;
  let activePageIndex = -1;
  let animationInProgress = false;

  // Slide config for phone vs. desktop
  const slideConfig = {
    mobile: {
      centerSlide: 7,
      finalSlide: 8
    },
    desktop: {
      centerSlide: 25,
      finalSlide: 25
    },
    breakpoint: 768
  };

  // Disable direct click pointer events on pages if you want scroll-only flipping
  pages.forEach(page => {
    page.style.pointerEvents = 'none';
  });

  // A helper to pick which slide distances to use
  function getSlideAmounts() {
    const isMobile = window.innerWidth < slideConfig.breakpoint;
    return isMobile ? slideConfig.mobile : slideConfig.desktop;
  }

  // Smoothly position the notebook horizontally based on scroll progress
  function updateNotebookPosition(scrollPosition) {
    const { centerSlide, finalSlide } = getSlideAmounts();
    const sectionTop = storySection.offsetTop;
    const scrollInSection = scrollPosition - sectionTop;
    const maxScroll = spacer.offsetHeight; // total range inside this section
    const scrollProgress = Math.max(0, Math.min(1, scrollInSection / maxScroll));

    // From 0 -> centerSlide in the first ~3% of the scroll
    if (scrollProgress < 0.1) {
      const slideProgress = scrollProgress / 0.1;
      let slideAmount = centerSlide * slideProgress;
      notebook.style.transform = `
        translateY(-50%) perspective(1500px) translateX(${slideAmount}vh)
      `;
    }
    // Then centerSlide -> finalSlide in the last ~3%
    else if (scrollProgress > 0.9) {
      const finalSlideProgress = (scrollProgress - 0.9) / 0.1;
      let finalSlideAmount = centerSlide + (finalSlide * finalSlideProgress);
      
      // Clamp the final slide
      const maxValue = window.innerWidth < slideConfig.breakpoint ? 20 : 60; 
      finalSlideAmount = Math.min(finalSlideAmount, maxValue);

      notebook.style.transform = `
        translateY(-50%) perspective(1500px) translateX(${finalSlideAmount}vh)
      `;
    }
    // Otherwise, remain at centerSlide
    else {
      notebook.style.transform = `
        translateY(-50%) perspective(1500px) translateX(${centerSlide}vh)
      `;
    }
  }

  // Reset all pages to "closed"
  function resetPageStates() {
    animationInProgress = true;
    pages.forEach((page, index) => {
      page.classList.remove('active');
      page.style.zIndex = pages.length - index; 
      // Keep the normal flip transition
      page.style.transition = 'transform 0.8s ease-in-out';
    });

    setTimeout(() => {
      currentZ = pages.length;
      activePageIndex = -1;
      animationInProgress = false;
    }, 800);
  }

  // Calculate scroll threshold for each page
  function getScrollThreshold(index) {
    const sectionTop = storySection.offsetTop;
    const totalScrollRange = spacer.offsetHeight;
    const pageScrollRange = totalScrollRange / pages.length;
    return sectionTop + pageScrollRange * (index + 1);
  }

  // Main logic: open or close pages based on scroll direction
  function updatePages() {
    if (animationInProgress) return;
    const scrollPosition = window.scrollY;
    const scrollDirection = scrollPosition > lastScrollPos ? 'down' : 'up';

    updateNotebookPosition(scrollPosition);

    pages.forEach((page, index) => {
      const threshold = getScrollThreshold(index);

      if (scrollDirection === 'down') {
        // If going down & crossing threshold for the next page to open
        if (!page.classList.contains('active') && index > activePageIndex) {
          if (scrollPosition > threshold) {
            flipPage(page, index, true); // open
          }
        }
      } else {
        // If going up & above the threshold for the current active page, close it
        if (page.classList.contains('active') && index === activePageIndex) {
          if (scrollPosition < threshold) {
            flipPage(page, index, false); // close
          }
        }
      }
    });

    lastScrollPos = scrollPosition;
  }

  // Flip a single page open or closed
  function flipPage(page, index, isOpening) {
    if (animationInProgress) return;
    animationInProgress = true;

    if (isOpening) {
      page.classList.add('active');
      // Bring this page on top for flipping
      page.style.zIndex = currentZ++;
      activePageIndex = index;
    } else {
      // Remove "active" so it flips back
      page.classList.remove('active');
      // NOTE: we do NOT immediately change z-index here.
      // Let transitionend handle that so it stays on top while flipping shut.
      activePageIndex = index - 1;
    }

    setTimeout(() => {
      animationInProgress = false;
      updatePages();
    }, 800);
  }

  // After a transition ends, if the page is closed, push it behind
  pages.forEach(page => {
    page.addEventListener('transitionend', () => {
      if (!page.classList.contains('active')) {
        // Only set the zIndex if it’s no longer active (closed)
        // This avoids flicker when flipping shut.
        page.style.zIndex = pages.length - pages.indexOf(page);
      }
    });
  });

  // Use requestAnimationFrame to batch scroll updates
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updatePages();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Re-check positions on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updatePages();
    }, 200);
  });

  // Initialize closed
  resetPageStates();
});

