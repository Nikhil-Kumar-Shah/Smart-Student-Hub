import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bbinrcxivqtedsjoctlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaW5yY3hpdnF0ZWRzam9jdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjA1MjksImV4cCI6MjA3NDAzNjUyOX0.4fNZoEgrkrCBi73tTVBCqhIa2OtJjfnaSzFfzNoMZJQ';
const supabase = createClient(supabaseUrl, supabaseKey);
// Password eye toggle for login
const loginPwdInput = document.getElementById('loginPassword');
const toggleLoginBtn = document.getElementById('toggleLoginPassword');
const eyeIconLogin = document.getElementById('eyeIconLogin');
if (toggleLoginBtn) {
    toggleLoginBtn.onclick = function() {
        if (loginPwdInput.type === 'password') {
            loginPwdInput.type = 'text';
            eyeIconLogin.textContent = '🙈';
        } else {
            loginPwdInput.type = 'password';
            eyeIconLogin.textContent = '👁️';
        }
    };
}
// Password eye toggle for signup
const signupPwdInput = document.getElementById('signupPassword');
const toggleSignupBtn = document.getElementById('toggleSignupPassword');
const eyeIconSignup = document.getElementById('eyeIconSignup');
if (toggleSignupBtn) {
    toggleSignupBtn.onclick = function() {
        if (signupPwdInput.type === 'password') {
            signupPwdInput.type = 'text';
            eyeIconSignup.textContent = '🙈';
        } else {
            signupPwdInput.type = 'password';
            eyeIconSignup.textContent = '👁️';
        }
    };
}

const userInfoDiv = document.getElementById('userInfo');
const signOutBtn = document.getElementById('signOutBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const showLogin = document.getElementById('showLogin');
const showSignup = document.getElementById('showSignup');

// Tab switching logic
showLogin.onclick = () => {
    showLogin.classList.add('active');
    showSignup.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
};
showSignup.onclick = () => {
    showSignup.classList.add('active');
    showLogin.classList.remove('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
};

// Login form (Supabase)
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    try {
        let { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Login failed: ' + error.message);
        } else if (data && data.user) {
            // Clear any institution session
            localStorage.removeItem('instut_email');
            // Login successful, redirect to dashboard
            window.location.href = '../dashboard/index.html';
        } else {
            alert('Login failed: Unknown error');
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
};

// Signup form (Supabase)
signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = signupEmail.value;
    const password = signupPassword.value;
    try {
        let { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            alert('Sign up failed: ' + error.message);
        } else if (data && data.user) {
            // Signup successful, redirect to new institution page
            window.location.href = '../intut_auth/instut_auth.html';
        } else {
            alert('Sign up failed: Unknown error');
        }
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    }
};

// Supabase auth state check
async function checkAuthState() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        userInfoDiv.style.display = 'block';
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        showLogin.style.display = 'none';
        showSignup.style.display = 'none';
        userInfoDiv.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}" alt="Profile" style="width:60px;height:60px;border-radius:50%;margin-bottom:10px;" />
            <div><strong>${user.email}</strong></div>
            <div>${user.email}</div>
        `;
    } else {
        userInfoDiv.style.display = 'none';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        showLogin.style.display = 'inline-block';
        showSignup.style.display = 'inline-block';
        showLogin.classList.add('active');
        showSignup.classList.remove('active');
        userInfoDiv.innerHTML = '';
    }
}

window.addEventListener('DOMContentLoaded', checkAuthState);
