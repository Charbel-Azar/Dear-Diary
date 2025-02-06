document.addEventListener('DOMContentLoaded', function() {
    const videoRows = document.querySelectorAll('.video-row');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    }
  
    // Function to handle scroll
    function handleScroll() {
      videoRows.forEach(row => {
        if (isInViewport(row)) {
          row.classList.add('visible');
        }
      });
    }
  
    // Initial check
    handleScroll();
  
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
  
    // Handle video muting/unmuting
    const volumeBtns = document.querySelectorAll('.volume-btn');
    volumeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const video = this.parentElement.querySelector('video');
        const icon = this.querySelector('i');
        
        if (video.muted) {
          video.muted = false;
          icon.classList.remove('fa-volume-mute');
          icon.classList.add('fa-volume-up');
        } else {
          video.muted = true;
          icon.classList.remove('fa-volume-up');
          icon.classList.add('fa-volume-mute');
        }
      });
    });
  
    // Start playing videos when they become visible
    const videos = document.querySelectorAll('.video-wrapper video');
    videos.forEach(video => {
      video.play().catch(function(error) {
        console.log("Video play failed:", error);
      });
    });
  });