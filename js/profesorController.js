// --- Configuración de URLs ---
const apiUrlListarProfesores = "https://paginas-web-cr.com/Api/apis/ListaProfesores.php";
const apiUrlInsertarProfesor = "https://paginas-web-cr.com/Api/apis/InsertarProfesores.php";
const apiUrlActualizarProfesor = "https://paginas-web-cr.com/Api/apis/ActualizarProfesores.php";
const apiUrlBorrarProfesor = "https://paginas-web-cr.com/Api/apis/BorrarProfesores.php";

const tablaResultado = document.getElementById('datosTablaProfesores');
const mensajes = document.getElementById('mensajes');
const modalCrear = new bootstrap.Modal(document.getElementById('modalCrear'));
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

const formCrearProfesor = document.getElementById('formCrearProfesor');
const formEditarProfesor = document.getElementById('formEditarProfesor');
const formEliminarProfesor = document.getElementById('formEliminarProfesor');

let profesores = [];

document.addEventListener('DOMContentLoaded', function () {
    cargarDatosProfesores();
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

async function cargarDatosProfesores() {
    tablaResultado.innerHTML = '<tr><td colspan="15" class="text-center">Cargando datos...</td></tr>';
    try {
        const respuesta = await fetch(apiUrlListarProfesores);
        const datos = await respuesta.json();
        if (datos.code === 200 && Array.isArray(datos.data)) {
            profesores = datos.data;
            pintarDatosProfesores(profesores);
        } else {
            mostrarMensaje('Error al cargar los profesores.', 'danger');
        }
    } catch (error) {
        console.error('Error al cargar profesores:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
}

function pintarDatosProfesores(profesores) {
    tablaResultado.innerHTML = '';
    if (profesores.length === 0) {
        tablaResultado.innerHTML = '<tr><td colspan="15" class="text-center">No hay profesores registrados.</td></tr>';
        return;
    }

    profesores.forEach(profesor => {
        const fila = `<tr>
            <td>${profesor.id}</td>
            <td>${profesor.cedula}</td>
            <td>${profesor.correoelectronico}</td>
            <td>${profesor.telefono || '-'}</td>
            <td>${profesor.telefonocelular || '-'}</td>
            <td>${profesor.fechanacimiento}</td>
            <td>${profesor.sexo}</td>
            <td>${profesor.direccion || '-'}</td>
            <td>${profesor.nombre}</td>
            <td>${profesor.apellidopaterno}</td>
            <td>${profesor.apellidomaterno || '-'}</td>
            <td>${profesor.nacionalidad}</td>
            <td>${profesor.idCarreras}</td>
            <td>${profesor.usuario}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="mostrarEditarModalProfesor('${profesor.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="mostrarEliminarModalProfesor('${profesor.id}')">Eliminar</button>
            </td>
        </tr>`;
        tablaResultado.innerHTML += fila;
    });
}

// --- Funcionalidad CREAR ---
formCrearProfesor.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nuevoProfesor = {
        cedula: document.getElementById('cedulaCrear').value,
        correoelectronico: document.getElementById('correoelectronicoCrear').value,
        telefono: document.getElementById('telefonoCrear').value,
        telefonocelular: document.getElementById('telefonocelularCrear').value,
        fechanacimiento: document.getElementById('fechanacimientoCrear').value,
        sexo: document.getElementById('sexoCrear').value,
        direccion: document.getElementById('direccionCrear').value,
        nombre: document.getElementById('nombreCrear').value,
        apellidopaterno: document.getElementById('apellidopaternoCrear').value,
        apellidomaterno: document.getElementById('apellidomaternoCrear').value,
        nacionalidad: document.getElementById('nacionalidadCrear').value,
        idCarreras: document.getElementById('idcarrerasCrear').value,
        usuario: 'UsuarioDemo'
    };

    try {
        await fetch(apiUrlInsertarProfesor, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProfesor)
        });
        modalCrear.hide();
        formCrearProfesor.reset();
        cargarDatosProfesores();
    } catch (error) {
        console.error('Error al crear profesor:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
});

// --- Funcionalidad EDITAR ---
async function mostrarEditarModalProfesor(id) {
    const profesor = profesores.find(p => p.id == id);

    if (profesor) {
        document.getElementById('idEditar').value = profesor.id;
        document.getElementById('cedulaEditar').value = profesor.cedula;
        document.getElementById('correoelectronicoEditar').value = profesor.correoelectronico;
        document.getElementById('telefonoEditar').value = profesor.telefono;
        document.getElementById('telefonocelularEditar').value = profesor.telefonocelular;
        document.getElementById('fechanacimientoEditar').value = profesor.fechanacimiento.split(' ')[0];
        document.getElementById('sexoEditar').value = profesor.sexo;
        document.getElementById('direccionEditar').value = profesor.direccion;
        document.getElementById('nombreEditar').value = profesor.nombre;
        document.getElementById('apellidopaternoEditar').value = profesor.apellidopaterno;
        document.getElementById('apellidomaternoEditar').value = profesor.apellidomaterno;
        document.getElementById('nacionalidadEditar').value = profesor.nacionalidad;
        document.getElementById('idcarrerasEditar').value = profesor.idCarreras;
        document.getElementById('usuarioEditar').value = profesor.usuario;
        modalEditar.show();
    } else {
        mostrarMensaje('No se encontró el profesor para editar.', 'warning');
    }
}

formEditarProfesor.addEventListener('submit', async function (e) {
    e.preventDefault();

    const profesorEditado = {
        id: document.getElementById('idEditar').value,
        cedula: document.getElementById('cedulaEditar').value,
        correoelectronico: document.getElementById('correoelectronicoEditar').value,
        telefono: document.getElementById('telefonoEditar').value,
        telefonocelular: document.getElementById('telefonocelularEditar').value,
        fechanacimiento: document.getElementById('fechanacimientoEditar').value,
        sexo: document.getElementById('sexoEditar').value,
        direccion: document.getElementById('direccionEditar').value,
        nombre: document.getElementById('nombreEditar').value,
        apellidopaterno: document.getElementById('apellidopaternoEditar').value,
        apellidomaterno: document.getElementById('apellidomaternoEditar').value,
        nacionalidad: document.getElementById('nacionalidadEditar').value,
        idCarreras: document.getElementById('idcarrerasEditar').value,
        usuario: document.getElementById('usuarioEditar').value
    };

    try {
        await fetch(apiUrlActualizarProfesor, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profesorEditado)
        });
        modalEditar.hide();
        cargarDatosProfesores();
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
});

// --- Funcionalidad ELIMINAR ---
function mostrarEliminarModalProfesor(id) {
    document.getElementById('idEliminar').value = id;
    modalEliminar.show();
}

formEliminarProfesor.addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('idEliminar').value;

    try {
        await fetch(apiUrlBorrarProfesor, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        modalEliminar.hide();
        cargarDatosProfesores();
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
});

// --- Funciones globales para los botones ---
window.mostrarEditarModalProfesor = mostrarEditarModalProfesor;
window.mostrarEliminarModalProfesor = mostrarEliminarModalProfesor;
