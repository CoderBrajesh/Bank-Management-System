protectPage();

document.addEventListener("DOMContentLoaded", () => {

    initializeSettingsPage();

    setupSettingsEvents();

    setupLogout();

    setupMobileMenu();

});



//    INITIALIZE SETTINGS PAGE


function initializeSettingsPage() {

    const data = getBankData();
    const user = getUser();

    if (!data.settings) {

        data.settings = {
            darkMode: false,
            notifications: true
        };

        saveBankData(data);
    }


    // User information
    const name = user.name || "Admin User";

    const email = user.email || "admin@securebank.com";

    const accountNumber =
        user.accountNumber || "45897821";


    // Topbar
    const topUserName =
        document.getElementById("topUserName");

    if (topUserName) {
        topUserName.textContent = name;
    }


    // Avatar
    const firstLetter =
        name.charAt(0).toUpperCase();


    const userAvatar =
        document.getElementById("userAvatar");

    if (userAvatar) {
        userAvatar.textContent = firstLetter;
    }


    // Settings account
    const settingsUserName =
        document.getElementById("settingsUserName");

    if (settingsUserName) {
        settingsUserName.textContent = name;
    }


    const settingsUserEmail =
        document.getElementById("settingsUserEmail");

    if (settingsUserEmail) {
        settingsUserEmail.textContent = email;
    }


    const settingsAccountNumber =
        document.getElementById("settingsAccountNumber");

    if (settingsAccountNumber) {
        settingsAccountNumber.textContent =
            accountNumber;
    }


    const settingsAvatar =
        document.getElementById("settingsAvatar");

    if (settingsAvatar) {
        settingsAvatar.textContent = firstLetter;
    }


    // Load settings
    const darkModeToggle =
        document.getElementById("darkModeToggle");

    const notificationToggle =
        document.getElementById("notificationToggle");


    if (darkModeToggle) {
        darkModeToggle.checked =
            data.settings.darkMode === true;
    }


    if (notificationToggle) {
        notificationToggle.checked =
            data.settings.notifications !== false;
    }


    // Apply saved theme
    applyDarkMode(
        data.settings.darkMode === true
    );


    updateNotificationCount();

}



//    SETTINGS EVENTS


function setupSettingsEvents() {

    const darkModeToggle =
        document.getElementById("darkModeToggle");


    const notificationToggle =
        document.getElementById("notificationToggle");


    const passwordForm =
        document.getElementById("passwordForm");


    const resetDataBtn =
        document.getElementById("resetDataBtn");



    //    DARK MODE


    if (darkModeToggle) {

        darkModeToggle.addEventListener(
            "change",
            function () {

                const enabled =
                    this.checked;

                const data =
                    getBankData();


                if (!data.settings) {
                    data.settings = {};
                }


                data.settings.darkMode =
                    enabled;


                saveBankData(data);


                applyDarkMode(enabled);


                showSettingsMessage(
                    enabled
                        ? "Dark mode enabled."
                        : "Dark mode disabled.",
                    "success"
                );

            }
        );

    }



    //    NOTIFICATION SETTING


    if (notificationToggle) {

        notificationToggle.addEventListener(
            "change",
            function () {

                const enabled =
                    this.checked;

                const data =
                    getBankData();


                if (!data.settings) {
                    data.settings = {};
                }


                data.settings.notifications =
                    enabled;


                saveBankData(data);


                showSettingsMessage(
                    enabled
                        ? "Bank notifications enabled."
                        : "Bank notifications disabled.",
                    "success"
                );

            }
        );

    }



    //    PASSWORD CHANGE


    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    ).value.trim();


                const newPassword =
                    document.getElementById(
                        "newPassword"
                    ).value.trim();


                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    ).value.trim();


                const savedPassword =
                    localStorage.getItem(
                        "demoPassword"
                    ) || "123456";


                /* Current password */

                if (!currentPassword) {

                    showPasswordMessage(
                        "Please enter your current password.",
                        "error"
                    );

                    return;
                }


                if (currentPassword !== savedPassword) {

                    showPasswordMessage(
                        "Current password is incorrect.",
                        "error"
                    );

                    return;
                }


                /* New password */

                if (newPassword.length < 6) {

                    showPasswordMessage(
                        "New password must contain at least 6 characters.",
                        "error"
                    );

                    return;
                }


                /* Confirm password */

                if (newPassword !== confirmPassword) {

                    showPasswordMessage(
                        "New password and confirm password do not match.",
                        "error"
                    );

                    return;
                }


                /* Save password */

                localStorage.setItem(
                    "demoPassword",
                    newPassword
                );


                passwordForm.reset();


                showPasswordMessage(
                    "Password changed successfully.",
                    "success"
                );

            }
        );

    }



    //    RESET DEMO DATA


    if (resetDataBtn) {

        resetDataBtn.addEventListener(
            "click",
            function () {

                const confirmation =
                    confirm(
                        "Are you sure you want to reset all demo bank data?\n\n" +
                        "Transactions, beneficiaries and notifications will be removed."
                    );


                if (!confirmation) {
                    return;
                }


                resetBankData();


                showSettingsMessage(
                    "Demo data has been reset successfully.",
                    "success"
                );


                setTimeout(() => {

                    window.location.reload();

                }, 1000);

            }
        );

    }

}



//    DARK MODE


function applyDarkMode(enabled) {

    if (enabled) {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }

}



//    PASSWORD MESSAGE


function showPasswordMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "passwordMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    if (type === "success") {

        element.className =
            "settings-inline-message success";

    } else {

        element.className =
            "settings-inline-message error";

    }


    setTimeout(() => {

        element.textContent = "";

        element.className =
            "settings-inline-message";

    }, 4000);

}



//    SETTINGS MESSAGE


function showSettingsMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "settingsMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        "settings-page-message " +
        (type === "success"
            ? "success"
            : "error");


    setTimeout(() => {

        element.textContent = "";

        element.className =
            "settings-page-message";

    }, 3000);

}



//    NOTIFICATION COUNT


function updateNotificationCount() {

    const unread =
        getUnreadNotifications().length;


    const topCount =
        document.getElementById(
            "topNotificationCount"
        );


    const sidebarCount =
        document.getElementById(
            "sidebarNotificationCount"
        );


    if (topCount) {

        if (unread > 0) {

            topCount.textContent =
                unread;

            topCount.style.display =
                "flex";

        } else {

            topCount.textContent = "";

            topCount.style.display =
                "none";

        }

    }


    if (sidebarCount) {

        if (unread > 0) {

            sidebarCount.textContent =
                unread;

            sidebarCount.style.display =
                "inline-flex";

        } else {

            sidebarCount.textContent = "";

            sidebarCount.style.display =
                "none";

        }

    }

}