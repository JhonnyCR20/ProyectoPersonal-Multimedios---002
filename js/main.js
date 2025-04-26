document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
});

function loadMenu() {
    fetch('/components/menu.html') // Usar ruta absoluta desde la raíz
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('menu-container').innerHTML = data;
            // Activar el enlace correspondiente a la página actual si es necesario
            activateCurrentNavLink(); 
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
            document.getElementById('menu-container').innerHTML = '<p>Error al cargar el menú.</p>';
        });
}

function activateCurrentNavLink() {
    const currentPath = window.location.pathname; // Obtiene la ruta completa actual
    const navLinks = document.querySelectorAll('#menu-container .nav-link');

    navLinks.forEach(link => {
        // Crear un objeto URL temporal para extraer fácilmente el pathname del href
        // Se asume que el servidor corre en localhost o un dominio base.
        // Si href es relativo, necesita la base URL para resolverse correctamente.
        // Usar link.pathname asume que href es absoluto o relativo a la base correcta.
        const linkPath = new URL(link.href, window.location.origin).pathname;

        // Remueve la clase 'active' de todos los enlaces primero
        link.classList.remove('active');
        link.removeAttribute('aria-current');

        // Añade 'active' al enlace que coincide con la ruta actual
        // Comparar rutas normalizadas (ej. asegurar que terminen o no con / consistentemente si aplica)
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/index.html')) { // Caso especial para la raíz
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Placeholder para futuras funciones globales o inicializaciones