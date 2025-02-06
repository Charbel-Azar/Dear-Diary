document.addEventListener('DOMContentLoaded', function() {
    const secretButton = document.querySelector('.secret-button');
    const buttonKey = secretButton.querySelector('.button-key');
    const flyingKey = document.querySelector('.flying-key');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let hasBouncedOnce = false;
    let buttonClickable = false;
    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;
    let friction = 0.995;
    let animationFrameId;
    let rotationSpeed = 0;
    const maxRotationSpeed = 5;
  
    function startKeyAnimation() {
      if (hasBouncedOnce) return;
      
      const keyRect = buttonKey.getBoundingClientRect();
      
      // Position flying key exactly where the button key is
      xOffset = keyRect.left;
      yOffset = keyRect.top;
      
      // Make the key visible immediately
      flyingKey.classList.add('active');
      flyingKey.style.left = '0';
      flyingKey.style.top = '0';
      setTranslate(xOffset, yOffset, 0);
      
      // Start space physics immediately
      hasBouncedOnce = true;
      buttonClickable = true;
      secretButton.classList.add('ready');
      
      // Initial velocity upward
      velocityY = -10;
      velocityX = (Math.random() - 0.5) * 5;
      rotationSpeed = (Math.random() - 0.5) * 4;
      
      // Start the physics animation immediately
      startSpacePhysics();
      
      // Change button text
      secretButton.querySelector('.button-text').textContent = 'Tell Us Your Story';
    }
  
    function startSpacePhysics() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      let currentRotation = 0;
      
      function animate() {
        if (!isDragging) {
          velocityX *= friction;
          velocityY *= friction;
          
          xOffset += velocityX;
          yOffset += velocityY;
          
          // Wrap around screen edges with smoother transition
          const keyRect = flyingKey.getBoundingClientRect();
          if (xOffset > window.innerWidth + keyRect.width) {
            xOffset = -keyRect.width;
          } else if (xOffset < -keyRect.width) {
            xOffset = window.innerWidth + keyRect.width;
          }
          
          if (yOffset > window.innerHeight + keyRect.height) {
            yOffset = -keyRect.height;
          } else if (yOffset < -keyRect.height) {
            yOffset = window.innerHeight + keyRect.height;
          }
          
          currentRotation += rotationSpeed;
          setTranslate(xOffset, yOffset, currentRotation);
        }
        
        animationFrameId = requestAnimationFrame(animate);
      }
      
      animate();
    }
  
    function dragStart(e) {
      if (!hasBouncedOnce) return;
      
      const touch = e.type === 'touchstart' ? e.touches[0] : e;
      initialX = touch.clientX - xOffset;
      initialY = touch.clientY - yOffset;
      lastX = touch.clientX;
      lastY = touch.clientY;
  
      if (e.target === flyingKey || e.target.parentNode === flyingKey) {
        isDragging = true;
        rotationSpeed = 0;
      }
    }
  
    function drag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      const touch = e.type === 'touchmove' ? e.touches[0] : e;
      
      velocityX = (touch.clientX - lastX) * 0.5;
      velocityY = (touch.clientY - lastY) * 0.5;
      
      rotationSpeed = (Math.abs(velocityX) + Math.abs(velocityY)) * 0.1;
      rotationSpeed = Math.min(rotationSpeed, maxRotationSpeed);
      if (velocityX < 0) rotationSpeed *= -1;
      
      lastX = touch.clientX;
      lastY = touch.clientY;
      
      currentX = touch.clientX - initialX;
      currentY = touch.clientY - initialY;
  
      xOffset = currentX;
      yOffset = currentY;
  
      setTranslate(currentX, currentY, 0);
    }
  
    function setTranslate(xPos, yPos, rotation) {
      flyingKey.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) rotate(${rotation}deg)`;
    }
  
    function dragEnd() {
      rotationSpeed += (Math.random() - 0.5) * 2;
      rotationSpeed = Math.min(Math.max(rotationSpeed, -maxRotationSpeed), maxRotationSpeed);
      
      velocityX *= 1.5;
      velocityY *= 1.5;
      
      isDragging = false;
    }
  
    // Event listeners
    flyingKey.addEventListener('touchstart', dragStart, { passive: false });
    flyingKey.addEventListener('touchend', dragEnd);
    flyingKey.addEventListener('touchmove', drag, { passive: false });
    flyingKey.addEventListener('mousedown', dragStart);
    flyingKey.addEventListener('mouseup', dragEnd);
    flyingKey.addEventListener('mouseleave', dragEnd);
    flyingKey.addEventListener('mousemove', drag);
  
    secretButton.addEventListener('click', function() {
      if (!hasBouncedOnce) {
        startKeyAnimation();
      } else if (buttonClickable) {
        window.location.href = '#contact';
      }
    });
  });