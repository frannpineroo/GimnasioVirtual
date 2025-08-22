// FUNCIONES COMUNES PARA TODAS LAS PÁGINAS

// Función para cerrar modales
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Event listeners comunes para cerrar modales
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modales con los botones de cerrar
    const closeButtons = document.querySelectorAll('.close-btn, .btn-cancel, #cancel-delete');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
});

// Función utilitaria para capitalizar strings
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Manejar el menú activo
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');

    if (exerciseId) {
        fetch(`/api/entidades/${exerciseId}/`)
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar el ejercicio');
                return response.json();
            })
            .then(exercise => {
                document.getElementById('exercise-name').value = exercise.name;
                document.getElementById('muscle-group').value = exercise.muscle_group;
                document.getElementById('exercise-equipment').value = exercise.equipment || '';
                document.getElementById('exercise-description').value = exercise.description || '';

                if (exercise.image) {
                    const imagePreview = document.getElementById('image-preview');
                    imagePreview.innerHTML = `
                        <img src="${exercise.image}" alt="Previsualización de imagen">
                        <button type="button" class="btn btn-white btn-sm" id="remove-image">
                            <i class="fas fa-times"></i> Eliminar imagen
                        </button>
                    `;

                    document.getElementById('remove-image').addEventListener('click', function () {
                        document.getElementById('exercise-image').value = '';
                        imagePreview.innerHTML = '';
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar el ejercicio:', error);
            });
    }
});