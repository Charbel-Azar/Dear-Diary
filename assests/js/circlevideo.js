document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.expanding-video');
  const wrapper = document.querySelector('.video-wrapper');
  let videoStarted = false;

  function updateVideoSize() {
    const rect = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how much of the video is in the viewport
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    
    // Calculate visibility percentage
    const visibilityPercent = visibleHeight / viewportHeight;
    
    // Calculate scroll percentage for sizing
    const transitionDistance = window.innerHeight; 
    let scrollPercent = (transitionDistance - rect.top) / transitionDistance;
    scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);

    // Set volume based on visibility
    video.volume = visibilityPercent;
    
    // Mute if barely visible
    if (visibilityPercent < 0.1) {
      video.muted = true;
    } else {
      video.muted = false;
    }

    // Play/pause video based on visibility
    if (visibilityPercent > 0 && !videoStarted) {
      video.play();
      videoStarted = true;
    } else if (visibilityPercent === 0) {
      video.pause();
      videoStarted = false;
    }

    // Handle video sizing based on scroll percentage
    if (scrollPercent === 0) {
      // Reset to circle
      video.style.width = '200px';
      video.style.height = '200px';
      video.style.borderRadius = '50%';
    } else if (scrollPercent === 1) {
      // Fully expanded
      video.style.width = '100%';
      video.style.height = '100vh';
      video.style.borderRadius = '0';
    } else {
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
  updateVideoSize(); // initial call
});