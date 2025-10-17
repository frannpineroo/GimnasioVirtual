// CONFIGURACIÓN DE API
const API_BASE_URL = 'http://localhost:8000/api';

// Función para hacer peticiones GET
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al consultar ${endpoint}:`, error);
        return null;
    }
}

// Obtener clientes activos
async function getActiveClients() {
    const data = await fetchAPI('/clientes/active');
    return data;
}

// Obtener todos los ejercicios
async function getExercises() {
    const data = await fetchAPI('/ejercicios');
    return data;
}

// Obtener todas las rutinas
async function getRoutines() {
    const data = await fetchAPI('/rutinas');
    return data;
}

// ACTUALIZAR ESTADÍSTICAS EN EL DASHBOARD
async function updateDashboardStats() {
    // Actualizar clientes activos
    const clients = await getActiveClients();
    if (clients) {
        const clientCount = Array.isArray(clients) ? clients.length : clients.count || 0;
        document.getElementById('clients-count').textContent = clientCount;
    }

    // Actualizar ejercicios disponibles
    const exercises = await getExercises();
    if (exercises) {
        const exerciseCount = Array.isArray(exercises) ? exercises.length : exercises.count || 0;
        document.getElementById('exercises-count').textContent = exerciseCount;
    }

    // Actualizar rutinas creadas
    const routines = await getRoutines();
    if (routines) {
        const routineCount = Array.isArray(routines) ? routines.length : routines.count || 0;
        document.getElementById('routines-count').textContent = routineCount;
    }
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar estadísticas si estamos en la página de inicio
    if (document.getElementById('clients-count')) {
        updateDashboardStats();
    }
    
    // Manejar el menú activo
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
});

// FUNCIONES UTILITARIAS
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}