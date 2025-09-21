import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://bbinrcxivqtedsjoctlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaW5yY3hpdnF0ZWRzam9jdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjA1MjksImV4cCI6MjA3NDAzNjUyOX0.4fNZoEgrkrCBi73tTVBCqhIa2OtJjfnaSzFfzNoMZJQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const userInfoDiv = document.getElementById('userInfo');
const welcomeText = document.getElementById('welcomeText');
const logoutBtn = document.getElementById('logoutBtn');

async function showUserInfo() {
    // Try to get Supabase auth user (student)
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
        userInfoDiv.textContent = `Logged in as: ${user.email}`;
        welcomeText.textContent = `Welcome, ${user.email}!`;
        return;
    }
    // If not a student, check for institution session (by querying last login from localStorage)
    const instutEmail = localStorage.getItem('instut_email');
    if (instutEmail) {
        userInfoDiv.textContent = `Logged in as Institution: ${instutEmail}`;
        welcomeText.textContent = `Welcome, ${instutEmail}!`;
        return;
    }
    // Not logged in, redirect to login
    window.location.href = '../Authentication/Authentication.html';
}

showUserInfo();

logoutBtn.onclick = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '../Authentication/Authentication.html';
};
