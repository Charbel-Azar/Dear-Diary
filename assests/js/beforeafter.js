document.querySelectorAll('.image-container').forEach(container => {
    const wrapper = container.querySelector('.comparison-wrapper');
    const slider = wrapper.querySelector('.slider');
    const beforeImage = wrapper.querySelector('.before-image');
    const neonText = container.querySelector('.neon-textslide');
    let isResizing = false;

    // Mouse events
    slider.addEventListener('mousedown', initResize);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);

    // Touch events
    slider.addEventListener('touchstart', initResize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('touchend', stopResize);

    function initResize(e) {
        isResizing = true;
        wrapper.classList.add('active');
        e.preventDefault();
        wrapper.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6), 0 0 90px rgba(255, 255, 255, 0.4)';
    }

    function resize(e) {
        if (!isResizing) return;

        const rect = wrapper.getBoundingClientRect();
        const x = (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) - rect.left; // Using clientX for more precise positioning
        const percent = Math.min(Math.max(x / rect.width * 100, 0), 100);

        slider.style.left = `${percent}%`;
        beforeImage.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;

        // Show text when slider is near the start (5% or less)
        if (percent <= 15) {
            neonText.style.opacity = '1';
        } else {
            neonText.style.opacity = '0';
        }
    }

    function stopResize() {
        isResizing = false;
        wrapper.classList.remove('active');
        wrapper.style.boxShadow = 'none';
    }
});
