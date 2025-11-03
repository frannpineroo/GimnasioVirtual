// Archivo principal que inicializa la aplicación
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar componentes
    await initializeComponents();
    
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

