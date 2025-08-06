const video = document.getElementById('video');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const strip = document.getElementById('photo-strip');
const finalCanvas = document.getElementById('final-canvas');
const filterSelect = document.getElementById('filters');

let photoCount = 0;
const photos = [];

// Apply live filter on video preview (only for CSS filters like grayscale(100%))
filterSelect.addEventListener('change', () => {
  const val = filterSelect.value;
  if (val.includes('(')) {
    video.style.filter = val; // CSS-based live filter
  } else {
    video.style.filter = 'none'; // Reset CSS filter when switching to pixel-based
  }
});

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Webcam Error: ", err);
    const errorMsg = document.createElement('p');
    errorMsg.textContent = "Could not access your webcam. Please allow camera permissions.";
    errorMsg.style.color = "red";
    document.body.appendChild(errorMsg);
  });

// Capture photo
captureBtn.addEventListener('click', () => {
  if (photoCount >= 4) {
    alert("Max 4 photos taken! Click 'Download Strip' to save.");
    return;
  }

  // Flash effect
  document.body.classList.add('flash-active');
setTimeout(() => {
  document.body.classList.remove('flash-active');
}, 500);


  // Reset CSS filter if using pixel-based
  const filterType = filterSelect.value;
  if (!filterType.includes('(')) {
    video.style.filter = 'none';
  }

  // Create canvas and draw video frame
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Pixel-based filter processing
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  if (filterType === 'glow') {
    for (let i = 0; i < data.length; i += 4) {
      data[i]     += 15; // Red
      data[i + 1] += 10; // Green
      data[i + 2] += 20; // Blue
    }
  }

  if (filterType === 'peach') {
    for (let i = 0; i < data.length; i += 4) {
      data[i]     += 30;
      data[i + 1] += 15;
      data[i + 2] -= 10;
    }
  }

  if (filterType === 'smooth') {
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i]     = avg + 20;
      data[i + 1] = avg + 25;
      data[i + 2] = avg + 30;
    }
  }

  if (filterType === 'grayscale(100%)') {
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Add captured photo to the strip
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  img.classList.add('photo');
  strip.appendChild(img);

  photos.push(canvas);
  photoCount++;

  if (photoCount === 4) {
    downloadBtn.disabled = false;
  }
});

// Download the photo strip
downloadBtn.addEventListener('click', () => {
  const width = photos[0].width;
  const height = photos[0].height;
  finalCanvas.width = width;
  finalCanvas.height = height * 4;

  const ctx = finalCanvas.getContext('2d');
  photos.forEach((photo, i) => {
    ctx.drawImage(photo, 0, i * height, width, height);
  });

  const link = document.createElement('a');
  link.download = 'photobooth-strip.png';
  link.href = finalCanvas.toDataURL('image/png');
  link.click();
  
});
gsap.from("#heading", {
  y: -50,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out"
});
gsap.from("#video", {
  opacity: 0,
  scale: 0.8,
  duration: 1.2,
  delay: 0.5,
  ease: "power2.out"
});
