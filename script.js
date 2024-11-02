document.addEventListener('DOMContentLoaded', function() {
    const cameraBtn = document.querySelector('.camera-btn');
    const clearBtn = document.querySelector('.clear-btn');
    cameraBtn.onclick = startCamera;
    clearBtn.onclick = clearAll;
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

        // Intentar primero con la cámara trasera
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                }
            });
        } catch (error) {
            // Si falla, intentar con cualquier cámara
            stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
        }
        
        camera.srcObject = stream;

        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Capturar';
        cameraBtn.onclick = captureImage;

    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        alert('Error al acceder a la cámara. Por favor intenta de nuevo.');
    }
}

function clearAll() {
    const capturedImage = document.getElementById('captured-image');
    if (capturedImage) {
        capturedImage.style.display = 'none';
        capturedImage.src = '';
    }

    const camera = document.getElementById('camera');
    if (camera) {
        camera.style.display = 'none';
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('qr-text').textContent = '';
    document.getElementById('countdown').textContent = '';

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    const cameraBtn = document.querySelector('.camera-btn');
    cameraBtn.textContent = 'Generar QR';
    cameraBtn.onclick = startCamera;
}

// El resto del código permanece igual...
