document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('exercise-form');
    const cancelBtn = document.getElementById('cancel-btn');

    // Función para obtener el token CSRF (NECESARIO para Django)
    function getCSRFToken() {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('exercise-name').value.trim();
        const muscleGroup = document.getElementById('muscle-group').value;
        const description = document.getElementById('exercise-description').value.trim();

        // Validación mejorada
        if (!name || !muscleGroup) {
            alert('Por favor completa los campos requeridos (*)');
            return;
        }

        // Verificar que muscle_group no esté vacío
        if (muscleGroup === "" || muscleGroup === null || muscleGroup === undefined) {
            alert('Por favor selecciona un grupo muscular válido');
            console.error('Grupo muscular inválido:', muscleGroup);
            return;
        }

        const exerciseData = {
            name: name,
            muscle_group: muscleGroup,
            description: description || ""
        };

        // **CORREGIDO: Usar ruta relativa para producción**
        fetch('/api/ejercicios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken() // **AGREGADO: CSRF Token**
            },
            body: JSON.stringify(exerciseData)
        })
        .then(response => {
            
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            
            alert('✅ Ejercicio guardado exitosamente!');
            // **CORREGIDO: Redirigir a la página de ejercicios**
            window.location.href = '/entrenador/ejercicios/';
        })
        .catch(error => {
            console.error('Error completo:', error);
            alert('❌ Ocurrió un problema al guardar el ejercicio: ' + error.message);
        });
    });

    // **AGREGADO: Manejar el botón cancelar**
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            window.location.href = '/entrenador/ejercicios/';
        });
    }
});