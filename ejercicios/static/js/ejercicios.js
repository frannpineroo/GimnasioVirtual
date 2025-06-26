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

function getExercises() {
    fetch('/api/ejercicios/')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener ejercicios');
            return response.json();
        })
        .then(data => {
            allExercises = data;
            renderExercisesTable(allExercises);
        })
        .catch(error => {
            console.error('Error al cargar ejercicios:', error);
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

function deleteExercise(id) {
    fetch(`/api/ejercicios/${id}/`, {
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

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
}