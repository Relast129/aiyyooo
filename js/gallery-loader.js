// Gallery Loader for About Page
const API_BASE = '/api';

async function loadGalleryImages() {
    try {
        console.log('Loading gallery images from API...');
        const response = await fetch(`${API_BASE}/gallery`);
        const result = await response.json();
        
        console.log('Gallery API response:', result);
        
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) {
            console.error('Gallery grid not found');
            return;
        }
        
        if (result.success && result.data && result.data.length > 0) {
            console.log(`Found ${result.data.length} uploaded images from Blob Store`);
            
            // Add uploaded images at the beginning (before static images)
            // Reverse the array so newest images appear first
            const reversedImages = [...result.data].reverse();
            
            reversedImages.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item uploaded-image';
                galleryItem.innerHTML = `
                    <img src="${image.data}" alt="${image.caption}" class="gallery-image" title="${image.caption}">
                    <div class="image-caption">${image.caption}</div>
                `;
                // Insert at the beginning (before static images)
                galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
            });
            
            console.log(`Gallery now shows: ${result.data.length} uploaded images + static images`);
            
            // Reinitialize lightbox if it exists
            if (typeof initLightbox === 'function') {
                initLightbox();
            }
        } else {
            console.log('No uploaded images from API, showing static images only');
        }
        
        // Count total images
        const totalImages = galleryGrid.querySelectorAll('.gallery-item').length;
        console.log(`Total images in gallery: ${totalImages}`);
        
    } catch (error) {
        console.error('Error loading gallery images:', error);
        // Keep static images if API fails
        console.log('Showing static images only due to error');
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
