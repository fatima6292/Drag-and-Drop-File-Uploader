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

// Prevent default behavior for drag & drop
["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
  dropArea.addEventListener(event, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight drop area
["dragenter", "dragover"].forEach(event => {
  dropArea.addEventListener(event, () => dropArea.classList.add("highlight"));
});
["dragleave", "drop"].forEach(event => {
  dropArea.addEventListener(event, () => dropArea.classList.remove("highlight"));
});

// Handle drop file
dropArea.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0]; // get droped file
  if (file) 
    handleFile(file);
});

// Handle manual file input
fileInput.addEventListener("change", e => {
  const file = e.target.files[0]; // get manual file
  if (file) 
    handleFile(file);
});

// Click drop area to open file input
dropArea.addEventListener("click", () => fileInput.click());

// Main function to handle file
function handleFile(file) {
  errorMsg.textContent = "";
  previewArea.innerHTML = "";

  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    errorMsg.textContent = "Invalid file type! Please upload an image (JPG, PNG, GIF).";
    return;
  }

  // Show fake upload progress
  simulateUpload(() => uploadFile(file));
}

// Upload file in local storage
function uploadFile(file) {
  const reader = new FileReader(); // browser api-->use to read temporary browser stored file
  reader.onload = function(e) {// onload trigger when ile eading complete
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

    if (progress >= 100) 
    {
      clearInterval(interval);
      setTimeout(() => {
        progressContainer.style.display = "none";

        callback();
      }, 400);
    }
  }, 200);
}

// Show preview function
function showPreview(input, isFile = true) {
  if (isFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      showPreview(e.target.result, false);
    };
    reader.readAsDataURL(input);
  } else {
    previewArea.innerHTML = "";
    const img = document.createElement("img");
    img.src = input;
    previewArea.appendChild(img);
  }
}
