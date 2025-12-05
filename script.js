document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. RESPONSIVE NAV BAR TOGGLE --- */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('main-menu');
    
    // Check if elements exist (only on index.html)
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
            
            // Toggle the state
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when a link is clicked (for on-page links like #products)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) { // Only close on mobile
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Reset menu state when switching between mobile and desktop widths
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }


    /* --- 2. PRODUCT SEARCH/FILTER (Client-side) --- */
    const searchInput = document.getElementById('product-search');
    const productGrid = document.querySelector('.product-grid');
    
    if (searchInput && productGrid) {
        const productCards = productGrid.querySelectorAll('.product-card');

        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            productCards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const price = card.getAttribute('data-price'); // Price can be searched as a number
                
                // Check if the search term is found in the name or the raw price
                if (name.includes(searchTerm) || price.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }


    /* --- 3. AUTHENTICATION STATE (Login/Profile) --- */
    const loginLi = document.getElementById('auth-login');
    const profileLi = document.getElementById('auth-profile');

    const rawUser = localStorage.getItem('user'); // expected: JSON string e.g. {"name":"Alice"}
    if (rawUser) {
        // show profile, hide login
        if (loginLi) loginLi.style.display = 'none';
        if (profileLi) {
            profileLi.style.display = '';
            try {
                const user = JSON.parse(rawUser);
                const a = profileLi.querySelector('a');
                if (a && user && user.name) a.textContent = `Profile (${user.name})`;
            } catch (e) {
                // ignore parse errors
            }
        }
    } else {
        // show login, hide profile
        if (loginLi) loginLi.style.display = '';
        if (profileLi) profileLi.style.display = 'none';
    }

    /* --- 4. LOGIN & SIGNUP (Store to localStorage) --- */
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = /** @type {HTMLInputElement|null} */(document.getElementById('login-email'))?.value?.trim();
            const password = /** @type {HTMLInputElement|null} */(document.getElementById('login-password'))?.value;
            if (!email || !password) {
                alert('Please enter email and password');
                return;
            }
            const nameGuess = email.split('@')[0] || 'User';
            localStorage.setItem('user', JSON.stringify({ name: nameGuess, email }));
            window.location.href = '/profile.html';
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = /** @type {HTMLInputElement|null} */(document.getElementById('signup-name'))?.value?.trim();
            const email = /** @type {HTMLInputElement|null} */(document.getElementById('signup-email'))?.value?.trim();
            const password = /** @type {HTMLInputElement|null} */(document.getElementById('signup-password'))?.value;
            const confirm = /** @type {HTMLInputElement|null} */(document.getElementById('signup-confirm'))?.value;
            if (!name || !email || !password || !confirm) {
                alert('Please fill out all fields');
                return;
            }
            if (password.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }
            localStorage.setItem('user', JSON.stringify({ name, email }));
            window.location.href = '/profile.html';
        });
    }

    /* --- 5. LOGOUT HANDLER --- */
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = '/index.html';
        });
    }

    /* --- 6. PROFILE POPULATION --- */
    const profileNameEl = document.querySelector('.profile-info h2');
    const profileEmailEls = document.querySelectorAll('.profile-info p');
    if (profileNameEl && rawUser) {
        try {
            const user = JSON.parse(rawUser);
            if (user && user.name) profileNameEl.textContent = user.name;
            if (user && user.email && profileEmailEls && profileEmailEls.length) {
                // Update the first paragraph with email if it seems appropriate
                const firstP = profileEmailEls[0];
                if (firstP && !/Email/i.test(firstP.textContent || '')) {
                    firstP.textContent = `Email: ${user.email}`;
                }
            }
        } catch (_) {
            // ignore
        }
    }
});