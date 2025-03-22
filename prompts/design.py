def create_homepage():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>xperienced.ai - Smart Electronics Recommendations</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        body {
            background-color: var(--light);
            color: var(--dark);
            line-height: 1.6;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header Styles */
        header {
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
        }

        .logo {
            display: flex;
            align-items: center;
        }

        .logo img {
            height: 40px;
            margin-right: 10px;
             src: url('https://upload.wikimedia.org/wikipedia/commons/b/b2/AI_brain_and_code.png')
        }

        .logo h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
        }

        .nav-menu {
            display: flex;
            gap: 20px;
        }

        .nav-menu a {
            text-decoration: none;
            color: var(--dark);
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-menu a:hover {
            color: var(--primary);
        }

        .user-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .user-actions a {
            text-decoration: none;
            color: var(--dark);
            font-weight: 500;
            transition: color 0.3s;
        }

        .user-actions a:hover {
            color: var(--primary);
        }

        .cart-icon {
            position: relative;
        }

        .cart-count {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: var(--secondary);
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
        }

        /* Hero Section Styles */
        .hero {
            padding: 60px 0;
            text-align: center;
            background: linear-gradient(to right, #f0f9ff, #e0f2fe);
        }

        .hero h2 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 20px;
            color: var(--dark);
        }

        .hero p {
            font-size: 1.2rem;
            color: var(--gray);
            max-width: 700px;
            margin: 0 auto 30px;
        }

        /* Search Bar Styles */
        .search-container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }

        .search-bar {
            width: 100%;
            height: 60px;
            padding: 0 20px;
            font-size: 1.1rem;
            border-radius: 30px;
            border: 2px solid var(--light-gray);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
        }

        .search-bar:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
        }

        .search-button {
            position: absolute;
            right: 8px;
            top: 8px;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 24px;
            height: 44px;
            width: 44px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .search-button:hover {
            background-color: var(--primary-dark);
        }

        /* Autocomplete Dropdown */
        .autocomplete-dropdown {
            position: absolute;
            top: 65px;
            left: 0;
            width: 100%;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-height: 400px;
            overflow-y: auto;
            z-index: 10;
            display: none;
        }

        .autocomplete-item {
            padding: 12px 20px;
            cursor: pointer;
            border-bottom: 1px solid var(--light-gray);
            display: flex;
            align-items: center;
        }

        .autocomplete-item:hover {
            background-color: #f1f5f9;
        }

        .autocomplete-item img {
            width: 40px;
            height: 40px;
            object-fit: contain;
            margin-right: 15px;
        }

        .autocomplete-item-content h4 {
            font-size: 0.9rem;
            margin-bottom: 3px;
        }

        .autocomplete-item-content p {
            font-size: 0.8rem;
            color: var(--gray);
        }

        .match-highlight {
            font-weight: bold;
            color: var(--primary);
        }

        /* Recommendation Sections */
        .recommendations {
            padding: 50px 0;
        }

        .section-title {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 30px;
            color: var(--dark);
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .product-card {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .product-img {
            height: 200px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .product-img img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }

        .product-info {
            padding: 15px;
        }

        .product-info h3 {
            font-size: 1rem;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .product-info p.specs {
            font-size: 0.85rem;
            color: var(--gray);
            margin-bottom: 12px;
        }

        .product-info .price {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--primary);
        }

        .product-info .rating {
            display: flex;
            align-items: center;
            margin-top: 8px;
            font-size: 0.85rem;
        }

        .product-info .rating span {
            color: #f59e0b;
            margin-right: 5px;
        }

        /* Personalization Section */
        .personalized {
            background-color: #f8f9fa;
            padding: 50px 0;
        }

        /* Categories Section */
        .categories {
            padding: 50px 0;
        }

        .categories-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .category-card {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            text-align: center;
            padding: 30px;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .category-icon {
            font-size: 3rem;
            margin-bottom: 20px;
            color: var(--primary);
        }

        .category-card h3 {
            font-size: 1.25rem;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .category-card p {
            font-size: 0.9rem;
            color: var(--gray);
        }

        /* Footer Styles */
        footer {
            background-color: var(--dark);
            color: white;
            padding: 50px 0 20px;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
            margin-bottom: 40px;
        }

        .footer-column h3 {
            font-size: 1.1rem;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .footer-column ul {
            list-style: none;
        }

        .footer-column ul li {
            margin-bottom: 10px;
        }

        .footer-column ul li a {
            color: #cbd5e1;
            text-decoration: none;
            transition: color 0.3s;
        }

        .footer-column ul li a:hover {
            color: white;
        }

        .copyright {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #334155;
            font-size: 0.9rem;
            color: #94a3b8;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
            .products-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                padding: 15px 0;
            }

            .logo {
                margin-bottom: 15px;
            }

            .nav-menu {
                margin-bottom: 15px;
            }

            .hero h2 {
                font-size: 2rem;
            }

            .hero p {
                font-size: 1rem;
            }

            .products-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .categories-grid {
                grid-template-columns: 1fr;
            }

            .footer-content {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .nav-menu {
                flex-direction: column;
                gap: 10px;
                align-items: center;
            }

            .user-actions {
                flex-direction: column;
                gap: 10px;
                align-items: center;
            }

            .products-grid {
                grid-template-columns: 1fr;
            }

            .footer-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo">
                    <h1>xperienced.ai</h1>
                </div>
                <nav class="nav-menu">
                    <a href="#">Laptops</a>
                    <a href="#">Mobiles</a>
                    <a href="#">PCs</a>
                    <a href="#">Deals</a>
                </nav>
                <div class="user-actions">
                    <a href="#">Login</a>
                    <a href="#">Register</a>
                    <a href="#" class="cart-icon">
                        Cart
                        <span class="cart-count">0</span>
                    </a>
                    <a href="#">Wishlist</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero Section with Search -->
    <section class="hero">
        <div class="container">
            <h2>Find Your Perfect Electronics</h2>
            <p>Expert AI-powered recommendations to match your exact needs</p>
            <div class="search-container">
                <input type="text" class="search-bar" placeholder="Search for laptops, mobiles, PCs (e.g., 'gaming laptop', 'iPhone 16', 'desktop PC')">
                <button class="search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>

                <!-- Autocomplete Dropdown (hidden by default) -->
                <div class="autocomplete-dropdown">
                    <!-- Autocomplete items will be dynamically added here by JavaScript -->
                </div>
            </div>
        </div>
    </section>

    <!-- Popular Products Section -->
    <section class="recommendations">
        <div class="container">
            <h2 class="section-title">Trending Electronics</h2>
            <div class="products-grid">
                <!-- Product Card 1 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/MacBook_Pro_14_and_16_2021.jpg/800px-MacBook_Pro_14_and_16_2021.jpg" alt="MacBook Pro">
                    </div>
                    <div class="product-info">
                        <h3>MacBook Pro 14"</h3>
                        <p class="specs">M2 Pro, 16GB RAM, 512GB SSD</p>
                        <div class="price">$1,999</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.9 (128 reviews)
                        </div>
                    </div>
                </div>

                <!-- Product Card 2 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Samsung_Galaxy_S23_Ultra_-_Phantom_Black.png/800px-Samsung_Galaxy_S23_Ultra_-_Phantom_Black.png" alt="Samsung Galaxy S25">
                    </div>
                    <div class="product-info">
                        <h3>Samsung Galaxy S25 Ultra</h3>
                        <p class="specs">Snapdragon 8 Gen 3, 12GB RAM, 256GB</p>
                        <div class="price">$1,199</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.8 (256 reviews)
                        </div>
                    </div>
                </div>

                <!-- Product Card 3 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/CyberpowerPC_logo.svg/800px-CyberpowerPC_logo.svg.png" alt="Gaming PC">
                    </div>
                    <div class="product-info">
                        <h3>ASUS ROG Gaming PC</h3>
                        <p class="specs">RTX 4080, i9-13900K, 32GB RAM</p>
                        <div class="price">$2,499</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.7 (93 reviews)
                        </div>
                    </div>
                </div>

                <!-- Product Card 4 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/2021_11th_gen_iPad_Pro_12.9inch_Wi-Fi_Space_Gray_angled_left.jpg/800px-2021_11th_gen_iPad_Pro_12.9inch_Wi-Fi_Space_Gray_angled_left.jpg" alt="iPad Pro">
                    </div>
                    <div class="product-info">
                        <h3>iPad Pro 12.9"</h3>
                        <p class="specs">M2 chip, 512GB Storage, Wi-Fi + Cellular</p>
                        <div class="price">$1,299</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.9 (167 reviews)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Personalized Recommendations (for returning users) -->
    <section class="personalized">
        <div class="container">
            <h2 class="section-title">Based on Your Recent Views</h2>
            <div class="products-grid">
                <!-- Product Card 1 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dell_XPS_15_9520_%282022%29.jpg/800px-Dell_XPS_15_9520_%282022%29.jpg" alt="Dell XPS">
                    </div>
                    <div class="product-info">
                        <h3>Dell XPS 15</h3>
                        <p class="specs">Intel i7-13700H, 32GB RAM, 1TB SSD</p>
                        <div class="price">$1,799</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.6 (78 reviews)
                        </div>
                    </div>
                </div>

                <!-- Product Card 2 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/HP_Spectre_X360_14_%282023%29.png/800px-HP_Spectre_X360_14_%282023%29.png" alt="HP Spectre">
                    </div>
                    <div class="product-info">
                        <h3>HP Spectre x360</h3>
                        <p class="specs">Intel i7-1360P, 16GB RAM, 1TB SSD</p>
                        <div class="price">$1,499</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.7 (112 reviews)
                        </div>
                    </div>
                </div>

                <!-- Product Card 3 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Lenovo_ThinkPad_X1_Carbon_G11.jpg/800px-Lenovo_ThinkPad_X1_Carbon_G11.jpg" alt="Lenovo ThinkPad">
                    </div>
                    <div class="product-info">
                        <h3>Lenovo ThinkPad X1 Carbon</h3>
                        <p class="specs">Intel i7-1370P, 16GB RAM, 512GB SSD</p>
                        <div class="price">$1,649</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.8 (64 reviews)
                        </div>
                    </div>
                </div>

                <!-- Product Card 4 -->
                <div class="product-card">
                    <div class="product-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Asus-Zenbook-UX430UA.jpg/800px-Asus-Zenbook-UX430UA.jpg" alt="ASUS ZenBook">
                    </div>
                    <div class="product-info">
                        <h3>ASUS ZenBook 14</h3>
                        <p class="specs">Intel i5-1340P, 16GB RAM, 512GB SSD</p>
                        <div class="price">$1,099</div>
                        <div class="rating">
                            <span>★★★★★</span> 4.5 (93 reviews)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
        <div class="container">
            <h2 class="section-title">Browse by Category</h2>
            <div class="categories-grid">
                <!-- Laptops Category -->
                <div class="category-card">
                    <div class="category-icon">💻</div>
                    <h3>Laptops</h3>
                    <p>Find the perfect laptop for work, gaming, or everyday use.</p>
                </div>

                <!-- Mobiles Category -->
                <div class="category-card">
                    <div class="category-icon">📱</div>
                    <h3>Mobile Phones</h3>
                    <p>Discover the latest smartphones with cutting-edge features.</p>
                </div>

                <!-- PCs Category -->
                <div class="category-card">
                    <div class="category-icon">🖥️</div>
                    <h3>Desktop PCs</h3>
                    <p>Powerful desktop computers for home, office, and gaming.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <!-- Column 1 -->
                <div class="footer-column">
                    <h3>About xperienced.ai</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="#">How It Works</a></li>
                        <li><a href="#">Our Technology</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                    </ul>
                </div>

                <!-- Column 2 -->
                <div class="footer-column">
                    <h3>Customer Support</h3>
                    <ul>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="#">Feedback</a></li>
                        <li><a href="/sitemap">Site Map</a></li>
                    </ul>
                </div>

                <!-- Column 3 -->
                <div class="footer-column">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <!-- Column 4 -->
                <div class="footer-column">
                    <h3>Connect With Us</h3>
                    <ul>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">LinkedIn</a></li>
                        <li><a href="#">YouTube</a></li>
                    </ul>
                </div>
            </div>

            <div class="copyright">
                &copy; 2025 xperienced.ai. All rights reserved.
            </div>
        </div>
    </footer>

    <script>
        const searchBar = document.querySelector('.search-bar');
        const autocompleteDropdown = document.querySelector('.autocomplete-dropdown');
        const autocompleteItemsContainer = document.querySelector('.autocomplete-dropdown');

        const autocompleteData = [
            { name: "Laptops", type: "category", image: "https://placehold.co/40x40?text=Laptop" },
            { name: "Mobiles", type: "category", image: "https://placehold.co/40x40?text=Mobile" },
            { name: "PCs", type: "category", image: "https://placehold.co/40x40?text=PC" },
            { name: "Gaming Laptops", type: "category", image: "https://placehold.co/40x40?text=GameLaptop" },
            { name: "Dell XPS 15 Laptop", type: "product", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dell_XPS_15_9520_%282022%29.jpg/800px-Dell_XPS_15_9520_%282022%29.jpg", description: "Intel i7, 16GB RAM, 512GB SSD" },
            { name: "MacBook Pro 14\" Laptop", type: "product", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/MacBook_Pro_14_and_16_2021.jpg/800px-MacBook_Pro_14_and_16_2021.jpg", description: "M2 Pro, 16GB RAM, 1TB SSD" },
            { name: "Samsung Galaxy S24 Ultra", type: "product", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Samsung_Galaxy_S23_Ultra_-_Phantom_Black.png/800px-Samsung_Galaxy_S23_Ultra_-_Phantom_Black.png", description: "Snapdragon 8 Gen 3, 12GB RAM, 256GB" },
            { name: "Custom Gaming PC", type: "product", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/CyberpowerPC_logo.svg/800px-CyberpowerPC_logo.svg.png", description: "RTX 4090, i9-14900K, 64GB RAM" },
            // ... more data
        ];


        searchBar.addEventListener('input', function() {
            const searchTerm = searchBar.value.toLowerCase();
            autocompleteDropdown.innerHTML = ''; // Clear previous suggestions

            if (!searchTerm) {
                autocompleteDropdown.style.display = 'none';
                return;
            }

            const filteredSuggestions = autocompleteData.filter(item =>
                item.name.toLowerCase().includes(searchTerm)
            );

            if (filteredSuggestions.length > 0) {
                filteredSuggestions.forEach(item => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('autocomplete-item');

                    const imageElement = document.createElement('img');
                    imageElement.src = item.image;
                    imageElement.alt = item.type === 'category' ? `${item.name} category` : 'Product image';
                    suggestionItem.appendChild(imageElement);

                    const contentElement = document.createElement('div');
                    contentElement.classList.add('autocomplete-item-content');

                    const nameElement = document.createElement('h4');
                    let highlightedName = item.name;
                    if (searchTerm) {
                        highlightedName = item.name.replace(new RegExp(searchTerm, 'gi'), match => `<span class="match-highlight">${match}</span>`);
                    }
                    nameElement.innerHTML = highlightedName;
                    contentElement.appendChild(nameElement);

                    if (item.description) {
                        const descriptionElement = document.createElement('p');
                        descriptionElement.textContent = item.description;
                        contentElement.appendChild(descriptionElement);
                    }

                    suggestionItem.appendChild(contentElement);
                    autocompleteItemsContainer.appendChild(suggestionItem);

                    suggestionItem.addEventListener('click', () => {
                        alert('Selected: ' + item.name);
                        autocompleteDropdown.style.display = 'none';
                    });
                });
                autocompleteDropdown.style.display = 'block';
            } else {
                autocompleteDropdown.style.display = 'none';
            }
        });


        searchBar.addEventListener('focus', () => {
            if(autocompleteItemsContainer.children.length > 0 && searchBar.value) {
                 autocompleteDropdown.style.display = 'block';
            }

        });

        searchBar.addEventListener('blur', () => {
            setTimeout(() => {
                autocompleteDropdown.style.display = 'none';
            }, 200);
        });
    </script>
</body>
</html>
"""

def create_comparison_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>xperienced.ai - Product Comparison</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        .metric-highlight {
            background-color: rgba(59, 130, 246, 0.1);
            border-left: 3px solid #3b82f6;
        }
        .comparison-table th {
            position: sticky;
            top: 0;
            background: white;
            z-index: 10;
        }
        .comparison-table td:first-child {
            position: sticky;
            left: 0;
            background: white;
            z-index: 5;
        }
        @media (max-width: 768px) {
            .comparison-table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
            }
        }
        .progress-bar {
            height: 8px;
            border-radius: 4px;
            background-color: #e5e7eb;
            overflow: hidden;
        }
        .progress-value {
            height: 100%;
            border-radius: 4px;
            background-color: #3b82f6;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="#" class="text-blue-600 font-bold text-xl mr-8">xperienced.ai</a>
                <nav class="hidden md:flex space-x-6">
                    <a href="#" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Gaming Laptop Comparison</h1>
            <p class="text-gray-600">Based on your search for <span class="font-medium">"gaming laptop with good battery"</span></p>
        </div>

        <!-- Product Comparison Table -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div class="overflow-x-auto">
                <table class="comparison-table w-full">
                    <thead>
                        <tr class="bg-gray-50 border-b">
                            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                            <th class="px-6 py-4 text-center">
                                <div class="flex flex-col items-center">
                                    <img src="https://placehold.co/180x120?text=Laptop1" alt="ASUS ROG Zephyrus G14" class="w-24 h-16 object-contain mb-2">
                                    <span class="font-medium text-gray-900">ASUS ROG Zephyrus G14</span>
                                    <div class="flex items-center mt-1">
                                        <div class="flex text-yellow-400">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star-half-alt"></i>
                                        </div>
                                        <span class="text-xs text-gray-500 ml-1">(542)</span>
                                    </div>
                                    <span class="font-bold text-gray-900 mt-1">$1,499</span>
                                </div>
                            </th>
                            <th class="px-6 py-4 text-center">
                                <div class="flex flex-col items-center">
                                    <img src="https://placehold.co/180x120?text=Laptop2" alt="Razer Blade 15" class="w-24 h-16 object-contain mb-2">
                                    <span class="font-medium text-gray-900">Razer Blade 15</span>
                                    <div class="flex items-center mt-1">
                                        <div class="flex text-yellow-400">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="far fa-star"></i>
                                        </div>
                                        <span class="text-xs text-gray-500 ml-1">(387)</span>
                                    </div>
                                    <span class="font-bold text-gray-900 mt-1">$1,799</span>
                                </div>
                            </th>
                            <th class="px-6 py-4 text-center">
                                <div class="flex flex-col items-center">
                                    <img src="https://placehold.co/180x120?text=Laptop3" alt="MSI GS66 Stealth" class="w-24 h-16 object-contain mb-2">
                                    <span class="font-medium text-gray-900">MSI GS66 Stealth</span>
                                    <div class="flex items-center mt-1">
                                        <div class="flex text-yellow-400">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star-half-alt"></i>
                                        </div>
                                        <span class="text-xs text-gray-500 ml-1">(629)</span>
                                    </div>
                                    <span class="font-bold text-gray-900 mt-1">$1,699</span>
                                </div>
                            </th>
                            <th class="px-6 py-4 text-center">
                                <div class="flex flex-col items-center">
                                    <img src="https://placehold.co/180x120?text=Laptop4" alt="Lenovo Legion 5 Pro" class="w-24 h-16 object-contain mb-2">
                                    <span class="font-medium text-gray-900">Lenovo Legion 5 Pro</span>
                                    <div class="flex items-center mt-1">
                                        <div class="flex text-yellow-400">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="far fa-star"></i>
                                        </div>
                                        <span class="text-xs text-gray-500 ml-1">(412)</span>
                                    </div>
                                    <span class="font-bold text-gray-900 mt-1">$1,399</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <!-- Performance Metrics -->
                        <tr>
                            <td colspan="5" class="px-6 py-3 bg-gray-50">
                                <h3 class="text-sm font-medium text-gray-900">Performance</h3>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Processor</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">AMD Ryzen 9 7940HS</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">Intel Core i9-13900H</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Intel Core i7-13700H</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">AMD Ryzen 7 7840HS</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Graphics Card</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">NVIDIA RTX 4070</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">NVIDIA RTX 4080</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">NVIDIA RTX 4070</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">NVIDIA RTX 4070</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">RAM</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">16GB DDR5</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">32GB DDR5</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">32GB DDR5</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">32GB DDR5 (4800MHz)</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Storage</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1TB SSD</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1TB SSD</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">2TB SSD</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1TB SSD</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gaming Performance</td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 87%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">87</span>
                            </td>
                            <td class="px-6 py-4 text-center metric-highlight">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 96%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">96</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 89%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">89</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 84%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">84</span>
                            </td>
                        </tr>

                        <!-- Display Metrics -->
                        <tr>
                            <td colspan="5" class="px-6 py-3 bg-gray-50">
                                <h3 class="text-sm font-medium text-gray-900">Display</h3>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Screen Size</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">14" (Compact)</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">15.6"</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">15.6"</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">16" (16:10)</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Resolution</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">2560 x 1600</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1920 x 1080</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1920 x 1080</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">2560 x 1600</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Refresh Rate</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">165Hz</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">360Hz</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">240Hz</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">165Hz</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Display Technology</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">IPS, 100% DCI-P3</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">IPS, 100% sRGB</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">IPS, 100% sRGB</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">IPS, 100% sRGB</td>
                        </tr>

                        <!-- Battery -->
                        <tr>
                            <td colspan="5" class="px-6 py-3 bg-gray-50">
                                <h3 class="text-sm font-medium text-gray-900">Battery</h3>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Battery Capacity</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">76Wh</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">80Wh</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">99.9Wh</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">80Wh</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Battery Life (Mixed Usage)</td>
                            <td class="px-6 py-4 text-center metric-highlight">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 95%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">10.5 hrs</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 65%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">6 hrs</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 70%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">7 hrs</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 80%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">8 hrs</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gaming on Battery</td>
                            <td class="px-6 py-4 text-center metric-highlight">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 75%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">2.5 hrs</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 40%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">1.5 hrs</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 50%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">1.8 hrs</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 60%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">2 hrs</span>
                            </td>
                        </tr>

                        <!-- Benchmarks -->
                        <tr>
                            <td colspan="5" class="px-6 py-3 bg-gray-50">
                                <h3 class="text-sm font-medium text-gray-900">Benchmarks</h3>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Geekbench 6 (Multi-core)</td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 88%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">11,248</span>
                            </td>
                            <td class="px-6 py-4 text-center metric-highlight">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 98%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">14,567</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 92%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">12,890</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 85%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">10,654</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3DMark Time Spy</td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 82%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">9,876</span>
                            </td>
                            <td class="px-6 py-4 text-center metric-highlight">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 95%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">12,543</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 85%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">10,234</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="w-full progress-bar">
                                    <div class="progress-value" style="width: 78%;"></div>
                                </div>
                                <span class="text-sm text-gray-700 mt-1 inline-block">9,451</span>
                            </td>
                        </tr>

                        <!-- Physical Attributes -->
                        <tr>
                            <td colspan="5" class="px-6 py-3 bg-gray-50">
                                <h3 class="text-sm font-medium text-gray-900">Physical Attributes</h3>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Weight</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">3.6 lbs (1.65 kg)</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">4.4 lbs (2.0 kg)</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">4.6 lbs (2.1 kg)</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">5.3 lbs (2.4 kg)</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dimensions</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center metric-highlight">12.3" x 8.9" x 0.7"</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">13.9" x 9.2" x 0.7"</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">14.1" x 9.8" x 0.8"</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">14.3" x 10.2" x 1.1"</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Recommendation Explanations -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Why These Products Match Your Search</h2>
                <div class="space-y-4">
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h3 class="font-medium text-gray-900">ASUS ROG Zephyrus G14</h3>
                        <p class="mt-1 text-sm text-gray-600">Best battery life among gaming laptops with 10.5 hours of mixed usage. Lightweight design (3.6 lbs) makes it perfect for gaming on the go. The AMD processor is power-efficient while still delivering strong gaming performance.</p>
                    </div>
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h3 class="font-medium text-gray-900">Razer Blade 15</h3>
                        <p class="mt-1 text-sm text-gray-600">Highest performance with RTX 4080 GPU and Intel i9 processor. Premium build quality with sleek aluminum chassis. Balanced option between performance and portability, though battery life is lower than competitors.</p>
                    </div>
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h3 class="font-medium text-gray-900">MSI GS66 Stealth</h3>
                        <p class="mt-1 text-sm text-gray-600">Best storage capacity (2TB SSD) and largest battery capacity (99.9Wh). High refresh rate display (240Hz) ideal for competitive gaming. Good balance of performance and battery life with 7 hours
"""

def create_mobiles_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobiles - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        .product-card {
            background-color: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            transition: transform 0.2s;
        }

        .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .product-img {
            height: 200px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .product-img img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }

        .product-info {
            padding: 1rem;
        }

        .product-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-size: 1rem;
        }

        .product-specs {
            font-size: 0.875rem;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .product-price {
            font-weight: bold;
            color: var(--primary);
        }
        .filter-section {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .filter-title {
            font-weight: 600;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .filter-group label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .filter-checkbox {
            margin-right: 0.5rem;
        }
        .sort-options {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .sort-label {
            margin-right: 1rem;
            font-weight: 600;
            color: var(--gray);
        }

        .sort-select {
            padding: 0.5rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
            appearance: none; /* Remove default arrow in some browsers */
            -webkit-appearance: none; /* For Safari and Chrome */
            -moz-appearance: none; /* For Firefox */
            background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position-x: calc(100% - 0.5rem);
            background-position-y: center;
            padding-right: 2rem;
        }

        .sort-select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Category Breadcrumb -->
        <div class="mb-4 text-sm text-gray-500">
            <a href="/" class="text-blue-600 hover:underline">Home</a> /
            <span class="font-medium">Mobiles</span>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Filters Sidebar -->
            <aside class="md:col-span-1">
                <div class="bg-white shadow-md rounded-lg p-6 sticky top-8">
                    <div class="filter-section">
                        <h3 class="filter-title">Brand</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Apple</label>
                            <label><input type="checkbox" class="filter-checkbox"> Samsung</label>
                            <label><input type="checkbox" class="filter-checkbox"> Google</label>
                            <label><input type="checkbox" class="filter-checkbox"> OnePlus</label>
                            <label><input type="checkbox" class="filter-checkbox"> Xiaomi</label>
                            <label><input type="checkbox" class="filter-checkbox"> Oppo</label>
                            <label><input type="checkbox" class="filter-checkbox"> Motorola</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Price Range</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Under $500</label>
                            <label><input type="checkbox" class="filter-checkbox"> $500 - $800</label>
                            <label><input type="checkbox" class="filter-checkbox"> $800 - $1200</label>
                            <label><input type="checkbox" class="filter-checkbox"> Over $1200</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Screen Size</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Under 6 inches</label>
                            <label><input type="checkbox" class="filter-checkbox"> 6 - 6.5 inches</label>
                            <label><input type="checkbox" class="filter-checkbox"> 6.5 inches & Above</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Operating System</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> iOS</label>
                            <label><input type="checkbox" class="filter-checkbox"> Android</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Camera Resolution</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> 12MP</label>
                            <label><input type="checkbox" class="filter-checkbox"> 48MP</label>
                            <label><input type="checkbox" class="filter-checkbox"> 108MP & Above</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Storage</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> 128GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 256GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 512GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 1TB</label>
                        </div>
                    </div>

                    <!-- More filters can be added here -->
                </div>
            </aside>

            <!-- Product Listing -->
            <section class="md:col-span-3">
                <h1 class="text-2xl font-bold text-gray-800 mb-4">Mobile Phones</h1>

                <div class="sort-options">
                    <label for="sort" class="sort-label">Sort By:</label>
                    <select id="sort" class="sort-select">
                        <option value="relevance">Relevance</option>
                        <option value="price-low-high">Price (Low to High)</option>
                        <option value="price-high-low">Price (High to Low)</option>
                        <option value="rating">Customer Rating</option>
                        <option value="popularity">Popularity</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Product Card 1 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Samsung_Galaxy_S23_Ultra_-_Phantom_Black.png/800px-Samsung_Galaxy_S23_Ultra_-_Phantom_Black.png" alt="Mobile 1">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Samsung Galaxy S24 Ultra</h3>
                            <p class="product-specs">Snapdragon 8 Gen 3, 12GB RAM, 256GB Storage</p>
                            <p class="product-price">$1,299</p>
                        </div>
                    </div>

                    <!-- Product Card 2 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/IPhone_14_Pro_Space_Black.png/800px-IPhone_14_Pro_Space_Black.png" alt="Mobile 2">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">iPhone 15 Pro Max</h3>
                            <p class="product-specs">A17 Bionic, 8GB RAM, 256GB Storage</p>
                            <p class="product-price">$1,399</p>
                        </div>
                    </div>

                    <!-- Product Card 3 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Google_Pixel_8_Pro_in_Bay_front_and_back.png" alt="Mobile 3">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Google Pixel 8 Pro</h3>
                            <p class="product-specs">Tensor G3, 12GB RAM, 128GB Storage</p>
                            <p class="product-price">$999</p>
                        </div>
                    </div>

                    <!-- Product Card 4 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/OnePlus_11_Eternal_Green_Front_%26_Back.png/800px-OnePlus_11_Eternal_Green_Front_%26_Back.png" alt="Mobile 4">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">OnePlus 12</h3>
                            <p class="product-specs">Snapdragon 8 Gen 3, 16GB RAM, 256GB Storage</p>
                            <p class="product-price">$899</p>
                        </div>
                    </div>

                    <!-- Product Card 5 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Xiaomi_13_Pro_ceramic_black.jpg/800px-Xiaomi_13_Pro_ceramic_black.jpg" alt="Mobile 5">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Xiaomi 14 Pro</h3>
                            <p class="product-specs">Snapdragon 8 Gen 3, 12GB RAM, 512GB Storage</p>
                            <p class="product-price">$799</p>
                        </div>
                    </div>

                    <!-- Product Card 6 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Motorola_Edge_plus_2023.png/800px-Motorola_Edge_plus_2023.png" alt="Mobile 6">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Motorola Edge+ (2024)</h3>
                            <p class="product-specs">Snapdragon 8 Gen 2, 8GB RAM, 256GB Storage</p>
                            <p class="product-price">$799</p>
                        </div>
                    </div>

                    <!-- More product cards -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Oppo-Find-X5-Pro-Ceramic-White-Frontal.png/800px-Oppo-Find-X5-Pro-Ceramic-White-Frontal.png" alt="Mobile 7">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Oppo Find X7 Pro</h3>
                            <p class="product-specs">Snapdragon 8 Gen 3, 16GB RAM, 512GB Storage</p>
                            <p class="product-price">$999</p>
                        </div>
                    </div>

                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Sony_Xperia_1_V_Black_Front_%26_Back.png/800px-Sony_Xperia_1_V_Black_Front_%26_Back.png" alt="Mobile 8">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Sony Xperia 1 VI</h3>
                            <p class="product-specs">Snapdragon 8 Gen 3, 12GB RAM, 256GB Storage</p>
                            <p class="product-price">$1,199</p>
                        </div>
                    </div>

                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Nokia_X21_5G_Front_and_Back_in_Nordic_Blue.png/800px-Nokia_X21_5G_Front_and_Back_in_Nordic_Blue.png" alt="Mobile 9">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Nokia X21 5G</h3>
                            <p class="product-specs">Snapdragon 695, 6GB RAM, 128GB Storage</p>
                            <p class="product-price">$399</p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="mt-8 flex justify-center">
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Previous</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">1</button>
                    <button class="px-4 py-2 border border-blue-600 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">2</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">3</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Next</button>
                </div>
            </section>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="#">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="#">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_pcs_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PCs - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        .product-card {
            background-color: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            transition: transform 0.2s;
        }

        .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .product-img {
            height: 200px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .product-img img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }

        .product-info {
            padding: 1rem;
        }

        .product-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-size: 1rem;
        }

        .product-specs {
            font-size: 0.875rem;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .product-price {
            font-weight: bold;
            color: var(--primary);
        }
        .filter-section {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .filter-title {
            font-weight: 600;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .filter-group label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .filter-checkbox {
            margin-right: 0.5rem;
        }
        .sort-options {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .sort-label {
            margin-right: 1rem;
            font-weight: 600;
            color: var(--gray);
        }

        .sort-select {
            padding: 0.5rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
            appearance: none; /* Remove default arrow in some browsers */
            -webkit-appearance: none; /* For Safari and Chrome */
            -moz-appearance: none; /* For Firefox */
            background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position-x: calc(100% - 0.5rem);
            background-position-y: center;
            padding-right: 2rem;
        }

        .sort-select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Category Breadcrumb -->
        <div class="mb-4 text-sm text-gray-500">
            <a href="/" class="text-blue-600 hover:underline">Home</a> /
            <span class="font-medium">PCs</span>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Filters Sidebar -->
            <aside class="md:col-span-1">
                <div class="bg-white shadow-md rounded-lg p-6 sticky top-8">
                    <div class="filter-section">
                        <h3 class="filter-title">Brand</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Dell</label>
                            <label><input type="checkbox" class="filter-checkbox"> HP</label>
                            <label><input type="checkbox" class="filter-checkbox"> Lenovo</label>
                            <label><input type="checkbox" class="filter-checkbox"> ASUS</label>
                            <label><input type="checkbox" class="filter-checkbox"> MSI</label>
                            <label><input type="checkbox" class="filter-checkbox"> Acer</label>
                            <label><input type="checkbox" class="filter-checkbox"> Corsair</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Price Range</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Under $800</label>
                            <label><input type="checkbox" class="filter-checkbox"> $800 - $1200</label>
                            <label><input type="checkbox" class="filter-checkbox"> $1200 - $1800</label>
                            <label><input type="checkbox" class="filter-checkbox"> Over $1800</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">CPU Brand</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Intel</label>
                            <label><input type="checkbox" class="filter-checkbox"> AMD</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">GPU Brand</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> NVIDIA GeForce</label>
                            <label><input type="checkbox" class="filter-checkbox"> AMD Radeon</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">RAM</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> 8GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 16GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 32GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 64GB & Above</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Storage Type</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> SSD</label>
                            <label><input type="checkbox" class="filter-checkbox"> HDD</label>
                            <label><input type="checkbox" class="filter-checkbox"> SSD + HDD</label>
                        </div>
                    </div>

                     <div class="filter-section">
                        <h3 class="filter-title">Form Factor</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Tower</label>
                            <label><input type="checkbox" class="filter-checkbox"> Small Form Factor</label>
                            <label><input type="checkbox" class="filter-checkbox"> All-in-One</label>
                        </div>
                    </div>


                    <!-- More filters can be added here -->
                </div>
            </aside>

            <!-- Product Listing -->
            <section class="md:col-span-3">
                <h1 class="text-2xl font-bold text-gray-800 mb-4">Desktop PCs</h1>

                <div class="sort-options">
                    <label for="sort" class="sort-label">Sort By:</label>
                    <select id="sort" class="sort-select">
                        <option value="relevance">Relevance</option>
                        <option value="price-low-high">Price (Low to High)</option>
                        <option value="price-high-low">Price (High to Low)</option>
                        <option value="rating">Customer Rating</option>
                        <option value="popularity">Popularity</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Product Card 1 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dell_XPS_8950_DE_datasheet_image.jpg/800px-Dell_XPS_8950_DE_datasheet_image.jpg" alt="PC 1">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Dell XPS Desktop</h3>
                            <p class="product-specs">i9, RTX 4070, 32GB RAM, 1TB SSD</p>
                            <p class="product-price">$1,999</p>
                        </div>
                    </div>

                    <!-- Product Card 2 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/HP_ENVY_Desktop_Te01-2xxx_Series.jpg/800px-HP_ENVY_Desktop_Te01-2xxx_Series.jpg" alt="PC 2">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">HP Envy Desktop</h3>
                            <p class="product-specs">i7, RTX 3060, 16GB RAM, 512GB SSD + 1TB HDD</p>
                            <p class="product-price">$1,299</p>
                        </div>
                    </div>

                    <!-- Product Card 3 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Lenovo_Legion_T5i_tower_2020_%281%29.jpg/800px-Lenovo_Legion_T5i_tower_2020_%281%29.jpg" alt="PC 3">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Lenovo Legion Tower 5i</h3>
                            <p class="product-specs">i7, RTX 4060, 16GB RAM, 1TB SSD</p>
                            <p class="product-price">$1,499</p>
                        </div>
                    </div>

                    <!-- Product Card 4 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ASUS_ROG_Strix_G15DH_picture.jpg/800px-ASUS_ROG_Strix_G15DH_picture.jpg" alt="PC 4">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">ASUS ROG Strix G15</h3>
                            <p class="product-specs">Ryzen 9, RTX 4070, 32GB RAM, 1TB SSD, Gaming PC</p>
                            <p class="product-price">$2,199</p>
                        </div>
                    </div>

                    <!-- Product Card 5 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/MSI_Aegis_RS_13th.jpg/800px-MSI_Aegis_RS_13th.jpg" alt="PC 5">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">MSI Aegis RS</h3>
                            <p class="product-specs">i9, RTX 4080, 64GB RAM, 2TB SSD, High-End Gaming</p>
                            <p class="product-price">$3,499</p>
                        </div>
                    </div>

                    <!-- Product Card 6 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Acer_Predator_Orion_3000_%28PO3-640%29.png/800px-Acer_Predator_Orion_3000_%28PO3-640%29.png" alt="PC 6">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Acer Predator Orion 3000</h3>
                            <p class="product-specs">i7, RTX 4060 Ti, 16GB RAM, 1TB SSD</p>
                            <p class="product-price">$1,699</p>
                        </div>
                    </div>

                    <!-- More product cards -->
                     <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Corsair_Vengeance_a7200_Gaming_PC.png/800px-Corsair_Vengeance_a7200_Gaming_PC.png" alt="PC 7">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Corsair Vengeance i7400</h3>
                            <p class="product-specs">i9, RTX 4090, 64GB RAM, 2TB SSD, Liquid Cooled</p>
                            <p class="product-price">$4,999</p>
                        </div>
                    </div>

                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/CyberpowerPC_Gamer_Supreme_Liquid_Cool_Gaming_PC_%282022%29.png/800px-CyberpowerPC_Gamer_Supreme_Liquid_Cool_Gaming_PC_%282022%29.png" alt="PC 8">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">CyberPowerPC Gamer Supreme</h3>
                            <p class="product-specs">Ryzen 7, RTX 4060, 16GB RAM, 1TB SSD</p>
                            <p class="product-price">$1,199</p>
                        </div>
                    </div>

                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/IBUYPOWER_Gaming_Desktop_Computer_%282022%29.png/800px-IBUYPOWER_Gaming_Desktop_Computer_%282022%29.png" alt="PC 9">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">iBUYPOWER Pro Gaming PC</h3>
                            <p class="product-specs">i5, RTX 3050, 16GB RAM, 500GB SSD</p>
                            <p class="product-price">$999</p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="mt-8 flex justify-center">
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Previous</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">1</button>
                    <button class="px-4 py-2 border border-blue-600 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">2</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">3</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Next</button>
                </div>
            </section>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="#">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="#">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_deals_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deals - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
            --red: #dc2626;
        }
        .deal-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: var(--red);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-weight: bold;
        }

        .product-card {
            background-color: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            transition: transform 0.2s;
            position: relative; /* For badge positioning */
        }

        .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .product-img {
            height: 200px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .product-img img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }

        .product-info {
            padding: 1rem;
        }

        .product-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-size: 1rem;
        }

        .product-specs {
            font-size: 0.875rem;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .product-price {
            font-weight: bold;
            color: var(--primary);
        }

        .original-price {
            text-decoration: line-through;
            color: var(--gray);
            margin-left: 0.5rem;
        }
        .filter-section {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .filter-title {
            font-weight: 600;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .filter-group label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .filter-checkbox {
            margin-right: 0.5rem;
        }
        .sort-options {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .sort-label {
            margin-right: 1rem;
            font-weight: 600;
            color: var(--gray);
        }

        .sort-select {
            padding: 0.5rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
            appearance: none; /* Remove default arrow in some browsers */
            -webkit-appearance: none; /* For Safari and Chrome */
            -moz-appearance: none; /* For Firefox */
            background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position-x: calc(100% - 0.5rem);
            background-position-y: center;
            padding-right: 2rem;
        }

        .sort-select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Category Breadcrumb -->
        <div class="mb-4 text-sm text-gray-500">
            <a href="/" class="text-blue-600 hover:underline">Home</a> /
            <span class="font-medium">Deals</span>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Filters Sidebar -->
            <aside class="md:col-span-1">
                <div class="bg-white shadow-md rounded-lg p-6 sticky top-8">
                    <div class="filter-section">
                        <h3 class="filter-title">Category</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Laptops</label>
                            <label><input type="checkbox" class="filter-checkbox"> Mobiles</label>
                            <label><input type="checkbox" class="filter-checkbox"> PCs</label>
                            <label><input type="checkbox" class="filter-checkbox"> Accessories</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Discount Range</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> 10% and above</label>
                            <label><input type="checkbox" class="filter-checkbox"> 20% and above</label>
                            <label><input type="checkbox" class="filter-checkbox"> 30% and above</label>
                            <label><input type="checkbox" class="filter-checkbox"> 50% and above</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Price Range</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Under $500</label>
                            <label><input type="checkbox" class="filter-checkbox"> $500 - $1000</label>
                            <label><input type="checkbox" class="filter-checkbox"> $1000 - $1500</label>
                            <label><input type="checkbox" class="filter-checkbox"> Over $1500</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Brand</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Apple</label>
                            <label><input type="checkbox" class="filter-checkbox"> Samsung</label>
                            <label><input type="checkbox" class="filter-checkbox"> Dell</label>
                            <label><input type="checkbox" class="filter-checkbox"> HP</label>
                            <!-- More brands -->
                        </div>
                    </div>

                    <!-- More filters can be added here -->
                </div>
            </aside>

            <!-- Product Listing -->
            <section class="md:col-span-3">
                <h1 class="text-2xl font-bold text-gray-800 mb-4">Deals on Electronics</h1>

                <div class="sort-options">
                    <label for="sort" class="sort-label">Sort By:</label>
                    <select id="sort" class="sort-select">
                        <option value="relevance">Relevance</option>
                        <option value="discount-high-low">Discount (High to Low)</option>
                        <option value="price-low-high">Price (Low to High)</option>
                        <option value="price-high-low">Price (High to Low)</option>
                        <option value="rating">Customer Rating</option>
                        <option value="popularity">Popularity</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Deal Product Card 1 -->
                    <div class="product-card">
                        <span class="deal-badge">25% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=Watch" alt="Deal Product 1">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Samsung Galaxy Watch 6</h3>
                            <p class="product-specs">Health Tracking, AMOLED Display, GPS</p>
                            <p class="product-price">$299 <span class="original-price">$399</span></p>
                        </div>
                    </div>

                    <!-- Deal Product Card 2 -->
                    <div class="product-card">
                        <span class="deal-badge">15% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=Laptop" alt="Deal Product 2">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Dell XPS 15 Laptop</h3>
                            <p class="product-specs">i7, 16GB RAM, 512GB SSD, InfinityEdge Display</p>
                            <p class="product-price">$1,529 <span class="original-price">$1,799</span></p>
                        </div>
                    </div>

                    <!-- Deal Product Card 3 -->
                    <div class="product-card">
                        <span class="deal-badge">30% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=Headphones" alt="Deal Product 3">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Sony WH-1000XM5 Headphones</h3>
                            <p class="product-specs">Noise Cancelling, Wireless, High-Resolution Audio</p>
                            <p class="product-price">$279 <span class="original-price">$399</span></p>
                        </div>
                    </div>

                    <!-- Deal Product Card 4 -->
                    <div class="product-card">
                        <span class="deal-badge">20% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=Mouse" alt="Deal Product 4">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Logitech MX Master 3S Mouse</h3>
                            <p class="product-specs">Ergonomic, Wireless, Precision Scrolling</p>
                            <p class="product-price">$79 <span class="original-price">$99</span></p>
                        </div>
                    </div>

                    <!-- Deal Product Card 5 -->
                    <div class="product-card">
                        <span class="deal-badge">40% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=Speaker" alt="Deal Product 5">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Amazon Echo Dot (5th Gen)</h3>
                            <p class="product-specs">Smart Speaker, Alexa, Voice Control</p>
                            <p class="product-price">$29 <span class="original-price">$49</span></p>
                        </div>
                    </div>

                    <!-- Deal Product Card 6 -->
                    <div class="product-card">
                        <span class="deal-badge">10% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=iPad" alt="Deal Product 6">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Apple iPad Air (5th Gen)</h3>
                            <p class="product-specs">M1 Chip, 10.9-inch Liquid Retina Display, 256GB</p>
                            <p class="product-price">$539 <span class="original-price">$599</span></p>
                        </div>
                    </div>

                    <!-- More deal product cards -->
                     <div class="product-card">
                        <span class="deal-badge">35% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=Keyboard" alt="Deal Product 7">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Razer BlackWidow V3 Keyboard</h3>
                            <p class="product-specs">Mechanical Keyboard, RGB Lighting, Gaming</p>
                            <p class="product-price">$99 <span class="original-price">$149</span></p>
                        </div>
                    </div>

                    <div class="product-card">
                        <span class="deal-badge">45% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=SSD" alt="Deal Product 8">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">SanDisk 2TB Portable SSD</h3>
                            <p class="product-specs">External SSD, High-Speed Transfer, Durable</p>
                            <p class="product-price">$109 <span class="original-price">$199</span></p>
                        </div>
                    </div>

                    <div class="product-card">
                        <span class="deal-badge">18% Off</span>
                        <div class="product-img">
                            <img src="https://placehold.co/200x150?text=Monitor" alt="Deal Product 9">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">LG 27-inch 4K Monitor</h3>
                            <p class="product-specs">4K UHD, IPS Panel, HDR10, FreeSync</p>
                            <p class="product-price">$269 <span class="original-price">$329</span></p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="mt-8 flex justify-center">
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Previous</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">1</button>
                    <button class="px-4 py-2 border border-blue-600 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">2</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">3</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Next</button>
                </div>
            </section>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="#">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_faq_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQs - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        .faq-item {
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 1.5rem;
        }

        .faq-item:last-child {
            border-bottom: none;
        }

        .faq-question {
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 0.75rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .faq-question::after {
            content: '+';
            font-size: 1.2rem;
            color: var(--primary);
        }

        .faq-question.active::after {
            content: '-';
        }

        .faq-answer {
            color: var(--gray);
            line-height: 1.6;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out, padding-bottom 0.3s ease-out;
            padding-bottom: 0;
        }

        .faq-answer.active {
            max-height: 500px; /* Adjust as needed, or use a more dynamic approach */
            padding-bottom: 1rem;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
            <p class="text-gray-700 leading-relaxed mb-8">
                Have questions? We've got answers! Browse our FAQs below to find quick solutions and information about xperienced.ai. If you can't find what you're looking for, please <a href="/contact" class="text-blue-600 hover:underline">contact us</a>.
            </p>

            <div class="space-y-4">
                <!-- FAQ Item 1 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>What is xperienced.ai and how does it work?</span>
                    </div>
                    <div class="faq-answer">
                        <p>xperienced.ai is an AI-powered platform designed to help you find the perfect electronics. Our system analyzes product specifications, benchmark data, and customer reviews to provide you with personalized recommendations and comparisons. Simply search for what you need, and our AI will guide you to the best options.</p>
                    </div>
                </div>

                <!-- FAQ Item 2 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>Is xperienced.ai free to use?</span>
                    </div>
                    <div class="faq-answer">
                        <p>Yes, xperienced.ai is completely free to use for everyone. You can search, compare products, and view recommendations without any charges or subscriptions.</p>
                    </div>
                </div>

                <!-- FAQ Item 3 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>How accurate are the product recommendations?</span>
                    </div>
                    <div class="faq-answer">
                        <p>We strive for high accuracy in our recommendations. Our AI model is continuously learning and improving by analyzing vast amounts of data. However, recommendations are suggestions, and we encourage users to review the detailed comparison tables and product information to make their own informed decisions.</p>
                    </div>
                </div>

                <!-- FAQ Item 4 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>Can I compare products side-by-side?</span>
                    </div>
                    <div class="faq-answer">
                        <p>Yes, product comparison is a core feature of xperienced.ai. When you search for a product or browse categories, you'll be able to compare up to four products side-by-side, viewing key specifications, metrics, and customer review excerpts in an easy-to-read table.</p>
                    </div>
                </div>

                <!-- FAQ Item 5 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>Where do you get your product information and reviews from?</span>
                    </div>
                    <div class="faq-answer">
                        <p>We aggregate product information from manufacturer websites, retailers, and publicly available databases. Customer reviews are collected from various e-commerce platforms and review sites. We aim to provide a comprehensive and unbiased view by drawing from diverse sources.</p>
                    </div>
                </div>

                <!-- FAQ Item 6 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>Do you sell electronics directly?</span>
                    </div>
                    <div class="faq-answer">
                        <p>No, xperienced.ai is a recommendation and comparison platform. We do not sell electronics directly. We provide information and links to retailers where you can purchase the products. Our goal is to help you find the best products and deals, and then direct you to trusted sellers.</p>
                    </div>
                </div>

                <!-- FAQ Item 7 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>How do I provide feedback or report an issue?</span>
                    </div>
                    <div class="faq-answer">
                        <p>We welcome your feedback! Please visit our <a href="/contact" class="text-blue-600 hover:underline">Contact Us</a> page to send us a message. You can also use this page to report any issues or errors you encounter on the website.</p>
                    </div>
                </div>

                <!-- FAQ Item 8 -->
                <div class="faq-item">
                    <div class="faq-question">
                        <span>Is my personal data safe with xperienced.ai?</span>
                    </div>
                    <div class="faq-answer">
                        <p>Yes, we take your privacy seriously. Please review our <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a> for detailed information on how we protect your personal data. We are committed to ensuring your data is safe and secure.</p>
                    </div>
                </div>

                <!-- Add more FAQ items here -->

            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="#" class="font-medium hover:text-white">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const faqQuestions = document.querySelectorAll('.faq-question');

            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const answer = question.nextElementSibling;
                    question.classList.toggle('active');
                    answer.classList.toggle('active');
                });
            });
        });
    </script>

</body>
</html>
"""

def create_terms_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        body {
            font-size: 0.9rem; /* Slightly smaller default font size for legal text */
            color: var(--gray); /* Default text color to gray for legal pages */
        }

        .terms-section {
            margin-bottom: 2rem;
        }

        .terms-section h2 {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 1rem;
        }

        .terms-section h3 {
            font-size: 1.125rem;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 0.75rem;
        }

        .terms-section p {
            line-height: 1.7;
            margin-bottom: 1rem;
        }

        .terms-section ul {
            list-style-type: disc;
            margin-left: 1.25rem;
            margin-bottom: 1rem;
        }

        .terms-section ol {
            list-style-type: decimal;
            margin-left: 1.25rem;
            margin-bottom: 1rem;
        }

        .terms-section li {
            line-height: 1.7;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>

            <div class="terms-section">
                <h2 >1. Acceptance of Terms</h2>
                <p>Welcome to xperienced.ai. By accessing or using our website, you agree to comply with and be bound by these Terms of Service ("Terms"). Please read these Terms carefully. If you do not agree with these Terms, you should not use our website.</p>
            </div>

            <div class="terms-section">
                <h2 >2. Description of Service</h2>
                <p>xperienced.ai provides an AI-powered platform that offers recommendations and comparisons for electronics, including laptops, mobile phones, and PCs. Our service is designed to help users make informed decisions when purchasing electronics. We do not sell products directly but provide information and links to third-party retailers.</p>
            </div>

            <div class="terms-section">
                <h2 >3. User Conduct</h2>
                <p>You agree to use xperienced.ai for lawful purposes only and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes:</p>
                <ul>
                    <li>Harassing or causing distress or inconvenience to any other user.</li>
                    <li>Transmitting obscene or offensive content.</li>
                    <li>Disrupting the normal flow of dialogue within our website.</li>
                    <li>Attempting to gain unauthorized access to our systems or user accounts.</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2 >4. Intellectual Property</h2>
                <p>The content, layout, design, data, databases, and graphics on this website are protected by intellectual property laws and are owned by xperienced.ai or its licensors. Unless expressly permitted, you must not copy, redistribute, republish, or otherwise make the content available to anyone else for commercial use without our express written permission.</p>
            </div>

            <div class="terms-section">
                <h2 >5. Disclaimer of Warranties</h2>
                <p>The service is provided on an "AS IS" and "AS AVAILABLE" basis. xperienced.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                <p>Further, xperienced.ai does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
            </div>

            <div class="terms-section">
                <h2 >6. Limitation of Liability</h2>
                <p>In no event shall xperienced.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the service, even if xperienced.ai or a xperienced.ai authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
            </div>

            <div class="terms-section">
                <h2 >7. Modifications to Terms of Service</h2>
                <p>xperienced.ai may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service.</p>
            </div>

            <div class="terms-section">
                <h2 >8. Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which xperienced.ai operates, without regard to its conflict of law provisions.</p>
            </div>

            <div class="terms-section">
                <h2 >9. Contact Information</h2>
                <p>If you have any questions about these Terms of Service, please contact us at:</p>
                <p><a href="/contact" class="text-blue-600 hover:underline">Contact Us Page</a></p>
            </div>

            <div class="terms-section">
                <p>Last Updated: October 26, 2023</p>
            </div>

        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="#">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#" class="font-medium hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_privacy_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        body {
            font-size: 0.9rem;
            color: var(--gray);
        }

        .terms-section {
            margin-bottom: 2rem;
        }

        .terms-section h2 {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 1rem;
        }

        .terms-section h3 {
            font-size: 1.125rem;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 0.75rem;
        }

        .terms-section p {
            line-height: 1.7;
            margin-bottom: 1rem;
        }

        .terms-section ul {
            list-style-type: disc;
            margin-left: 1.25rem;
            margin-bottom: 1rem;
        }

        .terms-section ol {
            list-style-type: decimal;
            margin-left: 1.25rem;
            margin-bottom: 1rem;
        }

        .terms-section li {
            line-height: 1.7;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

            <div class="terms-section">
                <h2>1. Introduction</h2>
                <p>Your privacy is important to xperienced.ai. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website xperienced.ai (the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Site.</p>
            </div>

            <div class="terms-section">
                <h2>2. Collection of Your Information</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect via the Site depends on the content and materials you use and includes:</p>
                <ul>
                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you choose to contact us or register for an account.</li>
                    <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    <li><strong>Data from Contests, Giveaways, and Surveys:</strong> Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2>3. Use of Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                <ul>
                    <li>Administer sweepstakes, promotions, and contests.</li>
                    <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                    <li>Respond to your inquiries and offer support.</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2>4. Disclosure of Your Information</h2>
                <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                <ul>
                    <li><strong>By Law or to Protect Rights:</strong> If we believe disclosure is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                    <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                    <li><strong>Marketing Communications:</strong> With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2>5. Security of Your Information</h2>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            </div>

            <div class="terms-section">
                <h2>6. Policy for Children</h2>
                <p>We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.</p>
            </div>

            <div class="terms-section">
                <h2>7. Changes to This Privacy Policy</h2>
                <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.</p>
            </div>

            <div class="terms-section">
                <h2>8. Contact Us</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <p><a href="/contact" class="text-blue-600 hover:underline">Contact Us Page</a></p>
            </div>

            <div class="terms-section">
                <p>Last Updated: October 26, 2023</p>
            </div>

        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="#">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="#" class="font-medium hover:text-white">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_sitemap_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        .sitemap-list {
            list-style: none;
            padding-left: 0;
        }

        .sitemap-list li {
            margin-bottom: 0.5rem;
        }

        .sitemap-list a {
            color: var(--blue-600);
            text-decoration: none;
            transition: color 0.3s;
        }

        .sitemap-list a:hover {
            color: var(--blue-800);
            text-decoration: underline;
        }

        .sitemap-list ul {
            list-style: none;
            padding-left: 1rem;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Sitemap</h1>
            <p class="text-gray-700 leading-relaxed mb-8">
                Below is a sitemap of xperienced.ai to help you navigate our website.
            </p>

            <nav>
                <ul class="sitemap-list">
                    <li>
                        <a href="/">Homepage</a>
                    </li>
                    <li>
                        <a href="/laptops">Laptops</a>
                    </li>
                    <li>
                        <a href="/mobiles">Mobile Phones</a>
                    </li>
                    <li>
                        <a href="/pcs">Desktop PCs</a>
                    </li>
                    <li>
                        <a href="/deals">Deals</a>
                    </li>
                    <li>
                        <a href="#">Product Comparison</a>
                    </li>
                    <li>
                        <a href="/about">About Us</a>
                    </li>
                    <li>
                        <a href="/contact">Contact Us</a>
                    </li>
                    <li>
                        <a href="/faq">FAQs</a>
                    </li>
                    <li>
                        <a href="/terms">Terms of Service</a>
                    </li>
                    <li>
                        <a href="/privacy">Privacy Policy</a>
                    </li>
                </ul>
            </nav>

        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_login_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login to xperienced.ai</h1>

            <form>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <input type="email" id="email" placeholder="Email Address" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input type="password" id="password" placeholder="Password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="flex items-center mb-6">
                    <input type="checkbox" id="remember" class="mr-2">
                    <label for="remember" class="text-sm text-gray-700">Remember me</label>
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Log In
                    </button>
                    <a href="#" class="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
                        Forgot Password?
                    </a>
                </div>
                <div class="mt-4 text-center">
                    <p class="text-gray-700 text-sm">Don't have an account? <a href="/register" class="font-bold text-blue-600 hover:text-blue-800">Register here</a></p>
                </div>
            </form>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_register_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Register with xperienced.ai</h1>

            <form>
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Your Name</label>
                    <input type="text" id="name" placeholder="Your Name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <input type="email" id="email" placeholder="Your Email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input type="password" id="password" placeholder="Password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Register
                    </button>
                    <a href="/login" class="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
                        Already have an account?
                    </a>
                </div>
            </form>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_wishlist_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wishlist - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        .wishlist-item {
            background-color: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .wishlist-item-img {
            height: 160px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .wishlist-item-img img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }

        .wishlist-item-info {
            padding: 1rem;
        }

        .wishlist-item-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-size: 1rem;
        }

        .wishlist-item-price {
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 0.75rem;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Wishlist Item 1 -->
            <div class="wishlist-item">
                <div class="wishlist-item-img">
                    <img src="https://placehold.co/200x150?text=Laptop" alt="Wishlist Product 1">
                </div>
                <div class="wishlist-item-info">
                    <h3 class="wishlist-item-name">Dell XPS 13</h3>
                    <p class="wishlist-item-price">$1,299</p>
                    <div class="flex space-x-4">
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
                        </button>
                        <button class="px-4 py-2 bg-red-200 text-red-700 rounded-md text-sm hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500">
                            <i class="far fa-trash-alt mr-2"></i> Remove
                        </button>
                    </div>
                </div>
            </div>

            <!-- Wishlist Item 2 -->
            <div class="wishlist-item">
                <div class="wishlist-item-img">
                    <img src="https://placehold.co/200x150?text=Mobile" alt="Wishlist Product 2">
                </div>
                <div class="wishlist-item-info">
                    <h3 class="wishlist-item-name">Samsung Galaxy S24 Ultra</h3>
                    <p class="wishlist-item-price">$1,299</p>
                    <div class="flex space-x-4">
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
                        </button>
                        <button class="px-4 py-2 bg-red-200 text-red-700 rounded-md text-sm hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500">
                            <i class="far fa-trash-alt mr-2"></i> Remove
                        </button>
                    </div>
                </div>
            </div>

            <!-- Wishlist Item 3 -->
            <div class="wishlist-item">
                <div class="wishlist-item-img">
                    <img src="https://placehold.co/200x150?text=TV" alt="Wishlist Product 3">
                </div>
                <div class="wishlist-item-info">
                    <h3 class="wishlist-item-name">LG OLED C3 65-inch TV</h3>
                    <p class="wishlist-item-price">$1,799</p>
                    <div class="flex space-x-4">
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
                        </button>
                        <button class="px-4 py-2 bg-red-200 text-red-700 rounded-md text-sm hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500">
                            <i class="far fa-trash-alt mr-2"></i> Remove
                        </button>
                    </div>
                </div>
            </div>

            <!-- Add more wishlist items here -->

        </div>

        <div class="mt-8 text-center" id="empty-wishlist" style="display:none;">
            <p class="text-gray-700">Your wishlist is empty.</p>
            <a href="/deals" class="text-blue-600 hover:underline">Check out our deals!</a>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const wishlistItems = document.querySelectorAll('.wishlist-item');
            const emptyWishlistSection = document.getElementById('empty-wishlist');

            if(wishlistItems.length === 0) {
                emptyWishlistSection.style.display = 'block';
            } else {
                emptyWishlistSection.style.display = 'none';
            }
        });
    </script>

</body>
</html>
"""

def create_cart_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
            --red: #dc2626;
        }
        .cart-item {
            display: flex;
            background-color: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            margin-bottom: 1rem;
        }

        .cart-item-img {
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
        }

        .cart-item-img img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }

        .cart-item-details {
            padding: 1rem;
            flex-grow: 1;
        }

        .cart-item-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-size: 1rem;
        }

        .cart-item-price {
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 0.75rem;
        }

        .cart-item-quantity {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
        }

        .quantity-label {
            margin-right: 0.5rem;
            color: var(--gray);
        }

        .quantity-input {
            width: 60px;
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
            text-align: center;
        }

        .remove-button {
            background-color: var(--red);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .remove-button:hover {
            background-color: var(--red-dark);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        <div class="lg:flex lg:space-x-8">
            <!-- Cart Items -->
            <section class="lg:w-3/4">
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="https://placehold.co/120x120?text=Laptop" alt="Product Image">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">Dell XPS 15</h3>
                        <p class="cart-item-price">$1,799</p>
                        <div class="cart-item-quantity">
                            <label for="quantity-1" class="quantity-label">Quantity:</label>
                            <input type="number" id="quantity-1" class="quantity-input" value="1" min="1">
                        </div>
                        <button class="remove-button">Remove</button>
                    </div>
                </div>

                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="https://placehold.co/120x120?text=Mobile" alt="Product Image">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">Samsung Galaxy S24 Ultra</h3>
                        <p class="cart-item-price">$1,299</p>
                        <div class="cart-item-quantity">
                            <label for="quantity-2" class="quantity-label">Quantity:</label>
                            <input type="number" id="quantity-2" class="quantity-input" value="2" min="1">
                        </div>
                        <button class="remove-button">Remove</button>
                    </div>
                </div>

                <!-- More cart items here -->

                <div id="empty-cart" style="display:none;">
                    <p class="text-gray-700 text-center py-8">Your cart is empty.</p>
                </div>
            </section>

            <!-- Order Summary -->
            <aside class="lg:w-1/4">
                <div class="bg-white shadow-md rounded-lg p-6 sticky top-8">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                    <div class="border-b border-gray-200 pb-4 mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-700">Subtotal</span>
                            <span class="font-bold text-gray-800">$4,397</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-700">Shipping</span>
                            <span class="font-bold text-gray-800">Free</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-700">Estimated Tax (CA)</span>
                            <span class="font-bold text-gray-800">$350</span>
                        </div>
                    </div>
                    <div class="flex justify-between mb-6">
                        <span class="text-lg font-bold text-gray-800">Total</span>
                        <span class="text-lg font-bold text-primary">$4,747</span>
                    </div>
                    <button class="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Proceed to Checkout
                    </button>
                    <div class="mt-4 text-center text-sm text-gray-600">
                        <p>By placing your order, you agree to our <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a>.</p>
                    </div>
                </div>
            </aside>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const cartItems = document.querySelectorAll('.cart-item');
            const emptyCartSection = document.getElementById('empty-cart');

            if(cartItems.length === 0) {
                emptyCartSection.style.display = 'block';
            } else {
                emptyCartSection.style.display = 'none';
            }
        });
    </script>

</body>
</html>
"""

def create_error_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Unavailable - xperienced.ai</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
            --error-red: #ef4444;
        }

        body {
            background-color: var(--light);
            color: var(--dark);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }

        .error-container {
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 800px;
        }

        .error-image {
            max-width: 100%;
            height: auto;
            margin-bottom: 30px;
            border-radius: 10px;
        }

        .error-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--error-red);
            margin-bottom: 20px;
        }

        .error-message {
            font-size: 1.1rem;
            color: var(--gray);
            line-height: 1.7;
            margin-bottom: 30px;
        }

        .button-primary {
            display: inline-block;
            padding: 12px 24px;
            background-color: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: background-color 0.3s;
        }

        .button-primary:hover {
            background-color: var(--primary-dark);
        }

        .button-secondary {
            display: inline-block;
            padding: 12px 24px;
            color: var(--primary);
            background-color: transparent;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            border: 2px solid var(--primary);
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
            margin-left: 10px;
        }

        .button-secondary:hover {
            background-color: var(--light-gray);
            border-color: var(--primary-dark);
            color: var(--primary-dark);
        }

        @media (max-width: 600px) {
            .error-container {
                padding: 30px;
            }

            .error-title {
                font-size: 2rem;
            }

            .error-message {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <img src="https://creazilla-store.fra1.digitaloceanspaces.com/emojis/47594/construction-emoji-clipart-xl.png" alt="Under Maintenance" class="error-image" style="max-width: 200px; display: block; margin-left: auto; margin-right: auto;">
        <h1 class="error-title">Service Unavailable</h1>
        <p class="error-message">
            Our servers are currently under maintenance or experiencing a technical issue.
            We apologize for the inconvenience. Please try again later.
        </p>
        <a href="/" class="button-primary">Go to Homepage</a>
        <a href="/contact" class="button-secondary">Contact Support</a>
    </div>
</body>
</html>
"""

def create_404_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - xperienced.ai</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
            --error-red: #ef4444;
        }

        body {
            background-color: var(--light);
            color: var(--dark);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }

        .error-container {
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 800px;
        }

        .error-image {
            max-width: 100%;
            height: auto;
            margin-bottom: 30px;
            border-radius: 10px;
        }

        .error-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--error-red);
            margin-bottom: 20px;
        }

        .error-message {
            font-size: 1.1rem;
            color: var(--gray);
            line-height: 1.7;
            margin-bottom: 30px;
        }

        .button-primary {
            display: inline-block;
            padding: 12px 24px;
            background-color: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: background-color 0.3s;
        }

        .button-primary:hover {
            background-color: var(--primary-dark);
        }

        .button-secondary {
            display: inline-block;
            padding: 12px 24px;
            color: var(--primary);
            background-color: transparent;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            border: 2px solid var(--primary);
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
            margin-left: 10px;
        }

        .button-secondary:hover {
            background-color: var(--light-gray);
            border-color: var(--primary-dark);
            color: var(--primary-dark);
        }

        @media (max-width: 600px) {
            .error-container {
                padding: 30px;
            }

            .error-title {
                font-size: 2rem;
            }

            .error-message {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <img src="https://creazilla-store.fra1.digitaloceanspaces.com/emojis/43955/page-not-found-emoji-clipart-xl.png" alt="Page Not Found" class="error-image" style="max-width: 200px; display: block; margin-left: auto; margin-right: auto;">
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-message">
            We're sorry, but the page you are looking for could not be found.
            Please check the URL or use the navigation to find what you need.
        </p>
        <a href="/" class="button-primary">Go to Homepage</a>
        <a href="/contact" class="button-secondary">Contact Support</a>
    </div>
</body>
</html>
"""

def create_contact_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h1>
            <p class="text-gray-700 text-center mb-4">We'd love to hear from you! Please fill out the form below to get in touch with us.</p>

            <form>
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input type="text" id="name" placeholder="Your Name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <input type="email" id="email" placeholder="Your Email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-6">
                    <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message</label>
                    <textarea id="message" rows="5" placeholder="Your Message" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
                <div class="flex justify-center">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Send Message
                    </button>
                </div>
            </form>

            <div class="mt-8 text-center">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Or reach us directly at:</h3>
                <p class="text-gray-700">Email: <a href="mailto:support@xperienced.ai" class="text-blue-600 hover:underline">support@xperienced.ai</a></p>
                <p class="text-gray-700">Phone: +1-555-123-4567</p>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="#" class="font-medium hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_about_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">About Us</h1>

            <div class="md:flex md:items-start md:space-x-8">
                <div class="md:w-1/2">
                    <img src="https://images.unsplash.com/photo-1550750253-12d9824b610d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NjY5NzB8MHwxfHNlYXJjaHwzfHxhaSUyMHRlY2hub2xvZ3l8ZW58MHx8fHx8MTY5ODE4NzE0OHww&ixlib=rb-4.0.3&q=80&w=2000" alt="About xperienced.ai Team" class="rounded-lg mb-4 shadow-md">
                </div>
                <div class="md:w-1/2">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        At xperienced.ai, our mission is to empower individuals to make informed decisions when choosing electronics. We understand that the world of technology can be overwhelming, with countless options and rapidly evolving specifications. That's why we've harnessed the power of Artificial Intelligence to simplify the process and guide you to the perfect device that meets your unique needs and preferences.
                    </p>

                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        We envision a future where everyone can confidently navigate the electronics market, armed with clear, unbiased, and data-driven recommendations. We strive to be the leading AI-powered platform that bridges the gap between complex technology and everyday users, making expert advice accessible to all.
                    </p>

                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Meet the Team</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        xperienced.ai is built by a team of passionate technologists, data scientists, and industry experts who believe in the power of AI to enhance lives. We are committed to innovation, user satisfaction, and ethical AI practices. Our diverse backgrounds and shared dedication drive us to continuously improve and expand our platform, ensuring it remains at the forefront of smart electronics recommendations.
                    </p>

                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Technology</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        Our recommendation engine is powered by state-of-the-art AI algorithms that analyze vast datasets of product specifications, performance benchmarks, customer reviews, and market trends. This allows us to provide personalized recommendations that go beyond simple specifications, considering real-world performance and user experiences. We are constantly refining our models to ensure accuracy, relevance, and the highest level of user satisfaction.
                    </p>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_laptops_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laptops - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
        .product-card {
            background-color: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            transition: transform 0.2s;
        }

        .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .product-img {
            height: 200px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .product-img img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }

        .product-info {
            padding: 1rem;
        }

        .product-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-size: 1rem;
        }

        .product-specs {
            font-size: 0.875rem;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .product-price {
            font-weight: bold;
            color: var(--primary);
        }
        .filter-section {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .filter-title {
            font-weight: 600;
            color: var(--gray);
            margin-bottom: 0.75rem;
        }

        .filter-group label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .filter-checkbox {
            margin-right: 0.5rem;
        }
        .sort-options {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .sort-label {
            margin-right: 1rem;
            font-weight: 600;
            color: var(--gray);
        }

        .sort-select {
            padding: 0.5rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
            appearance: none; /* Remove default arrow in some browsers */
            -webkit-appearance: none; /* For Safari and Chrome */
            -moz-appearance: none; /* For Firefox */
            background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position-x: calc(100% - 0.5rem);
            background-position-y: center;
            padding-right: 2rem;
        }

        .sort-select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Category Breadcrumb -->
        <div class="mb-4 text-sm text-gray-500">
            <a href="/" class="text-blue-600 hover:underline">Home</a> /
            <span class="font-medium">Laptops</span>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Filters Sidebar -->
            <aside class="md:col-span-1">
                <div class="bg-white shadow-md rounded-lg p-6 sticky top-8">
                    <div class="filter-section">
                        <h3 class="filter-title">Brand</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Apple</label>
                            <label><input type="checkbox" class="filter-checkbox"> Dell</label>
                            <label><input type="checkbox" class="filter-checkbox"> HP</label>
                            <label><input type="checkbox" class="filter-checkbox"> Lenovo</label>
                            <label><input type="checkbox" class="filter-checkbox"> ASUS</label>
                            <label><input type="checkbox" class="filter-checkbox"> Acer</label>
                            <label><input type="checkbox" class="filter-checkbox"> MSI</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Price Range</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Under $800</label>
                            <label><input type="checkbox" class="filter-checkbox"> $800 - $1200</label>
                            <label><input type="checkbox" class="filter-checkbox"> $1200 - $1800</label>
                            <label><input type="checkbox" class="filter-checkbox"> Over $1800</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Screen Size</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Under 13 inches</label>
                            <label><input type="checkbox" class="filter-checkbox"> 13 - 14 inches</label>
                            <label><input type="checkbox" class="filter-checkbox"> 14 - 16 inches</label>
                            <label><input type="checkbox" class="filter-checkbox"> 16 inches & Above</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">CPU Brand</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Intel</label>
                            <label><input type="checkbox" class="filter-checkbox"> AMD</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">RAM</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> 8GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 16GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 32GB</label>
                            <label><input type="checkbox" class="filter-checkbox"> 64GB & Above</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Storage Type</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> SSD</label>
                            <label><input type="checkbox" class="filter-checkbox"> HDD</label>
                            <label><input type="checkbox" class="filter-checkbox"> SSD + HDD</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Graphics Card</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Integrated Graphics</label>
                            <label><input type="checkbox" class="filter-checkbox"> NVIDIA GeForce RTX</label>
                            <label><input type="checkbox" class="filter-checkbox"> AMD Radeon RX</label>
                        </div>
                    </div>

                     <div class="filter-section">
                        <h3 class="filter-title">Type</h3>
                        <div class="filter-group">
                            <label><input type="checkbox" class="filter-checkbox"> Gaming Laptop</label>
                            <label><input type="checkbox" class="filter-checkbox"> Ultrabook</label>
                            <label><input type="checkbox" class="filter-checkbox"> Workstation</label>
                            <label><input type="checkbox" class="filter-checkbox"> 2-in-1 Convertible</label>
                        </div>
                    </div>


                    <!-- More filters can be added here -->
                </div>
            </aside>

            <!-- Product Listing -->
            <section class="md:col-span-3">
                <h1 class="text-2xl font-bold text-gray-800 mb-4">Laptops</h1>

                <div class="sort-options">
                    <label for="sort" class="sort-label">Sort By:</label>
                    <select id="sort" class="sort-select">
                        <option value="relevance">Relevance</option>
                        <option value="price-low-high">Price (Low to High)</option>
                        <option value="price-high-low">Price (High to Low)</option>
                        <option value="rating">Customer Rating</option>
                        <option value="popularity">Popularity</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Product Card 1 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/MacBook_Pro_14_and_16_2021.jpg/800px-MacBook_Pro_14_and_16_2021.jpg" alt="Laptop 1">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">MacBook Pro 14-inch</h3>
                            <p class="product-specs">Apple M3 Pro, 16GB RAM, 1TB SSD</p>
                            <p class="product-price">$2,499</p>
                        </div>
                    </div>

                    <!-- Product Card 2 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dell_XPS_15_9520_%282022%29.jpg/800px-Dell_XPS_15_9520_%282022%29.jpg" alt="Laptop 2">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Dell XPS 15</h3>
                            <p class="product-specs">Intel Core i9, 32GB RAM, 1TB SSD</p>
                            <p class="product-price">$2,199</p>
                        </div>
                    </div>

                    <!-- Product Card 3 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/HP_Spectre_X360_14_%282023%29.png/800px-HP_Spectre_X360_14_%282023%29.png" alt="Laptop 3">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">HP Spectre x360 14</h3>
                            <p class="product-specs">Intel Core i7, 16GB RAM, 512GB SSD</p>
                            <p class="product-price">$1,699</p>
                        </div>
                    </div>

                    <!-- Product Card 4 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Lenovo_ThinkPad_X1_Carbon_G11.jpg/800px-Lenovo_ThinkPad_X1_Carbon_G11.jpg" alt="Laptop 4">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Lenovo ThinkPad X1 Carbon</h3>
                            <p class="product-specs">Intel Core i7, 16GB RAM, 512GB SSD</p>
                            <p class="product-price">$1,849</p>
                        </div>
                    </div>

                    <!-- Product Card 5 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Asus-Zenbook-UX430UA.jpg/800px-Asus-Zenbook-UX430UA.jpg" alt="Laptop 5">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">ASUS ZenBook 14 OLED</h3>
                            <p class="product-specs">Intel Core i5, 8GB RAM, 512GB SSD</p>
                            <p class="product-price">$1,249</p>
                        </div>
                    </div>

                    <!-- Product Card 6 -->
                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Acer_Swift_3_%28SF314-43%29.jpg/800px-Acer_Swift_3_%28SF314-43%29.jpg" alt="Laptop 6">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Acer Swift 3</h3>
                            <p class="product-specs">AMD Ryzen 7, 8GB RAM, 512GB SSD</p>
                            <p class="product-price">$999</p>
                        </div>
                    </div>

                    <!-- More product cards -->
                     <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/MSI_Raider_GE78_HX_13V.jpg/800px-MSI_Raider_GE78_HX_13V.jpg" alt="Laptop 7">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">MSI Raider GE78 HX</h3>
                            <p class="product-specs">Intel Core i9, RTX 4090, 64GB RAM, 2TB SSD, Gaming</p>
                            <p class="product-price">$4,299</p>
                        </div>
                    </div>

                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Razer_Blade_16_%282023%29.jpg/800px-Razer_Blade_16_%282023%29.jpg" alt="Laptop 8">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">Razer Blade 16</h3>
                            <p class="product-specs">Intel Core i9, RTX 4080, 32GB RAM, 1TB SSD, Gaming</p>
                            <p class="product-price">$3,699</p>
                        </div>
                    </div>

                    <div class="product-card">
                        <div class="product-img">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/LG_Gram_Style_2023_Laptop-02.jpg/800px-LG_Gram_Style_2023_Laptop-02.jpg" alt="Laptop 9">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">LG Gram Style</h3>
                            <p class="product-specs">Intel Core i7, 16GB RAM, 1TB SSD, Lightweight</p>
                            <p class="product-price">$1,599</p>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="mt-8 flex justify-center">
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Previous</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">1</button>
                    <button class="px-4 py-2 border border-blue-600 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">2</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">3</button>
                    <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1">Next</button>
                </div>
            </section>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="#">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>© 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_contact_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h1>
            <p class="text-gray-700 text-center mb-4">We'd love to hear from you! Please fill out the form below to get in touch with us.</p>

            <form>
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input type="text" id="name" placeholder="Your Name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <input type="email" id="email" placeholder="Your Email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-6">
                    <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message</label>
                    <textarea id="message" rows="5" placeholder="Your Message" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
                <div class="flex justify-center">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Send Message
                    </button>
                </div>
            </form>

            <div class="mt-8 text-center">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Or reach us directly at:</h3>
                <p class="text-gray-700">Email: <a href="mailto:support@xperienced.ai" class="text-blue-600 hover:underline">support@xperienced.ai</a></p>
                <p class="text-gray-700">Phone: +1-555-123-4567</p>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="#" class="font-medium hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>© 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

def create_about_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - xperienced.ai</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1e293b;
            --light: #f8fafc;
            --gray: #64748b;
            --light-gray: #e2e8f0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center text-blue-600 font-bold text-xl mr-8">
                    <img src="https://www.svgrepo.com/show/512448/artificial-intelligence-2.svg" alt="xperienced.ai logo" class="h-8 w-8 mr-2">
                    xperienced.ai
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="/laptops" class="text-gray-700 hover:text-blue-600">Laptops</a>
                    <a href="/mobiles" class="text-gray-700 hover:text-blue-600">Mobiles</a>
                    <a href="/pcs" class="text-gray-700 hover:text-blue-600">PCs</a>
                    <a href="/deals" class="text-gray-700 hover:text-blue-600 font-medium">Deals</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative hidden md:block">
                    <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button class="absolute right-2 top-2 text-gray-500">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-heart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600">
                    <i class="far fa-user"></i>
                </a>
            </div>
        </div>
        <div class="container mx-auto px-4 py-2 md:hidden">
            <div class="relative">
                <input type="text" placeholder="Search for laptops, mobiles, PCs..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button class="absolute right-2 top-2 text-gray-500">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <section class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">About Us</h1>

            <div class="md:flex md:items-start md:space-x-8">
                <div class="md:w-1/2">
                    <img src="https://images.unsplash.com/photo-1550750253-12d9824b610d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NjY5NzB8MHwxfHNlYXJjaHwzfHxhaSUyMHRlY2hub2xvZ3l8ZW58MHx8fHx8MTY5ODE4NzE0OHww&ixlib=rb-4.0.3&q=80&w=2000" alt="About xperienced.ai Team" class="rounded-lg mb-4 shadow-md">
                </div>
                <div class="md:w-1/2">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        At xperienced.ai, our mission is to empower individuals to make informed decisions when choosing electronics. We understand that the world of technology can be overwhelming, with countless options and rapidly evolving specifications. That's why we've harnessed the power of Artificial Intelligence to simplify the process and guide you to the perfect device that meets your unique needs and preferences.
                    </p>

                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        We envision a future where everyone can confidently navigate the electronics market, armed with clear, unbiased, and data-driven recommendations. We strive to be the leading AI-powered platform that bridges the gap between complex technology and everyday users, making expert advice accessible to all.
                    </p>

                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Meet the Team</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        xperienced.ai is built by a team of passionate technologists, data scientists, and industry experts who believe in the power of AI to enhance lives. We are committed to innovation, user satisfaction, and ethical AI practices. Our diverse backgrounds and shared dedication drive us to continuously improve and expand our platform, ensuring it remains at the forefront of smart electronics recommendations.
                    </p>

                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Technology</h2>
                    <p class="text-gray-700 leading-relaxed mb-6">
                        Our recommendation engine is powered by state-of-the-art AI algorithms that analyze vast datasets of product specifications, performance benchmarks, customer reviews, and market trends. This allows us to provide personalized recommendations that go beyond simple specifications, considering real-world performance and user experiences. We are constantly refining our models to ensure accuracy, relevance, and the highest level of user satisfaction.
                    </p>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 class="font-bold text-lg mb-4">About xperienced.ai</h3>
                    <p class="text-gray-300">Your AI-powered guide to finding the perfect electronics. We provide expert recommendations and in-depth comparisons to help you make informed decisions.</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Explore</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/laptops">Laptops</a></li>
                        <li><a href="/mobiles">Mobile Phones</a></li>
                        <li><a href="/pcs">Desktop PCs</a></li>
                        <li><a href="#">Product Comparison</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Support</h3>
                    <ul class="text-gray-300 space-y-2">
                        <li><a href="/faq">FAQs</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-facebook-square fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-gray-300 hover:text-white"><i class="fab fa-linkedin fa-lg"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>© 2025 xperienced.ai. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
"""

page_functions = {
    "homepage": create_homepage,
    "comparison_page": create_comparison_page,
    "mobiles_page": create_mobiles_page,
    "pcs_page": create_pcs_page,
    "deals_page": create_deals_page,
    "faq_page": create_faq_page,
    "terms_page": create_terms_page,
    "privacy_page": create_privacy_page,
    "sitemap_page": create_sitemap_page,
    "login_page": create_login_page,
    "register_page": create_register_page,
    "wishlist_page": create_wishlist_page,
    "cart_page": create_cart_page,
    "error_page": create_error_page,
    "404_page": create_404_page,
    "contact_page": create_contact_page,
    "about_page": create_about_page,
    "laptops_page": create_laptops_page,
}

for page_name, create_function in page_functions.items():
    html_content = create_function()
    filename = f"{page_name}.html"
    with open(filename, "w") as file:
        file.write(html_content)
    print(f"Created {filename}")

print("All pages created.")