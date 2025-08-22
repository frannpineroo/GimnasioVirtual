// LÓGICA ESPECÍFICA PARA LA PÁGINA DE EJERCICIOS

// Variables globales
let currentExerciseId = null;
let allExercises = [];

document.addEventListener('DOMContentLoaded', function () {
    getExercises();

    document.getElementById('search-input').addEventListener('input', function () {
        filterExercises(this.value);
    });

    document.getElementById('confirm-delete').addEventListener('click', function () {
        if (currentExerciseId) {
            deleteExercise(currentExerciseId);
        }
    });

    document.getElementById('cancel-delete').addEventListener('click', closeModals);
});

// GET: Obtener todos los ejercicios
function getExercises() {
    fetch('http://localhost:8000/api/ejercicios/') 
        .then(response => response.json())
        .then(data => {
            allExercises = data;
            renderExercisesTable(allExercises);
        })
        .catch(error => {
            console.error('Error al cargar ejercicios:', error);
        });
}

// POST: Crear un nuevo ejercicio
function createExercise(exerciseData) {
    console.log("Datos enviados:", exerciseData);
    fetch('http://localhost:8000/api/ejercicios/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseData)
    })
    .then(response => {
        console.log("Status:", response.status);
        if (!response.ok) {
            return response.text().then(text => {  
                console.log("Error response:", text);
                throw new Error('No se pudo crear el ejercicio');
            });
        }
        return response.json();
    })
    .then(data => {
        getExercises();
    })
    .catch(error => {
        console.error('Error al crear ejercicio:', error);
    });
}

// PUT: Actualizar un ejercicio existente
function updateExercise(id, exerciseData) {
    fetch(`http://localhost:8000/api/ejercicios/${id}/`, {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseData)
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo actualizar el ejercicio');
        return response.json();
    })
    .then(data => {
        getExercises();
    })
    .catch(error => {
        console.error('Error al actualizar ejercicio:', error);
    });
}

// DELETE: Eliminar un ejercicio
function deleteExercise(id) {
    fetch(`http://localhost:8000/api/ejercicios/${id}/`, {  
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo eliminar el ejercicio');
        closeModals();
        getExercises();
    })
    .catch(error => {
        console.error('Error al eliminar ejercicio:', error);
    });
}

function renderExercisesTable(exercises) {
    const tbody = document.getElementById('exercises-table-body');

    if (!exercises.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px;">
                    <i class="fas fa-dumbbell" style="font-size: 48px; color: #32CD32; margin-bottom: 15px;"></i>
                    <h3>No hay ejercicios registrados</h3>
                    <p>Comienza agregando tu primer ejercicio</p>
                    <a href="nuevo-ejercicio.html" class="btn btn-white" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Agregar primer ejercicio
                    </a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = exercises.map(exercise => `
        <tr>
            <td>${exercise.name}</td>
            <td>${capitalizeFirstLetter(exercise.muscle_group)}</td>
            <td>${capitalizeFirstLetter(exercise.equipment || '-')}</td>
            <td>${exercise.description || '-'}</td>
            <td class="actions-cell">
                <a href="nuevo-ejercicio.html?id=${exercise.id}" class="action-btn edit-btn" title="Editar ejercicio">
                    <i class="fas fa-pen"></i>
                </a>
                <button class="action-btn delete-btn" data-id="${exercise.id}" title="Eliminar ejercicio">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentExerciseId = parseInt(this.dataset.id);
            showDeleteModal();
        });
    });
}

function filterExercises(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allExercises.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.muscle_group.toLowerCase().includes(term) ||
        (e.equipment && e.equipment.toLowerCase().includes(term)) ||
        (e.description && e.description.toLowerCase().includes(term))
    );
    renderExercisesTable(filtered);
}

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
}