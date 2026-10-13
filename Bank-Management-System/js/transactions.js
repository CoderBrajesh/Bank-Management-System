protectPage();


document.addEventListener("DOMContentLoaded", () => {

    loadTransactionsPage();

    setupLogout();

    setupMobileMenu();

    setupFilters();

    setupTransactionModal();

});



//    LOAD TRANSACTIONS PAGE


function loadTransactionsPage() {

    const user = getUser();

    const balance = getBalance();

    const transactions = getTransactions();


    /* USER NAME */

    const userName = document.getElementById("userName");

    if (userName) {
        userName.textContent = user.name;
    }


    /* USER AVATAR */

    const userAvatar = document.getElementById("userAvatar");

    if (userAvatar) {

        userAvatar.textContent =
            user.name
                ? user.name.charAt(0).toUpperCase()
                : "U";

    }


    /* BALANCE */

    const currentBalance =
        document.getElementById("currentBalance");

    if (currentBalance) {

        currentBalance.textContent =
            formatCurrency(balance);

    }


    /* TOTAL TRANSACTIONS */

    const totalTransactions =
        document.getElementById("totalTransactions");

    if (totalTransactions) {

        totalTransactions.textContent =
            transactions.length;

    }


    /* NOTIFICATION */

    loadNotificationCount();


    /* RENDER */

    applyFilters();

}



//    FILTER SETUP


function setupFilters() {

    const searchInput =
        document.getElementById("transactionSearch");

    const typeFilter =
        document.getElementById("transactionType");

    const dateFilter =
        document.getElementById("dateFilter");

    const clearButton =
        document.getElementById("clearFilters");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (dateFilter) {

        dateFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearFilters
        );

    }

}



//    APPLY ALL FILTERS


function applyFilters() {

    let transactions =
        getTransactions();


    /* SEARCH */

    const searchInput =
        document.getElementById("transactionSearch");

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    if (searchTerm) {

        transactions =
            transactions.filter(transaction => {

                const id =
                    String(transaction.id || "")
                        .toLowerCase();

                const description =
                    String(transaction.description || "")
                        .toLowerCase();

                const receiver =
                    String(transaction.receiver || "")
                        .toLowerCase();

                const type =
                    String(transaction.type || "")
                        .toLowerCase();

                const amount =
                    String(transaction.amount || "")
                        .toLowerCase();


                return (
                    id.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    receiver.includes(searchTerm) ||
                    type.includes(searchTerm) ||
                    amount.includes(searchTerm)
                );

            });

    }


    /* TYPE FILTER */

    const typeFilter =
        document.getElementById("transactionType");

    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";


    if (selectedType !== "all") {

        transactions =
            transactions.filter(transaction => {

                return (
                    String(transaction.type).toLowerCase()
                    === selectedType
                );

            });

    }


    /* DATE FILTER */

    const dateFilter =
        document.getElementById("dateFilter");

    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "all";


    if (selectedDate !== "all") {

        transactions =
            transactions.filter(transaction => {

                return isTransactionInDateRange(
                    transaction,
                    selectedDate
                );

            });

    }


    renderTransactions(transactions);

}



//    DATE FILTER


function isTransactionInDateRange(
    transaction,
    filter
) {

    if (!transaction.date) {
        return false;
    }


    const transactionDate =
        new Date(transaction.date);


    if (isNaN(transactionDate.getTime())) {
        return false;
    }


    const now = new Date();


    /* TODAY */

    if (filter === "today") {

        return (
            transactionDate.getFullYear()
            === now.getFullYear()

            &&

            transactionDate.getMonth()
            === now.getMonth()

            &&

            transactionDate.getDate()
            === now.getDate()
        );

    }


    /* LAST 7 DAYS */

    if (filter === "7days") {

        const sevenDaysAgo =
            new Date(now);

        sevenDaysAgo.setDate(
            now.getDate() - 7
        );


        return transactionDate >= sevenDaysAgo;

    }


    /* LAST 30 DAYS */

    if (filter === "30days") {

        const thirtyDaysAgo =
            new Date(now);

        thirtyDaysAgo.setDate(
            now.getDate() - 30
        );


        return transactionDate >= thirtyDaysAgo;

    }


    return true;

}



//    RENDER TRANSACTIONS


function renderTransactions(
    transactions
) {

    const tableBody =
        document.getElementById(
            "transactionTableBody"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    const resultCount =
        document.getElementById(
            "resultCount"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    /* RESULT COUNT */

    if (resultCount) {

        resultCount.textContent =
            `Showing ${transactions.length} transaction${transactions.length === 1 ? "" : "s"
            }`;

    }


    /* EMPTY */

    if (transactions.length === 0) {

        if (emptyState) {

            emptyState.classList.add("show");

        }

        return;

    }


    if (emptyState) {

        emptyState.classList.remove("show");

    }


    /* ROWS */

    transactions.forEach(
        transaction => {

            const row =
                document.createElement("tr");


            const isCredit =
                transaction.type === "credit";


            const amountClass =
                isCredit
                    ? "credit"
                    : "debit";


            const amountPrefix =
                isCredit
                    ? "+"
                    : "-";


            const receiver =
                transaction.receiver
                    ? escapeHtml(
                        transaction.receiver
                    )
                    : `<span class="no-receiver">—</span>`;


            const date =
                transaction.date
                    ? formatDateTime(
                        transaction.date
                    )
                    : "—";


            const status =
                transaction.status || "Completed";


            row.innerHTML = `

                <td>
                    <span class="transaction-id">
                        ${escapeHtml(
                transaction.id || "N/A"
            )}
                    </span>
                </td>


                <td>
                    <span class="transaction-date">
                        ${date}
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
                        ${amountClass}
                    ">

                        ${isCredit
                    ? "Credit"
                    : "Debit"}

                    </span>

                </td>


                <td>

                    <span class="receiver-name">

                        ${receiver}

                    </span>

                </td>


                <td>

                    <span class="
                        transaction-table-amount
                        ${amountClass}
                    ">

                        ${amountPrefix}
                        ${formatCurrency(
                        transaction.amount
                    )}

                    </span>

                </td>


                <td>

                    <span class="badge-success">

                        ${escapeHtml(status)}

                    </span>

                </td>


                <td>

                    <button
                        class="btn-view-details"
                        data-id="${escapeHtml(
                        transaction.id
                    )}"
                    >
                        View
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );


    /* VIEW BUTTONS */

    setupViewButtons();

}



//    VIEW TRANSACTION DETAILS


function setupViewButtons() {

    const buttons =
        document.querySelectorAll(
            ".btn-view-details"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const transactionId =
                    button.dataset.id;


                openTransactionModal(
                    transactionId
                );

            }
        );

    });

}



//    OPEN MODAL


function openTransactionModal(
    transactionId
) {

    const transactions =
        getTransactions();


    const transaction =
        transactions.find(
            item =>
                String(item.id)
                === String(transactionId)
        );


    if (!transaction) {
        return;
    }


    const details =
        document.getElementById(
            "transactionDetails"
        );


    if (!details) {
        return;
    }


    const isCredit =
        transaction.type === "credit";


    const typeClass =
        isCredit
            ? "credit"
            : "debit";


    const typeText =
        isCredit
            ? "Credit"
            : "Debit";


    details.innerHTML = `

        <div class="transaction-detail-row">

            <span>
                Transaction ID
            </span>

            <strong>
                ${escapeHtml(
        transaction.id || "N/A"
    )}
            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                Date & Time
            </span>

            <strong>
                ${transaction.date
            ? formatDateTime(
                transaction.date
            )
            : "—"
        }
            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                Description
            </span>

            <strong>
                ${escapeHtml(
            transaction.description
            || "Transaction"
        )}
            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                Transaction Type
            </span>

            <strong class="
                transaction-modal-type
                ${typeClass}
            ">

                ${typeText}

            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                Amount
            </span>

            <strong class="
                transaction-modal-amount
                ${typeClass}
            ">

                ${isCredit ? "+" : "-"
        }

                ${formatCurrency(
            transaction.amount
        )}

            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                Receiver
            </span>

            <strong>

                ${transaction.receiver
            ? escapeHtml(
                transaction.receiver
            )
            : "—"
        }

            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                Account Number
            </span>

            <strong>

                ${transaction.accountNumber
            ? escapeHtml(
                transaction.accountNumber
            )
            : "—"
        }

            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                IFSC Code
            </span>

            <strong>

                ${transaction.ifsc
            ? escapeHtml(
                transaction.ifsc
            )
            : "—"
        }

            </strong>

        </div>


        <div class="transaction-detail-row">

            <span>
                Status
            </span>

            <strong class="badge-success">

                ${escapeHtml(
            transaction.status
            || "Completed"
        )}

            </strong>

        </div>

    `;


    const modal =
        document.getElementById(
            "transactionModal"
        );


    if (modal) {

        modal.classList.add("show");

    }

}



//    MODAL SETUP


function setupTransactionModal() {

    const modal =
        document.getElementById(
            "transactionModal"
        );


    const closeButton =
        document.getElementById(
            "closeTransactionModal"
        );


    const closeModalButton =
        document.getElementById(
            "closeModalBtn"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeTransactionModal
        );

    }


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeTransactionModal
        );

    }


    /* CLICK OUTSIDE */

    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeTransactionModal();

                }

            }
        );

    }


    /* ESC KEY */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeTransactionModal();

            }

        }
    );

}



//    CLOSE MODAL


function closeTransactionModal() {

    const modal =
        document.getElementById(
            "transactionModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }

}



//    CLEAR FILTERS


function clearFilters() {

    const searchInput =
        document.getElementById(
            "transactionSearch"
        );


    const typeFilter =
        document.getElementById(
            "transactionType"
        );


    const dateFilter =
        document.getElementById(
            "dateFilter"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    if (typeFilter) {

        typeFilter.value = "all";

    }


    if (dateFilter) {

        dateFilter.value = "all";

    }


    applyFilters();

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



//    ESCAPE HTML


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}