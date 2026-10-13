protectPage();


document.addEventListener("DOMContentLoaded", () => {

    loadStatementPage();

    setupLogout();

    setupMobileMenu();

    setupStatementFilters();

    setupPrintStatement();

});




//    LOAD PAGE


function loadStatementPage() {

    const user = getUser();


    if (user) {

        const userName =
            document.getElementById(
                "userName"
            );

        if (userName) {

            userName.textContent =
                user.name || "User";

        }


        const userAvatar =
            document.getElementById(
                "userAvatar"
            );

        if (userAvatar) {

            userAvatar.textContent =
                getInitial(user.name);

        }


        setText(
            "statementUserName",
            user.name
        );


        setText(
            "statementAccountNumber",
            user.accountNumber
        );


        setText(
            "statementIfsc",
            user.ifsc
        );

    }


    setDefaultDates();

    updateNotificationCount();

    generateStatement();

}




//    DEFAULT DATES


function setDefaultDates() {

    const fromDate =
        document.getElementById(
            "fromDate"
        );


    const toDate =
        document.getElementById(
            "toDate"
        );


    if (!fromDate || !toDate) {
        return;
    }


    const today =
        new Date();


    const thirtyDaysAgo =
        new Date();


    thirtyDaysAgo.setDate(
        today.getDate() - 30
    );


    fromDate.value =
        formatInputDate(
            thirtyDaysAgo
        );


    toDate.value =
        formatInputDate(
            today
        );

}




//    DATE TO INPUT FORMAT


function formatInputDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}




//    FILTER SETUP


function setupStatementFilters() {

    const generateButton =
        document.getElementById(
            "generateStatementBtn"
        );


    const resetButton =
        document.getElementById(
            "resetStatementBtn"
        );


    if (generateButton) {

        generateButton.addEventListener(
            "click",
            generateStatement
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetStatement
        );

    }

}




//    GENERATE STATEMENT


function generateStatement() {

    clearStatementMessage();


    const fromInput =
        document.getElementById(
            "fromDate"
        );


    const toInput =
        document.getElementById(
            "toDate"
        );


    const typeInput =
        document.getElementById(
            "statementType"
        );


    const fromDate =
        fromInput
            ? fromInput.value
            : "";


    const toDate =
        toInput
            ? toInput.value
            : "";


    const type =
        typeInput
            ? typeInput.value
            : "all";


    /* DATE VALIDATION */

    if (fromDate && toDate) {

        if (fromDate > toDate) {

            showStatementMessage(
                "From Date cannot be later than To Date.",
                "error"
            );

            return;

        }

    }


    let transactions =
        getTransactions();


    /* SORT OLDEST FIRST */

    transactions =
        transactions
            .slice()
            .sort(
                (a, b) =>
                    new Date(a.date)
                    -
                    new Date(b.date)
            );


    /* DATE FILTER */

    if (fromDate) {

        const start =
            new Date(
                `${fromDate}T00:00:00`
            );


        transactions =
            transactions.filter(
                transaction => {

                    const date =
                        new Date(
                            transaction.date
                        );


                    return date >= start;

                }
            );

    }


    if (toDate) {

        const end =
            new Date(
                `${toDate}T23:59:59`
            );


        transactions =
            transactions.filter(
                transaction => {

                    const date =
                        new Date(
                            transaction.date
                        );


                    return date <= end;

                }
            );

    }


    /* TYPE FILTER */

    if (type !== "all") {

        transactions =
            transactions.filter(
                transaction =>
                    String(
                        transaction.type
                    ).toLowerCase()
                    === type
            );

    }


    /* SUMMARY */

    calculateStatementSummary(
        transactions,
        fromDate,
        toDate
    );


    /* TABLE */

    renderStatementTransactions(
        transactions
    );


    /* PERIOD */

    updateStatementPeriod(
        fromDate,
        toDate,
        type
    );

}




//    SUMMARY


function calculateStatementSummary(
    transactions,
    fromDate,
    toDate
) {

    let totalCredit = 0;

    let totalDebit = 0;


    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            if (
                transaction.type
                === "credit"
            ) {

                totalCredit += amount;

            } else {

                totalDebit += amount;

            }

        }
    );


    /*
        Closing balance is the current balance
        adjusted backwards using transactions
        after the selected period.
    */

    const currentBalance =
        getBalance();


    const allTransactions =
        getTransactions();


    let openingBalance =
        calculateOpeningBalance(
            allTransactions,
            transactions,
            fromDate,
            currentBalance
        );


    let closingBalance =
        openingBalance
        +
        totalCredit
        -
        totalDebit;


    /*
        If the selected range contains the
        latest transaction, use current balance
        as the closing balance.
    */

    if (
        isLatestTransactionIncluded(
            transactions,
            allTransactions
        )
    ) {

        closingBalance =
            currentBalance;

    }


    setText(
        "openingBalance",
        formatCurrency(
            openingBalance
        )
    );


    setText(
        "totalCredit",
        formatCurrency(
            totalCredit
        )
    );


    setText(
        "totalDebit",
        formatCurrency(
            totalDebit
        )
    );


    setText(
        "closingBalance",
        formatCurrency(
            closingBalance
        )
    );

}




//    CALCULATE OPENING BALANCE


function calculateOpeningBalance(
    allTransactions,
    selectedTransactions,
    fromDate,
    currentBalance
) {

    if (
        !fromDate
        ||
        selectedTransactions.length === 0
    ) {

        return Math.max(
            0,
            currentBalance
            -
            calculateNetAmount(
                selectedTransactions
            )
        );

    }


    const start =
        new Date(
            `${fromDate}T00:00:00`
        );


    let balance =
        currentBalance;


    /*
        Work backwards from current balance.
    */

    const transactionsAfterStart =
        allTransactions.filter(
            transaction => {

                const date =
                    new Date(
                        transaction.date
                    );


                return date >= start;

            }
        );


    transactionsAfterStart.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            if (
                transaction.type
                === "credit"
            ) {

                balance -= amount;

            } else {

                balance += amount;

            }

        }
    );


    return Math.max(
        0,
        balance
    );

}




//    NET AMOUNT


function calculateNetAmount(
    transactions
) {

    let net = 0;


    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            if (
                transaction.type
                === "credit"
            ) {

                net += amount;

            } else {

                net -= amount;

            }

        }
    );


    return net;

}




//    LATEST TRANSACTION CHECK


function isLatestTransactionIncluded(
    selectedTransactions,
    allTransactions
) {

    if (
        selectedTransactions.length === 0
        ||
        allTransactions.length === 0
    ) {

        return false;

    }


    const latestAll =
        allTransactions
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.date)
                    -
                    new Date(a.date)
            )[0];


    return selectedTransactions.some(
        transaction =>
            String(transaction.id)
            === String(latestAll.id)
    );

}




//    RENDER TABLE


function renderStatementTransactions(
    transactions
) {

    const tableBody =
        document.getElementById(
            "statementTableBody"
        );


    const empty =
        document.getElementById(
            "statementEmpty"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (transactions.length === 0) {

        if (empty) {

            empty.classList.add(
                "show"
            );

        }

        return;

    }


    if (empty) {

        empty.classList.remove(
            "show"
        );

    }


    let runningBalance =
        calculateOpeningBalanceForTable(
            transactions
        );


    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            const isCredit =
                transaction.type
                === "credit";


            if (isCredit) {

                runningBalance += amount;

            } else {

                runningBalance -= amount;

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${transaction.date
                    ? formatDate(
                        transaction.date
                    )
                    : "—"
                }
                </td>


                <td>

                    <span class="transaction-id">
                        ${escapeHtml(
                    transaction.id
                    || "N/A"
                )}
                    </span>

                </td>


                <td>

                    <span class="transaction-description">
                        ${escapeHtml(
                    transaction.description
                    || "Transaction"
                )}
                    </span>

                </td>


                <td>

                    <span class="
                        transaction-type
                        ${isCredit
                    ? "credit"
                    : "debit"
                }
                    ">

                        ${isCredit
                    ? "Credit"
                    : "Debit"
                }

                    </span>

                </td>


                <td>

                    ${!isCredit
                    ? `
                                <span class="
                                    amount-debit
                                ">
                                    ${formatCurrency(
                        amount
                    )}
                                </span>
                            `
                    : "—"
                }

                </td>


                <td>

                    ${isCredit
                    ? `
                                <span class="
                                    amount-credit
                                ">
                                    ${formatCurrency(
                        amount
                    )}
                                </span>
                            `
                    : "—"
                }

                </td>


                <td>

                    <strong>
                        ${formatCurrency(
                    runningBalance
                )}
                    </strong>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}




//    TABLE OPENING BALANCE


function calculateOpeningBalanceForTable(
    transactions
) {

    const currentBalance =
        getBalance();


    const net =
        calculateNetAmount(
            transactions
        );


    /*
        This provides a useful demo
        opening balance for the selected range.
    */

    return Math.max(
        0,
        currentBalance - net
    );

}




//    PERIOD TEXT


function updateStatementPeriod(
    fromDate,
    toDate,
    type
) {

    const period =
        document.getElementById(
            "statementPeriodText"
        );


    if (!period) {
        return;
    }


    let text =
        "All Transactions";


    if (fromDate && toDate) {

        text =
            `${formatDisplayDate(fromDate)}
             to
             ${formatDisplayDate(toDate)}`;

    } else if (fromDate) {

        text =
            `From ${formatDisplayDate(fromDate)}`;

    } else if (toDate) {

        text =
            `Until ${formatDisplayDate(toDate)}`;

    }


    if (type === "credit") {

        text += " • Credit Only";

    }


    if (type === "debit") {

        text += " • Debit Only";

    }


    period.textContent =
        text;

}




//    RESET


function resetStatement() {

    setDefaultDates();


    const type =
        document.getElementById(
            "statementType"
        );


    if (type) {

        type.value = "all";

    }


    clearStatementMessage();

    generateStatement();

}




//    PRINT


function setupPrintStatement() {

    const button =
        document.getElementById(
            "printStatementBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const generatedDate =
                document.getElementById(
                    "statementGeneratedDate"
                );


            if (generatedDate) {

                generatedDate.textContent =
                    `Generated: ${formatDateTime(
                        new Date()
                    )}`;

            }


            window.print();

        }
    );

}




//    MESSAGE


function showStatementMessage(
    message,
    type
) {

    const messageBox =
        document.getElementById(
            "statementMessage"
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


function clearStatementMessage() {

    const messageBox =
        document.getElementById(
            "statementMessage"
        );


    if (messageBox) {

        messageBox.textContent = "";

        messageBox.className =
            "form-message";

    }

}




//    NOTIFICATION COUNT


function updateNotificationCount() {

    const count =
        document.getElementById(
            "notificationCount"
        );


    if (!count) {
        return;
    }


    count.textContent =
        getUnreadNotifications().length;

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




//    DISPLAY DATE


function formatDisplayDate(
    value
) {

    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (isNaN(date.getTime())) {

        return value;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
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




//    ESCAPE HTML


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}