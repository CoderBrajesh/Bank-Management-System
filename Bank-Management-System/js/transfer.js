/* Protect Page */

protectPage();




//    PAGE LOAD


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTransferPage();

        setupLogout();

        setupMobileMenu();

        setupTransferForm();

        setupQuickAmounts();

    }
);




//    LOAD TRANSFER PAGE


function loadTransferPage() {

    const user =
        getUser();


    const balance =
        getBalance();


    const withdrawals =
        getTotalWithdrawals();



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



    /* Current balance */

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



    /* Available balance hint */

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



    /* Total withdrawals */

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



    /* Notifications */

    loadNotificationCount();

}




//    TRANSFER FORM


function setupTransferForm() {

    const form =
        document.getElementById(
            "transferForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            processTransfer();

        }
    );

}




//    PROCESS TRANSFER


function processTransfer() {

    const receiverInput =
        document.getElementById(
            "receiverName"
        );


    const accountInput =
        document.getElementById(
            "accountNumber"
        );


    const ifscInput =
        document.getElementById(
            "ifscCode"
        );


    const amountInput =
        document.getElementById(
            "transferAmount"
        );


    const descriptionInput =
        document.getElementById(
            "transferDescription"
        );


    const receiverError =
        document.getElementById(
            "receiverError"
        );


    const accountError =
        document.getElementById(
            "accountNumberError"
        );


    const ifscError =
        document.getElementById(
            "ifscError"
        );


    const amountError =
        document.getElementById(
            "amountError"
        );


    const message =
        document.getElementById(
            "transferMessage"
        );


    const button =
        document.getElementById(
            "transferButton"
        );



    /* Get values */

    const receiver =
        receiverInput.value.trim();


    const accountNumber =
        accountInput.value.trim();


    const ifsc =
        ifscInput.value
            .trim()
            .toUpperCase();


    const amount =
        Number(
            amountInput.value
        );


    let description =
        descriptionInput.value.trim();



    /* Clear errors */

    receiverError.textContent = "";

    accountError.textContent = "";

    ifscError.textContent = "";

    amountError.textContent = "";

    message.textContent = "";

    message.className =
        "form-message";



    let hasError = false;




    //    RECEIVER VALIDATION


    if (!receiver) {

        receiverError.textContent =
            "Please enter receiver name.";

        hasError = true;

    }
    else if (receiver.length < 3) {

        receiverError.textContent =
            "Receiver name must contain at least 3 characters.";

        hasError = true;

    }




    //    ACCOUNT NUMBER VALIDATION


    if (!accountNumber) {

        accountError.textContent =
            "Please enter account number.";

        hasError = true;

    }
    else if (
        !/^[0-9]{6,20}$/.test(
            accountNumber
        )
    ) {

        accountError.textContent =
            "Account number must contain 6 to 20 digits.";

        hasError = true;

    }




    //    IFSC VALIDATION


    if (!ifsc) {

        ifscError.textContent =
            "Please enter IFSC code.";

        hasError = true;

    }
    else if (
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
            ifsc
        )
    ) {

        ifscError.textContent =
            "Please enter a valid IFSC code.";

        hasError = true;

    }




    //    AMOUNT VALIDATION


    if (
        !amountInput.value
        ||
        !Number.isFinite(amount)
        ||
        amount <= 0
    ) {

        amountError.textContent =
            "Please enter a valid amount.";

        hasError = true;

    }
    else if (amount < 1) {

        amountError.textContent =
            "Minimum transfer amount is ₹1.";

        hasError = true;

    }



    /* Stop if validation failed */

    if (hasError) {

        return;

    }




    //    BALANCE CHECK


    const currentBalance =
        getBalance();


    if (
        amount > currentBalance
    ) {

        amountError.textContent =
            "Insufficient balance. Available balance is "
            +
            formatCurrency(
                currentBalance
            );

        return;

    }




    //    DEFAULT DESCRIPTION


    if (!description) {

        description =
            "Money Transfer";

    }




    //    CONFIRM TRANSFER


    const confirmed =
        confirm(
            "Please confirm the transfer.\n\n"
            +
            "Receiver: "
            + receiver
            + "\n"
            +
            "Account: "
            + accountNumber
            + "\n"
            +
            "IFSC: "
            + ifsc
            + "\n"
            +
            "Amount: "
            + formatCurrency(amount)
        );


    if (!confirmed) {

        return;

    }




    //    PROCESSING


    button.disabled = true;

    button.textContent =
        "Processing...";




    //    TRANSFER MONEY


    const result =
        transferMoney({

            receiver:
                receiver,

            accountNumber:
                accountNumber,

            ifsc:
                ifsc,

            amount:
                amount,

            description:
                description

        });




    //    SUCCESS


    if (result.success) {

        message.textContent =
            "✓ "
            +
            result.message
            +
            " Transaction ID: "
            +
            result.transaction.id;


        message.className =
            "form-message success";



        /* Clear form */

        document
            .getElementById(
                "transferForm"
            )
            .reset();



        /* Reload data */

        loadTransferPage();



        /* Enable button */

        button.disabled = false;

        button.textContent =
            "🔄 Transfer Money";



        /* Redirect */

        setTimeout(
            function () {

                window.location.href =
                    "dashboard.html";

            },
            1800
        );


    } else {

        message.textContent =
            "✕ "
            +
            result.message;


        message.className =
            "form-message error";


        button.disabled = false;

        button.textContent =
            "🔄 Transfer Money";

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
            "transferAmount"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    amountInput.value =
                        this.dataset.amount;


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