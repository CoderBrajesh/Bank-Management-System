/* Protect page */

protectPage();



//    PAGE LOAD


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

        setupLogout();

        setupMobileMenu();

    }
);




//    LOAD DASHBOARD


function loadDashboard() {

    const user =
        getUser();

    const balance =
        getBalance();

    const deposits =
        getTotalDeposits();

    const withdrawals =
        getTotalWithdrawals();



    //    USER NAME


    const welcomeName =
        document.getElementById(
            "welcomeName"
        );


    if (welcomeName) {

        const firstName =
            user.name
                ? user.name.split(" ")[0]
                : "Admin";


        welcomeName.textContent =
            firstName;

    }




    //    TOP USER


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




    //    BALANCE


    const balanceAmount =
        document.getElementById(
            "balanceAmount"
        );


    if (balanceAmount) {

        balanceAmount.textContent =
            formatCurrency(
                balance
            );

    }




    //    TOTAL DEPOSIT


    const totalDeposit =
        document.getElementById(
            "totalDeposit"
        );


    if (totalDeposit) {

        totalDeposit.textContent =
            formatCurrency(
                deposits
            );

    }




    //    TOTAL WITHDRAWAL


    const totalWithdrawal =
        document.getElementById(
            "totalWithdrawal"
        );


    if (totalWithdrawal) {

        totalWithdrawal.textContent =
            formatCurrency(
                withdrawals
            );

    }




    //    ACCOUNT NUMBER


    const accountNumber =
        document.getElementById(
            "accountNumber"
        );


    if (accountNumber) {

        accountNumber.textContent =
            "A/C •••• " +
            user.accountNumber.slice(-4);

    }




    //    ACCOUNT DETAILS


    const accountType =
        document.getElementById(
            "accountType"
        );


    if (accountType) {

        accountType.textContent =
            user.accountType;

    }



    const summaryAccount =
        document.getElementById(
            "summaryAccount"
        );


    if (summaryAccount) {

        summaryAccount.textContent =
            user.accountNumber;

    }



    const ifscCode =
        document.getElementById(
            "ifscCode"
        );


    if (ifscCode) {

        ifscCode.textContent =
            user.ifsc;

    }



    const branchName =
        document.getElementById(
            "branchName"
        );


    if (branchName) {

        branchName.textContent =
            user.branch;

    }




    //    TRANSACTIONS


    loadRecentTransactions();




    //    NOTIFICATIONS


    loadNotificationCount();

}




//    RECENT TRANSACTIONS


function loadRecentTransactions() {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    if (!container) {
        return;
    }


    const transactions =
        getRecentTransactions(5);



    /* No transactions */

    if (
        transactions.length === 0
    ) {

        container.innerHTML = `

            <div class="no-transactions">

                <div class="no-transactions-icon">
                    📋
                </div>

                <p>
                    No transactions yet.
                </p>

            </div>

        `;

        return;

    }



    container.innerHTML = "";



    transactions.forEach(
        transaction => {

            const isCredit =
                transaction.type
                === "credit";


            const icon =
                isCredit
                    ? "↓"
                    : "↑";


            const amountClass =
                isCredit
                    ? "amount-credit"
                    : "amount-debit";


            const sign =
                isCredit
                    ? "+"
                    : "-";


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "transaction-item";



            item.innerHTML = `

                <div class="transaction-left">

                    <div class="transaction-icon">
                        ${icon}
                    </div>


                    <div class="transaction-info">

                        <strong>
                            ${escapeHtml(
                transaction.description
            )}
                        </strong>

                        <span>
                            ${formatDateTime(
                transaction.date
            )}
                        </span>

                    </div>

                </div>


                <div class="transaction-amount">

                    <strong class="${amountClass}">
                        ${sign}${formatCurrency(
                transaction.amount
            )}
                    </strong>

                    <span>
                        ${transaction.status}
                    </span>

                </div>

            `;


            container.appendChild(
                item
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




//    ESCAPE HTML


function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value || "";


    return div.innerHTML;

}