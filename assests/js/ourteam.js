
document.addEventListener('DOMContentLoaded', () => {
  const filterIcons = document.querySelectorAll('.filter-icon');
  // Check if device supports hover (desktop) or not (mobile)
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  filterIcons.forEach(icon => {
    if (supportsHover) {
      icon.addEventListener('mouseenter', handleFilterEvent);
    } else {
      icon.addEventListener('click', handleFilterEvent);
    }
  });

  function handleFilterEvent(e) {
    const icon = e.currentTarget;
    const card = icon.closest('.team-card');
    const image = card.querySelector('.team-image');
    const filterType = icon.dataset.filter;

    // Remove active class from all icons in this card
    card.querySelectorAll('.filter-icon').forEach(btn => btn.classList.remove('active'));
    // Add active class to the triggered icon
    icon.classList.add('active');

    // Fade out the image
    image.style.opacity = '0';

    // Change image after a short delay, then fade it in
    setTimeout(() => {
      image.src = icon.dataset.image;
      image.style.opacity = '1';
    }, 300);

    // Remove any existing active classes from the card
    card.classList.remove('active-work', 'active-family', 'active-hobby', 'active-travel');

    // Add the appropriate active class based on filter type
    switch (filterType) {
      case 'cool':
        card.classList.add('active-work');
        break;
      case 'moody':
        card.classList.add('active-family');
        break;
      case 'tired':
        card.classList.add('active-hobby');
        break;
      case 'working':
        card.classList.add('active-travel');
        break;
    }
  }
});

