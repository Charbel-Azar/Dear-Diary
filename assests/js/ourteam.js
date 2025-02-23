
document.addEventListener('DOMContentLoaded', function() {
  const teamCards = document.querySelectorAll('.team-card');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  teamCards.forEach(card => {
    // Get all possible images for this team member from data-images
    const imagePaths = card.dataset.images.split(',');
    const teamImage = card.querySelector('.team-image');

    if (supportsHover) {
      // DESKTOP: change on hover
      card.addEventListener('mouseenter', () => {
        const randomIndex = Math.floor(Math.random() * imagePaths.length);
        teamImage.style.opacity = '0';
        setTimeout(() => {
          teamImage.src = imagePaths[randomIndex].trim();
          teamImage.style.opacity = '1';
        }, 300);
      });
    } else {
      // MOBILE: change every 3 seconds
      setInterval(() => {
        const randomIndex = Math.floor(Math.random() * imagePaths.length);
        teamImage.style.opacity = '0';
        setTimeout(() => {
          teamImage.src = imagePaths[randomIndex].trim();
          teamImage.style.opacity = '1';
        }, 300);
      }, 3000);
    }
  });
});

