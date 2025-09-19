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
        // Try to sign in
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', cred.user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            // Check if email matches (extra safety)
            if (userData.email === email) {
                window.location.href = '../Dashboard/dashboard.html';
            } else {
                await signOut(auth);
                alert('Email does not match our records.');
            }
        } else {
            // User authenticated but not in Firestore, create user doc and redirect to institution.html
            await setDoc(userRef, {
                email,
                password,
                role: "student",
                createdAt: new Date()
            });
            window.location.href = '../Institution/institution.html';
        }
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
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", cred.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email,
                password,
                role: "student",
                createdAt: new Date()
            });
            window.location.href = '../Institution/institution.html';
        } else {
            alert('User already exists. Please log in.');
        }
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    }
};

// Google sign in/up
googleSignInBtn.onclick = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            // Existing user: go to dashboard
            window.location.href = '../Dashboard/dashboard.html';
        } else {
            // New user: create entry, then go to institution.html
            await setDoc(userRef, {
                email: user.email,
                password: null,
                role: "student",
                createdAt: new Date()
            });
            window.location.href = '../Institution/institution.html';
        }
    } catch (error) {
        alert('Google sign in/up failed: ' + error.message);
    }
};

signOutBtn.onclick = async () => {
    await signOut(auth);
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Prevent dashboard redirect if just signed up
        if (sessionStorage.getItem('justSignedUp')) {
            sessionStorage.removeItem('justSignedUp');
            return;
        }
        // Check if user info exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            // Redirect to dashboard if info exists
            window.location.href = '../Dashboard/dashboard.html';
            return;
        }
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
