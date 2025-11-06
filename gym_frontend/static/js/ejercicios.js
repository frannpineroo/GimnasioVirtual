// LÓGICA ESPECÍFICA PARA LA PÁGINA DE EJERCICIOS (versión defensiva)

// Variables globales
let currentExerciseId = null;
let allExercises = [];

// Función para capitalizar la primera letra 
function capitalizeFirstLetter(string) {
    if (!string || typeof string !== 'string') {
        return '-'; // Devolver guión si es null/undefined
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', function () {
    // Comprueba existencia y añade handlers de forma segura
    getExercises();

    const confirmDelete = document.getElementById('confirm-delete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', function () {
            if (currentExerciseId) {
                deleteExercise(currentExerciseId);
            }
        });
    } else {
        console.warn("Elemento #confirm-delete no encontrado en el DOM.");
    }

    const cancelDelete = document.getElementById('cancel-delete');
    if (cancelDelete) {
        cancelDelete.addEventListener('click', closeModals);
    } else {
        console.warn("Elemento #cancel-delete no encontrado en el DOM.");
    }
});

// GET: Obtener todos los ejercicios
function getExercises() {
    fetch('http://localhost:8000/api/ejercicios/')
        .then(response => {
            if (!response.ok) throw new Error('Respuesta no OK: ' + response.status);
            return response.json();
        })
        .then(data => {
            allExercises = Array.isArray(data) ? data : [];
            renderExercisesTable(allExercises);
        })
        .catch(error => {
            // opcional: render vacío
            renderExercisesTable([]);
        });
}

// POST: Crear un nuevo ejercicio
function createExercise(exerciseData) {
    fetch('http://localhost:8000/api/ejercicios/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseData)
    })
    .then(response => {
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
    if (!tbody) {
        console.warn("Elemento #exercises-table-body no encontrado en el DOM.");
        return;
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
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
            <td>${exercise.name || '-'}</td>
            <td>${capitalizeFirstLetter(exercise.muscle_group)}</td>
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

    const deleteBtns = document.querySelectorAll('.delete-btn');
    if (deleteBtns && deleteBtns.length) {
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                currentExerciseId = parseInt(this.dataset.id);
                showDeleteModal();
            });
        });
    }
}

function filterExercises(searchTerm) {
    const term = (searchTerm || '').toLowerCase();
    const filtered = allExercises.filter(e =>
        (e.name && e.name.toLowerCase().includes(term)) ||
        (e.muscle_group && e.muscle_group.toLowerCase().includes(term)) ||
        (e.equipment && e.equipment.toLowerCase().includes(term)) ||
        (e.description && e.description.toLowerCase().includes(term))
    );
    renderExercisesTable(filtered);
}

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (!modal) {
        console.warn("Elemento #delete-modal no encontrado.");
        return;
    }
    modal.classList.add('active');
}

function closeModals() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}
