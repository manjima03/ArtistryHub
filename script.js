document.addEventListener('DOMContentLoaded', () => {
    // Titlebar scroll behavior
    const header = document.querySelector('header');
    let lastScroll = 0;
    const scrollThreshold = 100; // Minimum scroll amount before hiding header

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            return;
        }

        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });

    // Slider functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentIndex = 0;
    const slideWidth = 430; // 400px width + 30px gap
    
    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Auto-slide functionality
    let autoSlideInterval = setInterval(() => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }, 5000);
    
    // Pause auto-slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
    });

    // Favorites functionality
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function toggleFavorite(productId) {
        const index = favorites.indexOf(productId);
        if (index === -1) {
            favorites.push(productId);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButton(productId);
        if (window.location.pathname.includes('favorites.html')) {
            displayFavorites();
        }
    }

    function updateFavoriteButton(productId) {
        const button = document.querySelector(`[data-product-id="${productId}"]`);
        if (button) {
            const isFavorite = favorites.includes(productId);
            button.innerHTML = isFavorite ? 
                '<i class="bi bi-heart-fill"></i>' : 
                '<i class="bi bi-heart"></i>';
        }
    }

    function displayFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const favoritesEmpty = document.getElementById('favoritesEmpty');
        
        if (!favorites.length) {
            favoritesGrid.style.display = 'none';
            favoritesEmpty.style.display = 'block';
            return;
        }

        favoritesGrid.style.display = 'flex';
        favoritesEmpty.style.display = 'none';
        favoritesGrid.innerHTML = '';

        // Get all products from the page
        const products = document.querySelectorAll('.product-item');
        const favoriteProducts = Array.from(products).filter(product => 
            favorites.includes(product.dataset.productId)
        );

        favoriteProducts.forEach(product => {
            const productId = product.dataset.productId;
            const productCard = product.cloneNode(true);
            
            // Add remove button
            const removeButton = document.createElement('div');
            removeButton.className = 'remove-favorite';
            removeButton.innerHTML = '<i class="bi bi-x"></i>';
            removeButton.onclick = () => toggleFavorite(productId);
            
            productCard.querySelector('.card').appendChild(removeButton);
            favoritesGrid.appendChild(productCard);
        });
    }

    // Initialize favorites display if on favorites page
    if (window.location.pathname.includes('favorites.html')) {
        displayFavorites();
    }

    // Update favorite buttons on page load
    const favoriteButtons = document.querySelectorAll('[data-product-id]');
    favoriteButtons.forEach(button => {
        const productId = button.dataset.productId;
        updateFavoriteButton(productId);
    });
}); 