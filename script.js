const dropArea = document.getElementById("dropArea");
const p = dropArea.querySelector("p");
const fileInput = document.getElementById("fileInput");
const uploadIcon = document.getElementById("uploadIcon");
const previewArea = document.getElementById("previewArea");
const errorMsg = document.getElementById("errorMsg");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const validTypes = ["image/jpeg","image/png","image/gif"];

// Load saved images
window.addEventListener("load", () => {
  const savedImages = JSON.parse(localStorage.getItem("uploadedImages")) || [];
  if(savedImages.length === 0) previewArea.innerHTML = "<p>No images uploaded yet</p>";
  savedImages.forEach(img => showPreview(img,false));
});

// Prevent default drag behaviors
["dragenter","dragover","dragleave","drop"].forEach(e=>{
  dropArea.addEventListener(e, ev=> { ev.preventDefault(); ev.stopPropagation(); });
});

// Drag & hover highlight with tilt
["dragenter","dragover"].forEach(e=>{
  dropArea.addEventListener(e,()=>{
    dropArea.classList.add("highlight-drag");
    dropArea.style.transform="scale(1.07) rotateX(8deg) rotateY(-8deg)";
  });
});

["dragleave","drop"].forEach(e=>{
  dropArea.addEventListener(e,()=>{
    dropArea.classList.remove("highlight-drag");
    dropArea.style.transform="scale(1) rotateX(0deg) rotateY(0deg)";
    const p = dropArea.querySelector("p");
    if(p) 
      p.textContent="Drag & Drop your file here";
  });
});

// Hover tilt
dropArea.addEventListener("mouseenter",()=>dropArea.style.transform="scale(1.05) rotateX(6deg) rotateY(-6deg)");
dropArea.addEventListener("mouseleave",()=>dropArea.style.transform="scale(1) rotateX(0deg) rotateY(0deg)");

// Upload Icon animation
uploadIcon.addEventListener("mouseenter",()=>uploadIcon.style.transform="scale(1.2) rotateZ(15deg)");
uploadIcon.addEventListener("mouseleave",()=>uploadIcon.style.transform="scale(1) rotateZ(0deg)");

// Drag file
dropArea.addEventListener("dragover", e=>{
  if(p) 
      p.textContent="Dragging file..";
});
dropArea.addEventListener("drop", e=>{
  const file = e.dataTransfer.files[0];
  if(p) 
      p.textContent="Droped file";
  if(file) 
    handleFile(file);
});

// Manual file upload
fileInput.addEventListener("change", e=>{ 
  const file = e.target.files[0];
  if(file) handleFile(file);
  fileInput.value="";
});

// File Handler
function handleFile(file){
  errorMsg.textContent="";
  if(!validTypes.includes(file.type)){
    errorMsg.textContent="Invalid file type! Upload JPG, PNG, or GIF.";
    if(p) 
      p.textContent="Drag & Drop your file here";
    return;
  }
  simulateUpload(()=>uploadFile(file));
}


// Upload & store images
function uploadFile(file){
  const reader = new FileReader();
  reader.onload = e=>{
    const dataURL = e.target.result;
    let images = JSON.parse(localStorage.getItem("uploadedImages")) || [];
    images.push(dataURL);
    localStorage.setItem("uploadedImages",JSON.stringify(images));
    showPreview(dataURL,false);
  }
  reader.readAsDataURL(file);
}

// Simulate progress bar
function simulateUpload(callback){
  progressContainer.style.display="block";
  progressBar.style.width="0%";
  let progress=0;
  const interval = setInterval(()=>{
    progress+=10;
    if(progress>100) progress=100;
    progressBar.style.width=progress+"%";
    progressBar.textContent=progress+"%";
    if(progress>=100){
      clearInterval(interval);
      setTimeout(()=>{
        progressContainer.style.display="none";
        if(p) 
          p.textContent="Drag & Drop your file here";
        callback();
      },400);
    }
  },200);
}

// Show Preview
function showPreview(input, isFile = true) // isFile -> file obj ha ya base64 mla
{
  // In case drag drop (file obj --> need to convert into base64 so we read file )
  if (isFile) {
    const reader = new FileReader();
    reader.onload = e => showPreview(e.target.result, false);
    reader.readAsDataURL(input);
  }
   // in case of file uploaded from local storage aleady in base
   else {
    const p = previewArea.querySelector("p");
    if (p) p.remove();

    const container = document.createElement("div");
    container.classList.add("preview-box");
    container.style.opacity = 0;          
    container.style.transform = "scale(0.6)";

    const img = document.createElement("img");
    img.src = input;
    container.appendChild(img);

   const delBtn = document.createElement("button");
    delBtn.classList.add("remove-btn");

    const icon = document.createElement("img");
    icon.src = "icons/delete.png";
    icon.style.width = "15px";
    icon.style.height = "15px";
    icon.style.pointerEvents = "none";
    delBtn.appendChild(icon);    

    // STOP PROPAGATION → container click will NOT trigger
    delBtn.addEventListener("click", (e) => {
    e.stopPropagation();     // prevent expand/collapse click
  deleteImage(input, container);
});

container.appendChild(delBtn);

    previewArea.appendChild(container);

    // small delay to trigger CSS transition
    setTimeout(() => {
      container.style.opacity = 1;
      container.style.transform = "scale(1)";
      updateStack();  // position all images
    }, 50);

    // Click handler for expand/collapse
    container.addEventListener("click", e => {
      const isActive = container.classList.contains("active");
      const boxes = previewArea.querySelectorAll(".preview-box");

      // if clicked image is not expanded yet
      if (!isActive) {

        // To EXPAND clicked image:
        boxes.forEach((box, index) => {
          // store original state of ith peview-box if not stored
          if (!box.dataset.origWidth) {
            box.dataset.origWidth = box.offsetWidth;
            box.dataset.origHeight = box.offsetHeight;
            box.dataset.origTransform = box.style.transform || "";
            box.dataset.origZ = box.style.zIndex || 0;
            box.dataset.origTop = box.style.top || "";
            box.dataset.origLeft = box.style.left || "";
          }
          // if current preview-box was not clicked
          if (box !== container) {
            // shrink other images slightly
            box.style.width = "150px";
            box.style.height = "150px";
            box.style.transform = `translateX(${index * 10}px)`; 
            box.style.zIndex = index;
            box.style.top = "";
            box.style.left = "";
          } 
          // if current preview-box is clicked
          else {
            // center clicked image
            const previewWidth = previewArea.clientWidth;
            const previewHeight = previewArea.clientHeight;
            const expandedWidth = 300;
            const expandedHeight = 200;
            const centerX = (previewWidth - expandedWidth) / 2;
            const centerY = (previewHeight - expandedHeight) / 2;

            box.classList.add("active");
            box.style.width = expandedWidth + "px";
            box.style.height = expandedHeight + "px";
            box.style.top = centerY + "px";
            box.style.left = centerX + "px";
            box.style.transform = "none";
            box.style.zIndex = 999;
          }
        });
      } 
      // if clicked image is explaned/ centered
      else {
        // COLLAPSE back to original stack
        container.classList.remove("active");
        boxes.forEach((box, index) => {
          box.style.width = box.dataset.origWidth + "px";
          box.style.height = box.dataset.origHeight + "px";
          box.style.transform = box.dataset.origTransform;
          box.style.top = box.dataset.origTop;
          box.style.left = box.dataset.origLeft;
          box.style.zIndex = box.dataset.origZ;
        });
      }
    });
  }
}

// update stack
function updateStack() {
  const boxes = previewArea.querySelectorAll(".preview-box");
  boxes.forEach((box, i) => {
    if (!box.classList.contains("active")) {
      box.style.transform = `translateX(${i * 30}px)`; 
      box.style.zIndex = i;
      box.style.top = "";
      box.style.left = "";
    }
  });
}


// Delete Image
function deleteImage(src, container) {
  container.remove();

  // Update localStorage
  let images = JSON.parse(localStorage.getItem("uploadedImages")) || [];
  images = images.filter(img => img !== src);
  localStorage.setItem("uploadedImages", JSON.stringify(images));

  // Get remaining boxes
  const boxes = previewArea.querySelectorAll(".preview-box");

  if (boxes.length === 0) {
    previewArea.innerHTML = "<p>No images uploaded yet</p>";
  } else {
    // Reset all boxes
    boxes.forEach((box, i) => {
      box.classList.remove("active");
      box.style.top = "";
      box.style.left = "";
      box.style.width = box.dataset.origWidth + "px";
      box.style.height = box.dataset.origHeight + "px";
      box.style.transform = `translateX(${i * 30}px)`; // tight stack
      box.style.zIndex = i;
    });
  }
}


// Toggle active card
function toggleActive(box){
  const boxes = previewArea.querySelectorAll(".preview-box");
  boxes.forEach(b => {
    if(b!==box) b.classList.remove("active");
    else b.classList.toggle("active");
  });
  updateStack();
}

