
document.addEventListener('DOMContentLoaded', function() {

  // --- Physics constants ---
  const FRICTION = 0.995;
  const MAX_ROTATION_SPEED = 8;
  const THROW_MULTIPLIER = 1.2;

  // Grab all keys from the DOM
  const keys = document.querySelectorAll('.flying-key');

  // Each keyData holds state for ONE key
  const keysData = [];
  
  // Initialize each key’s data
  keys.forEach((key) => {
    keysData.push({
      original: key,      // The original DOM element in the flex layout
      clone: null,        // The draggable/floatable clone
      isDragging: false,
      isFloating: false,  // True once “picked up” the first time
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      rotation: 0,
      rotationSpeed: 0,
      lastX: 0,
      lastY: 0
    });
  });

  // ------------------------------------------------------------
  //  Utility: Update the clone’s position & rotation via transform
  // ------------------------------------------------------------
  function updateClonePosition(keyData) {
    if (!keyData.clone) return;
    keyData.clone.style.transform = `
      translate3d(${keyData.x}px, ${keyData.y}px, 0)
      rotate(${keyData.rotation}deg)
    `;
  }

  // ------------------------------------------------------------
  //  startDrag: Called on mousedown/touchstart
  // ------------------------------------------------------------
  function startDrag(e, keyData) {
    e.preventDefault();

    // If this key is not yet floating, create a clone & hide the original
    if (!keyData.isFloating) {
      keyData.isFloating = true;

      // Measure the original's bounding box so we can place the clone
      const rect = keyData.original.getBoundingClientRect();

      // Create the clone
      const clone = keyData.original.cloneNode(true);
      clone.classList.add('drag-clone'); 
      clone.style.position = 'fixed';    
      clone.style.left = '0';
      clone.style.top  = '0';
      clone.style.zIndex = '999999';
      
      // Let the clone receive pointer events
      clone.style.pointerEvents = 'auto'; 

      // Append the clone to body
      document.body.appendChild(clone);

      // Attach new listeners so the clone can be dragged again later
      clone.addEventListener('mousedown', ev => startDrag(ev, keyData));
      clone.addEventListener('touchstart', ev => startDrag(ev, keyData), { passive: false });

      // Initialize clone & position
      keyData.clone = clone;
      keyData.x = rect.left;
      keyData.y = rect.top;
      updateClonePosition(keyData);

      // Hide the original key
      keyData.original.style.visibility = 'hidden';
    }

    // Mark as dragging
    keyData.isDragging = true;
    keyData.clone.classList.add('dragging');

    // Store last mouse/touch position
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    keyData.lastX = touch.clientX;
    keyData.lastY = touch.clientY;

    // Stop leftover spin velocity
    keyData.rotationSpeed = 0;
  }

  // ------------------------------------------------------------
  //  drag: Called on mousemove/touchmove
  // ------------------------------------------------------------
  function drag(e, keyData) {
    if (!keyData.isDragging) return;
    e.preventDefault();

    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const deltaX = touch.clientX - keyData.lastX;
    const deltaY = touch.clientY - keyData.lastY;

    // Update velocities
    keyData.velocityX = deltaX;
    keyData.velocityY = deltaY;

    // Update the clone position
    keyData.x += deltaX;
    keyData.y += deltaY;

    // Calculate rotation speed based on movement
    const moveSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    keyData.rotationSpeed = (moveSpeed * 0.1) * (deltaX > 0 ? 1 : -1);
    // Clamp rotation speed
    keyData.rotationSpeed = Math.max(
      -MAX_ROTATION_SPEED,
       Math.min(MAX_ROTATION_SPEED, keyData.rotationSpeed)
    );

    keyData.lastX = touch.clientX;
    keyData.lastY = touch.clientY;

    // Apply transform
    updateClonePosition(keyData);
  }

  // ------------------------------------------------------------
  //  endDrag: Called on mouseup/touchend
  // ------------------------------------------------------------
  function endDrag(keyData) {
    if (!keyData.isDragging) return;
    keyData.isDragging = false;
    keyData.clone.classList.remove('dragging');

    // Throw it a bit faster
    keyData.velocityX *= THROW_MULTIPLIER;
    keyData.velocityY *= THROW_MULTIPLIER;

    // Add some random tweak to rotation
    keyData.rotationSpeed += (Math.random() - 0.5) * 4;
  }

  // ------------------------------------------------------------
  //  animate: Loop called via requestAnimationFrame
  // ------------------------------------------------------------
  function animate() {
    keysData.forEach(keyData => {
      // If floating but not actively dragged, apply friction & move
      if (keyData.isFloating && !keyData.isDragging && keyData.clone) {
        keyData.velocityX *= FRICTION;
        keyData.velocityY *= FRICTION;
        keyData.x += keyData.velocityX;
        keyData.y += keyData.velocityY;

        keyData.rotation += keyData.rotationSpeed;
        keyData.rotationSpeed *= FRICTION;

        // (Optional) screen wrapping
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (keyData.x > width)  keyData.x = 0;
        if (keyData.x < 0)      keyData.x = width;
        if (keyData.y > height) keyData.y = 0;
        if (keyData.y < 0)      keyData.y = height;

        updateClonePosition(keyData);
      }
    });

    requestAnimationFrame(animate);
  }

  // ------------------------------------------------------------
  //  Attach event listeners for each original key
  // ------------------------------------------------------------
  keys.forEach((key, index) => {
    const keyData = keysData[index];

    // Start drag
    key.addEventListener('mousedown', e => startDrag(e, keyData));
    key.addEventListener('touchstart', e => startDrag(e, keyData), { passive: false });

    // Dragging
    window.addEventListener('mousemove', e => drag(e, keyData));
    window.addEventListener('touchmove', e => drag(e, keyData), { passive: false });

    // End drag
    window.addEventListener('mouseup', () => endDrag(keyData));
    window.addEventListener('touchend', () => endDrag(keyData));
  });

  // ------------------------------------------------------------
  //  Reset logic: remove clones, restore original keys
  // ------------------------------------------------------------
  const resetElement = document.querySelector('.reset-text');
  resetElement.addEventListener('click', function() {
    keysData.forEach(keyData => {
      // 1) Remove any floating clone from DOM
      if (keyData.clone) {
        keyData.clone.remove();
        keyData.clone = null;
      }
      
      // 2) Reset all state
      keyData.isFloating = false;
      keyData.isDragging = false;
      keyData.x = 0;
      keyData.y = 0;
      keyData.velocityX = 0;
      keyData.velocityY = 0;
      keyData.rotation = 0;
      keyData.rotationSpeed = 0;

      // 3) Show the original key again
      keyData.original.style.visibility = 'visible';
    });
  });

  // Kick off the animation loop
  animate();

});

