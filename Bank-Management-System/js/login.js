/* =====================================================
   1. GET ELEMENTS
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const rememberMe =
    document.getElementById("rememberMe");

const togglePassword =
    document.getElementById("togglePassword");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const forgotPassword =
    document.getElementById("forgotPassword");


/* =====================================================
   2. DEMO LOGIN DETAILS
===================================================== */

const DEMO_USERNAME = "admin";

const DEMO_PASSWORD = "123456";


/* =====================================================
   3. SHOW / HIDE PASSWORD
===================================================== */

togglePassword.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "🙈";

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "👁";

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }
);


/* =====================================================
   4. REMEMBERED USER
===================================================== */

const rememberedUsername =
    localStorage.getItem(
        "rememberedUsername"
    );


if (rememberedUsername) {

    usernameInput.value =
        rememberedUsername;

    rememberMe.checked =
        true;

}


/* =====================================================
   5. SHOW LOGIN MESSAGE
===================================================== */

function showLoginMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message " + type;

}


/* =====================================================
   6. CLEAR LOGIN MESSAGE
===================================================== */

function clearLoginMessage() {

    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}


/* =====================================================
   7. LOGIN FORM
===================================================== */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        clearLoginMessage();


        const username =
            usernameInput.value.trim();


        const password =
            passwordInput.value;


        /* =========================
           VALIDATION
        ========================= */


        if (!username) {

            showLoginMessage(
                "Please enter your username.",
                "error"
            );

            usernameInput.focus();

            return;

        }


        if (!password) {

            showLoginMessage(
                "Please enter your password.",
                "error"
            );

            passwordInput.focus();

            return;

        }


        /* =========================
           CHECK LOGIN
        ========================= */

        if (
            username !== DEMO_USERNAME ||
            password !== DEMO_PASSWORD
        ) {

            showLoginMessage(
                "Invalid username or password.",
                "error"
            );

            passwordInput.value = "";

            passwordInput.focus();

            return;

        }


        /* =========================
           REMEMBER USER
        ========================= */

        if (rememberMe.checked) {

            localStorage.setItem(
                "rememberedUsername",
                username
            );

        } else {

            localStorage.removeItem(
                "rememberedUsername"
            );

        }


        /* =========================
           LOGIN SUCCESS
        ========================= */

        loginUser(username);


        showLoginMessage(
            "Login successful. Opening dashboard...",
            "success"
        );


        loginButton.disabled =
            true;

        loginButton.textContent =
            "Logging in...";


        /* =========================
           REDIRECT
        ========================= */

        setTimeout(
            function () {

                window.location.href =
                    "dashboard.html";

            },
            700
        );

    }
);


/* =====================================================
   8. FORGOT PASSWORD
===================================================== */

forgotPassword.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        showLoginMessage(
            "This is a demo project. Use the demo password: 123456",
            "error"
        );

    }
);