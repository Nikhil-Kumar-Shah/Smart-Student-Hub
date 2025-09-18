import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const googleSignInBtn = document.getElementById('googleSignIn');
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

// Login form
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect to institution.html after login
        window.location.href = '../Institution/institution.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
};

// Signup form
signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = signupEmail.value;
    const password = signupPassword.value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // Redirect to institution.html after signup
        window.location.href = '../Institution/institution.html';
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    }
};

// Google sign in/up
googleSignInBtn.onclick = async () => {
    try {
        await signInWithPopup(auth, provider);
        // Always redirect to institution.html after Google sign in/up
        window.location.href = '../Institution/institution.html';
    } catch (error) {
        alert('Google sign in/up failed: ' + error.message);
    }
};

signOutBtn.onclick = async () => {
    await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        userInfoDiv.style.display = 'block';
        signOutBtn.style.display = 'inline-block';
        googleSignInBtn.style.display = 'none';
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        showLogin.style.display = 'none';
        showSignup.style.display = 'none';
        userInfoDiv.innerHTML = `
            <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email)}" alt="Profile" style="width:60px;height:60px;border-radius:50%;margin-bottom:10px;" />
            <div><strong>${user.displayName || user.email}</strong></div>
            <div>${user.email}</div>
        `;
    } else {
        userInfoDiv.style.display = 'none';
        signOutBtn.style.display = 'none';
        googleSignInBtn.style.display = 'inline-block';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        showLogin.style.display = 'inline-block';
        showSignup.style.display = 'inline-block';
        showLogin.classList.add('active');
        showSignup.classList.remove('active');
        userInfoDiv.innerHTML = '';
    }
});
