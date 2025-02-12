document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const filterMenus = document.querySelectorAll('.filter-menu');
    
    // Close all menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-button') && !e.target.closest('.filter-menu')) {
            filterMenus.forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });

    // Toggle menu for each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = button.nextElementSibling;
            const card = button.closest('.team-card');
            
            // Close all other menus
            filterMenus.forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('active');
                }
            });
            
            menu.classList.toggle('active');
        });
    });

    // Handle filter option selection
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const card = option.closest('.team-card');
            const image = card.querySelector('.team-image');
            const menu = option.parentElement;
            
            // Add transition effect
            image.style.opacity = '0';
            
            setTimeout(() => {
                image.src = option.dataset.image;
                image.style.opacity = '1';
            }, 300);
            
            // Remove any existing active classes
            card.classList.remove('active-work', 'active-family', 'active-hobby', 'active-travel');
            
            // Add appropriate active class based on selected filter
            const filterText = option.textContent.toLowerCase();
            switch(filterText) {
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
            
            // Close menu
            menu.classList.remove('active');
        });
    });
});