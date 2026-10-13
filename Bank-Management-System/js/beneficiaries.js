protectPage();


document.addEventListener("DOMContentLoaded", () => {

    loadBeneficiaryPage();

    setupLogout();

    setupMobileMenu();

    setupAddBeneficiary();

    setupBeneficiaryForm();

    setupBeneficiaryModal();

    setupBeneficiarySearch();

});




//    LOAD PAGE


function loadBeneficiaryPage() {

    const user = getUser();

    const beneficiaries =
        getBeneficiaries();


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


    updateSummary(beneficiaries);

    renderBeneficiaries(beneficiaries);

    loadNotificationCount();

}




//    SUMMARY


function updateSummary(beneficiaries) {

    const count =
        document.getElementById(
            "beneficiaryCount"
        );


    const savedCount =
        document.getElementById(
            "savedAccountCount"
        );


    if (count) {

        count.textContent =
            beneficiaries.length;

    }


    if (savedCount) {

        savedCount.textContent =
            beneficiaries.length;

    }

}




//    RENDER BENEFICIARIES


function renderBeneficiaries(
    beneficiaries
) {

    const list =
        document.getElementById(
            "beneficiaryList"
        );


    const empty =
        document.getElementById(
            "beneficiaryEmpty"
        );


    const resultCount =
        document.getElementById(
            "beneficiaryResultCount"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (resultCount) {

        resultCount.textContent =
            `Showing ${beneficiaries.length} beneficiary${beneficiaries.length === 1
                ? ""
                : "ies"
            }`;

    }


    if (beneficiaries.length === 0) {

        if (empty) {

            empty.classList.add("show");

        }

        return;

    }


    if (empty) {

        empty.classList.remove("show");

    }


    beneficiaries.forEach(
        beneficiary => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "beneficiary-item";


            const initial =
                getInitial(
                    beneficiary.name
                );


            const maskedAccount =
                maskAccountNumber(
                    beneficiary.accountNumber
                );


            item.innerHTML = `

                <div class="beneficiary-main">

                    <div class="beneficiary-avatar">

                        ${escapeHtml(initial)}

                    </div>


                    <div class="beneficiary-info">

                        <h3>

                            ${escapeHtml(
                beneficiary.name
            )}

                        </h3>


                        <p>

                            ${escapeHtml(
                beneficiary.bank
                || "Bank"
            )}

                        </p>


                        <div class="beneficiary-meta">

                            <span>
                                A/C: ${escapeHtml(
                maskedAccount
            )}
                            </span>

                            <span>
                                IFSC: ${escapeHtml(
                beneficiary.ifsc
                || "—"
            )}
                            </span>

                        </div>

                    </div>

                </div>


                <div class="beneficiary-actions">

                    <button
                        type="button"
                        class="btn-use-beneficiary"
                        data-id="${escapeHtml(
                beneficiary.id
            )}"
                    >
                        Use for Transfer
                    </button>


                    <button
                        type="button"
                        class="btn-delete-beneficiary"
                        data-id="${escapeHtml(
                beneficiary.id
            )}"
                    >
                        Delete
                    </button>

                </div>

            `;


            list.appendChild(item);

        }
    );


    setupBeneficiaryActions();

}




//    MASK ACCOUNT NUMBER


function maskAccountNumber(
    accountNumber
) {

    if (!accountNumber) {
        return "—";
    }


    const number =
        String(accountNumber);


    if (number.length <= 4) {

        return number;

    }


    const lastFour =
        number.slice(-4);


    return `••••${lastFour}`;

}




//    ADD BENEFICIARY BUTTON


function setupAddBeneficiary() {

    const button =
        document.getElementById(
            "addBeneficiaryBtn"
        );


    const emptyButton =
        document.getElementById(
            "emptyAddButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            openBeneficiaryModal
        );

    }


    if (emptyButton) {

        emptyButton.addEventListener(
            "click",
            openBeneficiaryModal
        );

    }

}




//    BENEFICIARY FORM

function setupBeneficiaryForm() {

    const form =
        document.getElementById(
            "beneficiaryForm"
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
                    "beneficiaryName"
                )
                    .value
                    .trim();


            const bank =
                document.getElementById(
                    "beneficiaryBank"
                )
                    .value
                    .trim();


            const accountNumber =
                document.getElementById(
                    "beneficiaryAccount"
                )
                    .value
                    .trim();


            const ifsc =
                document.getElementById(
                    "beneficiaryIfsc"
                )
                    .value
                    .trim()
                    .toUpperCase();


            /* NAME */

            if (name.length < 3) {

                showBeneficiaryMessage(
                    "Please enter a valid beneficiary name.",
                    "error"
                );

                return;

            }


            /* BANK */

            if (bank.length < 2) {

                showBeneficiaryMessage(
                    "Please enter a valid bank name.",
                    "error"
                );

                return;

            }


            /* ACCOUNT */

            if (
                !/^[0-9]{6,20}$/
                    .test(accountNumber)
            ) {

                showBeneficiaryMessage(
                    "Account number must contain 6 to 20 digits.",
                    "error"
                );

                return;

            }


            /* IFSC */

            if (
                !/^[A-Z]{4}0[A-Z0-9]{6}$/
                    .test(ifsc)
            ) {

                showBeneficiaryMessage(
                    "Please enter a valid 11-character IFSC code.",
                    "error"
                );

                return;

            }


            /* DUPLICATE CHECK */

            const beneficiaries =
                getBeneficiaries();


            const duplicate =
                beneficiaries.some(
                    beneficiary =>
                        String(
                            beneficiary.accountNumber
                        )
                        === accountNumber
                );


            if (duplicate) {

                showBeneficiaryMessage(
                    "This account is already saved.",
                    "error"
                );

                return;

            }


            /* SAVE */

            const saved =
                addBeneficiary({

                    name: name,

                    bank: bank,

                    accountNumber:
                        accountNumber,

                    ifsc: ifsc

                });


            if (!saved) {

                showBeneficiaryMessage(
                    "Unable to save beneficiary.",
                    "error"
                );

                return;

            }


            /* SUCCESS */

            showBeneficiaryMessage(
                "Beneficiary added successfully.",
                "success"
            );


            form.reset();


            setTimeout(
                () => {

                    closeBeneficiaryModal();

                    loadBeneficiaryPage();

                },
                700
            );

        }
    );

}




//    BENEFICIARY ACTIONS


function setupBeneficiaryActions() {

    const useButtons =
        document.querySelectorAll(
            ".btn-use-beneficiary"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".btn-delete-beneficiary"
        );


    useButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;


                    const beneficiaries =
                        getBeneficiaries();


                    const beneficiary =
                        beneficiaries.find(
                            item =>
                                String(item.id)
                                === String(id)
                        );


                    if (!beneficiary) {
                        return;
                    }


                    /* SAVE SELECTED BENEFICIARY */

                    localStorage.setItem(
                        "selectedBeneficiary",
                        JSON.stringify(
                            beneficiary
                        )
                    );


                    window.location.href =
                        "transfer.html";

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


                    const beneficiaries =
                        getBeneficiaries();


                    const beneficiary =
                        beneficiaries.find(
                            item =>
                                String(item.id)
                                === String(id)
                        );


                    if (!beneficiary) {
                        return;
                    }


                    const confirmed =
                        confirm(
                            `Delete ${beneficiary.name} from your beneficiaries?`
                        );


                    if (!confirmed) {
                        return;
                    }


                    deleteBeneficiary(id);

                    loadBeneficiaryPage();

                }
            );

        }
    );

}




//    MODAL SETUP


function setupBeneficiaryModal() {

    const modal =
        document.getElementById(
            "beneficiaryModal"
        );


    const closeButton =
        document.getElementById(
            "closeBeneficiaryModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelBeneficiaryBtn"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeBeneficiaryModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeBeneficiaryModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeBeneficiaryModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeBeneficiaryModal();

            }

        }
    );

}




//    OPEN MODAL


function openBeneficiaryModal() {

    const modal =
        document.getElementById(
            "beneficiaryModal"
        );


    const form =
        document.getElementById(
            "beneficiaryForm"
        );


    clearBeneficiaryMessage();


    if (form) {

        form.reset();

    }


    if (modal) {

        modal.classList.add("show");

    }

}




//    CLOSE MODAL


function closeBeneficiaryModal() {

    const modal =
        document.getElementById(
            "beneficiaryModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }


    clearBeneficiaryMessage();

}




//    SEARCH


function setupBeneficiarySearch() {

    const search =
        document.getElementById(
            "beneficiarySearch"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        () => {

            const searchTerm =
                search.value
                    .trim()
                    .toLowerCase();


            const beneficiaries =
                getBeneficiaries();


            if (!searchTerm) {

                renderBeneficiaries(
                    beneficiaries
                );

                return;

            }


            const filtered =
                beneficiaries.filter(
                    beneficiary => {

                        const name =
                            String(
                                beneficiary.name || ""
                            ).toLowerCase();


                        const bank =
                            String(
                                beneficiary.bank || ""
                            ).toLowerCase();


                        const account =
                            String(
                                beneficiary.accountNumber || ""
                            ).toLowerCase();


                        const ifsc =
                            String(
                                beneficiary.ifsc || ""
                            ).toLowerCase();


                        return (
                            name.includes(
                                searchTerm
                            )
                            ||
                            bank.includes(
                                searchTerm
                            )
                            ||
                            account.includes(
                                searchTerm
                            )
                            ||
                            ifsc.includes(
                                searchTerm
                            )
                        );

                    }
                );


            renderBeneficiaries(
                filtered
            );

        }
    );

}




//    MESSAGE


function showBeneficiaryMessage(
    message,
    type
) {

    const messageBox =
        document.getElementById(
            "beneficiaryMessage"
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


function clearBeneficiaryMessage() {

    const messageBox =
        document.getElementById(
            "beneficiaryMessage"
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