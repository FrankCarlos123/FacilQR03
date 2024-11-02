document.addEventListener('DOMContentLoaded', function() {
    const cameraBtn = document.querySelector('.camera-btn');
    cameraBtn.onclick = startCamera;
});

let qrcode = null;
let countdownInterval = null;
let stream = null;

async function startCamera() {
    try {
        let camera = document.getElementById('camera');
        if (!camera) {
            camera = document.createElement('video');
            camera.id = 'camera';
            camera.autoplay = true;
            camera.playsInline = true;
            camera.style.width = '100%';
            camera.style.borderRadius = '8px';
            camera.style.marginBottom = '15px';
            document.querySelector('.camera-section').appendChild(camera);
        }

        const capturedImage = document.getElementById('captured-image');
        capturedImage.style.display = 'none';
        camera.style.display = 'block';

        stream = await navigator.mediaDevices.getUserMedia({ 
            video: true
        });
        
        camera.srcObject = stream;

        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Capturar';
        cameraBtn.onclick = captureImage;

    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        alert('Error al acceder a la cámara. Por favor intenta de nuevo.');
    }
}

async function captureImage() {
    const camera = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const capturedImage = document.getElementById('captured-image');

    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(camera, 0, 0);

    capturedImage.src = canvas.toDataURL('image/jpeg', 1.0);
    capturedImage.style.display = 'block';
    camera.style.display = 'none';

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    const cameraBtn = document.querySelector('.camera-btn');
    cameraBtn.textContent = 'Generar QR';
    cameraBtn.onclick = startCamera;

    processImage(canvas);
}
