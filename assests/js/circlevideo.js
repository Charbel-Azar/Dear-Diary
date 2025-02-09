document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.expanding-video');
    const wrapper = document.querySelector('.video-wrapper');
    let videoStarted = false;
  
    // Add volume button
    const volumeBtn = document.createElement('button');
    volumeBtn.className = 'volume-btn';
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    wrapper.appendChild(volumeBtn);
  
    // Volume control
    let isMuted = true;
    volumeBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      video.muted = isMuted;
      volumeBtn.innerHTML = isMuted ?
        '<i class="fas fa-volume-mute"></i>' :
        '<i class="fas fa-volume-up"></i>';
    });
  
    function updateVideoSize() {
      const rect = wrapper.getBoundingClientRect();
  
      // Use a longer scroll distance to slow the transition (adjust as needed)
      const transitionDistance = window.innerHeight; // increased from window.innerHeight/3
      let scrollPercent = (transitionDistance - rect.top) / transitionDistance;
      scrollPercent = Math.min(Math.max(scrollPercent, 0), 1); // Clamp between 0 and 1
  
      // Show/hide volume button based on video state
      if (video.style.borderRadius === '50%') {
        volumeBtn.classList.add('visible');
      } else if (scrollPercent >= 1) {
        volumeBtn.classList.remove('visible');
      }
  
      if (scrollPercent > 0 && !videoStarted) {
        video.play();
        videoStarted = true;
      }
  
      if (scrollPercent === 0) {
        // Reset to circle state
        video.style.width = '200px';
        video.style.height = '200px';
        video.style.borderRadius = '50%';
        videoStarted = false;
        video.pause();
        volumeBtn.classList.add('visible');
      } else if (scrollPercent === 1) {
        // Fully expanded state
        video.style.width = '100%';
        video.style.height = '100vh';
        video.style.borderRadius = '0';
        volumeBtn.classList.remove('visible');
      } else {
        // Transitioning state
        const size = 200 + (scrollPercent * (window.innerWidth - 200));
        const heightSize = 200 + (scrollPercent * (window.innerHeight - 200));
        const borderRadius = 50 - (scrollPercent * 50);
        
        video.style.width = `${size}px`;
        video.style.height = `${heightSize}px`;
        video.style.borderRadius = `${borderRadius}%`;
        
        // Fade out volume button during transition
        volumeBtn.style.opacity = Math.max(0, 1 - scrollPercent);
      }
    }
  
    window.addEventListener('scroll', updateVideoSize);
    updateVideoSize(); // Initial call
  });
  