
document.addEventListener('DOMContentLoaded', function() {
  const teamCards = document.querySelectorAll('.team-card');
  // Check if the device supports hover (desktop vs. mobile)
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  teamCards.forEach(card => {
    // Get all possible images for this team member from data-images
    const imagePaths = card.dataset.images.split(',');
    const teamImage = card.querySelector('.team-image');

    // Track our current index in the image array
    let currentIndex = 0; // starting with the first image

    if (supportsHover) {
      // DESKTOP: change on hover
      card.addEventListener('mouseenter', () => {
        // Go to the next image in the sequence
        currentIndex = (currentIndex + 1) % imagePaths.length;

        // Fade out, switch image, fade back in
        teamImage.style.opacity = '0';
        setTimeout(() => {
          teamImage.src = imagePaths[currentIndex].trim();
          teamImage.style.opacity = '1';
        }, 300);
      });
    } else {
      // MOBILE: change image every 3 seconds
      setInterval(() => {
        // Go to the next image in the sequence
        currentIndex = (currentIndex + 1) % imagePaths.length;

        // Fade out, switch image, fade back in
        teamImage.style.opacity = '0';
        setTimeout(() => {
          teamImage.src = imagePaths[currentIndex].trim();
          teamImage.style.opacity = '1';
        }, 300);
      }, 3000);
    }
  });
});

