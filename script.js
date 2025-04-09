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

    // Slider functionality - only initialize if elements exist
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (slider && slides.length > 0 && prevBtn && nextBtn) {
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
    }

    // Initialize favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log('Initial favorites:', favorites);
    console.log('Current page:', window.location.pathname);

    // Function to toggle favorite status
    function toggleFavorite(productId) {
        const index = favorites.indexOf(productId);
        if (index === -1) {
            favorites.push(productId);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log('Updated favorites:', favorites);
        updateFavoriteButton(productId);
        
        // If we're on the favorites page, refresh the display
        if (window.location.pathname.includes('favourites.html')) {
            console.log('Refreshing favorites display after toggle');
            displayFavorites();
        }
    }

    // Function to update favorite button appearance
    function updateFavoriteButton(productId) {
        const button = document.querySelector(`[data-product-id="${productId}"]`);
        if (button) {
            const isFavorite = favorites.includes(productId);
            button.classList.toggle('active', isFavorite);
            button.innerHTML = isFavorite ? 
                '<i class="bi bi-heart-fill"></i>' : 
                '<i class="bi bi-heart"></i>';
        }
    }

    // Check if we're on the main page and if favorite buttons exist
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    if (favoriteButtons.length > 0 && !window.location.pathname.includes('favourites.html')) {
        // Add click event listeners to all favorite buttons
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.getAttribute('data-product-id');
                console.log('Favorite button clicked for product:', productId);
                toggleFavorite(productId);
            });
        });

        // Initialize favorite buttons on page load
        favoriteButtons.forEach(button => {
            const productId = button.getAttribute('data-product-id');
            updateFavoriteButton(productId);
        });
    }

    // Function to display favorites on favorites page
    function displayFavorites() {
        console.log('Starting displayFavorites function');
        const favoritesGrid = document.getElementById('favoritesGrid');
        const favoritesEmpty = document.getElementById('favoritesEmpty');
        
        console.log('Found elements:', {
            favoritesGrid: !!favoritesGrid,
            favoritesEmpty: !!favoritesEmpty
        });
        
        if (!favorites.length) {
            console.log('No favorites found, showing empty state');
            if (favoritesGrid) favoritesGrid.style.display = 'none';
            if (favoritesEmpty) favoritesEmpty.style.display = 'block';
            return;
        }

        console.log('Found favorites:', favorites);
        if (favoritesGrid) {
            console.log('Setting up grid display');
            favoritesGrid.style.display = 'grid';
            favoritesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            favoritesGrid.style.gap = '20px';
        favoritesGrid.innerHTML = '';
        }
        if (favoritesEmpty) favoritesEmpty.style.display = 'none';

        // Create product cards for each favorite
        favorites.forEach(productId => {
            const productDetails = getProductDetails(productId);
            console.log('Creating card for product:', productId, productDetails);
            
            const productCard = document.createElement('div');
            productCard.className = 'card h-100';
            
            productCard.innerHTML = `
                <img src="${productDetails.image}" class="card-img-top" alt="${productDetails.title}">
                <div class="card-body">
                    <h5 class="card-title">${productDetails.title}</h5>
                    <p class="card-text">${productDetails.price}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary">Add to Cart</button>
                        <button class="btn btn-outline-danger favorite-btn active" data-product-id="${productId}">
                            <i class="bi bi-heart-fill"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add remove button
            const removeButton = document.createElement('div');
            removeButton.className = 'remove-favorite';
            removeButton.innerHTML = '<i class="bi bi-x"></i>';
            removeButton.onclick = () => {
                toggleFavorite(productId);
                displayFavorites(); // Refresh the display
            };
            
            productCard.querySelector('.card-body').appendChild(removeButton);
            if (favoritesGrid) {
                console.log('Appending card to grid');
            favoritesGrid.appendChild(productCard);
            }
        });
    }

    // Helper function to get product details (mock data)
    function getProductDetails(productId) {
        const products = {
            '1': {
                title: 'Ceramic Vessel',
                price: '$29.99',
                image: 'https://images.unsplash.com/photo-1523264067855-7b9941f18ca9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            '2': {
                title: 'Porcelain Bowl',
                price: '$49.99',
                image: 'https://images.unsplash.com/photo-1565972093658-620985899236?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            '3': {
                title: 'Painting',
                price: '$19.99',
                image: 'https://images.unsplash.com/photo-1650212731571-9116569fb416?q=80&w=2154&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            '4': {
                title: 'Nature Painting',
                price: '$39.99',
                image: 'https://images.unsplash.com/photo-1551739330-0ac17fbc8599?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            '5': {
                title: 'Canvas',
                price: '$29.99',
                image: 'https://images.unsplash.com/photo-1671212684958-2e59c6bafaea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVhc2VsfGVufDB8MHwwfHx8Mg%3D%3D'
            },
            '6': {
                title: 'Crayons',
                price: '$49.99',
                image: 'https://images.unsplash.com/photo-1594423701030-8b44bb1c92f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3JheW9uc3xlbnwwfDB8MHx8fDI%3D'
            },
            '7': {
                title: 'Macrame',
                price: '$19.99',
                image: 'https://media.istockphoto.com/id/1438301905/photo/handmade-macrame-wall-decoration-with-wooden-stick-hanging-on-a-white-wall-female-hobby-eco.webp?a=1&b=1&s=612x612&w=0&k=20&c=mxbdj811eIpa57z72kozUP1w1EFOBHK5Q7XIOzQbWWs='
            },
            '8': {
                title: 'Wall Art',
                price: '$39.99',
                image: 'https://media.istockphoto.com/id/1330032317/photo/rajasthani-traditional-metal-artifacts-depicting-indian-folk-dancers-adorns-a-wall-in-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=eSob7iH72RKLVhrE7D2MM17RM2cehH4ZZiusnXN2ZD0='
            },
            '9': {
                title: 'Dreamcatcher',
                price: '$29.99',
                image: 'https://images.unsplash.com/photo-1446813768824-b3730a9d5840?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJlYW1jYXRjaGVyfGVufDB8MHwwfHx8Mg%3D%3D'
            },
            '10': {
                title: 'Framed Painting',
                price: '$49.99',
                image: 'https://images.unsplash.com/photo-1493841160601-33a4807cb6de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJhbWVkJTIwcGFpbnRpbmd8ZW58MHwwfDB8fHwy'
            },
            '11': {
                title: 'Frame',
                price: '$19.99',
                image: 'https://media.istockphoto.com/id/182391849/photo/empty-gold-ornate-picture-frame-with-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=96ZpOF6Q-Yv8HxjDgEHROLDYj3eNC1tvfP-AmIkhap0='
            },
            '12': {
                title: 'Dreamcatcher',
                price: '$39.99',
                image: 'https://images.unsplash.com/photo-1466238196552-044002a786ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlYW1jYXRjaGVyfGVufDB8MHwwfHx8Mg%3D%3D'
            }
        };

        return products[productId] || {
            title: 'Unknown Product',
            price: '$0.00',
            image: 'https://via.placeholder.com/300'
        };
    }

    // Initialize favorites display if on favorites page
    if (window.location.pathname.includes('favourites.html')) {
        console.log('On favourites page, initializing display');
        displayFavorites();
    } else {
        console.log('Not on favourites page');
    }

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    // Store the search term in localStorage
                    localStorage.setItem('searchTerm', searchTerm);
                    // Redirect to search results page
                    window.location.href = 'search-results.html';
                }
            }
        });
    }

    // Handle search results page
    if (window.location.pathname.includes('search-results.html')) {
        const searchTerm = localStorage.getItem('searchTerm');
        const searchResultsGrid = document.getElementById('searchResultsGrid');
        const noResults = document.getElementById('noResults');
        
        if (searchTerm) {
            // Clear previous results
            searchResultsGrid.innerHTML = '';
            
            // Get all products from our product data
            const products = {
                '1': {
                    title: 'Ceramic Vessel',
                    price: '$29.99',
                    image: 'https://images.unsplash.com/photo-1523264067855-7b9941f18ca9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                '2': {
                    title: 'Porcelain Bowl',
                    price: '$49.99',
                    image: 'https://images.unsplash.com/photo-1565972093658-620985899236?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                '3': {
                    title: 'Painting',
                    price: '$19.99',
                    image: 'https://images.unsplash.com/photo-1650212731571-9116569fb416?q=80&w=2154&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                '4': {
                    title: 'Nature Painting',
                    price: '$39.99',
                    image: 'https://images.unsplash.com/photo-1551739330-0ac17fbc8599?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                '5': {
                    title: 'Canvas',
                    price: '$29.99',
                    image: 'https://images.unsplash.com/photo-1671212684958-2e59c6bafaea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVhc2VsfGVufDB8MHwwfHx8Mg%3D%3D'
                },
                '6': {
                    title: 'Crayons',
                    price: '$49.99',
                    image: 'https://images.unsplash.com/photo-1594423701030-8b44bb1c92f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3JheW9uc3xlbnwwfDB8MHx8fDI%3D'
                },
                '7': {
                    title: 'Macrame',
                    price: '$19.99',
                    image: 'https://media.istockphoto.com/id/1438301905/photo/handmade-macrame-wall-decoration-with-wooden-stick-hanging-on-a-white-wall-female-hobby-eco.webp?a=1&b=1&s=612x612&w=0&k=20&c=mxbdj811eIpa57z72kozUP1w1EFOBHK5Q7XIOzQbWWs='
                },
                '8': {
                    title: 'Wall Art',
                    price: '$39.99',
                    image: 'https://media.istockphoto.com/id/1330032317/photo/rajasthani-traditional-metal-artifacts-depicting-indian-folk-dancers-adorns-a-wall-in-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=eSob7iH72RKLVhrE7D2MM17RM2cehH4ZZiusnXN2ZD0='
                },
                '9': {
                    title: 'Dreamcatcher',
                    price: '$29.99',
                    image: 'https://images.unsplash.com/photo-1446813768824-b3730a9d5840?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJlYW1jYXRjaGVyfGVufDB8MHwwfHx8Mg%3D%3D'
                },
                '10': {
                    title: 'Framed Painting',
                    price: '$49.99',
                    image: 'https://images.unsplash.com/photo-1493841160601-33a4807cb6de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJhbWVkJTIwcGFpbnRpbmd8ZW58MHwwfDB8fHwy'
                },
                '11': {
                    title: 'Frame',
                    price: '$19.99',
                    image: 'https://media.istockphoto.com/id/182391849/photo/empty-gold-ornate-picture-frame-with-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=96ZpOF6Q-Yv8HxjDgEHROLDYj3eNC1tvfP-AmIkhap0='
                },
                '12': {
                    title: 'Dreamcatcher',
                    price: '$39.99',
                    image: 'https://images.unsplash.com/photo-1466238196552-044002a786ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlYW1jYXRjaGVyfGVufDB8MHwwfHx8Mg%3D%3D'
                }
            };

            // Convert products object to array and filter based on search term
            const filteredProducts = Object.entries(products)
                .filter(([id, product]) => 
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.price.toLowerCase().includes(searchTerm.toLowerCase())
                );

            if (filteredProducts.length > 0) {
                // Display filtered products
                filteredProducts.forEach(([id, product]) => {
                    const productCard = document.createElement('div');
                    productCard.className = 'col';
                    productCard.innerHTML = `
                        <div class="card h-100">
                            <img src="${product.image}" class="card-img-top" alt="${product.title}">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.price}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <button class="btn btn-primary" style="background-color: rgb(67, 110, 51);">Add to Cart</button>
                                    <button class="btn btn-outline-danger favorite-btn" data-product-id="${id}">
                                        <i class="bi bi-heart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    // Add click event listener to the favorite button
                    const favoriteBtn = productCard.querySelector('.favorite-btn');
                    favoriteBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const productId = favoriteBtn.getAttribute('data-product-id');
                        toggleFavorite(productId);
                    });

                    // Initialize favorite button state
                    const isFavorite = favorites.includes(id);
                    if (isFavorite) {
                        favoriteBtn.classList.add('active');
                        favoriteBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
                    }

                    searchResultsGrid.appendChild(productCard);
                });
                noResults.style.display = 'none';
            } else {
                // Show no results message
                searchResultsGrid.style.display = 'none';
                noResults.style.display = 'block';
            }
        }
    }

    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Function to update cart count in the header
    function updateCartCount() {
        const cartIcon = document.querySelector('.lasticon .icon:last-child');
        if (cartIcon) {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            let countBadge = cartIcon.querySelector('.cart-count');
            
            if (count > 0) {
                if (!countBadge) {
                    countBadge = document.createElement('span');
                    countBadge.className = 'cart-count';
                    cartIcon.appendChild(countBadge);
                }
                countBadge.textContent = count;
                countBadge.style.display = 'block';
            } else if (countBadge) {
                countBadge.style.display = 'none';
            }
        }
    }

    // Function to add item to cart
    function addToCart(productId) {
        const product = getProductDetails(productId);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        
        // Show a toast notification
        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="bi bi-check-circle-fill"></i>
                <span>Item added to cart!</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Function to update cart display
    function updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartSummary = document.getElementById('cartSummary');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartEmpty || !cartSummary || !cartTotal) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '';
            cartEmpty.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }
        
        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';
        
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price * item.quantity;
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                                   data-id="${item.id}">
                            <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="remove-item" data-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </div>
                </div>
            `;
        }).join('');
        
        cartTotal.textContent = `$${total.toFixed(2)}`;

        // Add event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = button.getAttribute('data-id');
                const action = button.getAttribute('data-action');
                const input = button.parentElement.querySelector('.quantity-input');
                let newQuantity = parseInt(input.value);
                
                if (action === 'increase') {
                    newQuantity++;
                } else if (action === 'decrease' && newQuantity > 1) {
                    newQuantity--;
                }
                
                updateQuantity(productId, newQuantity);
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = input.getAttribute('data-id');
                const newQuantity = parseInt(input.value);
                if (newQuantity >= 1) {
                    updateQuantity(productId, newQuantity);
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = button.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }

    // Function to update item quantity
    function updateQuantity(productId, newQuantity) {
        newQuantity = parseInt(newQuantity);
        if (newQuantity < 1) return;
        
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    }

    // Function to remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }

    // Add styles for cart count and toast
    const style = document.createElement('style');
    style.textContent = `
        .cart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: rgb(67, 110, 51);
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            display: none;
        }
        .cart-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        }
        .toast-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .toast-content i {
            color: rgb(67, 110, 51);
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Initialize cart display and count
    updateCartCount();
    
    // Initialize cart display if on cart page
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
    }
    
    // Add event listeners for "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        if (button.textContent.trim() === 'Add to Cart') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.closest('.card').querySelector('.favorite-btn').getAttribute('data-product-id');
                addToCart(productId);
            });
        }
    });

    // Make cart functions available globally
    window.addToCart = addToCart;
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
}); 