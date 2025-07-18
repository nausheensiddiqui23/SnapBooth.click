const video = document.getElementById('video');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const strip = document.getElementById('photo-strip');
const finalCanvas = document.getElementById('final-canvas');
const filterSelect = document.getElementById('filters');
// Apply selected filter to the video stream
filterSelect.addEventListener('change', () => {
  video.style.filter = filterSelect.value;
});

let photoCount = 0;
const photos = [];

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    console.error("Webcam Error: ", err);
});
captureBtn.addEventListener('click', () => {
  if (photoCount >= 4) {
    alert("Max 4 photos taken! Click 'Download Strip' to save.");
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
ctx.filter = filterSelect.value;
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
const filterType = filterSelect.value;
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let data = imageData.data;

if (filterType === 'glow') {
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = data[i] + 15;  // Red
    data[i + 1] = data[i + 1] + 10; // Green
    data[i + 2] = data[i + 2] + 20; // Blue
  }
}

if (filterType === 'peach') {
  for (let i = 0; i < data.length; i += 4) {
    data[i]     += 30;  // Add red tone
    data[i + 1] += 15;  // Slight green
    data[i + 2] -= 10;  // Reduce blue
  }
}

if (filterType === 'smooth') {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i]     = avg + 20; // R
    data[i + 1] = avg + 25; // G
    data[i + 2] = avg + 30; // B
  }
}

ctx.putImageData(imageData, 0, 0);



  // Grayscale effect
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
    imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);
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
downloadBtn.addEventListener('click', () => {
    const width = photos[0].width;
    const height = photos[0].height;
    finalCanvas.width = width;
    finalCanvas.height = height * 4;
    const ctx = finalCanvas.getContext('2d');
    photos.forEach((photo,i) => {
        ctx.drawImage(photo, 0, i * height, width, height);
    });

    const link= document.createElement('a');
    link.download = 'photobooth-strip.png';
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
});