// Get elements
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const previewArea = document.getElementById("previewArea");
const errorMsg = document.getElementById("errorMsg");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");

// Show saved image on page load
window.addEventListener("load", () => {
  const savedImage = localStorage.getItem("uploadedImage");
  if (savedImage) showPreview(savedImage, false);
});

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
  dropArea.addEventListener(event, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight drop area on drag
["dragenter", "dragover"].forEach(event => {
  dropArea.addEventListener(event, () => dropArea.classList.add("highlight"));
});
["dragleave", "drop"].forEach(event => {
  dropArea.addEventListener(event, () => dropArea.classList.remove("highlight"));
});

// Handle drop
dropArea.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// Handle manual file input
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) handleFile(file);

  // Reset input to allow same file selection again
  fileInput.value = "";
});

uploadIcon.addEventListener("click", () => {
  fileInput.click();
});

// Main file handler
function handleFile(file) {
  errorMsg.textContent = "";
  previewArea.innerHTML = "";

  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    errorMsg.textContent = "Invalid file type! Please upload JPG, PNG or GIF.";
    return;
  }

  // Show fake progress then upload
  simulateUpload(() => uploadFile(file));
}

// Upload: convert to Base64 and store in localStorage
function uploadFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    localStorage.setItem("uploadedImage", dataURL);
    showPreview(dataURL, false);
  };
  reader.readAsDataURL(file);
}

// Simulate upload progress
function simulateUpload(callback) {
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressBar.innerText = "0%";

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progress > 100) progress = 100;

    progressBar.style.width = progress + "%";
    progressBar.innerText = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        progressContainer.style.display = "none";
        callback();
      }, 400);
    }
  }, 200);
}

// Show image preview
function showPreview(input, isFile = true) {
  if (isFile) {
    const reader = new FileReader();
    reader.onload = e => showPreview(e.target.result, false);
    reader.readAsDataURL(input);
  } else {
    previewArea.innerHTML = "";
    const img = document.createElement("img");
    img.src = input;
    previewArea.appendChild(img);
  }
}
