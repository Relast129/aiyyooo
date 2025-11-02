// Gallery Loader for About Page
const API_BASE = '/api';

async function loadGalleryImages() {
    try {
        const response = await fetch(`${API_BASE}/gallery`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            const galleryGrid = document.querySelector('.gallery-grid');
            if (!galleryGrid) return;
            
            // Clear existing static images
            galleryGrid.innerHTML = '';
            
            // Add dynamic images
            result.data.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${image.data}" alt="${image.caption}" class="gallery-image">
                `;
                galleryGrid.appendChild(galleryItem);
            });
            
            // Reinitialize lightbox if it exists
            if (typeof initLightbox === 'function') {
                initLightbox();
            }
        }
    } catch (error) {
        console.error('Error loading gallery images:', error);
    }
}

// Load gallery images when page loads
if (document.querySelector('.gallery-grid')) {
    loadGalleryImages();
}
