document.addEventListener('DOMContentLoaded', () => {
  const notebook = document.querySelector('.notebook');
  const pages = Array.from(document.querySelectorAll('.page'));
  const spacer = document.querySelector('.scroll-spacer');
  const storySection = document.querySelector('.story-section');
  let currentZ = pages.length;
  let lastScrollPosition = window.scrollY;
  let animationInProgress = false;
  let activePageIndex = -1;
  
  // Configure your slide amounts here
  const slideConfig = {
    mobile: {
      centerSlide: 9,
      finalSlide: 10
    },
    desktop: {
      centerSlide: 25,
      finalSlide: 25
    },
    breakpoint: 768
  };
  
  // Prevent click interactions on pages
  pages.forEach(page => {
    page.style.pointerEvents = 'none';
  });
  
  // Calculate heights
  const sectionHeight = storySection.offsetHeight;
  const pageHeight = spacer.offsetHeight / pages.length;
  
  function getSlideAmounts() {
    const isMobile = window.innerWidth < slideConfig.breakpoint;
    return isMobile ? slideConfig.mobile : slideConfig.desktop;
  }
  
  function updateNotebookPosition(scrollPosition) {
    const { centerSlide, finalSlide } = getSlideAmounts();
    const sectionTop = storySection.offsetTop;
    const scrollInSection = scrollPosition - sectionTop;
    const scrollProgress = Math.max(0, Math.min(1, scrollInSection / spacer.offsetHeight));
    
    if (scrollProgress < 0.03) {
      const slideProgress = scrollProgress / 0.03;
      const slideAmount = centerSlide * slideProgress;
      notebook.style.transform = `translateY(-50%) perspective(1500px) translateX(${slideAmount}vh)`;
    }
    else if (scrollProgress > 0.97) {
      const finalSlideProgress = (scrollProgress - 0.97) / 0.03;
      const finalSlideAmount = centerSlide + (finalSlide * finalSlideProgress);
      notebook.style.transform = `translateY(-50%) perspective(1500px) translateX(${finalSlideAmount}vh)`;
    }
    else {
      notebook.style.transform = `translateY(-50%) perspective(1500px) translateX(${centerSlide}vh)`;
    }
  }
  
  function resetPageStates() {
    animationInProgress = true;
    pages.forEach((page, index) => {
      page.classList.remove('active');
      page.style.zIndex = pages.length - index;
      page.style.transition = 'transform 0.5s ease-in-out';
    });
    
    setTimeout(() => {
      currentZ = pages.length;
      activePageIndex = -1;
      animationInProgress = false;
    }, 500);
  }
  
  function getScrollThreshold(index) {
    const sectionTop = storySection.offsetTop;
    const totalScrollRange = spacer.offsetHeight;
    const pageScrollRange = totalScrollRange / pages.length;
    return sectionTop + (pageScrollRange * (index + 1));
  }
  
  function updatePages() {
    if (animationInProgress) return;
    
    const scrollPosition = window.scrollY;
    const scrollDirection = scrollPosition > lastScrollPosition ? 'down' : 'up';
    const sectionTop = storySection.offsetTop;
    const sectionBottom = sectionTop + spacer.offsetHeight;
    
    updateNotebookPosition(scrollPosition);
    
    // Calculate scroll progress for each page
    pages.forEach((page, index) => {
      const threshold = getScrollThreshold(index);
      const nextThreshold = index < pages.length - 1 ? getScrollThreshold(index + 1) : sectionBottom;
      const pageScrollProgress = (scrollPosition - threshold) / (nextThreshold - threshold);
      
      if (scrollDirection === 'down') {
        if (!page.classList.contains('active') && index > activePageIndex) {
          if (scrollPosition > threshold) {
            flipPage(page, index, true);
            return;
          }
        }
      } else if (scrollDirection === 'up') {
        if (page.classList.contains('active') && index === activePageIndex) {
          if (scrollPosition < threshold) {
            flipPage(page, index, false);
            return;
          }
        }
      }
    });
    
    lastScrollPosition = scrollPosition;
  }
  
  function flipPage(page, index, isOpening) {
    if (animationInProgress) return;
    animationInProgress = true;
    
    if (isOpening) {
      page.classList.add('active');
      page.style.zIndex = currentZ++;
      activePageIndex = index;
    } else {
      page.classList.remove('active');
      page.style.zIndex = pages.length - index;
      activePageIndex = index - 1;
    }
    
    setTimeout(() => {
      animationInProgress = false;
      updatePages();
    }, 500);
  }

  // Add transition end listener to handle interrupted animations
  pages.forEach(page => {
    page.addEventListener('transitionend', () => {
      if (!page.classList.contains('active')) {
        page.style.zIndex = pages.length - Array.from(pages).indexOf(page);
      }
    });
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updatePages();
    }, 100);
  });

  let scrollTimeout;
  let lastScrollTime = Date.now();
  
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    const currentTime = Date.now();
    
    // Throttle scroll events
    if (currentTime - lastScrollTime > 16) { // ~60fps
      if (!animationInProgress) {
        window.requestAnimationFrame(() => {
          updatePages();
        });
      }
      lastScrollTime = currentTime;
    }
    
    // Reset scroll position check
    scrollTimeout = setTimeout(() => {
      if (window.scrollY <= storySection.offsetTop) {
        notebook.style.transform = 'translateY(-50%) perspective(1500px)';
        resetPageStates();
      }
    }, 50);
  });

  // Initial state setup
  resetPageStates();
});