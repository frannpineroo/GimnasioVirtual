document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('exercise-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('exercise-name').value.trim();
        const muscleGroup = document.getElementById('muscle-group').value;
        const equipment = document.getElementById('exercise-equipment').value;
        const description = document.getElementById('exercise-description').value.trim();

        // DEBUG: Imprimir todos los valores obtenidos
        console.log('=== VALORES DEL FORMULARIO ===');
        console.log('Nombre:', name);
        console.log('Grupo muscular:', muscleGroup);
        console.log('Equipo:', equipment);
        console.log('Descripción:', description);
        console.log('================================');

        // Validación mejorada
        if (!name || !muscleGroup || !equipment) {
            alert('Por favor completa los campos requeridos (*)');
            console.log('Validación falló:');
            console.log('- Nombre válido:', !!name);
            console.log('- Grupo muscular válido:', !!muscleGroup);
            console.log('- Equipo válido:', !!equipment);
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
            equipment: equipment,
            description: description || ""
        };

        console.log('=== DATOS A ENVIAR ===');
        console.log('Objeto completo:', exerciseData);
        console.log('JSON:', JSON.stringify(exerciseData));
        console.log('====================');

        fetch('http://localhost:8000/api/ejercicios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exerciseData)
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
            console.log('=== EJERCICIO CREADO ===');
            console.log('Respuesta:', data);
            console.log('=======================');
            
            alert('Ejercicio guardado exitosamente!');
            window.location.href = 'ejercicios.html';
        })
        .catch(error => {
            console.error('=== ERROR ===');
            console.error('Error completo:', error);
            console.error('=============');
            alert('Ocurrió un problema al guardar el ejercicio: ' + error.message);
        });
    });
});