"use strict";

/*
 * Page Maker
 * Customer Application
 *
 * PHASE 1
 *
 * Current responsibilities:
 * - Customer UI
 * - Camera input
 * - Gallery input
 * - Image selection
 * - Selected-file preview
 *
 * Firebase, crop engine, PDF and printing
 * will be added in later phases.
 */


const state = {
    files: []
};


// =========================
// DOM ELEMENTS
// =========================

const cameraInput =
    document.getElementById("cameraInput");

const galleryInput =
    document.getElementById("galleryInput");

const selectedFilesSection =
    document.getElementById("selectedFilesSection");

const selectedFilesContainer =
    document.getElementById("selectedFiles");

const selectedCount =
    document.getElementById("selectedCount");

const clearFilesBtn =
    document.getElementById("clearFilesBtn");

const continueBtn =
    document.getElementById("continueBtn");

const toast =
    document.getElementById("toast");


// =========================
// INPUT EVENTS
// =========================

cameraInput.addEventListener(
    "change",
    handleFileSelection
);

galleryInput.addEventListener(
    "change",
    handleFileSelection
);


// =========================
// FILE SELECTION
// =========================

function handleFileSelection(event) {

    const selectedFiles =
        Array.from(event.target.files || []);

    if (!selectedFiles.length) {
        return;
    }

    const validFiles = selectedFiles.filter(
        validateFile
    );

    if (!validFiles.length) {
        return;
    }

    state.files.push(...validFiles);

    renderSelectedFiles();

    // Allow selecting the same file again later.
    event.target.value = "";
}


// =========================
// FILE VALIDATION
// =========================

function validateFile(file) {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

        showToast(
            `${file.name} is not a supported image.`
        );

        return false;
    }

    // Phase 1 limit.
    // This will be improved later for camera images.
    const maxSize =
        20 * 1024 * 1024;

    if (file.size > maxSize) {

        showToast(
            `${file.name} is larger than 20 MB.`
        );

        return false;
    }

    return true;
}


// =========================
// RENDER SELECTED FILES
// =========================

function renderSelectedFiles() {

    selectedFilesContainer.innerHTML = "";

    if (!state.files.length) {

        selectedFilesSection.classList.add(
            "hidden"
        );

        return;
    }

    selectedFilesSection.classList.remove(
        "hidden"
    );

    selectedCount.textContent =
        `${state.files.length} ${
            state.files.length === 1
                ? "document"
                : "documents"
        }`;


    state.files.forEach(
        (file, index) => {

            const item =
                document.createElement("div");

            item.className = "file-item";


            const preview =
                document.createElement("img");

            preview.className =
                "file-preview";

            preview.alt =
                `Document ${index + 1}`;


            const info =
                document.createElement("div");

            info.className =
                "file-info";


            const name =
                document.createElement("div");

            name.className =
                "file-name";

            name.textContent =
                file.name;


            const size =
                document.createElement("div");

            size.className =
                "file-size";

            size.textContent =
                formatFileSize(file.size);


            info.appendChild(name);
            info.appendChild(size);


            const removeButton =
                document.createElement("button");

            removeButton.type =
                "button";

            removeButton.className =
                "text-button";

            removeButton.textContent =
                "Remove";

            removeButton.addEventListener(
                "click",
                () => removeFile(index)
            );


            item.appendChild(preview);
            item.appendChild(info);
            item.appendChild(removeButton);


            selectedFilesContainer.appendChild(
                item
            );


            createPreviewURL(
                file,
                preview
            );

        }
    );
}


// =========================
// IMAGE PREVIEW
// =========================

function createPreviewURL(
    file,
    imageElement
) {

    const objectURL =
        URL.createObjectURL(file);

    imageElement.src =
        objectURL;

    imageElement.onload = () => {

        URL.revokeObjectURL(
            objectURL
        );

    };
}


// =========================
// REMOVE FILE
// =========================

function removeFile(index) {

    if (
        index < 0 ||
        index >= state.files.length
    ) {
        return;
    }

    state.files.splice(
        index,
        1
    );

    renderSelectedFiles();
}


// =========================
// CLEAR FILES
// =========================

clearFilesBtn.addEventListener(
    "click",
    () => {

        state.files = [];

        renderSelectedFiles();

        showToast(
            "Documents cleared."
        );

    }
);


// =========================
// CONTINUE
// =========================

continueBtn.addEventListener(
    "click",
    () => {

        if (!state.files.length) {

            showToast(
                "Please add a document first."
            );

            return;
        }

        /*
         * PHASE 2 / 3:
         *
         * This button will open the
         * document crop interface.
         */

        showToast(
            "Crop screen will be added in the next phase."
        );

    }
);


// =========================
// FILE SIZE
// =========================

function formatFileSize(bytes) {

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }

    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;
}


// =========================
// TOAST
// =========================

let toastTimer = null;

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );
}


// =========================
// INITIAL STATE
// =========================

renderSelectedFiles();