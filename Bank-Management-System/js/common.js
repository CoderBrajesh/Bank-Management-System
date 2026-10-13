//  DEFAULT BANK DATA


const DEFAULT_BANK_DATA = {

    user: {
        username: "admin",
        name: "Admin User",
        email: "admin@securebank.com",
        phone: "+91 98765 43210",
        address: "Main Branch",

        accountNumber: "45897821",
        accountType: "Savings Account",
        ifsc: "SBIN0001234",
        branch: "Main Branch"
    },

    balance: 50000,

    totalDeposit: 50000,

    totalWithdrawal: 0,

    transactions: [],

    beneficiaries: [],

    notifications: [],

    card: {
        number: "458978217821",
        expiry: "12/29",
        cvv: "123",
        frozen: false
    },

    settings: {
        darkMode: false,
        notifications: true
    }
};




//    INITIALIZE BANK DATA


function initializeBankData() {

    const existingData =
        localStorage.getItem("bankData");


    if (!existingData) {

        localStorage.setItem(
            "bankData",
            JSON.stringify(DEFAULT_BANK_DATA)
        );

    }

}


/* Run immediately */

initializeBankData();




//    GET BANK DATA


function getBankData() {

    const data =
        localStorage.getItem("bankData");


    if (!data) {

        initializeBankData();

        return {
            ...DEFAULT_BANK_DATA
        };

    }


    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Bank data error:",
            error
        );

        localStorage.setItem(
            "bankData",
            JSON.stringify(DEFAULT_BANK_DATA)
        );

        return {
            ...DEFAULT_BANK_DATA
        };

    }

}




//    SAVE BANK DATA


function saveBankData(data) {

    localStorage.setItem(
        "bankData",
        JSON.stringify(data)
    );

}




//    LOGIN SESSION


function isLoggedIn() {

    return (
        localStorage.getItem("isLoggedIn")
        === "true"
    );

}



function protectPage() {

    if (!isLoggedIn()) {

        window.location.href =
            "index.html";

    }

}



function loginUser(username) {

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

    localStorage.setItem(
        "currentUser",
        username
    );

}



function logoutUser() {

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "index.html";

}



function getCurrentUser() {

    return (
        localStorage.getItem(
            "currentUser"
        )
        || "admin"
    );

}




//    LOGOUT BUTTON


function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(
            ".logout-btn"
        );


    logoutButtons.forEach(button => {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (confirmLogout) {

                    logoutUser();

                }

            }
        );

    });

}




//    USER


function getUser() {

    const data =
        getBankData();

    return data.user;

}



function updateUser(updatedUser) {

    const data =
        getBankData();


    data.user = {
        ...data.user,
        ...updatedUser
    };


    saveBankData(data);

}




//    CURRENCY


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    ).format(amount);

}




//    DATE


function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}



function formatDateTime(date) {

    return new Date(date).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}




//    TRANSACTION ID


function generateTransactionId() {

    return (
        "TXN" +
        Date.now() +
        Math.floor(
            Math.random() * 1000
        )
    );

}




//    ADD TRANSACTION


function addTransaction({

    description,
    type,
    amount,
    receiver = "",
    status = "Completed"

}) {

    const data =
        getBankData();


    const transaction = {

        id: generateTransactionId(),

        description:
            description || "Transaction",

        type:
            type || "debit",

        amount:
            Number(amount),

        receiver:
            receiver,

        status:
            status,

        date:
            new Date().toISOString()

    };


    data.transactions.unshift(
        transaction
    );


    /* Keep only latest 100 */

    if (
        data.transactions.length
        > 100
    ) {

        data.transactions =
            data.transactions.slice(
                0,
                100
            );

    }


    saveBankData(data);


    return transaction;

}




//    ADD NOTIFICATION


function addNotification(
    message,
    type = "info"
) {

    const data =
        getBankData();


    const notification = {

        id:
            Date.now(),

        message:
            message,

        type:
            type,

        read:
            false,

        date:
            new Date().toISOString()

    };


    data.notifications.unshift(
        notification
    );


    saveBankData(data);


    return notification;

}




//    UNREAD NOTIFICATIONS


function getUnreadNotifications() {

    const data =
        getBankData();


    return data.notifications.filter(
        notification =>
            notification.read === false
    );

}




//    DEPOSIT MONEY


function depositMoney(
    amount,
    description = "Cash Deposit"
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount)
        || amount <= 0
    ) {

        return {
            success: false,
            message:
                "Enter a valid amount."
        };

    }


    const data =
        getBankData();


    data.balance += amount;

    data.totalDeposit += amount;


    const transaction = {

        id:
            generateTransactionId(),

        description:
            description,

        type:
            "credit",

        amount:
            amount,

        receiver:
            "",

        status:
            "Completed",

        date:
            new Date().toISOString()

    };


    data.transactions.unshift(
        transaction
    );


    data.notifications.unshift({

        id:
            Date.now(),

        message:
            `${formatCurrency(amount)} deposited successfully.`,

        type:
            "success",

        read:
            false,

        date:
            new Date().toISOString()

    });


    saveBankData(data);


    return {
        success: true,
        message:
            "Money deposited successfully.",
        transaction:
            transaction
    };

}




//    WITHDRAW MONEY


function withdrawMoney(
    amount,
    description = "Cash Withdrawal"
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount)
        || amount <= 0
    ) {

        return {
            success: false,
            message:
                "Enter a valid amount."
        };

    }


    const data =
        getBankData();


    if (
        amount > data.balance
    ) {

        return {
            success: false,
            message:
                "Insufficient balance."
        };

    }


    data.balance -= amount;

    data.totalWithdrawal += amount;


    const transaction = {

        id:
            generateTransactionId(),

        description:
            description,

        type:
            "debit",

        amount:
            amount,

        receiver:
            "",

        status:
            "Completed",

        date:
            new Date().toISOString()

    };


    data.transactions.unshift(
        transaction
    );


    data.notifications.unshift({

        id:
            Date.now(),

        message:
            `${formatCurrency(amount)} withdrawn successfully.`,

        type:
            "success",

        read:
            false,

        date:
            new Date().toISOString()

    });


    saveBankData(data);


    return {
        success: true,
        message:
            "Money withdrawn successfully.",
        transaction:
            transaction
    };

}




//    TRANSFER MONEY


function transferMoney({

    receiver,
    accountNumber,
    ifsc,
    amount,
    description =
    "Money Transfer"

}) {

    amount =
        Number(amount);


    if (
        !receiver
        || !accountNumber
        || !ifsc
    ) {

        return {
            success: false,
            message:
                "Please enter all receiver details."
        };

    }


    if (
        !Number.isFinite(amount)
        || amount <= 0
    ) {

        return {
            success: false,
            message:
                "Enter a valid amount."
        };

    }


    const data =
        getBankData();


    if (
        amount > data.balance
    ) {

        return {
            success: false,
            message:
                "Insufficient balance."
        };

    }


    data.balance -= amount;

    data.totalWithdrawal += amount;


    const transaction = {

        id:
            generateTransactionId(),

        description:
            description,

        type:
            "debit",

        amount:
            amount,

        receiver:
            receiver,

        accountNumber:
            accountNumber,

        ifsc:
            ifsc,

        status:
            "Completed",

        date:
            new Date().toISOString()

    };


    data.transactions.unshift(
        transaction
    );


    data.notifications.unshift({

        id:
            Date.now(),

        message:
            `${formatCurrency(amount)} transferred to ${receiver}.`,

        type:
            "success",

        read:
            false,

        date:
            new Date().toISOString()

    });


    saveBankData(data);


    return {
        success: true,
        message:
            "Money transferred successfully.",
        transaction:
            transaction
    };

}




//    TRANSACTIONS


function getTransactions() {

    const data =
        getBankData();


    return data.transactions;

}



function getRecentTransactions(
    limit = 5
) {

    const data =
        getBankData();


    return data.transactions
        .slice(0, limit);

}




//    BALANCE


function getBalance() {

    return getBankData().balance;

}



function getTotalDeposits() {

    return getBankData()
        .totalDeposit;

}



function getTotalWithdrawals() {

    return getBankData()
        .totalWithdrawal;

}




//    CARD


function getCard() {

    return getBankData().card;

}



function toggleCardFreeze() {

    const data =
        getBankData();


    data.card.frozen =
        !data.card.frozen;


    saveBankData(data);


    return data.card.frozen;

}




//    BENEFICIARIES


function getBeneficiaries() {

    return getBankData()
        .beneficiaries;

}



function addBeneficiary(
    beneficiary
) {

    const data =
        getBankData();


    beneficiary.id =
        Date.now();


    data.beneficiaries.push(
        beneficiary
    );


    saveBankData(data);

}



function deleteBeneficiary(id) {

    const data =
        getBankData();


    data.beneficiaries =
        data.beneficiaries.filter(
            item =>
                item.id !== id
        );


    saveBankData(data);

}




//    RESET BANK DATA


function resetBankData() {

    localStorage.setItem(
        "bankData",
        JSON.stringify(
            DEFAULT_BANK_DATA
        )
    );

}




//    CONSOLE MESSAGE


console.log(
    "SecureBank Common JS Loaded"
);