protectPage();


document.addEventListener("DOMContentLoaded", () => {

    loadCardPage();

    setupLogout();

    setupMobileMenu();

    setupCardDetailsToggle();

    setupFreezeCard();

});




//    LOAD CARD PAGE


function loadCardPage() {

    const user = getUser();

    const card = getCard();


    if (!user || !card) {
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


    /* CARD HOLDER */

    const cardHolder =
        document.getElementById(
            "cardHolderName"
        );

    if (cardHolder) {

        cardHolder.textContent =
            (user.name || "CARD HOLDER")
                .toUpperCase();

    }


    /* CARD NUMBER */

    updateCardNumber(card);


    /* EXPIRY */

    const expiry =
        document.getElementById(
            "cardExpiry"
        );

    const expiryText =
        document.getElementById(
            "cardExpiryText"
        );


    if (expiry) {

        expiry.textContent =
            "••/••";

    }


    if (expiryText) {

        expiryText.textContent =
            "••/••";

    }


    /* CVV */

    const cvv =
        document.getElementById(
            "cardCvvText"
        );


    if (cvv) {

        cvv.textContent =
            "•••";

    }


    /* STATUS */

    updateCardStatus(card);


    /* NOTIFICATIONS */

    loadNotificationCount();

}




//    CARD NUMBER


function updateCardNumber(card) {

    const cardNumber =
        String(card.number || "");


    const hiddenNumber =
        maskCardNumber(cardNumber);


    const display =
        document.getElementById(
            "cardNumberDisplay"
        );


    const text =
        document.getElementById(
            "cardNumberText"
        );


    if (display) {

        display.textContent =
            hiddenNumber;

    }


    if (text) {

        text.textContent =
            hiddenNumber;

    }

}




//    MASK CARD NUMBER


function maskCardNumber(number) {

    const cleanNumber =
        number.replace(/\D/g, "");


    if (!cleanNumber) {

        return "•••• •••• •••• ••••";

    }


    const lastFour =
        cleanNumber.slice(-4);


    return `•••• •••• •••• ${lastFour}`;

}




//    SHOW / HIDE CARD DETAILS


function setupCardDetailsToggle() {

    const button =
        document.getElementById(
            "toggleCardDetails"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const card =
                getCard();


            if (!card) {
                return;
            }


            const cardNumberDisplay =
                document.getElementById(
                    "cardNumberDisplay"
                );


            const cardNumberText =
                document.getElementById(
                    "cardNumberText"
                );


            const expiry =
                document.getElementById(
                    "cardExpiry"
                );


            const expiryText =
                document.getElementById(
                    "cardExpiryText"
                );


            const cvv =
                document.getElementById(
                    "cardCvvText"
                );


            const isShowing =
                button.dataset.showing === "true";


            if (isShowing) {


                /* HIDE */

                const hiddenNumber =
                    maskCardNumber(
                        card.number
                    );


                if (cardNumberDisplay) {

                    cardNumberDisplay.textContent =
                        hiddenNumber;

                }


                if (cardNumberText) {

                    cardNumberText.textContent =
                        hiddenNumber;

                }


                if (expiry) {

                    expiry.textContent =
                        "••/••";

                }


                if (expiryText) {

                    expiryText.textContent =
                        "••/••";

                }


                if (cvv) {

                    cvv.textContent =
                        "•••";

                }


                button.textContent =
                    "👁️ Show Card Details";


                button.dataset.showing =
                    "false";


            } else {


                /* SHOW */

                const formattedNumber =
                    formatCardNumber(
                        card.number
                    );


                if (cardNumberDisplay) {

                    cardNumberDisplay.textContent =
                        formattedNumber;

                }


                if (cardNumberText) {

                    cardNumberText.textContent =
                        formattedNumber;

                }


                if (expiry) {

                    expiry.textContent =
                        card.expiry || "12/29";

                }


                if (expiryText) {

                    expiryText.textContent =
                        card.expiry || "12/29";

                }


                if (cvv) {

                    cvv.textContent =
                        card.cvv || "123";

                }


                button.textContent =
                    "🙈 Hide Card Details";


                button.dataset.showing =
                    "true";

            }

        }
    );

}




//    FORMAT CARD NUMBER


function formatCardNumber(number) {

    const cleanNumber =
        String(number || "")
            .replace(/\D/g, "");


    if (!cleanNumber) {
        return "•••• •••• •••• ••••";
    }


    return cleanNumber
        .replace(/(.{4})/g, "$1 ")
        .trim();

}




//    CARD STATUS


function updateCardStatus(card) {

    const statusText =
        document.getElementById(
            "cardStatusText"
        );


    const statusBadge =
        document.getElementById(
            "cardStatusBadge"
        );


    const freezeButtonText =
        document.getElementById(
            "freezeButtonText"
        );


    const freezeDescription =
        document.getElementById(
            "freezeButtonDescription"
        );


    const freezeIcon =
        document.getElementById(
            "freezeIcon"
        );


    const virtualCard =
        document.getElementById(
            "virtualBankCard"
        );


    if (card.frozen) {


        if (statusText) {

            statusText.textContent =
                "Frozen";

        }


        if (statusBadge) {

            statusBadge.textContent =
                "Frozen";

            statusBadge.className =
                "card-status-badge frozen";

        }


        if (freezeButtonText) {

            freezeButtonText.textContent =
                "Unfreeze Card";

        }


        if (freezeDescription) {

            freezeDescription.textContent =
                "Restore card transactions";

        }


        if (freezeIcon) {

            freezeIcon.textContent =
                "🔓";

        }


        if (virtualCard) {

            virtualCard.classList.add(
                "card-frozen"
            );

        }


    } else {


        if (statusText) {

            statusText.textContent =
                "Active";

        }


        if (statusBadge) {

            statusBadge.textContent =
                "Active";

            statusBadge.className =
                "card-status-badge";

        }


        if (freezeButtonText) {

            freezeButtonText.textContent =
                "Freeze Card";

        }


        if (freezeDescription) {

            freezeDescription.textContent =
                "Temporarily block card transactions";

        }


        if (freezeIcon) {

            freezeIcon.textContent =
                "❄️";

        }


        if (virtualCard) {

            virtualCard.classList.remove(
                "card-frozen"
            );

        }

    }

}




//    FREEZE / UNFREEZE


function setupFreezeCard() {

    const button =
        document.getElementById(
            "freezeCardBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const card =
                getCard();


            if (!card) {
                return;
            }


            const action =
                card.frozen
                    ? "unfreeze"
                    : "freeze";


            const message =
                card.frozen

                    ? "Are you sure you want to unfreeze your card?"

                    : "Are you sure you want to freeze your card?";


            const confirmed =
                confirm(message);


            if (!confirmed) {
                return;
            }


            const updatedCard =
                toggleCardFreeze();


            if (updatedCard) {

                updateCardStatus(
                    updatedCard
                );

            }

        }
    );

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
        document.getElementById(
            "mobileMenuBtn"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

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