// API URLs based on provided documentation
const apiUrlListarCursos = "https://paginas-web-cr.com/Api/apis/ListaCurso.php";
const apiUrlInsertarCurso = "https://paginas-web-cr.com/Api/apis/InsertarCursos.php"; // Assuming based on pattern
const apiUrlActualizarCurso = "https://paginas-web-cr.com/Api/apis/ActualizarCursos.php";
const apiUrlBorrarCurso = "https://paginas-web-cr.com/Api/apis/BorrarCursos.php"; // Assuming based on pattern and API structure
const apiUrlConsultarCurso = "https://paginas-web-cr.com/Api/apis/ListaCursoId.php"; // For fetching data before edit

const tablaResultado = document.getElementById('datosTablaCursos');
const mensajes = document.getElementById('mensajes');
const modalCrear = new bootstrap.Modal(document.getElementById('modalCrear'));
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
const formCrearCurso = document.getElementById('formCrearCurso');
const formEditarCurso = document.getElementById('formEditarCurso');
const formEliminarCurso = document.getElementById('formEliminarCurso');

// --- Cargar Datos Iniciales ---
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    // Load menu dynamically (assuming main.js handles this)
    if (typeof loadMenu === 'function') {
        // Ensure menu is loaded after DOM content
    } else {
        console.warn('loadMenu function not found. Ensure main.js is loaded correctly.');
    }
});

function mostrarMensaje(texto, tipo = 'success') {
    mensajes.innerHTML = ''; // Limpiar mensajes anteriores
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = 'alert';
    alerta.innerHTML = `
        ${texto}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    mensajes.appendChild(alerta);
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        alerta.classList.remove('show');
        alerta.addEventListener('transitionend', () => alerta.remove());
    }, 5000);
}

async function cargarDatos() {
    tablaResultado.innerHTML = '<tr><td colspan="6" class="text-center">Cargando datos...</td></tr>'; // Indicador de carga
    try {
        const respuesta = await fetch(apiUrlListarCursos);
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datos = await respuesta.json();

        if (datos.code === 200 && Array.isArray(datos.data)) {
            pintarDatos(datos.data);
        } else {
            mostrarMensaje('No se pudieron cargar los datos o el formato es incorrecto.', 'warning');
            tablaResultado.innerHTML = '<tr><td colspan="6" class="text-center">No hay datos para mostrar.</td></tr>';
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarMensaje(`Error al cargar datos: ${error.message}`, 'danger');
        tablaResultado.innerHTML = '<tr><td colspan="6" class="text-center">Error al cargar los datos.</td></tr>';
    }
}

function pintarDatos(datos) {
    tablaResultado.innerHTML = ''; // Limpiar tabla antes de pintar
    if (datos.length === 0) {
        tablaResultado.innerHTML = '<tr><td colspan="6" class="text-center">No hay cursos registrados.</td></tr>';
        return;
    }
    datos.forEach(curso => {
        const fila = `
            <tr>
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.descripcion}</td>
                <td>${curso.tiempo}</td>
                <td>${curso.usuario}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="mostrarEditarModal('${curso.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="mostrarEliminarModal('${curso.id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tablaResultado.innerHTML += fila;
    });
}

// --- Funcionalidad CREAR ---
formCrearCurso.addEventListener('submit', async function(event) {
    event.preventDefault();
    const nuevoCurso = {
        nombre: document.getElementById('nombreCrear').value,
        descripcion: document.getElementById('descripcionCrear').value,
        tiempo: document.getElementById('tiempoCrear').value,
        usuario: 'B84958' // Asignar un usuario por defecto o según lógica
    };

    try {
        const respuesta = await fetch(apiUrlInsertarCurso, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCurso)
        });
        const resultado = await respuesta.json();

        if (resultado.code === 200) {
            mostrarMensaje('Curso creado exitosamente.', 'success');
            modalCrear.hide();
            formCrearCurso.reset();
            cargarDatos(); // Recargar la tabla
        } else {
            mostrarMensaje(`Error al crear el curso: ${resultado.message}`, 'danger');
        }
    } catch (error) {
        console.error('Error en la creación:', error);
        mostrarMensaje(`Error de red al crear el curso: ${error.message}`, 'danger');
    }
});

// --- Funcionalidad EDITAR ---
async function mostrarEditarModal(id) {
    try {
        const respuesta = await fetch(apiUrlListarCursos);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const resultado = await respuesta.json();

        if (resultado.code === 200 && resultado.data.length > 0) {
            // Buscar el curso localmente
            const curso = resultado.data.find(curso => curso.id == id);
            if (curso) {
                document.getElementById('idEditar').value = curso.id;
                document.getElementById('nombreEditar').value = curso.nombre;
                document.getElementById('descripcionEditar').value = curso.descripcion;
                document.getElementById('tiempoEditar').value = curso.tiempo;
                document.getElementById('usuarioEditar').value = curso.usuario;
                modalEditar.show();
            } else {
                mostrarMensaje('No se pudo encontrar el curso para editar.', 'warning');
            }
        } else {
            mostrarMensaje('No se pudieron cargar los cursos.', 'warning');
        }
    } catch (error) {
        console.error('Error al cargar curso para editar:', error);
        mostrarMensaje(`Error al cargar curso para editar: ${error.message}`, 'danger');
    }
}

formEditarCurso.addEventListener('submit', async function(event) {
    event.preventDefault();
    const cursoEditado = {
        id: document.getElementById('idEditar').value,
        nombre: document.getElementById('nombreEditar').value,
        descripcion: document.getElementById('descripcionEditar').value,
        tiempo: document.getElementById('tiempoEditar').value,
        usuario: document.getElementById('usuarioEditar').value
    };

    try {
        const respuesta = await fetch(apiUrlActualizarCurso, {
            method: 'POST', // La API usa POST para actualizar según api.txt
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cursoEditado)
        });
        const resultado = await respuesta.json();

        if (resultado.code === 200) {
            mostrarMensaje('Curso actualizado exitosamente.', 'success');
            modalEditar.hide();
            cargarDatos(); // Recargar la tabla
        } else {
            mostrarMensaje(`Error al actualizar el curso: ${resultado.message}`, 'danger');
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        mostrarMensaje(`Error de red al actualizar el curso: ${error.message}`, 'danger');
    }
});

// --- Funcionalidad ELIMINAR ---
function mostrarEliminarModal(id) {
    document.getElementById('idEliminar').value = id;
    modalEliminar.show();
}

formEliminarCurso.addEventListener('submit', async function(event) {
    event.preventDefault();
    const idParaEliminar = document.getElementById('idEliminar').value;

    try {
        const respuesta = await fetch(apiUrlBorrarCurso, {
            method: 'POST', // Asumiendo POST basado en patrón, ajustar si es DELETE
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idParaEliminar })
        });
        const resultado = await respuesta.json();

        if (resultado.code === 200) {
            mostrarMensaje('Curso eliminado exitosamente.', 'success');
            modalEliminar.hide();
            cargarDatos(); // Recargar la tabla
        } else {
            mostrarMensaje(`Error al eliminar el curso: ${resultado.message}`, 'danger');
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        mostrarMensaje(`Error de red al eliminar el curso: ${error.message}`, 'danger');
    }
});

// Hacer funciones globales para que onclick funcione desde HTML
window.mostrarEditarModal = mostrarEditarModal;
window.mostrarEliminarModal = mostrarEliminarModal;