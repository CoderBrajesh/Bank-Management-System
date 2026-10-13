/* Protect Page */

protectPage();




//    PAGE LOAD


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadWithdrawPage();

        setupLogout();

        setupMobileMenu();

        setupWithdrawForm();

        setupQuickAmounts();

    }
);




//    LOAD WITHDRAW PAGE


function loadWithdrawPage() {

    const user =
        getUser();


    const balance =
        getBalance();


    const withdrawals =
        getTotalWithdrawals();




    //    USER NAME


    const topUserName =
        document.getElementById(
            "topUserName"
        );


    if (topUserName) {

        topUserName.textContent =
            user.name;

    }




    //    USER AVATAR


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




    //    CURRENT BALANCE


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




    //    AVAILABLE BALANCE HINT


    const availableBalanceHint =
        document.getElementById(
            "availableBalanceHint"
        );


    if (availableBalanceHint) {

        availableBalanceHint.textContent =
            formatCurrency(
                balance
            );

    }




    //    TOTAL WITHDRAWALS


    const totalWithdrawals =
        document.getElementById(
            "totalWithdrawals"
        );


    if (totalWithdrawals) {

        totalWithdrawals.textContent =
            formatCurrency(
                withdrawals
            );

    }




    //    NOTIFICATIONS


    loadNotificationCount();

}




//    WITHDRAW FORM


function setupWithdrawForm() {

    const form =
        document.getElementById(
            "withdrawForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            processWithdrawal();

        }
    );

}




//    PROCESS WITHDRAWAL


function processWithdrawal() {

    const amountInput =
        document.getElementById(
            "withdrawAmount"
        );


    const descriptionInput =
        document.getElementById(
            "withdrawDescription"
        );


    const amountError =
        document.getElementById(
            "amountError"
        );


    const message =
        document.getElementById(
            "withdrawMessage"
        );


    const button =
        document.getElementById(
            "withdrawButton"
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




    //    VALIDATE AMOUNT


    if (
        !amountInput.value
        ||
        !Number.isFinite(amount)
        ||
        amount <= 0
    ) {

        amountError.textContent =
            "Please enter a valid amount.";

        amountInput.focus();

        return;

    }




    //    MINIMUM AMOUNT


    if (amount < 1) {

        amountError.textContent =
            "Minimum withdrawal amount is ₹1.";

        amountInput.focus();

        return;

    }




    //    CHECK BALANCE


    const currentBalance =
        getBalance();


    if (amount > currentBalance) {

        amountError.textContent =
            "Insufficient balance. Available balance is "
            +
            formatCurrency(
                currentBalance
            );


        amountInput.focus();

        return;

    }




    //    DEFAULT DESCRIPTION


    if (!description) {

        description =
            "Cash Withdrawal";

    }




    //    DISABLE BUTTON


    button.disabled = true;

    button.textContent =
        "Processing...";




    //    WITHDRAW MONEY


    const result =
        withdrawMoney(
            amount,
            description
        );




    //    SUCCESS


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



        /* Reload data */

        loadWithdrawPage();



        /* Enable button */

        button.disabled = false;

        button.textContent =
            "💸 Withdraw Money";



        /* Redirect */

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
            "💸 Withdraw Money";

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
            "withdrawAmount"
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