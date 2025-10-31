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

// Gallery Management
function getGalleryImages() {
    const images = localStorage.getItem('galleryImages');
    return images ? JSON.parse(images) : [];
}

function saveGalleryImages(images) {
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

function renderGalleryList() {
    const galleryList = document.getElementById('galleryList');
    const images = getGalleryImages();
    
    if (images.length === 0) {
        galleryList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No images uploaded yet.</p>';
        return;
    }
    
    galleryList.innerHTML = images.map((img, index) => `
        <div class="gallery-item">
            <img src="${img.data}" alt="${img.caption}">
            <div class="gallery-item-info">
                <div class="gallery-item-caption">${img.caption}</div>
                <div class="gallery-item-actions">
                    <button class="btn-delete" onclick="deleteGalleryImage(${index})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteGalleryImage(index) {
    if (confirm('Are you sure you want to delete this image?')) {
        const images = getGalleryImages();
        images.splice(index, 1);
        saveGalleryImages(images);
        renderGalleryList();
    }
}

// Upload gallery image
const uploadGalleryForm = document.getElementById('uploadGalleryForm');
if (uploadGalleryForm) {
    uploadGalleryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('galleryImage');
        const caption = document.getElementById('galleryCaption').value;
        const file = fileInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const images = getGalleryImages();
                images.push({
                    data: e.target.result,
                    caption: caption,
                    date: new Date().toISOString()
                });
                saveGalleryImages(images);
                renderGalleryList();
                uploadGalleryForm.reset();
                alert('Image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Reviews Management
function getReviews() {
    const reviews = localStorage.getItem('reviews');
    return reviews ? JSON.parse(reviews) : [];
}

function saveReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function renderReviewsList() {
    const reviewsList = document.getElementById('reviewsList');
    const reviews = getReviews();
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No reviews yet.</p>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map((review, index) => `
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
                ${review.status === 'pending' ? `<button class="btn-approve" onclick="approveReview(${index})">Approve</button>` : ''}
                <button class="btn-delete" onclick="deleteReview(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function approveReview(index) {
    const reviews = getReviews();
    reviews[index].status = 'approved';
    saveReviews(reviews);
    renderReviewsList();
    alert('Review approved!');
}

function deleteReview(index) {
    if (confirm('Are you sure you want to delete this review?')) {
        const reviews = getReviews();
        reviews.splice(index, 1);
        saveReviews(reviews);
        renderReviewsList();
    }
}

// Add review (admin)
const addReviewForm = document.getElementById('addReviewForm');
if (addReviewForm) {
    addReviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const review = {
            name: document.getElementById('reviewName').value,
            country: document.getElementById('reviewCountry').value,
            rating: parseInt(document.getElementById('reviewRating').value),
            text: document.getElementById('reviewText').value,
            date: new Date().toISOString(),
            status: 'approved',
            source: 'admin'
        };
        
        const reviews = getReviews();
        reviews.unshift(review);
        saveReviews(reviews);
        renderReviewsList();
        addReviewForm.reset();
        alert('Review added successfully!');
    });
}

// Initialize
renderGalleryList();
renderReviewsList();
