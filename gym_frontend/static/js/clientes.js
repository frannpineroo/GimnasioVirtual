// LÓGICA ESPECÍFICA PARA LA PÁGINA DE CLIENTES

// Variables globales
let currentClientId = null;
let allClients = [];

// Función para capitalizar la primera letra 
function capitalizeFirstLetter(string) {
    if (!string || typeof string !== 'string') {
        return '-'; // Devolver guión si es null/undefined
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', function () {
    getClients();

    document.getElementById('search-input').addEventListener('input', function () {
        filterClients(this.value);
    });

    document.getElementById('confirm-delete').addEventListener('click', function () {
        if (currentClientId) {
            deleteClient(currentClientId);
        }
    });

    document.getElementById('cancel-delete').addEventListener('click', closeModals);
});

// GET: Obtener todos los clientes
function getClients() {
    fetch('http://localhost:8000/api/clientes/') 
        .then(response => response.json())
        .then(data => {
            allClients = data;
            renderClientsTable(allClients);
        })
        .catch(error => {
            console.error('Error al cargar los clientes:', error);
        });
}

// POST: Crear un nuevo cliente
function createClient(clienteData) {
    console.log("Datos enviados:", clienteData);
    fetch('http://localhost:8000/api/clientes/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteData)
    })
    .then(response => {
        console.log("Status:", response.status);
        if (!response.ok) {
            return response.text().then(text => {  
                console.log("Error response:", text);
                throw new Error('No se pudo crear el cliente');
            });
        }
        return response.json();
    })
    .then(data => {
        getClients();
    })
    .catch(error => {
        console.error('Error al crear el cliente:', error);
    });
}

// PUT: Actualizar un cliente existente
function updateClient(id, clienteData) {
    fetch(`http://localhost:8000/api/clientes/${id}/`, {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteData)
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo actualizar el cliente');
        return response.json();
    })
    .then(data => {
        getClients();
    })
    .catch(error => {
        console.error('Error al actualizar el cliente:', error);
    });
}

// DELETE: Eliminar un cliente
function deleteClient(id) {
    fetch(`http://localhost:8000/api/clientes/${id}/`, {  
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo eliminar el cliente');
        closeModals();
        getClients();
    })
    .catch(error => {
        console.error('Error al eliminar cliente:', error);
    });
}

function renderClientsTable(clients) {
    const tbody = document.getElementById('clients-table-body');

    if (!clients.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px;">
                    <i class="fas fa-dumbbell" style="font-size: 48px; color: #32CD32; margin-bottom: 15px;"></i>
                    <h3>No hay clientes registrados</h3>
                    <p>Comienza creando tu primer cliente</p>
                    <a href="nuevo-cliente.html" class="btn btn-white" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Agregar primer cliente
                    </a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.name || '-'}</td>
            <td>${client.last_name || '-'}</td>
            <td>${client.dni || '-'}</td>
            <td>${capitalizeFirstLetter(client.experience_level)}</td>
            <td>${capitalizeFirstLetter(client.goal)}</td>
            <td>${client.injuries || '-'}</td>
            <td>${client.status || '-'}</td>
            <td class="actions-cell">
                <a href="nuevo-cliente.html?id=${client.id}" class="action-btn edit-btn" title="Editar cliente">
                    <i class="fas fa-pen"></i>
                </a>
                <button class="action-btn delete-btn" data-id="${client.id}" title="Eliminar cliente">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentClientId = parseInt(this.dataset.id);
            showDeleteModal();
        });
    });
}

function filterClients(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allClients.filter(e =>
        (e.name && e.name.toLowerCase().includes(term)) ||
        (e.last_name && e.last_name.toLowerCase().includes(term)) ||
        (e.experience_level && e.experience_level.toLowerCase().includes(term)) ||
        (e.goal && e.goal.toLowerCase().includes(term)) ||
        (e.injuries && e.injuries.toLowerCase().includes(term)) ||
        (e.status && e.status.toLowerCase().includes(term))
    );
    renderClientsTable(filtered);
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