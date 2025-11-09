// Dashboard Content Loader
// This script loads the management sections into the new dashboard

// Don't redeclare API_BASE - use the global one from dashboard.js

// Load Gallery Management Content
function loadGalleryContent() {
    const galleryPage = document.getElementById('galleryPage');
    if (!galleryPage) return;
    
    galleryPage.querySelector('.page-content').innerHTML = `
        <div class="management-section">
            <div class="section-card">
                <div class="section-header">
                    <h2>Upload New Image</h2>
                    <p class="section-subtitle">Add images to your tour gallery</p>
                </div>
                <form id="uploadGalleryForm" class="modern-form">
                    <div class="form-grid">
                        <div class="form-field full-width">
                            <label for="galleryImage">Select Image</label>
                            <div class="file-upload-area" id="fileUploadArea">
                                <input type="file" id="galleryImage" accept="image/*" required hidden>
                                <div class="upload-placeholder">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    <p>Click to upload or drag and drop</p>
                                    <span>PNG, JPG, GIF up to 10MB</span>
                                </div>
                                <div class="upload-preview" id="uploadPreview" style="display: none;">
                                    <img id="previewImage" src="" alt="Preview">
                                    <button type="button" class="btn-remove-preview" onclick="removePreview()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="form-field full-width">
                            <label for="galleryCaption">Image Caption</label>
                            <input type="text" id="galleryCaption" placeholder="Enter a descriptive caption" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload Image
                    </button>
                </form>
            </div>
            
            <div class="section-card">
                <div class="section-header">
                    <h2>Gallery Images</h2>
                    <p class="section-subtitle">Manage your uploaded images</p>
                </div>
                <div id="galleryGrid" class="images-grid">
                    <div class="loading-spinner">Loading...</div>
                </div>
            </div>
        </div>
    `;
    
    // Setup file upload
    setupFileUpload();
    
    // Setup form handler
    document.getElementById('uploadGalleryForm').addEventListener('submit', handleGalleryUpload);
    
    // Load gallery images
    loadGalleryImages();
}

// Setup file upload drag and drop
function setupFileUpload() {
    const fileInput = document.getElementById('galleryImage');
    const uploadArea = document.getElementById('fileUploadArea');
    const preview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                uploadArea.querySelector('.upload-placeholder').style.display = 'none';
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });
}

// Remove preview
window.removePreview = function() {
    document.getElementById('galleryImage').value = '';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('fileUploadArea').querySelector('.upload-placeholder').style.display = 'flex';
};

// Handle gallery upload
async function handleGalleryUpload(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('galleryImage');
    const caption = document.getElementById('galleryCaption').value;
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Uploading...';
    submitBtn.disabled = true;
    
    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = e.target.result;
            
            const response = await fetch(`${API_BASE}/gallery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: imageData,
                    caption: caption,
                    date: new Date().toISOString()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Image uploaded successfully!');
                document.getElementById('uploadGalleryForm').reset();
                removePreview();
                loadGalleryImages();
            } else {
                alert('Error uploading image: ' + result.error);
            }
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Load gallery images
async function loadGalleryImages() {
    const grid = document.getElementById('galleryGrid');
    
    try {
        const response = await fetch(`${API_BASE}/gallery`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            grid.innerHTML = result.data.map(img => `
                <div class="image-card">
                    <div class="image-wrapper">
                        <img src="${img.data}" alt="${img.caption}">
                        <div class="image-overlay">
                            <button class="btn-icon" onclick="deleteGalleryImage('${img.id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="image-info">
                        <p class="image-caption">${img.caption}</p>
                        <span class="image-date">${new Date(img.date).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<div class="empty-state"><p>No images uploaded yet</p></div>';
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        grid.innerHTML = '<div class="empty-state"><p>Error loading images</p></div>';
    }
}

// Delete gallery image
window.deleteGalleryImage = async function(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/gallery`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Image deleted successfully!');
            loadGalleryImages();
        } else {
            alert('Error deleting image: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image');
    }
};

// Load Reviews Management Content
function loadReviewsContent() {
    const reviewsPage = document.getElementById('reviewsPage');
    if (!reviewsPage) return;
    
    reviewsPage.querySelector('.page-content').innerHTML = `
        <div class="management-section">
            <div class="section-card">
                <div class="section-header">
                    <h2>Add Review (Admin)</h2>
                    <p class="section-subtitle">Add customer testimonials</p>
                </div>
                <form id="addReviewForm" class="modern-form">
                    <div class="form-grid">
                        <div class="form-field">
                            <label for="reviewName">Customer Name</label>
                            <input type="text" id="reviewName" placeholder="John Doe" required>
                        </div>
                        <div class="form-field">
                            <label for="reviewCountry">Country</label>
                            <input type="text" id="reviewCountry" placeholder="United States" required>
                        </div>
                        <div class="form-field">
                            <label for="reviewRating">Rating</label>
                            <select id="reviewRating" required>
                                <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                                <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                                <option value="3">⭐⭐⭐ (3 stars)</option>
                                <option value="2">⭐⭐ (2 stars)</option>
                                <option value="1">⭐ (1 star)</option>
                            </select>
                        </div>
                        <div class="form-field full-width">
                            <label for="reviewText">Review</label>
                            <textarea id="reviewText" rows="4" placeholder="Share your experience..." required></textarea>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Review
                    </button>
                </form>
            </div>
            
            <div class="section-card">
                <div class="section-header">
                    <h2>All Reviews</h2>
                    <p class="section-subtitle">Manage customer reviews</p>
                </div>
                <div id="reviewsList" class="reviews-list">
                    <div class="loading-spinner">Loading...</div>
                </div>
            </div>
        </div>
    `;
    
    // Setup form handler
    document.getElementById('addReviewForm').addEventListener('submit', handleAddReview);
    
    // Load reviews
    loadReviews();
}

// Handle add review
async function handleAddReview(e) {
    e.preventDefault();
    
    const reviewData = {
        name: document.getElementById('reviewName').value,
        country: document.getElementById('reviewCountry').value,
        rating: parseInt(document.getElementById('reviewRating').value),
        text: document.getElementById('reviewText').value,
        approved: true,
        date: new Date().toISOString()
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Adding...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Review added successfully!');
            document.getElementById('addReviewForm').reset();
            loadReviews();
        } else {
            alert('Error adding review: ' + result.error);
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    } catch (error) {
        console.error('Error adding review:', error);
        alert('Error adding review');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Load reviews
async function loadReviews() {
    const list = document.getElementById('reviewsList');
    
    try {
        const response = await fetch(`${API_BASE}/reviews`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            list.innerHTML = result.data.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-author-info">
                            <div class="review-avatar">${review.name.charAt(0)}</div>
                            <div>
                                <h4>${review.name}</h4>
                                <p>${review.country}</p>
                            </div>
                        </div>
                        <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                    </div>
                    <p class="review-text">${review.text}</p>
                    <div class="review-footer">
                        <span class="review-status ${review.approved ? 'approved' : 'pending'}">
                            ${review.approved ? 'Approved' : 'Pending'}
                        </span>
                        <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                        <div class="review-actions">
                            ${!review.approved ? `<button class="btn-approve" onclick="approveReview('${review.id}')">Approve</button>` : ''}
                            <button class="btn-delete" onclick="deleteReview('${review.id}')">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<div class="empty-state"><p>No reviews yet</p></div>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        list.innerHTML = '<div class="empty-state"><p>Error loading reviews</p></div>';
    }
}

// Approve review
window.approveReview = async function(id) {
    try {
        const response = await fetch(`${API_BASE}/reviews/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Review approved!');
            loadReviews();
        } else {
            alert('Error approving review: ' + result.error);
        }
    } catch (error) {
        console.error('Error approving review:', error);
        alert('Error approving review');
    }
};

// Delete review
window.deleteReview = async function(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/reviews`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Review deleted!');
            loadReviews();
        } else {
            alert('Error deleting review: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
    }
};

// Load Packages Management Content
function loadPackagesManagement() {
    const packagesPage = document.getElementById('packagesPage');
    if (!packagesPage) return;
    
    packagesPage.querySelector('.page-content').innerHTML = `
        <div class="management-section">
            <div class="section-card">
                <div class="section-header">
                    <h2>Add New Package</h2>
                    <p class="section-subtitle">Create tour packages for your website</p>
                </div>
                <form id="addPackageForm" class="modern-form">
                    <div class="form-grid">
                        <div class="form-field">
                            <label for="packageName">Package Name *</label>
                            <input type="text" id="packageName" placeholder="e.g., Cultural Heritage Tour" required>
                        </div>
                        <div class="form-field">
                            <label for="packageDuration">Duration *</label>
                            <input type="text" id="packageDuration" placeholder="e.g., 7 Days / 6 Nights" required>
                        </div>
                        <div class="form-field">
                            <label for="packagePrice">Current Price *</label>
                            <input type="text" id="packagePrice" placeholder="e.g., $899" required>
                        </div>
                        <div class="form-field">
                            <label for="packageOriginalPrice">Original Price</label>
                            <input type="text" id="packageOriginalPrice" placeholder="e.g., $1,199">
                        </div>
                        <div class="form-field">
                            <label for="packageDiscount">Discount Badge</label>
                            <input type="text" id="packageDiscount" placeholder="e.g., 25% OFF">
                        </div>
                        <div class="form-field">
                            <label for="packageBadge">Badge</label>
                            <input type="text" id="packageBadge" placeholder="e.g., Most Popular, Adventure">
                        </div>
                        <div class="form-field full-width">
                            <label for="packageDescription">Description *</label>
                            <textarea id="packageDescription" rows="3" placeholder="Brief package description" required></textarea>
                        </div>
                        <div class="form-field full-width">
                            <label for="packageHighlights">Highlights (one per line) *</label>
                            <textarea id="packageHighlights" rows="4" placeholder="Visit 8 UNESCO World Heritage Sites&#10;Traditional dance performances&#10;Local cuisine experiences" required></textarea>
                        </div>
                        <div class="form-field full-width">
                            <label for="packageIncluded">What's Included (one per line) *</label>
                            <textarea id="packageIncluded" rows="4" placeholder="Accommodation in 4-star hotels&#10;All meals (breakfast, lunch, dinner)&#10;Air-conditioned transportation" required></textarea>
                        </div>
                        <div class="form-field">
                            <label for="packageSeason">Season</label>
                            <input type="text" id="packageSeason" placeholder="e.g., All Year, Winter Only" value="All Year">
                        </div>
                        <div class="form-field">
                            <label for="packageActive">Status</label>
                            <select id="packageActive">
                                <option value="true">Active (Visible)</option>
                                <option value="false">Inactive (Hidden)</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Package
                    </button>
                </form>
            </div>
            
            <div class="section-card">
                <div class="section-header">
                    <h2>All Packages</h2>
                    <p class="section-subtitle">Manage your tour packages</p>
                </div>
                <div id="packagesList" class="packages-list">
                    <div class="loading-spinner">Loading...</div>
                </div>
            </div>
        </div>
    `;
    
    // Reinitialize packages management
    if (typeof initializePackagesManagement === 'function') {
        initializePackagesManagement();
    }
}

// Make functions globally available
window.loadGalleryContent = loadGalleryContent;
window.loadReviewsContent = loadReviewsContent;
window.loadPackagesManagement = loadPackagesManagement;
