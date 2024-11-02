document.addEventListener('DOMContentLoaded', function() {
    const cameraBtn = document.querySelector('.camera-btn');
    cameraBtn.onclick = initCamera;
});

let qrcode = null;
let countdownInterval = null;
let stream = null;

async function initCamera() {
    try {
        // Obtener lista de cámaras disponibles
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // Si hay múltiples cámaras, mostrar diálogo de selección
        if (videoDevices.length > 1) {
            let cameraSection = document.querySelector('.camera-section');
            
            // Crear el selector de cámara si no existe
            let cameraSelect = document.getElementById('camera-select');
            if (!cameraSelect) {
                cameraSelect = document.createElement('select');
                cameraSelect.id = 'camera-select';
                cameraSelect.className = 'camera-select';
                // Estilos para el selector
                cameraSelect.style.width = '100%';
                cameraSelect.style.padding = '8px';
                cameraSelect.style.marginBottom = '10px';
                cameraSelect.style.borderRadius = '6px';
                cameraSelect.style.backgroundColor = '#1E1E1E';
                cameraSelect.style.color = '#FFFFFF';
                cameraSelect.style.border = '1px solid #333333';
            }
            
            cameraSelect.innerHTML = '';
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Cámara ${index + 1}`;
                cameraSelect.appendChild(option);
            });
            
            // Agregar el selector al principio de camera-section
            if (!document.getElementById('camera-select')) {
                cameraSection.insertBefore(cameraSelect, cameraSection.firstChild);
            }
            
            // Evento de cambio de cámara
            cameraSelect.onchange = () => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                startCamera(cameraSelect.value);
            };
            
            // Iniciar con la primera cámara
            startCamera(videoDevices[0].deviceId);
        } else {
            // Si solo hay una cámara, iniciar directamente
            startCamera();
        }
    } catch (err) {
        console.error('Error al inicializar la cámara:', err);
        alert('Error al acceder a la cámara. Por favor, verifica los permisos y refresca la página.');
    }
}

async function startCamera(deviceId = null) {
    try {
        // Limpiar stream anterior si existe
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        // Crear o obtener elemento de video
        let camera = document.getElementById('camera');
        if (!camera) {
            camera = document.createElement('video');
            camera.id = 'camera';
            camera.autoplay = true;
            camera.playsInline = true; // Importante para iOS
            camera.style.width = '100%';
            camera.style.borderRadius = '6px';
            camera.style.marginBottom = '10px';
            document.querySelector('.camera-section').appendChild(camera);
        }

        const capturedImage = document.getElementById('captured-image');
        capturedImage.style.display = 'none';
        camera.style.display = 'block';

        // Configurar restricciones de video
        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        // Si se especifica un deviceId, usarlo
        if (deviceId) {
            constraints.video.deviceId = { exact: deviceId };
        }

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        camera.srcObject = stream;

        // Esperar a que el video esté listo
        await new Promise((resolve) => {
            camera.onloadedmetadata = () => {
                camera.play().then(resolve);
            };
        });

        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Capturar';
        cameraBtn.onclick = captureImage;

    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        alert('Error al acceder a la cámara. Por favor:\n1. Verifica los permisos de la cámara\n2. Asegúrate de que otra aplicación no esté usando la cámara\n3. Refresca la página');
        
        // Restablecer botón
        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Generar QR';
        cameraBtn.onclick = initCamera;
    }
}

// ... El resto del código permanece igual ...
