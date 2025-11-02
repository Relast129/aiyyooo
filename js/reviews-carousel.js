// Reviews Carousel for Homepage
const API_BASE = '/api';

async function loadReviewsCarousel() {
    try {
        console.log('Loading reviews carousel from API...');
        const response = await fetch(`${API_BASE}/reviews?approved=true`);
        const result = await response.json();
        
        console.log('Reviews API response:', result);
        
        if (result.success && result.data.length > 0) {
            const reviews = result.data.slice(0, 6); // Show max 6 reviews
            console.log(`Found ${reviews.length} approved reviews for carousel`);
            
            // Create carousel HTML
            const carouselHTML = `
                <section class="reviews-carousel">
                    <div class="container">
                        <div class="section-header text-center">
                            <div class="badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                Trusted by Travelers
                            </div>
                            <h2 class="section-title">
                                What Our <span class="text-primary">Guests Say</span>
                            </h2>
                            <p class="section-description">
                                Real experiences from travelers who explored Sri Lanka with us
                            </p>
                        </div>
                        
                        <div class="reviews-carousel-track-container">
                            <div class="reviews-carousel-track">
                                ${reviews.map(review => {
                                    const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase();
                                    return `
                                        <div class="review-carousel-card">
                                            <div class="review-carousel-header">
                                                <div class="review-carousel-avatar">${initials}</div>
                                                <div>
                                                    <div class="review-carousel-name">${review.name}</div>
                                                    <div class="review-carousel-country">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                            <circle cx="12" cy="10" r="3"></circle>
                                                        </svg>
                                                        ${review.country}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="review-carousel-rating">${'⭐'.repeat(review.rating)}</div>
                                            <p class="review-carousel-text">${review.text}</p>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div class="reviews-carousel-nav">
                            <button class="carousel-nav-btn carousel-prev" aria-label="Previous reviews">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button class="carousel-nav-btn carousel-next" aria-label="Next reviews">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="text-center" style="margin-top: 2rem;">
                            <a href="reviews.html" class="btn btn-outline">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                View All Reviews
                            </a>
                        </div>
                    </div>
                </section>
            `;
            
            // Insert carousel before call-to-action section
            const callToAction = document.querySelector('.call-to-action');
            if (callToAction) {
                callToAction.insertAdjacentHTML('beforebegin', carouselHTML);
                console.log('Reviews carousel HTML inserted');
                initCarousel();
            } else {
                console.warn('Call-to-action section not found, carousel not inserted');
            }
        } else {
            console.log('No approved reviews found for carousel');
        }
    } catch (error) {
        console.error('Error loading reviews carousel:', error);
    }
}

function initCarousel() {
    const track = document.querySelector('.reviews-carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = Array.from(track.children);
    let currentIndex = 0;
    let cardsToShow = getCardsToShow();
    
    function getCardsToShow() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // 1.5rem
        const offset = -(currentIndex * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - cardsToShow;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - cardsToShow) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newCardsToShow = getCardsToShow();
        if (newCardsToShow !== cardsToShow) {
            cardsToShow = newCardsToShow;
            currentIndex = Math.min(currentIndex, cards.length - cardsToShow);
            updateCarousel();
        }
    });
    
    // Auto-scroll every 5 seconds
    setInterval(() => {
        if (currentIndex < cards.length - cardsToShow) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 5000);
    
    updateCarousel();
}

// Load carousel when page loads
if (document.querySelector('.homepage')) {
    loadReviewsCarousel();
}
