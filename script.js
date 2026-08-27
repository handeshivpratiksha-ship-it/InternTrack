// GET HTML ELEMENTS

const form = document.getElementById("applicationForm");

const companyInput =
    document.getElementById("companyInput");

const positionInput =
    document.getElementById("positionInput");

const applicationDate =
    document.getElementById("applicationDate");

const applicationNotes =
    document.getElementById("applicationNotes");

const statusSelect =
    document.getElementById("applicationStatus");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const tableBody =
    document.getElementById("applicationTableBody");


// DASHBOARD ELEMENTS

const totalElement =
    document.getElementById("total");

const appliedElement =
    document.getElementById("applied");

const interviewsElement =
    document.getElementById("interviews");

const selectedElement =
    document.getElementById("selected");

const rejectedElement =
    document.getElementById("rejected");


// EDIT MODAL ELEMENTS

const editModal =
    document.getElementById("editModal");

const editCompany =
    document.getElementById("editCompany");

const editPosition =
    document.getElementById("editPosition");

const editDate =
    document.getElementById("editDate");

const editNotes =
    document.getElementById("editNotes");

const editStatus =
    document.getElementById("editStatus");

const saveEdit =
    document.getElementById("saveEdit");

const cancelEdit =
    document.getElementById("cancelEdit");


// APPLICATION DATA

let applications =
    JSON.parse(
        localStorage.getItem("applications")
    ) || [];

let editingIndex = null;


// ADD APPLICATION

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const company =
        companyInput.value.trim();

    const position =
        positionInput.value.trim();

    const date =
        applicationDate.value;

    const notes =
        applicationNotes.value.trim();

    const status =
        statusSelect.value;


    if (company === "" || position === "") {

        alert(
            "Please enter company name and position."
        );

        return;
    }


    applications.push({
        company: company,
        position: position,
        date: date,
        notes: notes,
        status: status
    });


    saveApplications();

    displayApplications();


    // Clear form

    companyInput.value = "";

    positionInput.value = "";

    applicationDate.value = "";

    applicationNotes.value = "";

    statusSelect.value = "Applied";

});


// SAVE APPLICATIONS

function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}


// DISPLAY APPLICATIONS

function displayApplications() {

    tableBody.innerHTML = "";

    if (applications.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.textContent =
            "No applications yet. Add your first application!";

        cell.className = "empty-state";

        row.appendChild(cell);

        tableBody.appendChild(row);

    } else {

        applications.forEach(function (application, index) {

            createApplicationRow(
                application,
                index
            );

        });

    }

    updateDashboard();
}

// CREATE TABLE ROW

function createApplicationRow(
    application,
    index
) {

    const row =
        document.createElement("tr");


    // Company

    const companyCell =
        document.createElement("td");

    companyCell.textContent =
        application.company;


    // Position

    const positionCell =
        document.createElement("td");

    positionCell.textContent =
        application.position;


    // Date

    const dateCell =
        document.createElement("td");

    dateCell.textContent =
        application.date || "-";


    // Status

    const statusCell =
        document.createElement("td");

    statusCell.textContent =
        application.status;

    statusCell.className =
        "status-" +
        application.status.toLowerCase();


    // Notes

    const notesCell =
        document.createElement("td");

    notesCell.textContent =
        application.notes || "-";


    // Action

    const actionCell =
        document.createElement("td");


    // EDIT BUTTON

    const editButton =
        document.createElement("button");

    editButton.textContent =
        "Edit";

    editButton.type =
        "button";

    editButton.addEventListener(
        "click",
        function () {

            editingIndex = index;

            editCompany.value =
                application.company;

            editPosition.value =
                application.position;

            editDate.value =
                application.date || "";

            editNotes.value =
                application.notes || "";

            editStatus.value =
                application.status;

            editModal.style.display =
                "flex";

        }
    );


    // DELETE BUTTON

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "Delete";

    deleteButton.type =
        "button";


    deleteButton.addEventListener(
        "click",
        function () {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this application?"
                );


            if (!confirmDelete) {
                return;
            }


            applications.splice(
                index,
                1
            );

            saveApplications();

            displayApplications();

        }
    );


    // Add buttons

    actionCell.appendChild(
        editButton
    );

    actionCell.appendChild(
        deleteButton
    );


    // Add cells to row

    row.appendChild(companyCell);

    row.appendChild(positionCell);

    row.appendChild(dateCell);

    row.appendChild(statusCell);

    row.appendChild(notesCell);

    row.appendChild(actionCell);


    // Add row to table

    tableBody.appendChild(row);

}


// UPDATE DASHBOARD

function updateDashboard() {

    let appliedCount = 0;

    let interviewCount = 0;

    let selectedCount = 0;

    let rejectedCount = 0;


    applications.forEach(
        function (application) {

            if (application.status === "Applied") {

                appliedCount++;

            }

            else if (
                application.status === "Interview"
            ) {

                interviewCount++;

            }

            else if (
                application.status === "Selected"
            ) {

                selectedCount++;

            }

            else if (
                application.status === "Rejected"
            ) {

                rejectedCount++;

            }

        }
    );


    totalElement.textContent =
        applications.length;

    appliedElement.textContent =
        appliedCount;

    interviewsElement.textContent =
        interviewCount;

    selectedElement.textContent =
        selectedCount;

    rejectedElement.textContent =
        rejectedCount;

}

// SAVE EDIT

saveEdit.addEventListener(
    "click",
    function () {

        if (editingIndex === null) {
            return;
        }


        const company =
            editCompany.value.trim();

        const position =
            editPosition.value.trim();

        const date =
            editDate.value;

        const notes =
            editNotes.value.trim();

        const status =
            editStatus.value;


        if (
            company === "" ||
            position === ""
        ) {

            alert(
                "Please enter company name and position."
            );

            return;
        }


        applications[editingIndex] = {

            company: company,

            position: position,

            date: date,

            notes: notes,

            status: status

        };


        saveApplications();

        displayApplications();


        editModal.style.display =
            "none";

        editingIndex = null;

    }
);


// ========================================
// CANCEL EDIT
// ========================================

cancelEdit.addEventListener(
    "click",
    function () {

        editModal.style.display =
            "none";

        editingIndex = null;

    }
);

// SEARCH + FILTER

function filterApplications() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;


    tableBody.innerHTML = "";


    applications.forEach(
        function (application, index) {

            const company =
                application.company
                    .toLowerCase();

            const position =
                application.position
                    .toLowerCase();


            const matchesSearch =
                company.includes(searchText) ||
                position.includes(searchText);


            const matchesStatus =
                selectedStatus === "All" ||
                application.status ===
                    selectedStatus;


            if (
                matchesSearch &&
                matchesStatus
            ) {

                createApplicationRow(
                    application,
                    index
                );

            }

        }
    );

}


searchInput.addEventListener(
    "input",
    filterApplications
);


statusFilter.addEventListener(
    "change",
    filterApplications
);


// ========================================
// LOAD APPLICATIONS
// ========================================

displayApplications();