const video = document.getElementById('video');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const strip = document.getElementById('photo-strip');
const finalCanvas = document.getElementById('final-canvas');
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
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);


  
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