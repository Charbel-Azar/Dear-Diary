document.addEventListener('DOMContentLoaded', function() {
    // Disable scrolling initially
    document.body.classList.add('no-scroll');
    
    // Loading screen duration: 5 seconds
    const LOADING_DURATION = 5000; // 5 seconds
    const FADE_DURATION = 1000;    // 1 second for fade animation
    
    // Handle loading screen and enable scrolling
    setTimeout(() => {
      const loadingScreen = document.getElementById("loading-screen");
      const mainContent = document.getElementById("main-content");
      
      loadingScreen.classList.add("hide");
      
      // Wait for fade animation to complete
      setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
        document.body.classList.remove('no-scroll'); // Enable scrolling
      }, FADE_DURATION);
      
    }, LOADING_DURATION);
  
    // Navigation transparency and glass effect
    window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  
    // Mobile menu functionality
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });
  
      // Close menu when clicking a link
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
          menuBtn.classList.remove('active');
          mobileMenu.classList.remove('active');
        });
      });
    }
  });