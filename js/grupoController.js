// --- Configuración de URLs ---
const apiUrlListarGrupos = "https://paginas-web-cr.com/Api/apis/ListaGrupo.php";
const apiUrlInsertarGrupo = "https://paginas-web-cr.com/Api/apis/InsertarGrupo.php";
const apiUrlActualizarGrupo = "https://paginas-web-cr.com/Api/apis/ActualizarGrupo.php";
const apiUrlBorrarGrupo = "https://paginas-web-cr.com/Api/apis/BorrarGrupo.php";

const tablaResultado = document.getElementById('datosTablaGrupos');
const mensajes = document.getElementById('mensajes');
const modalCrear = new bootstrap.Modal(document.getElementById('modalCrear'));
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

const formCrearGrupo = document.getElementById('formCrearGrupo');
const formEditarGrupo = document.getElementById('formEditarGrupo');
const formEliminarGrupo = document.getElementById('formEliminarGrupo');

let grupos = [];

document.addEventListener('DOMContentLoaded', function () {
    cargarDatosGrupos();
});

function mostrarMensaje(texto, tipo = 'success') {
    mensajes.innerHTML = '';
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = 'alert';
    alerta.innerHTML = `${texto}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    mensajes.appendChild(alerta);
    setTimeout(() => {
        alerta.classList.remove('show');
        alerta.addEventListener('transitionend', () => alerta.remove());
    }, 5000);
}

async function cargarDatosGrupos() {
    tablaResultado.innerHTML = '<tr><td colspan="3" class="text-center">Cargando datos...</td></tr>';
    try {
        const respuesta = await fetch(apiUrlListarGrupos);
        const datos = await respuesta.json();
        if (datos.code === 200 && Array.isArray(datos.data)) {
            grupos = datos.data;
            pintarDatosGrupos(grupos);
        } else {
            mostrarMensaje('Error al cargar los grupos.', 'danger');
        }
    } catch (error) {
        console.error('Error al cargar grupos:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
}

function pintarDatosGrupos(grupos) {
    tablaResultado.innerHTML = '';
    if (grupos.length === 0) {
        tablaResultado.innerHTML = '<tr><td colspan="3" class="text-center">No hay grupos registrados.</td></tr>';
        return;
    }

    grupos.forEach(grupo => {
        const fila = `<tr>
            <td>${grupo.id}</td>
            <td>${grupo.nombre}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="mostrarEditarModalGrupo('${grupo.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="mostrarEliminarModalGrupo('${grupo.id}')">Eliminar</button>
            </td>
        </tr>`;
        tablaResultado.innerHTML += fila;
    });
}

// --- Funcionalidad CREAR ---
formCrearGrupo.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nuevoGrupo = {
        nombre: document.getElementById('nombreCrear').value
    };

    try {
        await fetch(apiUrlInsertarGrupo, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoGrupo)
        });
        modalCrear.hide();
        formCrearGrupo.reset();
        cargarDatosGrupos();
    } catch (error) {
        console.error('Error al crear grupo:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
});

// --- Funcionalidad EDITAR ---
async function mostrarEditarModalGrupo(id) {
    const grupo = grupos.find(g => g.id == id);

    if (grupo) {
        document.getElementById('idEditar').value = grupo.id;
        document.getElementById('nombreEditar').value = grupo.nombre;
        modalEditar.show();
    } else {
        mostrarMensaje('No se encontró el grupo para editar.', 'warning');
    }
}

formEditarGrupo.addEventListener('submit', async function (e) {
    e.preventDefault();

    const grupoEditado = {
        id: document.getElementById('idEditar').value,
        nombre: document.getElementById('nombreEditar').value
    };

    try {
        await fetch(apiUrlActualizarGrupo, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(grupoEditado)
        });
        modalEditar.hide();
        cargarDatosGrupos();
    } catch (error) {
        console.error('Error al actualizar grupo:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
});

// --- Funcionalidad ELIMINAR ---
function mostrarEliminarModalGrupo(id) {
    document.getElementById('idEliminar').value = id;
    modalEliminar.show();
}

formEliminarGrupo.addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('idEliminar').value;

    try {
        await fetch(apiUrlBorrarGrupo, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        modalEliminar.hide();
        cargarDatosGrupos();
    } catch (error) {
        console.error('Error al eliminar grupo:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
});

// --- Funciones globales para botones ---
window.mostrarEditarModalGrupo = mostrarEditarModalGrupo;
window.mostrarEliminarModalGrupo = mostrarEliminarModalGrupo;
