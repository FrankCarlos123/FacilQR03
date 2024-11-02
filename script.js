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

        // Primero, enumerar los dispositivos disponibles
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // Si hay más de una cámara, intentar usar la última (generalmente la trasera)
        let constraints;
        if (videoDevices.length > 1) {
            constraints = {
                video: {
                    deviceId: { exact: videoDevices[videoDevices.length - 1].deviceId },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };
        } else {
            // Si solo hay una cámara, usar configuración básica
            constraints = {
                video: {
                    facingMode: { exact: 'environment' },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };
        }

        try {
            // Intentar con las restricciones específicas primero
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (specificError) {
            console.log('Error con configuración específica, intentando configuración genérica...', specificError);
            
            // Si falla, intentar con configuración más básica
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
        }
        
        camera.srcObject = stream;

        // Esperar a que el video esté listo
        await new Promise((resolve) => {
            camera.onloadedmetadata = () => {
                camera.play()
                    .then(resolve)
                    .catch(error => {
                        console.error('Error al reproducir el video:', error);
                        throw error;
                    });
            };
        });

        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Capturar';
        cameraBtn.onclick = captureImage;

    } catch (err) {
        console.error('Error detallado al acceder a la cámara:', err);
        
        // Mostrar un mensaje de error más específico
        let errorMessage = 'Error al acceder a la cámara. ';
        if (err.name === 'NotAllowedError') {
            errorMessage += 'Por favor permite el acceso a la cámara en los permisos del navegador.';
        } else if (err.name === 'NotFoundError') {
            errorMessage += 'No se encontró la cámara trasera.';
        } else if (err.name === 'NotReadableError') {
            errorMessage += 'La cámara está siendo usada por otra aplicación.';
        } else {
            errorMessage += 'Por favor, cierra otras aplicaciones que puedan estar usando la cámara y refresca la página.';
        }
        
        alert(errorMessage);
        
        const cameraBtn = document.querySelector('.camera-btn');
        cameraBtn.textContent = 'Generar QR';
        cameraBtn.onclick = startCamera;
    }
}
