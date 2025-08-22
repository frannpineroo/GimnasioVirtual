document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('exercise-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('exercise-name').value.trim();
        const muscleGroup = document.getElementById('muscle-group').value;
        const equipment = document.getElementById('exercise-equipment').value;
        const description = document.getElementById('exercise-description').value.trim();

        if (!name || !muscleGroup || !equipment) {
            alert('Por favor completa los campos requeridos (*)');
            return;
        }

        // Objeto con equipment como array
        const exerciseData = {
            name: name,
            muscle_group: muscleGroup,
            equipment: [equipment],
            description: description
        };

        console.log('Datos enviados:', JSON.stringify(exerciseData));

        fetch('http://localhost:8000/api/ejercicios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exerciseData)
        })
        .then(response => {
            console.log('Status:', response.status);
            if (!response.ok) {
                return response.text().then(text => {
                    console.log('Error response:', text);
                    throw new Error('Error al guardar el ejercicio');
                });
            }
            return response.json();
        })
        .then(() => {
            alert('Ejercicio guardado exitosamente!');
            window.location.href = 'ejercicios.html';
        })
        .catch(error => {
            console.error('Error al guardar ejercicio:', error);
            alert('Ocurrió un problema al guardar el ejercicio.');
        });
    });
});