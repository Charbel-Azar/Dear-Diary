/* Add this to your JavaScript file */
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.expanding-video');
    const wrapper = document.querySelector('.video-wrapper');
    let videoStarted = false;
  
    function updateVideoSize() {
      const rect = wrapper.getBoundingClientRect();
      const scrollPercent = (window.innerHeight / 3 - rect.top) / (window.innerHeight / 3);
      
      if (scrollPercent >= 0 && !videoStarted) {
        video.play();
        videoStarted = true;
      }
  
      if (scrollPercent < 0) {
        // Reset to circle
        video.style.width = '200px';
        video.style.height = '200px';
        video.style.borderRadius = '50%';
        videoStarted = false;
        video.pause();
      } else if (scrollPercent >= 1) {
        // Fully expanded
        video.style.width = '100%';
        video.style.height = '100vh';
        video.style.borderRadius = '0';
      } else if (scrollPercent >= 0) {
        // Transitioning
        const size = 200 + (scrollPercent * (window.innerWidth - 200));
        const heightSize = 200 + (scrollPercent * (window.innerHeight - 200));
        const borderRadius = 50 - (scrollPercent * 50);
        
        video.style.width = `${size}px`;
        video.style.height = `${heightSize}px`;
        video.style.borderRadius = `${borderRadius}%`;
      }
    }
  
    window.addEventListener('scroll', updateVideoSize);
    updateVideoSize(); // Initial call
  });