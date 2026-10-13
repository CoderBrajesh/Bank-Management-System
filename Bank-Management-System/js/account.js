protectPage();


document.addEventListener("DOMContentLoaded", () => {

    loadAccountPage();

    setupLogout();

    setupMobileMenu();

    setupEditProfile();

    setupCancelEdit();

});




//    LOAD ACCOUNT PAGE


function loadAccountPage() {

    const user = getUser();

    const balance = getBalance();


    if (!user) {
        return;
    }


    /* USER NAME */

    const userName =
        document.getElementById("userName");

    if (userName) {

        userName.textContent =
            user.name || "User";

    }


    /* USER AVATAR */

    const userAvatar =
        document.getElementById("userAvatar");

    if (userAvatar) {

        userAvatar.textContent =
            getInitial(user.name);

    }


    /* PROFILE AVATAR */

    const profileAvatar =
        document.getElementById("profileAvatar");

    if (profileAvatar) {

        profileAvatar.textContent =
            getInitial(user.name);

    }


    /* PROFILE NAME */

    const profileName =
        document.getElementById("profileName");

    if (profileName) {

        profileName.textContent =
            user.name || "User";

    }


    /* PROFILE EMAIL */

    const profileEmail =
        document.getElementById("profileEmail");

    if (profileEmail) {

        profileEmail.textContent =
            user.email || "No email";

    }


    /* ACCOUNT TYPE */

    const profileAccountType =
        document.getElementById(
            "profileAccountType"
        );

    if (profileAccountType) {

        profileAccountType.textContent =
            user.accountType || "Savings Account";

    }


    /* PERSONAL INFORMATION */

    setText(
        "detailName",
        user.name
    );

    setText(
        "detailUsername",
        user.username
    );

    setText(
        "detailEmail",
        user.email
    );

    setText(
        "detailPhone",
        user.phone
    );

    setText(
        "detailAddress",
        user.address
    );


    /* ACCOUNT INFORMATION */

    setText(
        "detailAccountNumber",
        user.accountNumber
    );

    setText(
        "detailAccountType",
        user.accountType
    );

    setText(
        "detailIfsc",
        user.ifsc
    );

    setText(
        "detailBranch",
        user.branch
    );


    /* BALANCE */

    const detailBalance =
        document.getElementById(
            "detailBalance"
        );

    if (detailBalance) {

        detailBalance.textContent =
            formatCurrency(balance);

    }


    /* EDIT FORM */

    loadEditForm(user);


    /* NOTIFICATIONS */

    loadNotificationCount();

}




//    LOAD EDIT FORM


function loadEditForm(user) {

    const editName =
        document.getElementById("editName");

    const editEmail =
        document.getElementById("editEmail");

    const editPhone =
        document.getElementById("editPhone");

    const editAddress =
        document.getElementById("editAddress");


    if (editName) {

        editName.value =
            user.name || "";

    }


    if (editEmail) {

        editEmail.value =
            user.email || "";

    }


    if (editPhone) {

        editPhone.value =
            user.phone || "";

    }


    if (editAddress) {

        editAddress.value =
            user.address || "";

    }

}




//    EDIT PROFILE SETUP


function setupEditProfile() {

    const editButton =
        document.getElementById(
            "editProfileBtn"
        );


    const editCard =
        document.getElementById(
            "editProfileCard"
        );


    if (!editButton || !editCard) {
        return;
    }


    editButton.addEventListener(
        "click",
        () => {

            editCard.classList.add("show");

            editCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}




//    CANCEL EDIT


function setupCancelEdit() {

    const cancelButton =
        document.getElementById(
            "cancelEditBtn"
        );


    const editCard =
        document.getElementById(
            "editProfileCard"
        );


    if (!cancelButton || !editCard) {
        return;
    }


    cancelButton.addEventListener(
        "click",
        () => {

            const user = getUser();

            loadEditForm(user);

            clearProfileMessage();

            editCard.classList.remove(
                "show"
            );

        }
    );

}




//    SAVE PROFILE


function setupProfileForm() {

    const form =
        document.getElementById(
            "profileForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "editName"
                ).value.trim();


            const email =
                document.getElementById(
                    "editEmail"
                ).value.trim();


            const phone =
                document.getElementById(
                    "editPhone"
                ).value.trim();


            const address =
                document.getElementById(
                    "editAddress"
                ).value.trim();


            /* VALIDATION */

            if (name.length < 3) {

                showProfileMessage(
                    "Please enter a valid name.",
                    "error"
                );

                return;

            }


            if (!isValidEmail(email)) {

                showProfileMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            if (phone.length < 10) {

                showProfileMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

                return;

            }


            if (address.length < 3) {

                showProfileMessage(
                    "Please enter a valid address.",
                    "error"
                );

                return;

            }


            /* CURRENT USER */

            const currentUser =
                getUser();


            /* UPDATE */

            const updatedUser = {

                ...currentUser,

                name: name,

                email: email,

                phone: phone,

                address: address

            };


            updateUser(updatedUser);


            /* SUCCESS */

            showProfileMessage(
                "Profile updated successfully.",
                "success"
            );


            /* RELOAD PAGE DATA */

            loadAccountPage();


            /* CLOSE AFTER SAVE */

            setTimeout(
                () => {

                    const editCard =
                        document.getElementById(
                            "editProfileCard"
                        );

                    if (editCard) {

                        editCard.classList.remove(
                            "show"
                        );

                    }

                },
                1200
            );

        }
    );

}




//    EMAIL VALIDATION


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}




//    PROFILE MESSAGE


function showProfileMessage(
    message,
    type
) {

    const messageBox =
        document.getElementById(
            "profileMessage"
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "form-message " + type;

}




//    CLEAR MESSAGE


function clearProfileMessage() {

    const messageBox =
        document.getElementById(
            "profileMessage"
        );


    if (messageBox) {

        messageBox.textContent = "";

        messageBox.className =
            "form-message";

    }

}




//    NOTIFICATION COUNT


function loadNotificationCount() {

    const notificationCount =
        document.getElementById(
            "notificationCount"
        );


    if (!notificationCount) {
        return;
    }


    const notifications =
        getUnreadNotifications();


    notificationCount.textContent =
        notifications.length;

}




//    MOBILE MENU


function setupMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");


    if (!menuButton || !sidebar) {
        return;
    }


    function openSidebar() {

        sidebar.classList.add("active");

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.style.overflow =
            "hidden";
    }


    function closeSidebar() {

        sidebar.classList.remove("active");

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.style.overflow =
            "";
    }


    menuButton.addEventListener(
        "click",
        function () {

            if (
                sidebar.classList.contains(
                    "active"
                )
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* Close sidebar after clicking a link */

    const sidebarLinks =
        sidebar.querySelectorAll("a");


    sidebarLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeSidebar
        );

    });


    /* ESC key */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeSidebar();

            }

        }
    );

}



//    SET TEXT


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value || "—";

    }

}




//    GET INITIAL


function getInitial(name) {

    if (!name) {
        return "U";
    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}



//    START PROFILE FORM


setupProfileForm();