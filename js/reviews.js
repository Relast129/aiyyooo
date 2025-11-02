// API Base URL
const API_BASE = '/api';

// Get approved reviews from API
async function getApprovedReviews() {
    try {
        const response = await fetch(`${API_BASE}/reviews?approved=true`);
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// Render reviews
async function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Loading reviews...</p>';
    
    const reviews = await getApprovedReviews();
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <h3>No Reviews Yet</h3>
                <p>Be the first to share your experience!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => {
        const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const date = new Date(review.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="review-card">
                <div class="review-card-header">
                    <div class="review-avatar">${initials}</div>
                    <div class="review-author-info">
                        <div class="review-author-name">${review.name}</div>
                        <div class="review-author-country">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${review.country}
                        </div>
                    </div>
                </div>
                <div class="review-rating-stars">${'⭐'.repeat(review.rating)}</div>
                <div class="review-content">${review.text}</div>
                <div class="review-date">${date}</div>
            </div>
        `;
    }).join('');
}

// Update stats
async function updateStats() {
    const reviews = await getApprovedReviews();
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : '0.0';
    
    document.getElementById('totalReviews').textContent = totalReviews;
    document.getElementById('avgRating').textContent = avgRating;
}

// User review submission
const userReviewForm = document.getElementById('userReviewForm');
if (userReviewForm) {
    userReviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const review = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            country: document.getElementById('userCountry').value,
            rating: parseInt(document.getElementById('userRating').value),
            text: document.getElementById('userReview').value,
            source: 'user'
        };
        
        try {
            const response = await fetch(`${API_BASE}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review)
            });
            const result = await response.json();
            if (result.success) {
                userReviewForm.reset();
                alert('Thank you for your review! It will be published after admin approval.');
            } else {
                alert('Error submitting review: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please try again.');
        }
    });
}

// Initialize
renderReviews();
updateStats();
