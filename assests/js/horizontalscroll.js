document.addEventListener('DOMContentLoaded', function() {
    const section = document.querySelector('.video-scroll-section');
    const spacer = document.querySelector('.section-spacer');
    const gallery = document.querySelector('.video-gallery');
    const videos = document.querySelectorAll('.sliding-video');
    let animationComplete = false;
    let lastScrollTop = 0;
    let isInView = false;
  
    // Play/pause videos based on visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play();
          isInView = true;
        } else {
          entry.target.pause();
          isInView = false;
        }
      });
    }, { threshold: 0.1 });
  
    observer.observe(section);
  
    // Calculate total scroll distance needed
    const totalScrollDistance = gallery.scrollWidth;
    
    window.addEventListener('scroll', () => {
      if (!isInView || animationComplete) return;
  
      const sectionRect = spacer.getBoundingClientRect();
      const scrollProgress = Math.max(0, -sectionRect.top) / (spacer.offsetHeight - window.innerHeight);
      
      // Calculate translation based on scroll progress
      const translateX = Math.min(totalScrollDistance, scrollProgress * totalScrollDistance);
      
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        gallery.style.transform = `rotate(-10deg) translateX(-${translateX}px)`;
        
        // Lock scroll if trying to scroll too fast
        if (Math.abs(window.scrollY - lastScrollTop) > 50) {
          window.scrollTo(0, lastScrollTop);
        }
      }
  
      // Check if animation is complete
      if (scrollProgress >= 1 && !animationComplete) {
        animationComplete = true;
        // Optional: Add a smooth transition when animation completes
        gallery.style.transition = 'transform 0.5s ease-out';
      }
  
      lastScrollTop = window.scrollY;
    });
  
    // Prevent rapid scrolling through section
    window.addEventListener('wheel', (e) => {
      if (isInView && !animationComplete) {
        e.preventDefault();
        const smoothScroll = e.deltaY * 0.5; // Adjust scroll speed
        window.scrollBy(0, smoothScroll);
      }
    }, { passive: false });
  });