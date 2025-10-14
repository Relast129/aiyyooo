// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Mobile social panel functionality
  const socialPanelBtn = document.getElementById('socialPanelBtn');
  const socialPanelContent = document.getElementById('socialPanelContent');
  
  // Debug logs to check if elements are found
  console.log('Mobile menu button found:', mobileMenuBtn);
  console.log('Mobile menu overlay found:', mobileMenuOverlay);
  console.log('Mobile menu close button found:', mobileMenuClose);
  console.log('Mobile nav links found:', mobileNavLinks.length);
  console.log('Social panel button found:', socialPanelBtn);
  console.log('Social panel content found:', socialPanelContent);
  
  if (mobileMenuBtn && mobileMenuOverlay) {
    // Update aria-expanded attribute when menu is toggled
    function updateMenuButtonState() {
      const isOpen = mobileMenuOverlay.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      
      // Focus the close button when menu opens
      if (isOpen && mobileMenuClose) {
        mobileMenuClose.focus();
      }
    }
    
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Mobile menu button clicked');
      mobileMenuOverlay.classList.toggle('active');
      updateMenuButtonState();
    });
    
    // Close mobile menu when clicking close button
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenuOverlay.classList.remove('active');
        updateMenuButtonState();
        mobileMenuBtn.focus(); // Return focus to menu button
      });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileMenuOverlay.classList.contains('active') && 
          !mobileMenuBtn.contains(e.target) && 
          !mobileMenuOverlay.contains(e.target) &&
          !mobileMenuClose.contains(e.target)) {
        mobileMenuOverlay.classList.remove('active');
        updateMenuButtonState();
      }
    });
    
    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        mobileMenuOverlay.classList.remove('active');
        updateMenuButtonState();
        mobileMenuBtn.focus(); // Return focus to menu button
      }
    });
    
    // Close mobile menu when clicking on any navigation link
    if (mobileNavLinks) {
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileMenuOverlay.classList.remove('active');
          updateMenuButtonState();
          mobileMenuBtn.focus(); // Return focus to menu button
        });
      });
    }
  } else {
    console.log('Mobile menu elements not found');
  }
  
  // Mobile social panel functionality
  if (socialPanelBtn && socialPanelContent) {
    socialPanelBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Social panel button clicked');
      socialPanelContent.classList.toggle('show');
    });
    
    // Close social panel when clicking outside
    document.addEventListener('click', function(e) {
      if (socialPanelContent.classList.contains('show') && 
          !socialPanelBtn.contains(e.target) && 
          !socialPanelContent.contains(e.target)) {
        socialPanelContent.classList.remove('show');
      }
    });
  } else {
    console.log('Social panel elements not found');
  }
  
  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Journey phase selection
  const journeyPhases = document.querySelectorAll('.journey-phase');
  if (journeyPhases.length > 0) {
    journeyPhases.forEach((phase, index) => {
      phase.addEventListener('click', function() {
        // Remove selected class from all phases
        journeyPhases.forEach(p => {
          p.querySelector('.journey-card').classList.remove('selected');
        });
        
        // Add selected class to clicked phase
        this.querySelector('.journey-card').classList.add('selected');
        
        // Update journey detail content
        const journeyDetailTitle = document.querySelector('.journey-detail-title');
        const journeyDetailDescription = document.querySelector('.journey-detail-description');
        
        if (journeyDetailTitle && journeyDetailDescription) {
          const titles = [
            "Your Sri Lankan Story Begins",
            "Uncover Ancient Mysteries",
            "Into the Wild Heart",
            "Feel the Island's Soul"
          ];
          
          const descriptions = [
            "Land in Colombo where warm smiles and tropical air welcome you. Your local guide shares the first tales of our ancient island.",
            "Climb Sigiriya at dawn, walk through 2000-year-old ruins, and feel the whispers of kings and legends in every stone.",
            "Safari through Yala where elephants roam free, trek misty mountains, and surf world-class waves under golden sunsets.",
            "Share meals with local families, learn traditional crafts, and discover why Sri Lankans say our smiles are the warmest in the world."
          ];
          
          journeyDetailTitle.textContent = titles[index];
          journeyDetailDescription.textContent = descriptions[index];
        }
      });
    });
  }
  
  // WhatsApp booking buttons
  const whatsappButtons = document.querySelectorAll('[data-whatsapp]');
  whatsappButtons.forEach(button => {
    button.addEventListener('click', function() {
      const message = this.getAttribute('data-whatsapp');
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/94772885558?text=${encodedMessage}`, '_blank');
    });
  });
  
  // Form validation for contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form elements
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');
      const consent = document.getElementById('consent');
      
      // Reset errors
      const errorElements = document.querySelectorAll('.error-message');
      errorElements.forEach(el => el.textContent = '');
      
      let isValid = true;
      
      // Validate name
      if (!name.value.trim()) {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
      }
      
      // Validate email
      if (!email.value.trim()) {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Validate subject
      if (!subject.value) {
        document.getElementById('subject-error').textContent = 'Please select a subject';
        isValid = false;
      }
      
      // Validate message
      if (!message.value.trim()) {
        document.getElementById('message-error').textContent = 'Message is required';
        isValid = false;
      } else if (message.value.trim().length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
        isValid = false;
      }
      
      // Validate consent
      if (!consent.checked) {
        document.getElementById('consent-error').textContent = 'Please accept our communication policy';
        isValid = false;
      }
      
      // If form is valid, show success message
      if (isValid) {
        // Hide form and show success message
        contactForm.style.display = 'none';
        document.querySelector('.form-success').style.display = 'block';
        
        // Reset form after 3 seconds
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = 'block';
          document.querySelector('.form-success').style.display = 'none';
        }, 3000);
      }
    });
  }
  
  // Newsletter form - changed to WhatsApp
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Redirect to WhatsApp instead of email submission
      window.open('https://wa.me/94772885558?text=Hi! I\'d like to get updates on Sri Lanka travel deals and tips.', '_blank');
    });
  }
  
  // Lightbox for gallery images
  const galleryImages = document.querySelectorAll('.gallery-image');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  
  let currentImageIndex = 0;
  const images = Array.from(galleryImages).map(img => ({
    src: img.src,
    title: img.alt
  }));
  
  if (galleryImages.length > 0 && lightbox) {
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        currentImageIndex = index;
        showLightboxImage();
      });
    });
    
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', showPrevImage);
    }
    
    if (lightboxNext) {
      lightboxNext.addEventListener('click', showNextImage);
    }
    
    // Close lightbox when clicking on backdrop
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          showPrevImage();
        } else if (e.key === 'ArrowRight') {
          showNextImage();
        }
      }
    });
  }
  
  function showLightboxImage() {
    if (!lightboxImg) return;
    
    lightboxImg.src = images[currentImageIndex].src;
    lightboxImg.alt = images[currentImageIndex].title;
    
    const titleElement = document.querySelector('.lightbox-title');
    
    if (titleElement) {
      titleElement.textContent = images[currentImageIndex].title;
    }
    
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showLightboxImage();
  }
  
  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showLightboxImage();
  }
});

// Utility functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================
// MODERN ENHANCEMENTS - Parallax & Animations
// ============================================

// Parallax scroll effect for sections
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  
  // Parallax for floating elements
  const floatingElements = document.querySelectorAll('.floating-element');
  floatingElements.forEach((element, index) => {
    const speed = 0.1 + (index * 0.05);
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
  
  // Parallax for journey background circles
  const journeyBgCircles = document.querySelectorAll('.journey-bg-circle-1, .journey-bg-circle-2');
  journeyBgCircles.forEach((circle, index) => {
    const speed = index === 0 ? 0.15 : 0.2;
    const yPos = scrolled * speed;
    circle.style.transform = `translateY(${yPos}px)`;
  });
});

// Scroll reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      
      // Add stagger effect for children
      const children = entry.target.querySelectorAll('.stagger-item');
      children.forEach((child, index) => {
        setTimeout(() => {
          child.classList.add('animate-in');
        }, index * 100);
      });
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
  const animateElements = document.querySelectorAll('.journey, .gallery, .features-grid, .contact-packages, .call-to-action, .why-choose-us, .contact-cta');
  animateElements.forEach(el => observer.observe(el));
  
  // Add stagger-item class to grid children
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => card.classList.add('stagger-item'));
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => item.classList.add('stagger-item'));
});

// Mouse move parallax effect for cards
document.addEventListener('mousemove', function(e) {
  const cards = document.querySelectorAll('.journey-card, .feature-card, .contact-card');
  
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    } else {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  });
});

// Add smooth reveal for badges
const badges = document.querySelectorAll('.badge');
badges.forEach((badge, index) => {
  badge.style.animationDelay = `${index * 0.1}s`;
  badge.classList.add('fade-in-badge');
});

// Magnetic button effect
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
  button.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(0, 0)';
  });
});

// Smooth scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #00a896, #f9c80e);
  z-index: 9999;
  transition: width 0.1s ease;
  box-shadow: 0 2px 10px rgba(0, 168, 150, 0.5);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + '%';
});