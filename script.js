// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = this.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 968) {
            navMenu.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Gallery lightbox functionality (if on gallery page)
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length > 0) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        display: none;
        position: fixed;
        z-index: 10000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);
    
    // Add click events to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.style.display = 'flex';
        });
    });
    
    // Close lightbox on click
    lightbox.addEventListener('click', function() {
        this.style.display = 'none';
    });
    
    // Close lightbox on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Form validation (if forms are added in the future)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe content cards and sections
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.content-card, .leader-card, .schedule-item, .contact-card, .method-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Print functionality
function printPage() {
    window.print();
}

// Share functionality (for future implementation)
function shareContent(platform, url, title) {
    const shareUrls = {
        facebook: `https://www.facebook.com/people/The-Greater-First-Baptist-Church-of-Mt-Pleasant-Plains/100064437860178/#`,
        twitter: `https://x.com/k29258218`,
        youtube: 'https://www.youtube.com/channel/UCguwrSa2mxgh0LgWxsHcR5A' ,
        location: 'https://www.google.com/maps/place/The+Greater+First+Baptist+Church/@38.9250122,-77.0292107,16z/data=!3m1!4b1!4m6!3m5!1s0x89b7b7e1c1091d6b:0x785199a699d51b18!8m2!3d38.9250122!4d-77.0292107!16s%2Fg%2F1tpbcwdx?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D' ,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--secondary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const heroSection = document.querySelector('.hero, .bio-hero, .give-hero');
    if (heroSection && !document.getElementById('main-content')) {
        const nextSection = heroSection.nextElementSibling;
        if (nextSection) {
            nextSection.id = 'main-content';
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {

  // Hide Visitor button on Google Form pages
  if (
    window.location.hostname.includes("forms.gle") ||
    window.location.hostname.includes("google.com")
  ) {
    return;
  }

  const visitorBtn = document.createElement("a");
  visitorBtn.href = "https://forms.gle/AJsrUvrMKC35FvCh8";
  visitorBtn.className = "floating-visitor-btn";
  visitorBtn.target = "_blank";
  visitorBtn.setAttribute("aria-label", "First Time Visitor Form");

  visitorBtn.innerHTML = `
    <i class="fas fa-user-check"></i>
    <span>1st Time Visitor</span>
  `;

  document.body.appendChild(visitorBtn);
});

console.log('The Greater First Baptist Church website loaded successfully!');
