// ... resto del código anterior ...

async function startCamera() {
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
            camera.playsInline = true;
            camera.style.width = '100%';
            camera.style.borderRadius = '8px';
            camera.style.marginBottom = '15px';
            document.querySelector('.camera-section').appendChild(camera);
        }

        const capturedImage = document.getElementById('captured-image');
        capturedImage.style.display = 'none';
        camera.style.display = 'block';

        // Configurar solo para cámara trasera
        const constraints = {
            video: {
                facingMode: { exact: "environment" },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

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
        alert('Error al acceder a la cámara. Por favor verifica los permisos de la cámara y refresca la página.');
        
        // Restablecer botón
        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Generar QR';
        cameraBtn.onclick = startCamera;
    }
}

// ... resto del código sigue igual ...
