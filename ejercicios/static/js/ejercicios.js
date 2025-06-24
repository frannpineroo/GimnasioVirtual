// LÓGICA ESPECÍFICA PARA LA PÁGINA DE EJERCICIOS

// Variables globales
let currentExerciseId = null;

// Inicialización de la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar ejercicios desde localStorage
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    
    // Renderizar la tabla de ejercicios
    renderExercisesTable(exercises);
    
    // Event listener para búsqueda
    document.getElementById('search-input').addEventListener('input', function() {
        filterExercises(exercises);
    });
    
    // Event listener para confirmar eliminación
    document.getElementById('confirm-delete').addEventListener('click', function() {
        deleteExercise(currentExerciseId, exercises);
    });
    
    // Event listener para cancelar eliminación
    document.getElementById('cancel-delete').addEventListener('click', closeModals);
});

// Función para renderizar la tabla de ejercicios
function renderExercisesTable(exercises) {
    const tbody = document.getElementById('exercises-table-body');
    
    if (exercises.length === 0) {
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
            <td>
                <div class="exercise-name">${exercise.name}</div>
                ${exercise.image ? `<div class="exercise-image-preview" data-image="${exercise.image}">
                    <i class="fas fa-image"></i> Ver imagen
                </div>` : ''}
            </td>
            <td>${capitalizeFirstLetter(exercise.muscleGroup)}</td>
            <td>${capitalizeFirstLetter(exercise.equipment)}</td>
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
    
    // Añadir event listeners a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentExerciseId = parseInt(this.dataset.id);
            showDeleteModal();
        });
    });
    
    // Añadir event listeners para ver imágenes
    document.querySelectorAll('.exercise-image-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            const imageData = this.getAttribute('data-image');
            showImageModal(imageData);
        });
    });
}

// Función para mostrar el modal de eliminación
function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
}

// Función para mostrar el modal de imagen
function showImageModal(imageData) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <div class="image-container">
                <img src="${imageData}" alt="Imagen del ejercicio">
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listener para cerrar
    modal.querySelector('.close-btn').addEventListener('click', function() {
        modal.remove();
    });
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Función para filtrar ejercicios
function filterExercises(exercises) {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredExercises = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm) ||
        exercise.muscleGroup.toLowerCase().includes(searchTerm) ||
        exercise.equipment.toLowerCase().includes(searchTerm) ||
        (exercise.description && exercise.description.toLowerCase().includes(searchTerm))
    );
    
    renderExercisesTable(filteredExercises);
}

// Función para eliminar un ejercicio
function deleteExercise(exerciseId, exercises) {
    const updatedExercises = exercises.filter(e => e.id !== exerciseId);
    localStorage.setItem('exercises', JSON.stringify(updatedExercises));
    closeModals();
    renderExercisesTable(updatedExercises);
}