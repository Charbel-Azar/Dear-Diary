document.addEventListener('DOMContentLoaded', function() {
  // Store initial scroll position
  const initialScroll = window.scrollY;
  
  // Force scroll to top when loading screen is active
  window.scrollTo(0, 0);
  document.body.classList.add('no-scroll');

  const container = document.querySelector('.containercamera');
  const video = document.querySelector('.videocamera');
  const flash = document.querySelector('.flash');
  
  // Preload audio for better timing
  const shutterSound = new Audio('./assests/images/camera/camera.mp3');
  shutterSound.preload = 'auto';

  setTimeout(() => {
    document.getElementById("loading-screen").classList.add("hide");
    setTimeout(() => {
      document.getElementById("loading-screen").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      document.body.classList.remove('no-scroll');
      // Restore scroll position
      window.scrollTo(0, initialScroll);
      video.pause();
    }, 1000);
  }, 2500);

  function triggerFlash() {
    flash.style.opacity = '1';
    setTimeout(() => {
      flash.style.transition = 'opacity 0.5s ease';
      flash.style.opacity = '0';
      setTimeout(() => {
        flash.style.transition = '';
      }, 500);
    }, 50);
  }

  function createPolaroid(x, y, capturedImage) {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    polaroid.style.zIndex = 99999;
    
    // Adjust positioning to be relative to viewport
    const viewportX = x - window.scrollX;
    const viewportY = y - window.scrollY;

    const rotation = Math.random() * 20 - 10;
    polaroid.style.setProperty('--rotation', `${rotation}deg`);
    
    // Use fixed positioning for viewport-relative placement
    polaroid.style.position = 'fixed';
    polaroid.style.left = `${Math.min(Math.max(viewportX - 100, 0), window.innerWidth - 230)}px`;
    polaroid.style.top = `${Math.min(Math.max(viewportY - 100, 0), window.innerHeight - 230)}px`;

    const image = document.createElement('div');
    image.className = 'polaroid-image';
    image.appendChild(capturedImage);
    
    polaroid.appendChild(image);
    document.body.appendChild(polaroid);

    requestAnimationFrame(() => {
      polaroid.classList.add('show');
    });

    setTimeout(() => {
      polaroid.classList.add('fade-out');
    }, 4000);

    setTimeout(() => {
      polaroid.remove();
    }, 5000);
  }

  const captureCanvas = document.createElement('canvas');
  const ctx = captureCanvas.getContext('2d');

  container.addEventListener('click', async (e) => {
    // Play audio immediately on click
    shutterSound.currentTime = 0;
    shutterSound.play();
    
    // Trigger flash immediately
    triggerFlash();

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    captureCanvas.width = 200;
    captureCanvas.height = 200;

    const sourceX = Math.max(0, x - 100);
    const sourceY = Math.max(0, y - 100);
    const sourceWidth = Math.min(200, video.videoWidth - sourceX);
    const sourceHeight = Math.min(200, video.videoHeight - sourceY);

    ctx.drawImage(
      video,
      sourceX * (video.videoWidth / rect.width),
      sourceY * (video.videoHeight / rect.height),
      sourceWidth,
      sourceHeight,
      0,
      0,
      captureCanvas.width,
      captureCanvas.height
    );

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = captureCanvas.width;
    finalCanvas.height = captureCanvas.height;
    const finalCtx = finalCanvas.getContext('2d');

    finalCtx.beginPath();
    finalCtx.roundRect(0, 0, finalCanvas.width, finalCanvas.height, 5);
    finalCtx.clip();
    finalCtx.drawImage(captureCanvas, 0, 0);

    createPolaroid(e.pageX, e.pageY, finalCanvas);
  });
});