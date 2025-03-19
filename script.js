import { accounts } from './config.js';

let currentUser = null;

function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUI();
    }
    
    // Check if on download page and redirect if no membership
    if (window.location.pathname.includes('download.html')) {
        if (!currentUser || !currentUser.hasMembership) {
            window.location.href = 'https://vihaangayakwad.github.io/ClassroomBypass/?bobertaccess=true/';
        }
    }
}

function updateUI() {
    const loginStatus = document.getElementById('login-status');
    const downloadLink = document.getElementById('download-link');
    const loginNav = document.getElementById('login-nav');
    const loginForm = document.getElementById('loginForm');
    const ctaLoginButton = document.querySelector('.cta-button.secondary');
    const ctaPricingButton = document.querySelector('.cta-button:not(.secondary)'); // Get pricing button

    if (currentUser) {
        loginStatus.innerHTML = `
            <span class="username">Logged in as ${currentUser.username}</span>
            <button onclick="logout()">Logout</button>
        `;
        if (loginForm) loginForm.style.display = 'none';
        if (loginNav) loginNav.style.display = 'none';
        if (ctaLoginButton) ctaLoginButton.style.display = 'none';
        
        if (currentUser.hasMembership) {
            if (downloadLink) downloadLink.style.display = 'block';
            if (ctaPricingButton) ctaPricingButton.style.display = 'none'; // Hide pricing button if user has membership
        }
    } else {
        loginStatus.innerHTML = '';
        if (loginForm) loginForm.style.display = 'block';
        if (loginNav) loginNav.style.display = 'block';
        if (ctaLoginButton) ctaLoginButton.style.display = 'inline-block';
        if (downloadLink) downloadLink.style.display = 'none';
        if (ctaPricingButton) ctaPricingButton.style.display = 'inline-block'; // Show pricing button if user is not logged in
    }
}

window.logout = function() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    if (window.location.pathname.includes('download.html')) {
        window.location.href = 'https://vihaangayakwad.github.io/ClassroomBypass/?bobertaccess=true/';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginError = document.getElementById('login-error');
        let loginAttemptAllowed = true;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!loginAttemptAllowed) return;
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = accounts.find(acc => 
                acc.username === username && acc.password === password
            );

            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateUI();
                window.location.href = 'https://vihaangayakwad.github.io/ClassroomBypass/?bobertaccess=true/';
            } else {
                loginError.textContent = 'Invalid credentials';
                loginAttemptAllowed = false;
                
                setTimeout(() => {
                    loginAttemptAllowed = true;
                    loginError.textContent = '';
                }, 2000);
            }
        });
    }

    const subscribeBtn = document.getElementById('subscribe-btn');
    if (subscribeBtn) {
        // Removed the event listener as per the plan
    }
});
