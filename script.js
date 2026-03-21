// ======================== Mobile Menu Toggle ========================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ======================== Dark Mode Toggle ========================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light-mode';
document.body.classList.add(currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
            updateThemeIcon('light-mode');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateThemeIcon('dark-mode');
        }
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark-mode') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ======================== Smooth Scrolling ========================
function scrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Active link highlighting on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ======================== WhatsApp Integration ========================
function openWhatsApp(product = '') {
    const phoneNumber = '2348001234567'; // Nigeria phone number format
    let message = 'Hello FARMERS NATION, I am interested in your services.';
    
    if (product) {
        const productMessages = {
            'eggs': 'Hi, I am interested in buying fresh eggs from your marketplace.',
            'chickens': 'Hi, I am interested in buying broiler chickens from your marketplace.',
            'goats': 'Hi, I am interested in breeding goats from your marketplace.',
            'vegetables': 'Hi, I am interested in buying fresh vegetables from your marketplace.',
            'milk': 'Hi, I am interested in buying fresh milk from your marketplace.',
            'grains': 'Hi, I am interested in buying maize and grains from your marketplace.'
        };
        message = productMessages[product] || message;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// ======================== Contact Form Handling ========================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Show success message
        showNotification('Message sent successfully! We will contact you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

// ======================== Notification System ========================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        }
        
        .notification-success {
            background-color: #1e5a24;
            color: white;
        }
        
        .notification-info {
            background-color: #2d8a3d;
            color: white;
        }
        
        .notification-error {
            background-color: #dc3545;
            color: white;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        .notification.removing {
            animation: slideOutRight 0.3s ease-out;
        }
        
        @media (max-width: 480px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('removing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ======================== Lazy Loading for Images ========================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// ======================== Scroll Animations ========================
function animateOnScroll() {
    const elements = document.querySelectorAll('.guide-card, .blog-card, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Run animations when content is loaded
window.addEventListener('load', animateOnScroll);

// ======================== Search Functionality (Optional Enhancement) ========================
function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('.product-desc').textContent.toLowerCase();
        
        if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ======================== Performance: Debounce Function ========================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ======================== Loading Animation ========================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical resources
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
});

// ======================== Keyboard Navigation ========================
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search (if search is implemented)
    if (e.key === '/' && e.ctrlKey) {
        e.preventDefault();
        // Add search functionality here when needed
    }
    
    // Press Escape to close mobile menu
    if (e.key === 'Escape') {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        if (menuToggle && navLinks) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});

// ======================== Social Media Links ========================
function openSocialMedia(platform) {
    const socialLinks = {
        'facebook': 'https://facebook.com/farmersnation',
        'twitter': 'https://twitter.com/farmersnation',
        'instagram': 'https://instagram.com/farmersnation',
        'youtube': 'https://youtube.com/farmersnation'
    };
    
    if (socialLinks[platform]) {
        window.open(socialLinks[platform], '_blank');
    }
}

// ======================== Newsletter Subscription (Optional) ========================
function subscribeNewsletter(email) {
    if (email && email.includes('@')) {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        return true;
    } else {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
}

// ======================== Print Friendly Farming Guides ========================
function printGuide(guideTitle) {
    window.print();
}

// ======================== Sharing Functionality ========================
function shareContent(platform, url = window.location.href, title = document.title) {
    const shareUrls = {
        'facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        'twitter': `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        'whatsapp': `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
        'linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// ======================== Service Worker for Offline Support (Optional) ========================
if ('serviceWorker' in navigator) {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js').catch(err => {
    //     console.log('Service Worker registration failed:', err);
    // });
}

console.log('FARMERS NATION - Turning Farms Into Fortunes');
