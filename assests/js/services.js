document.addEventListener('DOMContentLoaded', function () {
    // Constants for physics calculations
    const FRICTION = 0.995;
    const MAX_ROTATION_SPEED = 0.5;
    const THROW_MULTIPLIER = 1.2;

    // DOM Elements
    const serviceBtns = document.querySelectorAll('.service-btn');
    const packageContainers = document.querySelectorAll('.packages-container');
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');

    // Package cards data storage
    const packageCardsData = [];
    const allPackageCards = document.querySelectorAll('.package-card');
    
    // Initialize package cards data
    allPackageCards.forEach((card) => {
        packageCardsData.push({
            original: card,
            clone: null,
            isDragging: false,
            isFloating: false,
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

    // Function to handle container transitions
    function switchContainer(activeContainer) {
        const currentActive = document.querySelector('.packages-container.active');
        
        if (currentActive && currentActive !== activeContainer) {
            currentActive.classList.add('fade-out');
            
            setTimeout(() => {
                currentActive.classList.remove('active', 'fade-out');
                currentActive.style.display = 'none';
                
                activeContainer.style.display = 'flex';
                void activeContainer.offsetWidth;
                activeContainer.classList.add('active');
            }, 500);
        } else {
            activeContainer.style.display = 'flex';
            void activeContainer.offsetWidth;
            activeContainer.classList.add('active');
        }
    }

    // Update clone position
    function updateClonePosition(cardData) {
        if (!cardData.clone) return;
        cardData.clone.style.transform = `
            translate3d(${cardData.x}px, ${cardData.y}px, 0)
            rotate(${cardData.rotation}deg)
        `;
    }

  // Start dragging a card
// Start dragging a card
function startDrag(e, cardData) {
    e.preventDefault();

    if (!cardData.isFloating) {
        // Initial setup for a new floating card
        cardData.isFloating = true;
        const rect = cardData.original.getBoundingClientRect();

        const clone = cardData.original.cloneNode(true);
        clone.classList.add('drag-clone2'); // Add the base drag clone class

        // Check if this is an Ads card and apply the purple clone class
        if (cardData.original.closest('#ads-packages')) {
            clone.classList.add('drag-clone-ads'); // Add a specific class for Ads clone
        }

        clone.style.animationDelay = `${Math.random() * -3}s`;
        clone.style.position = 'fixed';
        clone.style.left = '0';
        clone.style.top = '0';
        clone.style.zIndex = '999999';
        clone.style.pointerEvents = 'none'; // Initially disable pointer events

        document.body.appendChild(clone);

        cardData.clone = clone;
        cardData.x = rect.left;
        cardData.y = rect.top;
        updateClonePosition(cardData);

        cardData.original.style.visibility = 'hidden';
        
        // Add mouse/touch event listeners to the clone
        clone.addEventListener('mousedown', e => startDragFloating(e, cardData));
        clone.addEventListener('touchstart', e => startDragFloating(e, cardData), { passive: false });
        clone.style.pointerEvents = 'auto'; // Enable pointer events after adding listeners
    }

    startDragFloating(e, cardData);
}


    // Start dragging for already floating cards
    function startDragFloating(e, cardData) {
        e.preventDefault();
        
        cardData.isDragging = true;
        cardData.clone.classList.add('dragging');

        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        cardData.lastX = touch.clientX;
        cardData.lastY = touch.clientY;

        // Reset velocities and rotation speed when grabbing
        cardData.velocityX = 0;
        cardData.velocityY = 0;
        cardData.rotationSpeed = 0;
    }

    // Handle dragging movement
    function drag(e, cardData) {
        if (!cardData.isDragging) return;
        e.preventDefault();

        const touch = e.type === 'touchmove' ? e.touches[0] : e;
        const deltaX = touch.clientX - cardData.lastX;
        const deltaY = touch.clientY - cardData.lastY;

        cardData.velocityX = deltaX;
        cardData.velocityY = deltaY;

        cardData.x += deltaX;
        cardData.y += deltaY;

        const moveSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        cardData.rotationSpeed = (moveSpeed * 0.1) * (deltaX > 0 ? 1 : -1);
        cardData.rotationSpeed = Math.max(-MAX_ROTATION_SPEED, Math.min(MAX_ROTATION_SPEED, cardData.rotationSpeed));

        cardData.lastX = touch.clientX;
        cardData.lastY = touch.clientY;

        updateClonePosition(cardData);
    }

    // End dragging
    function endDrag(cardData) {
        if (!cardData.isDragging) return;
        cardData.isDragging = false;
        cardData.clone.classList.remove('dragging');

        cardData.velocityX *= THROW_MULTIPLIER;
        cardData.velocityY *= THROW_MULTIPLIER;

        cardData.rotationSpeed += (Math.random() - 0.5) * 4;
    }

    // Animation loop
    function animate() {
        packageCardsData.forEach(cardData => {
            if (cardData.isFloating && !cardData.isDragging && cardData.clone) {
                // Apply physics
                cardData.velocityX *= FRICTION;
                cardData.velocityY *= FRICTION;
                cardData.x += cardData.velocityX;
                cardData.y += cardData.velocityY;

                cardData.rotation += cardData.rotationSpeed;
                cardData.rotationSpeed *= FRICTION;

                // Screen wrapping
                const width = window.innerWidth;
                const height = window.innerHeight;
                if (cardData.x > width) cardData.x = 0;
                if (cardData.x < 0) cardData.x = width;
                if (cardData.y > height) cardData.y = 0;
                if (cardData.y < 0) cardData.y = height;

                updateClonePosition(cardData);
            }
        });

        requestAnimationFrame(animate);
    }

    // Set up event listeners for service buttons
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            serviceBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const serviceType = this.dataset.service;
            const activePackageContainer = document.getElementById(`${serviceType}-packages`);
            switchContainer(activePackageContainer);
        });
    });

    // Set up event listeners for package cards
    allPackageCards.forEach((card, index) => {
        const cardData = packageCardsData[index];

        // Initial event listeners for the original card
        card.addEventListener('mousedown', e => startDrag(e, cardData));
        card.addEventListener('touchstart', e => startDrag(e, cardData), { passive: false });
    });

    // Global event listeners for drag and drop
    window.addEventListener('mousemove', e => {
        packageCardsData.forEach(cardData => {
            if (cardData.isDragging) {
                drag(e, cardData);
            }
        });
    });

    window.addEventListener('touchmove', e => {
        packageCardsData.forEach(cardData => {
            if (cardData.isDragging) {
                drag(e, cardData);
            }
        });
    }, { passive: false });

    window.addEventListener('mouseup', () => {
        packageCardsData.forEach(cardData => {
            if (cardData.isDragging) {
                endDrag(cardData);
            }
        });
    });

    window.addEventListener('touchend', () => {
        packageCardsData.forEach(cardData => {
            if (cardData.isDragging) {
                endDrag(cardData);
            }
        });
    });

    // Start animation loop
    animate();
});