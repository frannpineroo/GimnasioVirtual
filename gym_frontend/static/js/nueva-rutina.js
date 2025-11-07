document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('routine-form');
    const searchInput = document.getElementById('search-input');
    let selectedClient = null;
    let searchTimeout = null;
    
    // Crear contenedor de resultados de búsqueda
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    searchResultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        margin-top: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    // Insertar el contenedor después del input de búsqueda
    const searchContainer = searchInput.closest('.search');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(searchResultsContainer);

    // Función para buscar clientes
    function searchClients(query) {
    if (!query || query.trim().length < 2) {
        searchResultsContainer.style.display = 'none';
        return;
    }

    // Obtener todos los clientes
    fetch(`http://localhost:8000/api/clientes/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const queryLower = query.toLowerCase();
            const filteredClients = data.filter(client => {
                const nombre = (client.nombre || '').toLowerCase();
                const apellido = (client.apellido || '').toLowerCase();
                const dni = (client.dni || '').toString();
                const email = (client.email || '').toLowerCase();
                
                return nombre.includes(queryLower) || 
                       apellido.includes(queryLower) || 
                       dni.includes(queryLower) ||
                       email.includes(queryLower) ||
                       `${nombre} ${apellido}`.includes(queryLower);
            });
            
            displaySearchResults(filteredClients);
        })
        .catch(error => {
            console.error('Error al buscar clientes:', error);
            searchResultsContainer.innerHTML = `
                <div style="padding: 16px; text-align: center; color: #dc3545;">
                    Error al buscar clientes
                </div>
            `;
            searchResultsContainer.style.display = 'block';
        });
    }

    // Función para mostrar resultados de búsqueda
    function displaySearchResults(clients) {
        if (!clients || clients.length === 0) {
            searchResultsContainer.innerHTML = `
                <div style="padding: 16px; text-align: center; color: #999;">
                    No se encontraron clientes
                </div>
            `;
            searchResultsContainer.style.display = 'block';
            return;
        }

        searchResultsContainer.innerHTML = clients.map(client => `
            <div class="search-result-item" data-client-id="${client.id}" style="
                padding: 12px 16px;
                border-bottom: 1px solid #333;
                cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">
                    ${client.name} ${client.last_name}
                </div>
                <div style="font-size: 14px; color: #999;">
                    DNI: ${client.dni} ${client.email ? `• ${client.email}` : ''}
                </div>
            </div>
        `).join('');

        searchResultsContainer.style.display = 'block';

        // Agregar eventos a cada resultado
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#2a2a2a';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            item.addEventListener('click', function() {
                const clientId = this.dataset.clientId;
                const clientData = clients.find(c => c.id == clientId);
                selectClient(clientData);
            });
        });
    }

    // Función para seleccionar un cliente
    function selectClient(client) {
        selectedClient = client;
        searchInput.value = `${client.name} ${client.last_name} (DNI: ${client.dni})`;
        searchResultsContainer.style.display = 'none';
        
        // Cambiar el estilo del input para indicar que hay un cliente seleccionado
        searchInput.style.borderColor = '#32CD32';
        searchInput.style.backgroundColor = 'rgba(50, 205, 50, 0.1)';
    }

    // Event listener para el input de búsqueda
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        // Si el usuario borra el input, limpiar el cliente seleccionado
        if (!query) {
            selectedClient = null;
            searchInput.style.borderColor = '';
            searchInput.style.backgroundColor = '';
        }
        
        // Cancelar búsqueda anterior
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Esperar 300ms después de que el usuario deje de escribir
        searchTimeout = setTimeout(() => {
            searchClients(query);
        }, 300);
    });

    // Cerrar resultados al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });

    // GUARDAR RUTINA 

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('routine-name').value.trim();
        const description = document.getElementById('routine-description').value.trim();
        const timeWeek = document.getElementById('routine-weeks').value;
        const daysPerWeek = document.getElementById('routine-days').value;

        // Validación mejorada
        if (!name || !timeWeek || !daysPerWeek) {
            alert('Por favor completa los campos requeridos (*)');
            return;
        }

        // Verificar que time_week sea un número válido
        if (isNaN(timeWeek) || timeWeek <= 0) {
            alert('Por favor ingresa una duración válida en semanas');
            return;
        }

        const routineData = {
            name: name,
            description: description || "",
            time_week: parseInt(timeWeek),
            days_per_week: parseInt(daysPerWeek),
            client_id: selectedClient ? selectedClient.id : null
        };

        fetch('http://localhost:8000/api/rutinas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(routineData)
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
            console.log('=== RUTINA CREADA ===');
            console.log('Respuesta:', data);
            console.log('=======================');
            
            alert('Rutina guardada exitosamente!');
            window.location.href = 'rutinas.html';
        })
        .catch(error => {
            console.error('=== ERROR ===');
            console.error('Error completo:', error);
            console.error('=============');
            alert('Ocurrió un problema al guardar la rutina: ' + error.message);
        });
    });

    // Botón cancelar
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cancelar? Se perderán todos los cambios.')) {
                window.history.back();
            }
        });
    }
});