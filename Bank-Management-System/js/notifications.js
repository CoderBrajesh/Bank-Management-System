protectPage();


document.addEventListener("DOMContentLoaded", () => {

    loadNotificationsPage();

    setupLogout();

    setupMobileMenu();

    setupNotificationFilters();

    setupMarkAllRead();

});




//    LOAD PAGE


function loadNotificationsPage() {

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

    }


    updateNotificationSummary();

    applyNotificationFilters();

    updateTopNotificationCount();

}




//    GET ALL NOTIFICATIONS


function getAllNotifications() {

    const data =
        getBankData();


    return Array.isArray(
        data.notifications
    )
        ? data.notifications
        : [];

}




//    UPDATE SUMMARY


function updateNotificationSummary() {

    const notifications =
        getAllNotifications();


    const unread =
        notifications.filter(
            notification =>
                notification.read !== true
        );


    const read =
        notifications.filter(
            notification =>
                notification.read === true
        );


    const totalElement =
        document.getElementById(
            "totalNotifications"
        );


    const unreadElement =
        document.getElementById(
            "unreadNotifications"
        );


    const readElement =
        document.getElementById(
            "readNotifications"
        );


    if (totalElement) {

        totalElement.textContent =
            notifications.length;

    }


    if (unreadElement) {

        unreadElement.textContent =
            unread.length;

    }


    if (readElement) {

        readElement.textContent =
            read.length;

    }

}




//    FILTER SETUP


function setupNotificationFilters() {

    const searchInput =
        document.getElementById(
            "notificationSearch"
        );


    const filter =
        document.getElementById(
            "notificationFilter"
        );


    const clearButton =
        document.getElementById(
            "clearNotificationFilters"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyNotificationFilters
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            applyNotificationFilters
        );

    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearNotificationFilters
        );

    }

}




//    APPLY FILTERS


function applyNotificationFilters() {

    let notifications =
        getAllNotifications();


    const searchInput =
        document.getElementById(
            "notificationSearch"
        );


    const filter =
        document.getElementById(
            "notificationFilter"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedFilter =
        filter
            ? filter.value
            : "all";


    /* SEARCH */

    if (searchTerm) {

        notifications =
            notifications.filter(
                notification => {

                    const message =
                        String(
                            notification.message || ""
                        ).toLowerCase();


                    const type =
                        String(
                            notification.type || ""
                        ).toLowerCase();


                    const date =
                        notification.date
                            ? formatDateTime(
                                notification.date
                            ).toLowerCase()
                            : "";


                    return (
                        message.includes(
                            searchTerm
                        )
                        ||
                        type.includes(
                            searchTerm
                        )
                        ||
                        date.includes(
                            searchTerm
                        )
                    );

                }
            );

    }


    /* READ / UNREAD */

    if (selectedFilter === "unread") {

        notifications =
            notifications.filter(
                notification =>
                    notification.read !== true
            );

    }


    if (selectedFilter === "read") {

        notifications =
            notifications.filter(
                notification =>
                    notification.read === true
            );

    }


    renderNotifications(
        notifications
    );

}




//    RENDER NOTIFICATIONS


function renderNotifications(
    notifications
) {

    const list =
        document.getElementById(
            "notificationList"
        );


    const empty =
        document.getElementById(
            "notificationEmpty"
        );


    const resultCount =
        document.getElementById(
            "notificationResultCount"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (resultCount) {

        resultCount.textContent =
            `Showing ${notifications.length} notification${notifications.length === 1
                ? ""
                : "s"
            }`;

    }


    if (notifications.length === 0) {

        if (empty) {

            empty.classList.add("show");

        }

        return;

    }


    if (empty) {

        empty.classList.remove("show");

    }


    notifications.forEach(
        notification => {

            const item =
                document.createElement(
                    "div"
                );


            const isRead =
                notification.read === true;


            item.className =
                isRead
                    ? "notification-item read"
                    : "notification-item unread";


            const icon =
                getNotificationIcon(
                    notification.type
                );


            const typeLabel =
                getNotificationTypeLabel(
                    notification.type
                );


            const date =
                notification.date
                    ? formatDateTime(
                        notification.date
                    )
                    : "Recently";


            item.innerHTML = `

                <div class="notification-icon ${escapeHtml(
                notification.type || "info"
            )}">

                    ${icon}

                </div>


                <div class="notification-content">

                    <div class="notification-title-row">

                        <strong>
                            ${escapeHtml(
                typeLabel
            )}
                        </strong>

                        ${!isRead
                    ? `
                                    <span class="unread-dot">
                                    </span>
                                `
                    : ""
                }

                    </div>


                    <p>
                        ${escapeHtml(
                    notification.message
                    || "Notification"
                )}
                    </p>


                    <span class="notification-date">
                        ${escapeHtml(date)}
                    </span>

                </div>


                <div class="notification-actions">

                    ${!isRead
                    ? `
                                <button
                                    type="button"
                                    class="btn-mark-read"
                                    data-id="${escapeHtml(
                        notification.id
                    )}"
                                >
                                    Mark Read
                                </button>
                            `
                    : `
                                <span class="read-label">
                                    ✓ Read
                                </span>
                            `
                }


                    <button
                        type="button"
                        class="btn-delete-notification"
                        data-id="${escapeHtml(
                    notification.id
                )}"
                    >
                        Delete
                    </button>

                </div>

            `;


            list.appendChild(item);

        }
    );


    setupNotificationActions();

}




//    NOTIFICATION ICON


function getNotificationIcon(type) {

    switch (type) {

        case "success":
            return "✓";

        case "deposit":
            return "↓";

        case "withdraw":
            return "↑";

        case "transfer":
            return "↗";

        case "beneficiary":
            return "👤";

        case "warning":
            return "⚠";

        case "error":
            return "✕";

        default:
            return "ℹ";

    }

}




//    NOTIFICATION TYPE


function getNotificationTypeLabel(type) {

    switch (type) {

        case "deposit":
            return "Deposit";

        case "withdraw":
            return "Withdrawal";

        case "transfer":
            return "Transfer";

        case "beneficiary":
            return "Beneficiary";

        case "success":
            return "Success";

        case "warning":
            return "Warning";

        case "error":
            return "Alert";

        default:
            return "Information";

    }

}




//    NOTIFICATION ACTIONS


function setupNotificationActions() {

    const markButtons =
        document.querySelectorAll(
            ".btn-mark-read"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".btn-delete-notification"
        );


    markButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;


                    markNotificationAsRead(id);

                }
            );

        }
    );


    deleteButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;


                    deleteNotification(id);

                }
            );

        }
    );

}




//    MARK AS READ


function markNotificationAsRead(id) {

    const data =
        getBankData();


    if (!Array.isArray(
        data.notifications
    )) {

        return;

    }


    const notification =
        data.notifications.find(
            item =>
                String(item.id)
                === String(id)
        );


    if (!notification) {
        return;
    }


    notification.read = true;


    saveBankData(data);


    updateNotificationSummary();

    applyNotificationFilters();

    updateTopNotificationCount();

}




//    MARK ALL AS READ


function setupMarkAllRead() {

    const button =
        document.getElementById(
            "markAllReadBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const notifications =
                getAllNotifications();


            const unreadExists =
                notifications.some(
                    notification =>
                        notification.read !== true
                );


            if (!unreadExists) {

                alert(
                    "All notifications are already marked as read."
                );

                return;

            }


            const data =
                getBankData();


            data.notifications.forEach(
                notification => {

                    notification.read = true;

                }
            );


            saveBankData(data);


            updateNotificationSummary();

            applyNotificationFilters();

            updateTopNotificationCount();

        }
    );

}




//    DELETE NOTIFICATION


function deleteNotification(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this notification?"
        );


    if (!confirmed) {
        return;
    }


    const data =
        getBankData();


    data.notifications =
        data.notifications.filter(
            notification =>
                String(notification.id)
                !== String(id)
        );


    saveBankData(data);


    updateNotificationSummary();

    applyNotificationFilters();

    updateTopNotificationCount();

}




//    CLEAR FILTERS


function clearNotificationFilters() {

    const searchInput =
        document.getElementById(
            "notificationSearch"
        );


    const filter =
        document.getElementById(
            "notificationFilter"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    if (filter) {

        filter.value = "all";

    }


    applyNotificationFilters();

}




//    TOP NOTIFICATION COUNT


function updateTopNotificationCount() {

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