// Tab switching
const tabs = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.admin-tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tabName + 'Tab').classList.add('active');
    });
});

// API Base URL
const API_BASE = '/api';

// Gallery Management
async function getGalleryImages() {
    try {
        const response = await fetch(`${API_BASE}/gallery`);
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        return [];
    }
}

async function renderGalleryList() {
    const galleryList = document.getElementById('galleryList');
    galleryList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Loading...</p>';
    
    const images = await getGalleryImages();
    
    if (images.length === 0) {
        galleryList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No images uploaded yet.</p>';
        return;
    }
    
    galleryList.innerHTML = images.map(img => `
        <div class="gallery-item">
            <img src="${img.data}" alt="${img.caption}">
            <div class="gallery-item-info">
                <div class="gallery-item-caption">${img.caption}</div>
                <div class="gallery-item-actions">
                    <button class="btn-delete" onclick="deleteGalleryImage('${img.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function deleteGalleryImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        try {
            const response = await fetch(`${API_BASE}/gallery`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await response.json();
            if (result.success) {
                alert('Image deleted successfully!');
                renderGalleryList();
            } else {
                alert('Error deleting image: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image. Please try again.');
        }
    }
}

// Upload gallery image
const uploadGalleryForm = document.getElementById('uploadGalleryForm');
if (uploadGalleryForm) {
    uploadGalleryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('galleryImage');
        const caption = document.getElementById('galleryCaption').value;
        const file = fileInput.files[0];
        
        if (file) {
            // Check file size (max 4MB for Vercel KV)
            if (file.size > 4 * 1024 * 1024) {
                alert('Image size should be less than 4MB. Please compress the image and try again.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const response = await fetch(`${API_BASE}/gallery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            data: e.target.result,
                            caption: caption,
                            date: new Date().toISOString()
                        })
                    });
                    const result = await response.json();
                    if (result.success) {
                        alert('Image uploaded successfully!');
                        renderGalleryList();
                        uploadGalleryForm.reset();
                    } else {
                        alert('Error uploading image: ' + result.error);
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    alert('Error uploading image. Please try again.');
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Reviews Management
async function getReviews() {
    try {
        const response = await fetch(`${API_BASE}/reviews`);
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

async function renderReviewsList() {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Loading...</p>';
    
    const reviews = await getReviews();
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No reviews yet.</p>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <div class="review-author">${review.name}</div>
                    <div class="review-country">📍 ${review.country}</div>
                </div>
                <div>
                    <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                    <span class="review-status ${review.status}">${review.status}</span>
                </div>
            </div>
            <div class="review-text">${review.text}</div>
            ${review.email ? `<div style="color: #999; font-size: 0.9rem;">Email: ${review.email}</div>` : ''}
            <div class="review-actions">
                ${review.status === 'pending' ? `<button class="btn-approve" onclick="approveReview('${review.id}')">Approve</button>` : ''}
                <button class="btn-delete" onclick="deleteReview('${review.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function approveReview(id) {
    try {
        const response = await fetch(`${API_BASE}/reviews`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'approved' })
        });
        const result = await response.json();
        if (result.success) {
            alert('Review approved!');
            renderReviewsList();
        } else {
            alert('Error approving review: ' + result.error);
        }
    } catch (error) {
        console.error('Error approving review:', error);
        alert('Error approving review. Please try again.');
    }
}

async function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        try {
            const response = await fetch(`${API_BASE}/reviews`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await response.json();
            if (result.success) {
                alert('Review deleted successfully!');
                renderReviewsList();
            } else {
                alert('Error deleting review: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Error deleting review. Please try again.');
        }
    }
}

// Add review (admin)
const addReviewForm = document.getElementById('addReviewForm');
if (addReviewForm) {
    addReviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const review = {
            name: document.getElementById('reviewName').value,
            country: document.getElementById('reviewCountry').value,
            rating: parseInt(document.getElementById('reviewRating').value),
            text: document.getElementById('reviewText').value,
            source: 'admin'
        };
        
        try {
            const response = await fetch(`${API_BASE}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review)
            });
            const result = await response.json();
            if (result.success) {
                alert('Review added successfully!');
                renderReviewsList();
                addReviewForm.reset();
            } else {
                alert('Error adding review: ' + result.error);
            }
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Error adding review. Please try again.');
        }
    });
}

// Initialize
renderGalleryList();
renderReviewsList();
