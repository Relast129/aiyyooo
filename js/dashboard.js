// Dashboard Main Script
const API_BASE = '/api';

// Check authentication
if (!sessionStorage.getItem('adminAuthenticated')) {
    window.location.href = 'admin-login.html';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    loadDashboardData();
    setupNavigation();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.dashboard-page');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.dataset.page;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update active page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${pageName}Page`).classList.add('active');
            
            // Update page title
            updatePageTitle(pageName);
            
            // Load page-specific data
            loadPageData(pageName);
        });
    });
}

// Update page title
function updatePageTitle(pageName) {
    const titles = {
        overview: {
            title: 'Overview',
            subtitle: "Welcome back! Here's what's happening with your business."
        },
        gallery: {
            title: 'Gallery Management',
            subtitle: 'Upload and manage your tour gallery images.'
        },
        reviews: {
            title: 'Reviews Management',
            subtitle: 'Manage customer reviews and testimonials.'
        },
        packages: {
            title: 'Packages Management',
            subtitle: 'Create and manage your tour packages.'
        },
        analytics: {
            title: 'Analytics',
            subtitle: 'Detailed insights about your website performance.'
        }
    };
    
    const pageInfo = titles[pageName] || titles.overview;
    document.getElementById('pageTitle').textContent = pageInfo.title;
    document.getElementById('pageSubtitle').textContent = pageInfo.subtitle;
}

// Load page-specific data
function loadPageData(pageName) {
    switch(pageName) {
        case 'overview':
            loadDashboardData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }
}

// Initialize dashboard
function initializeDashboard() {
    createVisitorsChart();
    createReviewsChart();
    createPageViewsChart();
    createTrafficSourcesChart();
    createDevicesChart();
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load reviews
        const reviewsResponse = await fetch(`${API_BASE}/reviews`);
        const reviewsData = await reviewsResponse.json();
        
        // Load gallery
        const galleryResponse = await fetch(`${API_BASE}/gallery`);
        const galleryData = await galleryResponse.json();
        
        // Load packages
        const packagesResponse = await fetch(`${API_BASE}/packages`);
        const packagesData = await packagesResponse.json();
        
        // Update stats
        updateStats(reviewsData.data || [], galleryData.data || [], packagesData.data || []);
        
        // Update charts
        updateCharts(reviewsData.data || []);
        
        // Update activity
        updateActivity(reviewsData.data || [], galleryData.data || [], packagesData.data || []);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update stats
function updateStats(reviews, gallery, packages) {
    // Total visitors (simulated - would come from Vercel Analytics)
    const totalVisitors = Math.floor(Math.random() * 5000) + 10000;
    document.getElementById('totalVisitors').textContent = totalVisitors.toLocaleString();
    document.getElementById('visitorsChange').textContent = '+12.5%';
    
    // Total reviews
    document.getElementById('totalReviews').textContent = reviews.length;
    const reviewsChange = reviews.length > 0 ? '+' + Math.floor((reviews.length / 10) * 100) + '%' : '+0%';
    document.getElementById('reviewsChange').textContent = reviewsChange;
    
    // Total images
    const staticImages = 14; // Static images in about.html
    const uploadedImages = gallery.length;
    document.getElementById('totalImages').textContent = staticImages + uploadedImages;
    document.getElementById('imagesInfo').textContent = `${staticImages} static + ${uploadedImages} uploaded`;
    
    // Active packages
    const activePackages = packages.filter(p => p.active !== false).length;
    document.getElementById('totalPackages').textContent = activePackages;
    document.getElementById('packagesInfo').textContent = `${packages.length} total packages`;
    
    // Update top pages (simulated data)
    updateTopPages();
}

// Update top pages
function updateTopPages() {
    const pages = [
        { id: 'home', views: Math.floor(Math.random() * 3000) + 5000 },
        { id: 'packages', views: Math.floor(Math.random() * 2000) + 3000 },
        { id: 'about', views: Math.floor(Math.random() * 1500) + 2000 },
        { id: 'reviewsPage', views: Math.floor(Math.random() * 1000) + 1500 },
        { id: 'contact', views: Math.floor(Math.random() * 800) + 1000 }
    ];
    
    const maxViews = Math.max(...pages.map(p => p.views));
    
    pages.forEach(page => {
        document.getElementById(`${page.id}Views`).textContent = page.views.toLocaleString();
        const percentage = (page.views / maxViews) * 100;
        document.getElementById(`${page.id}Bar`).style.width = percentage + '%';
    });
}

// Update activity
function updateActivity(reviews, gallery, packages) {
    const activityList = document.getElementById('activityList');
    const activities = [];
    
    // Recent reviews
    reviews.slice(0, 2).forEach(review => {
        activities.push({
            type: 'review',
            title: 'New Review',
            description: `${review.name} left a ${review.rating}-star review`,
            time: getRelativeTime(review.date)
        });
    });
    
    // Recent gallery uploads
    gallery.slice(0, 2).forEach(image => {
        activities.push({
            type: 'gallery',
            title: 'Image Uploaded',
            description: image.caption,
            time: getRelativeTime(image.date)
        });
    });
    
    // Recent packages
    packages.slice(0, 1).forEach(pkg => {
        activities.push({
            type: 'package',
            title: 'Package Updated',
            description: pkg.name,
            time: getRelativeTime(pkg.updatedAt || pkg.createdAt)
        });
    });
    
    // Sort by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // Render activities
    if (activities.length === 0) {
        activityList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No recent activity</p>';
        return;
    }
    
    activityList.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                ${getActivityIcon(activity.type)}
            </div>
            <div class="activity-content">
                <p class="activity-title">${activity.title}</p>
                <p class="activity-description">${activity.description}</p>
                <p class="activity-time">${activity.time}</p>
            </div>
        </div>
    `).join('');
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        review: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
        gallery: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
        package: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
    };
    return icons[type] || '';
}

// Get relative time
function getRelativeTime(dateString) {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

// Create visitors chart
let visitorsChart;
function createVisitorsChart() {
    const ctx = document.getElementById('visitorsChart').getContext('2d');
    
    // Generate sample data for last 30 days
    const labels = [];
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 300) + 200);
    }
    
    visitorsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Visitors',
                data: data,
                borderColor: '#00a896',
                backgroundColor: 'rgba(0, 168, 150, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#00a896',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e2433',
                    titleColor: '#fff',
                    bodyColor: '#8b92a7',
                    borderColor: '#2d3548',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: '#2d3548',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

// Create reviews chart
let reviewsChart;
function createReviewsChart() {
    const ctx = document.getElementById('reviewsChart').getContext('2d');
    
    reviewsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Pending'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#10b981', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e2433',
                    titleColor: '#fff',
                    bodyColor: '#8b92a7',
                    borderColor: '#2d3548',
                    borderWidth: 1,
                    padding: 12
                }
            },
            cutout: '70%'
        }
    });
}

// Update charts
function updateCharts(reviews) {
    const approved = reviews.filter(r => r.approved).length;
    const pending = reviews.filter(r => !r.approved).length;
    
    if (reviewsChart) {
        reviewsChart.data.datasets[0].data = [approved, pending];
        reviewsChart.update();
    }
}

// Create page views chart
let pageViewsChart;
function createPageViewsChart() {
    const ctx = document.getElementById('pageViewsChart').getContext('2d');
    
    // Generate sample data
    const labels = [];
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 500) + 300);
    }
    
    pageViewsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Page Views',
                data: data,
                backgroundColor: 'rgba(0, 168, 150, 0.8)',
                borderRadius: 6,
                barThickness: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e2433',
                    titleColor: '#fff',
                    bodyColor: '#8b92a7',
                    borderColor: '#2d3548',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    grid: {
                        color: '#2d3548',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

// Create traffic sources chart
let trafficSourcesChart;
function createTrafficSourcesChart() {
    const ctx = document.getElementById('trafficSourcesChart').getContext('2d');
    
    trafficSourcesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Direct', 'Social Media', 'Search', 'Referral'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#00a896', '#f59e0b', '#3b82f6', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#8b92a7',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e2433',
                    titleColor: '#fff',
                    bodyColor: '#8b92a7',
                    borderColor: '#2d3548',
                    borderWidth: 1,
                    padding: 12
                }
            },
            cutout: '65%'
        }
    });
}

// Create devices chart
let devicesChart;
function createDevicesChart() {
    const ctx = document.getElementById('devicesChart').getContext('2d');
    
    devicesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Mobile', 'Desktop', 'Tablet'],
            datasets: [{
                data: [55, 35, 10],
                backgroundColor: ['#00a896', '#3b82f6', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#8b92a7',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e2433',
                    titleColor: '#fff',
                    bodyColor: '#8b92a7',
                    borderColor: '#2d3548',
                    borderWidth: 1,
                    padding: 12
                }
            }
        }
    });
}

// Load analytics data
function loadAnalyticsData() {
    // Analytics data would come from Vercel Analytics API
    console.log('Loading analytics data...');
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'admin-login.html';
}

// Period change handler
document.getElementById('visitorPeriod')?.addEventListener('change', (e) => {
    const period = parseInt(e.target.value);
    updateVisitorsChart(period);
});

function updateVisitorsChart(days) {
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 300) + 200);
    }
    
    if (visitorsChart) {
        visitorsChart.data.labels = labels;
        visitorsChart.data.datasets[0].data = data;
        visitorsChart.update();
    }
}
