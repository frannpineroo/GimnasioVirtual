// Archivo principal que inicializa la aplicación
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar componentes
    await initializeComponents();
    
    // Inicializar página específica si existe
    initializePageScript();
});

// Inicializar componentes comunes
async function initializeComponents() {
    // Cargar sidebar
    const sidebarComponent = new SidebarComponent();
    const sidebarElement = await sidebarComponent.loadSidebar();
    document.body.insertBefore(sidebarElement, document.body.firstChild);
    
    // Cargar header
    const headerComponent = new HeaderComponent();
    const headerElement = await headerComponent.loadHeader();
    
    // Insertar header en el main-content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(headerElement, mainContent.firstChild);
    }
}

// Inicializar script específico de la página
function initializePageScript() {
    const path = window.location.pathname;
    let scriptPath = '';
    
    if (path.includes('ejercicios.html')) {
        scriptPath = 'js/ejercicios.js';
    } else if (path.includes('nuevo-ejercicio.html')) {
        scriptPath = 'js/nuevo-ejercicio.js';
    }
    // Añadir más páginas según sea necesario
    
    if (scriptPath) {
        const script = document.createElement('script');
        script.src = scriptPath;
        document.body.appendChild(script);
    }
}