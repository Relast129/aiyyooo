// Admin Packages Management
// Use existing API_BASE or create it
if (typeof API_BASE === 'undefined') {
    var API_BASE = '/api';
}

// Initialize packages management
window.initializePackagesManagement = function() {
    // Setup form handler
    const form = document.getElementById('addPackageForm');
    if (form) {
        form.addEventListener('submit', handleAddPackage);
    }
    
    // Load packages
    loadPackages();
};

// Handle add package
async function handleAddPackage(e) {
    e.preventDefault();
    
    const packageData = {
        name: document.getElementById('packageName').value,
        duration: document.getElementById('packageDuration').value,
        price: document.getElementById('packagePrice').value,
        originalPrice: document.getElementById('packageOriginalPrice').value,
        discount: document.getElementById('packageDiscount').value,
        description: document.getElementById('packageDescription').value,
        highlights: document.getElementById('packageHighlights').value.split('\n').filter(h => h.trim()),
        included: document.getElementById('packageIncluded').value.split('\n').filter(i => i.trim()),
        badge: document.getElementById('packageBadge').value,
        season: document.getElementById('packageSeason').value || 'All Year',
        active: document.getElementById('packageActive').value === 'true'
    };
    
    try {
        const response = await fetch(`${API_BASE}/packages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(packageData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Package added successfully!');
            document.getElementById('addPackageForm').reset();
            loadPackages();
        } else {
            alert('Error adding package: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding package:', error);
        alert('Error adding package. Please try again.');
    }
}

// Load and display packages
async function loadPackages() {
    try {
        const response = await fetch(`${API_BASE}/packages`);
        const result = await response.json();
        
        if (result.success) {
            renderPackagesList(result.data);
        }
    } catch (error) {
        console.error('Error loading packages:', error);
    }
}

// Render packages list
function renderPackagesList(packages) {
    const container = document.getElementById('packagesList');
    if (!container) return;
    
    if (packages.length === 0) {
        container.innerHTML = '<p class="empty-message">No packages yet. Add your first package above!</p>';
        return;
    }
    
    container.innerHTML = packages.map(pkg => `
        <div class="package-item ${pkg.active ? '' : 'inactive'}">
            <div class="package-item-header">
                <div>
                    <h3>${pkg.name}</h3>
                    <p class="package-meta">
                        ${pkg.duration} • ${pkg.price}
                        ${pkg.badge ? `<span class="badge-small">${pkg.badge}</span>` : ''}
                        ${pkg.active ? '<span class="status-active">Active</span>' : '<span class="status-inactive">Inactive</span>'}
                    </p>
                </div>
                <div class="package-actions">
                    <button class="btn btn-sm btn-outline" onclick="editPackage('${pkg.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="btn btn-sm ${pkg.active ? 'btn-warning' : 'btn-success'}" onclick="togglePackageStatus('${pkg.id}', ${!pkg.active})">
                        ${pkg.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePackage('${pkg.id}', '${pkg.name}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
            <div class="package-item-details">
                <p><strong>Description:</strong> ${pkg.description}</p>
                <p><strong>Highlights:</strong> ${pkg.highlights?.length || 0} items</p>
                <p><strong>Included:</strong> ${pkg.included?.length || 0} items</p>
                <p><strong>Season:</strong> ${pkg.season || 'All Year'}</p>
            </div>
        </div>
    `).join('');
}

// Edit package
window.editPackage = async function(id) {
    try {
        const response = await fetch(`${API_BASE}/packages`);
        const result = await response.json();
        
        if (result.success) {
            const pkg = result.data.find(p => p.id === id);
            if (!pkg) {
                alert('Package not found');
                return;
            }
            
            // Populate form with package data
            document.getElementById('packageName').value = pkg.name;
            document.getElementById('packageDuration').value = pkg.duration;
            document.getElementById('packagePrice').value = pkg.price;
            document.getElementById('packageOriginalPrice').value = pkg.originalPrice || '';
            document.getElementById('packageDiscount').value = pkg.discount || '';
            document.getElementById('packageDescription').value = pkg.description;
            document.getElementById('packageHighlights').value = (pkg.highlights || []).join('\n');
            document.getElementById('packageIncluded').value = (pkg.included || []).join('\n');
            document.getElementById('packageBadge').value = pkg.badge || '';
            document.getElementById('packageSeason').value = pkg.season || 'All Year';
            document.getElementById('packageActive').value = pkg.active ? 'true' : 'false';
            
            // Change form to edit mode
            const form = document.getElementById('addPackageForm');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Update Package
            `;
            
            // Store package ID for update
            form.dataset.editId = id;
            
            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth' });
            
            // Replace submit handler
            form.onsubmit = async (e) => {
                e.preventDefault();
                await updatePackage(id);
            };
        }
    } catch (error) {
        console.error('Error loading package:', error);
        alert('Error loading package details');
    }
};

// Update package
async function updatePackage(id) {
    const packageData = {
        id,
        name: document.getElementById('packageName').value,
        duration: document.getElementById('packageDuration').value,
        price: document.getElementById('packagePrice').value,
        originalPrice: document.getElementById('packageOriginalPrice').value,
        discount: document.getElementById('packageDiscount').value,
        description: document.getElementById('packageDescription').value,
        highlights: document.getElementById('packageHighlights').value.split('\n').filter(h => h.trim()),
        included: document.getElementById('packageIncluded').value.split('\n').filter(i => i.trim()),
        badge: document.getElementById('packageBadge').value,
        season: document.getElementById('packageSeason').value || 'All Year',
        active: document.getElementById('packageActive').value === 'true'
    };
    
    try {
        const response = await fetch(`${API_BASE}/packages`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(packageData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Package updated successfully!');
            resetForm();
            loadPackages();
        } else {
            alert('Error updating package: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating package:', error);
        alert('Error updating package. Please try again.');
    }
}

// Toggle package status
window.togglePackageStatus = async function(id, newStatus) {
    try {
        const response = await fetch(`${API_BASE}/packages`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, active: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Package ${newStatus ? 'activated' : 'deactivated'} successfully!`);
            loadPackages();
        } else {
            alert('Error updating package status: ' + result.error);
        }
    } catch (error) {
        console.error('Error toggling package status:', error);
        alert('Error updating package status');
    }
};

// Delete package
window.deletePackage = async function(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/packages`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Package deleted successfully!');
            loadPackages();
        } else {
            alert('Error deleting package: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting package:', error);
        alert('Error deleting package');
    }
};

// Reset form to add mode
function resetForm() {
    const form = document.getElementById('addPackageForm');
    form.reset();
    delete form.dataset.editId;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Package
    `;
    
    // Restore original submit handler
    form.onsubmit = async (e) => {
        e.preventDefault();
        // Original add package logic is already in the event listener at the top
        form.dispatchEvent(new Event('submit'));
    };
}

// Auto-initialize if packages list exists on page load (for old admin-dashboard.html compatibility)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('packagesList') && !document.getElementById('galleryPage')) {
        // This is the old admin-dashboard.html, initialize normally
        const form = document.getElementById('addPackageForm');
        if (form) {
            form.addEventListener('submit', handleAddPackage);
        }
        loadPackages();
    }
});
