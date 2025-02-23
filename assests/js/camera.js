document.addEventListener('DOMContentLoaded', function() {
  // Store initial scroll position
  const initialScroll = window.scrollY;
  
  // Force scroll to top when loading screen is active
  window.scrollTo(0, 0);
  document.body.classList.add('no-scroll');

  // Get DOM elements
  const container = document.querySelector('.containercamera');
  const video = document.querySelector('.videocamera');
  const flash = document.querySelector('.flash');
  const skipButton = document.getElementById('skip-button');
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  
  // Create and setup crosshair
  const crosshair = document.createElement('img');
  crosshair.src = './assests/images/camera/frame.png'; // Replace with your image path
  crosshair.className = 'custom-crosshair';
  document.body.appendChild(crosshair);
  container.style.cursor = 'none';

  // Track cursor movement
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom) {
      crosshair.style.display = 'block';
      crosshair.style.left = `${e.pageX}px`;
      crosshair.style.top = `${e.pageY}px`;
    } else {
      crosshair.style.display = 'none';
    }
  });

  // Hide crosshair when leaving container
  container.addEventListener('mouseleave', () => {
    crosshair.style.display = 'none';
  });
  
  // Preload audio for better timing
  const shutterSound = new Audio('./assests/images/camera/camera.mp3');
  shutterSound.preload = 'auto';

  // Track loading state
  let isFullyLoaded = false;

  // Function to check if everything is loaded
  function checkIfLoaded() {
    if (document.readyState === 'complete') {
      isFullyLoaded = true;
      // Fade in skip button after 5 seconds if content isn't loaded
      setTimeout(() => {
        if (!loadingScreen.classList.contains('hide')) {
          skipButton.style.display = 'block';
          requestAnimationFrame(() => {
            skipButton.classList.add('show');
          });
        }
      }, 5000);
    }
  }

  // Function to end loading screen
  function endLoadingScreen() {
    if (isFullyLoaded || event.type === 'click') {
      skipButton.classList.remove('show');
      
      setTimeout(() => {
        loadingScreen.classList.add("hide");
        setTimeout(() => {
          loadingScreen.style.display = "none";
          mainContent.style.display = "block";
          document.body.classList.remove('no-scroll');
          window.scrollTo(0, initialScroll);
          video.pause();
          crosshair.remove(); // Clean up crosshair when loading screen ends
        }, 1000);
      }, 500);
    }
  }

  // Add load event listeners
  window.addEventListener('load', checkIfLoaded);
  
  // Check if already loaded
  if (document.readyState === 'complete') {
    checkIfLoaded();
  }

  // Skip button click handler
  skipButton.addEventListener('click', (event) => {
    endLoadingScreen();
  });

  // Natural loading screen end after 15 seconds
  setTimeout(() => {
    if (isFullyLoaded) {
      endLoadingScreen();
    } else {
      const waitForLoad = setInterval(() => {
        if (isFullyLoaded) {
          endLoadingScreen();
          clearInterval(waitForLoad);
        }
      }, 100);
    }
  }, 15000);

  // Flash effect function
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

  // Polaroid creation function
  function createPolaroid(x, y, capturedImage) {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    polaroid.style.zIndex = 99999;
    
    // Adjust positioning to be relative to viewport
    const viewportX = x - window.scrollX;
    const viewportY = y - window.scrollY;

    const rotation = Math.random() * 20 - 10;
    polaroid.style.setProperty('--rotation', `${rotation}deg`);
    
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

  // Setup canvas for capturing
  const captureCanvas = document.createElement('canvas');
  const ctx = captureCanvas.getContext('2d');

  // Camera click handler
  container.addEventListener('click', async (e) => {
    shutterSound.currentTime = 0;
    shutterSound.play();
    
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