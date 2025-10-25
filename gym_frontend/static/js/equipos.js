// LÓGICA ESPECÍFICA PARA LA PÁGINA DE ELEMENTOS

// Variables globales
let currentElementId = null;
let allElements = [];

// Función para capitalizar la primera letra 
function capitalizeFirstLetter(string) {
    if (!string || typeof string !== 'string') {
        return '-'; // Devolver guión si es null/undefined
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', function () {
    getElementos();

    document.getElementById('search-input').addEventListener('input', function () {
        filterElements(this.value);
    });

    document.getElementById('confirm-delete').addEventListener('click', function () {
        if (currentElementId) {
            deleteElement(currentElementId);
        }
    });

    document.getElementById('cancel-delete').addEventListener('click', closeModals);
});

// GET: Obtener todos los elementos
function getElementos() {
    fetch('http://localhost:8000/api/equipos/') 
        .then(response => response.json())
        .then(data => {
            allElements = data;
            renderEquipmentsTable(allElements);
        })
        .catch(error => {
            console.error('Error al cargar los equipos:', error);
        });
}

// POST: Crear un nuevo equipo
function createEquipe(equipeData) {
    console.log("Datos enviados:", equipeData);
    fetch('http://localhost:8000/api/equipos/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipeData)
    })
    .then(response => {
        console.log("Status:", response.status);
        if (!response.ok) {
            return response.text().then(text => {  
                console.log("Error response:", text);
                throw new Error('No se pudo crear el equipo');
            });
        }
        return response.json();
    })
    .then(data => {
        getElementos();
    })
    .catch(error => {
        console.error('Error al crear el equipo:', error);
    });
}

// PUT: Actualizar un equipo existente
function updateEquipment(id, equipeData) {
    fetch(`http://localhost:8000/api/equipos/${id}/`, {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipeData)
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo actualizar el equipo');
        return response.json();
    })
    .then(data => {
        getElementos();
    })
    .catch(error => {
        console.error('Error al actualizar el equipo:', error);
    });
}

// DELETE: Eliminar un elemento
function deleteEquipment(id) {
    fetch(`http://localhost:8000/api/equipos/${id}/`, {  
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo eliminar el equipo');
        closeModals();
        getElementos();
    })
    .catch(error => {
        console.error('Error al eliminar equipo:', error);
    });
}

function renderEquipmentsTable(equipments) {
    const tbody = document.getElementById('elements-table-body');

    if (!equipments.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px;">
                    <i class="fas fa-dumbbell" style="font-size: 48px; color: #32CD32; margin-bottom: 15px;"></i>
                    <h3>No hay equipos registrados</h3>
                    <p>Comienza creando tu primer equipo</p>
                    <a href="nuevo-equipo.html" class="btn btn-white" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Agregar primer equipo
                    </a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = equipments.map(equipments => `
        <tr>
            <td>${equipments.name || '-'}</td>
            <td>${equipments.description || '-'}</td>
            <td>${equipments.category || '-'}</td>
            <td>${equipments.model || '-'}</td>
            <td>${capitalizeFirstLetter(equipments.status)}</td>
            <td>${equipments.purchase_date || '-'}</td>
            <td class="actions-cell">
                <a href="nuevo-equipo.html?id=${equipments.id}" class="action-btn edit-btn" title="Editar equipo">
                    <i class="fas fa-pen"></i>
                </a>
                <button class="action-btn delete-btn" data-id="${equipments.id}" title="Eliminar equipo">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentEquipmentId = parseInt(this.dataset.id);
            showDeleteModal();
        });
    });
}

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
}

function closeModals() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}