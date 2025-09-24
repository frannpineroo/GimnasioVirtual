document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('routine-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('routine-name').value.trim();
        const description = document.getElementById('routine-description').value.trim();
        const timeWeek = document.getElementById('routine-weeks').value;
        const isTemplate = document.getElementById('is-template') ? document.getElementById('is-template').checked : false;

        // DEBUG: Imprimir todos los valores obtenidos
        console.log('=== VALORES DEL FORMULARIO ===');
        console.log('Nombre:', name);
        console.log('Descripción:', description);
        console.log('Duración en semanas:', timeWeek);
        console.log('Es plantilla:', isTemplate);
        console.log('================================');

        // Validación mejorada
        if (!name || !timeWeek) {
            alert('Por favor completa los campos requeridos (*)');
            console.log('Validación falló:');
            console.log('- Nombre válido:', !!name);
            console.log('- Duración válida:', !!timeWeek);
            return;
        }

        // Verificar que time_week sea un número válido
        if (isNaN(timeWeek) || timeWeek <= 0) {
            alert('Por favor ingresa una duración válida en semanas');
            console.error('Duración inválida:', timeWeek);
            return;
        }

        const routineData = {
            name: name,
            description: description || "",
            time_week: parseInt(timeWeek),
            is_template: isTemplate
        };

        console.log('=== DATOS A ENVIAR ===');
        console.log('Objeto completo:', routineData);
        console.log('JSON:', JSON.stringify(routineData));
        console.log('====================');

        fetch('http://localhost:8000/api/rutinas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(routineData)
        })
        .then(response => {
            console.log('=== RESPUESTA DEL SERVIDOR ===');
            console.log('Status:', response.status);
            console.log('Status Text:', response.statusText);
            console.log('==============================');
            
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error response body:', text);
                    throw new Error(`Error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('=== RUTINA CREADA ===');
            console.log('Respuesta:', data);
            console.log('=======================');
            
            alert('Rutina guardada exitosamente!');
            window.location.href = 'rutinas.html';
        })
        .catch(error => {
            console.error('=== ERROR ===');
            console.error('Error completo:', error);
            console.error('=============');
            alert('Ocurrió un problema al guardar la rutina: ' + error.message);
        });
    });
});