// Authentication state
let authToken = null;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const signupForm = document.getElementById('signup-form');

// Event Listeners
loginBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
});

logoutBtn.addEventListener('click', async () => {
    await logout();
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await login();
});

// Close modal when clicking outside
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.add('hidden');
    }
});

// Authentication Functions
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.access_token;
            updateAuthUI(true);
            loginModal.classList.add('hidden');
            showLoginMessage('Logged in successfully!', false);
            loginForm.reset();
        } else {
            showLoginMessage(data.detail || 'Login failed', true);
        }
    } catch (error) {
        showLoginMessage('An error occurred. Please try again.', true);
    }
}

async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            authToken = null;
            updateAuthUI(false);
            showLoginMessage('Logged out successfully!', false);
        }
    } catch (error) {
        showLoginMessage('Logout failed. Please try again.', true);
    }
}

function updateAuthUI(isLoggedIn) {
    loginBtn.classList.toggle('hidden', isLoggedIn);
    logoutBtn.classList.toggle('hidden', !isLoggedIn);
    signupForm.classList.toggle('hidden', !isLoggedIn);
}

function showLoginMessage(message, isError) {
    loginMessage.textContent = message;
    loginMessage.classList.remove('hidden', 'error', 'success');
    loginMessage.classList.add(isError ? 'error' : 'success');
    
    // Hide message after 3 seconds
    setTimeout(() => {
        loginMessage.classList.add('hidden');
    }, 3000);
}

// Initialize UI
updateAuthUI(false);