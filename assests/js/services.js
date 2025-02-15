
document.addEventListener('DOMContentLoaded', function() {
    const serviceBtns = document.querySelectorAll('.service-btn');
    const packageContainers = document.querySelectorAll('.packages-container');
    const packageCards = document.querySelectorAll('.package-card');
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');

    // Service button click handler
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and containers
            serviceBtns.forEach(b => b.classList.remove('active'));
            packageContainers.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding container
            this.classList.add('active');
            const serviceType = this.dataset.service;
            document.getElementById(`${serviceType}-packages`).classList.add('active');
            
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });

    // Package card hover and click handlers
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });

        card.addEventListener('click', function() {
            this.classList.toggle('active');
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });
});