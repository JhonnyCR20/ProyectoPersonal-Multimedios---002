// models/CursoModel.js

class CursoModel {
    constructor(id, nombre, descripcion, tiempo, usuario) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tiempo = tiempo;
        this.usuario = usuario;
    }
}

// Export if using modules in the future, though not strictly required for current setup
// export default CursoModel;