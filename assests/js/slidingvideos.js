document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.video-row video');
    const leftRows = document.querySelectorAll('.row-left');
    const rightRows = document.querySelectorAll('.row-right');
  
    // Clone videos for infinite scroll
    function cloneForInfiniteScroll(row) {
      const videos = Array.from(row.children);
      videos.forEach(video => {
        const clone = video.cloneNode(true);
        row.appendChild(clone);
      });
    }
  
    leftRows.forEach(cloneForInfiniteScroll);
    rightRows.forEach(cloneForInfiniteScroll);
  
    // Video interaction setup
    videos.forEach(video => {
      // Add autoplay attribute
      video.setAttribute('autoplay', '');
      video.muted = true;
      
      // Touch and mouse event handlers
      const startPlayback = () => {
        video.muted = false;
        video.style.filter = 'grayscale(0%)';
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Playback failed:", error);
          });
        }
      };
  
      const stopPlayback = () => {
        video.muted = true;
        video.style.filter = 'grayscale(100%)';
        video.pause();
      };
  
      // Mouse events
      video.addEventListener('mouseenter', startPlayback);
      video.addEventListener('mouseleave', stopPlayback);
  
      // Touch events
      video.addEventListener('touchstart', startPlayback);
      video.addEventListener('touchend', stopPlayback);
    });
  });