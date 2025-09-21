// Password eye toggle for institution auth
const pwdInput = document.getElementById('instutPassword');
const toggleBtn = document.getElementById('toggleInstutPassword');
const eyeIcon = document.getElementById('eyeIcon');
if (toggleBtn) {
    toggleBtn.onclick = function () {
        if (pwdInput.type === 'password') {
            pwdInput.type = 'text';
            eyeIcon.textContent = '🙈';
        } else {
            pwdInput.type = 'password';
            eyeIcon.textContent = '👁️';
        }
    };
}

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://bbinrcxivqtedsjoctlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaW5yY3hpdnF0ZWRzam9jdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjA1MjksImV4cCI6MjA3NDAzNjUyOX0.4fNZoEgrkrCBi73tTVBCqhIa2OtJjfnaSzFfzNoMZJQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const authForm = document.getElementById('instutAuthForm');
const emailInput = document.getElementById('instutEmail');
const passwordInput = document.getElementById('instutPassword');
const userInfoDiv = document.getElementById('userInfo');
const signOutBtn = document.getElementById('signOutBtn');

function setLoading(isLoading) {
    const btn = authForm.querySelector('button[type="submit"]');
    if (isLoading) {
        btn.disabled = true;
        btn.textContent = 'Logging in...';
    } else {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
}

authForm.onsubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    try {
        // Use filter to check for matching email and password (case-insensitive email)
        let { data, error, status } = await supabase
            .from('institute')
            .select('email')
            .ilike('email', email)
            .eq('password', password)
            .maybeSingle();
        if (error && status !== 406) {
            alert('Institution login failed: ' + error.message);
        } else if (data) {
            // Store institution email in localStorage for dashboard display (use canonical email from DB)
            localStorage.setItem('instut_email', data.email);
            window.location.href = '../dashboard/index.html';
        } else {
            alert('Institution login failed: Invalid email or password.');
        }
    } catch (error) {
        alert('Institution login failed: ' + error.message);
    } finally {
        setLoading(false);
    }
};

signOutBtn.onclick = () => {
    window.location.reload();
};

authForm.style.display = 'block';
userInfoDiv.style.display = 'none';
signOutBtn.style.display = 'none';
userInfoDiv.innerHTML = '';
