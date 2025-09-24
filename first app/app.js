document.addEventListener('DOMContentLoaded', () => {
    // Firebase config - Replace with your config from Firebase Console
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // DOM Elements
    const loginOptions = document.getElementById('login-options');
    const loginForm = document.getElementById('login-form');
    const phoneLoginForm = document.getElementById('phone-login-form');
    const otpForm = document.getElementById('otp-form');

    const btnUsernameLogin = document.getElementById('btn-username-login');
    const btnPhoneLogin = document.getElementById('btn-phone-login');

    const backFromUsername = document.getElementById('back-from-username');
    const backFromPhone = document.getElementById('back-from-phone');
    const backFromOtp = document.getElementById('back-from-otp');

    const errorMsg = document.getElementById('error-msg');
    const phoneErrorMsg = document.getElementById('phone-error-msg');
    const otpErrorMsg = document.getElementById('otp-error-msg');

    let confirmationResult = null;
    let recaptchaVerifier = null;

    function showForm(formToShow) {
        [loginOptions, loginForm, phoneLoginForm, otpForm].forEach(form => {
            if (form) form.style.display = 'none';
        });
        if (formToShow) formToShow.style.display = 'block';

        // Clear error messages
        errorMsg.textContent = '';
        phoneErrorMsg.textContent = '';
        otpErrorMsg.textContent = '';
    }

    function showLoginOptions() {
        showForm(loginOptions);
    }

    // Initialize reCAPTCHA
    function initializeRecaptcha() {
        if (!recaptchaVerifier) {
            recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                size: 'normal',
                callback: () => {
                    console.log('reCAPTCHA solved');
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expired');
                },
            });
            recaptchaVerifier.render();
        }
    }

    // Username Login Flow
    btnUsernameLogin.addEventListener('click', () => {
        showForm(loginForm);
    });
    backFromUsername.addEventListener('click', showLoginOptions);
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            errorMsg.textContent = 'Please enter both username and password.';
            return;
        }

        // Simple mock check (replace with real auth)
        if (username === 'abdeali' && password === 'abdeali123') {
            alert('Welcome to Career Point!');
            window.location.href = 'dashboard.html';
        } else {
            errorMsg.textContent = 'Invalid username or password.';
        }
    });

    // Phone Login Flow
    btnPhoneLogin.addEventListener('click', () => {
        showForm(phoneLoginForm);
        initializeRecaptcha();
    });
    backFromPhone.addEventListener('click', showLoginOptions);
    phoneLoginForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        phoneErrorMsg.textContent = '';

        const phoneNumber = document.getElementById('phone-number').value.trim();
        if (!phoneNumber) {
            phoneErrorMsg.textContent = 'Please enter a valid phone number.';
            return;
        }
        if (!phoneNumber.startsWith('+')) {
            phoneErrorMsg.textContent = 'Please include country code (e.g., +91).';
            return;
        }

        try {
            confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
            showForm(otpForm);
        } catch (error) {
            phoneErrorMsg.textContent = getErrorMessage(error);
            console.error(error);
        }
    });

    // OTP Verification Flow
    backFromOtp.addEventListener('click', () => {
        showForm(phoneLoginForm);
    });
    otpForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        otpErrorMsg.textContent = '';

        const otpCode = document.getElementById('otp-code').value.trim();
        if (!otpCode) {
            otpErrorMsg.textContent = 'Please enter the OTP code.';
            return;
        }
        if (otpCode.length !== 6) {
            otpErrorMsg.textContent = 'OTP must be 6 digits long.';
            return;
        }

        try {
            const result = await confirmationResult.confirm(otpCode);
            alert('Phone login successful!');
            window.location.href = 'dashboard.html';
        } catch (error) {
            otpErrorMsg.textContent = 'Invalid OTP. Please try again.';
            console.error(error);
        }
    });

    // Google Sign-In Integration
    function handleGoogleLogin(response) {
        const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
        auth.signInWithCredential(credential)
            .then((result) => {
                alert('Google login successful!');
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                alert('Google login failed: ' + getErrorMessage(error));
                console.error(error);
            });
    }

    window.handleGoogleLogin = handleGoogleLogin;

    // Display Google sign-in button
    window.onload = function() {
        if (window.google && google.accounts) {
            google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your own client ID
                callback: handleGoogleLogin,
            });
            google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
                theme: 'outline',
                size: 'large',
            });
        }
    };

    // Error helper
    function getErrorMessage(error) {
        switch (error.code) {
            case 'auth/invalid-phone-number':
                return 'Invalid phone number format.';
            case 'auth/too-many-requests':
                return 'Too many requests. Please try again later.';
            case 'auth/quota-exceeded':
                return 'SMS quota exceeded. Please try again later.';
            case 'auth/invalid-verification-code':
                return 'Invalid verification code.';
            case 'auth/code-expired':
                return 'Verification code has expired.';
            default:
                return error.message || 'An error occurred. Please try again.';
        }
    }

    // Start at login options
    showLoginOptions();
});