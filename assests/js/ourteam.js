document.addEventListener('DOMContentLoaded', () => {
    const filterIcons = document.querySelectorAll('.filter-icon');
    
    filterIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const card = icon.closest('.team-card');
            const image = card.querySelector('.team-image');
            const filterType = icon.dataset.filter;
            
            // Remove active class from all icons in this card
            card.querySelectorAll('.filter-icon').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked icon
            icon.classList.add('active');
            
            // Add transition effect
            image.style.opacity = '0';
            
            setTimeout(() => {
                image.src = icon.dataset.image;
                image.style.opacity = '1';
            }, 300);
            
            // Remove any existing active classes from card
            card.classList.remove('active-work', 'active-family', 'active-hobby', 'active-travel');
            
            // Add appropriate active class based on selected filter
            switch(filterType) {
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
        });
    });
});