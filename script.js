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

        // Intentar primero con configuración más flexible
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'  // Removido 'exact'
                }
            });
        } catch (initialError) {
            // Si falla, intentar sin especificar facingMode
            console.log('Intentando fallback...', initialError);
            stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
        }

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
        
        // Mensaje de error más amigable
        let errorMessage = 'Error al acceder a la cámara. ';
        if (err.name === 'NotAllowedError') {
            errorMessage += 'Por favor permite el acceso a la cámara en los permisos del navegador.';
        } else if (err.name === 'NotFoundError') {
            errorMessage += 'No se encontró ninguna cámara disponible.';
        } else {
            errorMessage += 'Por favor verifica que la cámara esté disponible y refresca la página.';
        }
        
        alert(errorMessage);
        
        // Restablecer botón
        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Generar QR';
        cameraBtn.onclick = startCamera;
    }
}
