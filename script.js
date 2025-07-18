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