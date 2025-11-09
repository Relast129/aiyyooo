// Admin Authentication
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin@ceyora'
};

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Login function
function login(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminAuthenticated', 'true');
        return true;
    }
    return false;
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'admin-login.html';
}

// Protect admin pages
if (window.location.pathname.includes('admin-dashboard') || window.location.pathname.includes('dashboard.html')) {
    if (!isLoggedIn()) {
        window.location.href = 'admin-login.html';
    }
}

// Redirect if already logged in
if (window.location.pathname.includes('admin-login')) {
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
}

// Login form handler
const loginForm = document.getElementById('adminLoginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        
        if (login(username, password)) {
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    });
}

// Logout button handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
