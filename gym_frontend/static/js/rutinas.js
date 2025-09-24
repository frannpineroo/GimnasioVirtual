// LÓGICA ESPECÍFICA PARA LA PÁGINA DE RUTINAS

// Variables globales
let currentRoutineId = null;
let allRoutines = [];

// Función para capitalizar la primera letra
function capitalizeFirstLetter(string) {
    if (!string || typeof string !== 'string') {
        return '-'; // Devolver guión si es null/undefined
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

document.addEventListener('DOMContentLoaded', function () {
    getRutinas();

    document.getElementById('search-input').addEventListener('input', function () {
        filterRutinas(this.value);
    });

    document.getElementById('confirm-delete').addEventListener('click', function () {
        if (currentRoutineId) {
            deleteRutina(currentRoutineId);
        }
    });

    document.getElementById('cancel-delete').addEventListener('click', closeModals);
});

// GET: Obtener todas las rutinas
function getRutinas() {
    fetch('http://localhost:8000/api/rutinas/') 
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos de la API:', data);
            if (data.length > 0) {
                console.log('Primera rutina:', data[0]);
            }
            allRoutines = data;
            renderRutinasTable(allRoutines);
        })
        .catch(error => {
            console.error('Error al cargar rutinas:', error);
        });
}

// POST: Crear una nueva rutina
function createRutina(rutinaData) {
    console.log("Datos enviados:", rutinaData);
    fetch('http://localhost:8000/api/rutinas/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rutinaData)
    })
    .then(response => {
        console.log("Status:", response.status);
        if (!response.ok) {
            return response.text().then(text => {  
                console.log("Error response:", text);
                throw new Error('No se pudo crear la rutina');
            });
        }
        return response.json();
    })
    .then(data => {
        getRutinas();
    })
    .catch(error => {
        console.error('Error al crear rutina:', error);
    });
}

// PUT: Actualizar una rutina existente
function updateRutina(id, rutinaData) {
    fetch(`http://localhost:8000/api/rutinas/${id}/`, {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rutinaData)
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo actualizar la rutina');
        return response.json();
    })
    .then(data => {
        getRutinas();
    })
    .catch(error => {
        console.error('Error al actualizar rutina:', error);
    });
}

// DELETE: Eliminar una rutina
function deleteRutina(id) {
    fetch(`http://localhost:8000/api/rutinas/${id}/`, {  
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo eliminar la rutina');
        closeModals();
        getRutinas();
    })
    .catch(error => {
        console.error('Error al eliminar rutina:', error);
    });
}

function renderRutinasTable(rutinas) {
    const tbody = document.getElementById('routines-table-body');

    if (!rutinas.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px;">
                    <i class="fas fa-clipboard-list" style="font-size: 48px; color: #32CD32; margin-bottom: 15px;"></i>
                    <h3>No hay rutinas registradas</h3>
                    <p>Comienza creando tu primera rutina</p>
                    <a href="nueva-rutina.html" class="btn btn-white" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Crear primera rutina
                    </a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = rutinas.map(rutina => `
        <tr>
            <td>
                <div class="routine-info">
                    <h4>${rutina.name || '-'}</h4>
                    <span class="routine-type">${rutina.is_template ? 'Plantilla' : 'Rutina Personal'}</span>
                </div>
            </td>
            <td>${rutina.description || '-'}</td>
            <td>${rutina.time_week || '-'} semanas</td>
            <td>${formatDate(rutina.time_creation)}</td>
            <td>${rutina.coach_name || 'Coach'}</td>
            <td class="actions-cell">
                <button class="action-btn view-btn" data-id="${rutina.id}" title="Ver rutina">
                    <i class="fas fa-eye"></i>
                </button>
                <a href="nueva-rutina.html?id=${rutina.id}" class="action-btn edit-btn" title="Editar rutina">
                    <i class="fas fa-pen"></i>
                </a>
                <button class="action-btn delete-btn" data-id="${rutina.id}" title="Eliminar rutina">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Event listeners para botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentRoutineId = parseInt(this.dataset.id);
            showDeleteModal();
        });
    });

    // Event listeners para botones de ver
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const routineId = parseInt(this.dataset.id);
            viewRutina(routineId);
        });
    });
}

function filterRutinas(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allRoutines.filter(rutina =>
        (rutina.name && rutina.name.toLowerCase().includes(term)) ||
        (rutina.description && rutina.description.toLowerCase().includes(term)) ||
        (rutina.coach_name && rutina.coach_name.toLowerCase().includes(term))
    );
    renderRutinasTable(filtered);
}

// Ver detalles de una rutina
function viewRutina(routineId) {
    fetch(`http://localhost:8000/api/rutinas/${routineId}/`)
        .then(response => response.json())
        .then(data => {
            console.log('Detalle de rutina:', data);
            showViewModal(data);
        })
        .catch(error => {
            console.error('Error al cargar detalle de rutina:', error);
        });
}

// Mostrar modal de visualización
function showViewModal(rutina) {
    const modal = document.getElementById('view-routine-modal');
    if (modal) {
        // Aquí puedes personalizar el contenido del modal con los datos de la rutina
        modal.style.display = 'flex';
    }
}

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
}

function closeModals() {
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.classList.remove('active');
    }
    
    const viewModal = document.getElementById('view-routine-modal');
    if (viewModal) {
        viewModal.style.display = 'none';
    }
}