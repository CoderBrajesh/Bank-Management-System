/* Protect Page */

protectPage();




//    PAGE LOAD


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDepositPage();

        setupLogout();

        setupMobileMenu();

        setupDepositForm();

        setupQuickAmounts();

    }
);




//    LOAD DEPOSIT PAGE


function loadDepositPage() {

    const user =
        getUser();


    const balance =
        getBalance();


    const deposits =
        getTotalDeposits();


    /* User name */

    const topUserName =
        document.getElementById(
            "topUserName"
        );


    if (topUserName) {

        topUserName.textContent =
            user.name;

    }


    /* Avatar */

    const userAvatar =
        document.getElementById(
            "userAvatar"
        );


    if (userAvatar) {

        userAvatar.textContent =
            user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "A";

    }


    /* Current Balance */

    const currentBalance =
        document.getElementById(
            "currentBalance"
        );


    if (currentBalance) {

        currentBalance.textContent =
            formatCurrency(
                balance
            );

    }


    /* Total Deposits */

    const totalDeposits =
        document.getElementById(
            "totalDeposits"
        );


    if (totalDeposits) {

        totalDeposits.textContent =
            formatCurrency(
                deposits
            );

    }


    /* Notifications */

    loadNotificationCount();

}




//    DEPOSIT FORM


function setupDepositForm() {

    const form =
        document.getElementById(
            "depositForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            processDeposit();

        }
    );

}




//    PROCESS DEPOSIT


function processDeposit() {

    const amountInput =
        document.getElementById(
            "depositAmount"
        );


    const descriptionInput =
        document.getElementById(
            "depositDescription"
        );


    const amountError =
        document.getElementById(
            "amountError"
        );


    const message =
        document.getElementById(
            "depositMessage"
        );


    const button =
        document.getElementById(
            "depositButton"
        );


    const amount =
        Number(
            amountInput.value
        );


    let description =
        descriptionInput.value.trim();



    /* Clear old messages */

    amountError.textContent = "";

    message.textContent = "";

    message.className =
        "form-message";



    /* Validate amount */

    if (
        !amountInput.value
        || !Number.isFinite(amount)
        || amount <= 0
    ) {

        amountError.textContent =
            "Please enter a valid amount.";

        amountInput.focus();

        return;

    }



    /* Minimum amount */

    if (amount < 1) {

        amountError.textContent =
            "Minimum deposit amount is ₹1.";

        amountInput.focus();

        return;

    }



    /* Default description */

    if (!description) {

        description =
            "Cash Deposit";

    }



    /* Disable button */

    button.disabled = true;

    button.textContent =
        "Processing...";



    /* Deposit */

    const result =
        depositMoney(
            amount,
            description
        );



    /* Success */

    if (result.success) {

        message.textContent =
            "✓ " +
            result.message +
            " Transaction ID: " +
            result.transaction.id;


        message.className =
            "form-message success";


        /* Clear form */

        amountInput.value = "";

        descriptionInput.value = "";


        /* Refresh page data */

        loadDepositPage();


        /* Button */

        button.disabled = false;

        button.textContent =
            "💰 Deposit Money";


        /* Go dashboard after 1.5 sec */

        setTimeout(
            function () {

                window.location.href =
                    "dashboard.html";

            },
            1500
        );


    } else {

        message.textContent =
            "✕ " +
            result.message;


        message.className =
            "form-message error";


        button.disabled = false;

        button.textContent =
            "💰 Deposit Money";

    }

}




//    QUICK AMOUNTS


function setupQuickAmounts() {

    const buttons =
        document.querySelectorAll(
            ".quick-amount"
        );


    const amountInput =
        document.getElementById(
            "depositAmount"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const amount =
                        this.dataset.amount;


                    amountInput.value =
                        amount;


                    amountInput.focus();

                }
            );

        }
    );

}




//    NOTIFICATION COUNT


function loadNotificationCount() {

    const countElement =
        document.getElementById(
            "notificationCount"
        );


    if (!countElement) {
        return;
    }


    const unread =
        getUnreadNotifications();


    countElement.textContent =
        unread.length;


    if (
        unread.length === 0
    ) {

        countElement.style.display =
            "none";

    } else {

        countElement.style.display =
            "flex";

    }

}




//    MOBILE MENU


function setupMobileMenu() {

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        !menuBtn ||
        !sidebar
    ) {

        return;

    }


    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}