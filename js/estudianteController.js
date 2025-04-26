// --- Configuracion URLs ---
const apiListar = "https://paginas-web-cr.com/Api/apis/ListaEstudiantes.php";
const apiInsertar = "https://paginas-web-cr.com/Api/apis/InsertarEstudiantes.php";
const apiActualizar = "https://paginas-web-cr.com/Api/apis/ActualizarEstudiantes.php";
const apiBorrar = "https://paginas-web-cr.com/Api/apis/BorrarEstudiantes.php";

const tablaResultado = document.getElementById('datosTablaEstudiantes');
const mensajes = document.getElementById('mensajes');

const modalCrear = new bootstrap.Modal(document.getElementById('modalCrear'));
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

const formCrearEstudiante = document.getElementById('formCrearEstudiante');
const formEditarEstudiante = document.getElementById('formEditarEstudiante');
const formEliminarEstudiante = document.getElementById('formEliminarEstudiante');

document.addEventListener('DOMContentLoaded', function () {
    cargarDatosEstudiantes();
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

async function cargarDatosEstudiantes() {
    tablaResultado.innerHTML = '<tr><td colspan="15" class="text-center">Cargando datos...</td></tr>';
    try {
        const respuesta = await fetch(apiListar);
        const datos = await respuesta.json();
        if (datos.code === 200 && Array.isArray(datos.data)) {
            pintarDatosEstudiantes(datos.data);
        } else {
            mostrarMensaje('Error al cargar los estudiantes.', 'danger');
        }
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
}

function pintarDatosEstudiantes(estudiantes) {
    tablaResultado.innerHTML = '';
    if (estudiantes.length === 0) {
        tablaResultado.innerHTML = '<tr><td colspan="15" class="text-center">No hay estudiantes registrados.</td></tr>';
        return;
    }

    estudiantes.forEach(est => {
        const fila = `<tr>
            <td>${est.id}</td>
            <td>${est.cedula}</td>
            <td>${est.correoelectronico}</td>
            <td>${est.telefono || '-'}</td>
            <td>${est.telefonocelular || '-'}</td>
            <td>${est.fechanacimiento}</td>
            <td>${est.sexo}</td>
            <td>${est.direccion || '-'}</td>
            <td>${est.nombre}</td>
            <td>${est.apellidopaterno}</td>
            <td>${est.apellidomaterno || '-'}</td>
            <td>${est.nacionalidad}</td>
            <td>${est.idCarreras}</td>
            <td>${est.usuario}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="mostrarEditarModal('${est.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="mostrarEliminarModal('${est.id}')">Eliminar</button>
            </td>
        </tr>`;
        tablaResultado.innerHTML += fila;
    });
}

// Crear Estudiante
formCrearEstudiante.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nuevoEstudiante = {
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
        usuario: 'B84958'
    };
    try {
        await fetch(apiInsertar, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEstudiante)
        });
        modalCrear.hide();
        formCrearEstudiante.reset();
        cargarDatosEstudiantes();
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        mostrarMensaje(`Error: ${error.message}`, 'danger');
    }
});

// Mostrar datos en Modal Editar
async function mostrarEditarModal(id) {
    try {
        const respuesta = await fetch(apiListar);
        const datos = await respuesta.json();
        const estudiante = datos.data.find(e => e.id == id);

        if (estudiante) {
            document.getElementById('idEditar').value = estudiante.id;
            document.getElementById('cedulaEditar').value = estudiante.cedula;
            document.getElementById('correoelectronicoEditar').value = estudiante.correoelectronico;
            document.getElementById('telefonoEditar').value = estudiante.telefono;
            document.getElementById('telefonocelularEditar').value = estudiante.telefonocelular;
            document.getElementById('fechanacimientoEditar').value = estudiante.fechanacimiento.split(' ')[0];
            document.getElementById('sexoEditar').value = estudiante.sexo;
            document.getElementById('direccionEditar').value = estudiante.direccion;
            document.getElementById('nombreEditar').value = estudiante.nombre;
            document.getElementById('apellidopaternoEditar').value = estudiante.apellidopaterno;
            document.getElementById('apellidomaternoEditar').value = estudiante.apellidomaterno;
            document.getElementById('nacionalidadEditar').value = estudiante.nacionalidad;
            document.getElementById('idcarrerasEditar').value = estudiante.idCarreras;
            document.getElementById('usuarioEditar').value = estudiante.usuario;
            modalEditar.show();
        }
    } catch (error) {
        console.error('Error al mostrar estudiante:', error);
    }
}

// Actualizar Estudiante
formEditarEstudiante.addEventListener('submit', async function (e) {
    e.preventDefault();

    const estudianteEditado = {
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
        await fetch(apiActualizar, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(estudianteEditado)
        });
        modalEditar.hide();
        cargarDatosEstudiantes();
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
    }
});

// Eliminar Estudiante
function mostrarEliminarModal(id) {
    document.getElementById('idEliminar').value = id;
    modalEliminar.show();
}

formEliminarEstudiante.addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('idEliminar').value;

    try {
        await fetch(apiBorrar, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        modalEliminar.hide();
        cargarDatosEstudiantes();
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
    }
});

// Hacer funciones globales para los botones
window.mostrarEditarModal = mostrarEditarModal;
window.mostrarEliminarModal = mostrarEliminarModal;

