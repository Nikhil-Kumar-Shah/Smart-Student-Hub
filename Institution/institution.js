import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxWDvbldPnVVahCaHQbYFd9zf-Tpj_bIE",
    authDomain: "smart-student-hub-973c4.firebaseapp.com",
    projectId: "smart-student-hub-973c4",
    storageBucket: "smart-student-hub-973c4.appspot.com",
    messagingSenderId: "75287424365",
    appId: "1:75287424365:web:e34a1f2f5313edcea87e64",
    measurementId: "G-JNPW5DZFD5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('institutionLoginForm');
const emailInput = document.getElementById('institutionEmail');
const passwordInput = document.getElementById('institutionPassword');
const userInfoDiv = document.getElementById('userInfo');
const signOutBtn = document.getElementById('signOutBtn');
const googleSignInBtn = document.getElementById('googleSignIn');
const provider = new GoogleAuthProvider();
// Google login for institution
googleSignInBtn.onclick = async () => {
    try {
        await signInWithPopup(auth, provider);
        window.location.href = '../Dashboard/dashboard.html';
    } catch (error) {
        alert('Google login failed: ' + error.message);
    }
};

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect to dashboard after institution login
        window.location.href = '../Dashboard/dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
};

signOutBtn.onclick = async () => {
    await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
    // Always show the login form unless the user just logged in as institution
    loginForm.style.display = 'block';
    userInfoDiv.style.display = 'none';
    signOutBtn.style.display = 'none';
    userInfoDiv.innerHTML = '';
});
