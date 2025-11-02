// Gallery Loader for About Page
const API_BASE = '/api';

async function loadGalleryImages() {
    try {
        console.log('Loading gallery images from API...');
        const response = await fetch(`${API_BASE}/gallery`);
        const result = await response.json();
        
        console.log('Gallery API response:', result);
        
        if (result.success && result.data && result.data.length > 0) {
            const galleryGrid = document.querySelector('.gallery-grid');
            if (!galleryGrid) {
                console.error('Gallery grid not found');
                return;
            }
            
            console.log(`Found ${result.data.length} images from API`);
            
            // Add dynamic images at the beginning (prepend)
            result.data.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${image.data}" alt="${image.caption}" class="gallery-image" title="${image.caption}">
                `;
                // Insert at the beginning
                galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
            });
            
            console.log('Gallery images loaded successfully');
            
            // Reinitialize lightbox if it exists
            if (typeof initLightbox === 'function') {
                initLightbox();
            }
        } else {
            console.log('No images from API, showing static images only');
        }
    } catch (error) {
        console.error('Error loading gallery images:', error);
        // Keep static images if API fails
    }
}

// Load gallery images when page loads
if (document.querySelector('.gallery-grid')) {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadGalleryImages);
    } else {
        loadGalleryImages();
    }
}
