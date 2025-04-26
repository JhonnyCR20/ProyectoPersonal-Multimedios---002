// models/ProfesorModel.js

class ProfesorModel {
    // Assuming the structure is identical to EstudianteModel based on API patterns
    constructor(id, cedula, correoelectronico, telefono, telefonocelular, fechanacimiento, sexo, direccion, nombre, apellidopaterno, apellidomaterno, nacionalidad, idcarreras, usuario) {
        this.id = id;
        this.cedula = cedula;
        this.correoelectronico = correoelectronico;
        this.telefono = telefono;
        this.telefonocelular = telefonocelular;
        this.fechanacimiento = fechanacimiento;
        this.sexo = sexo;
        this.direccion = direccion;
        this.nombre = nombre;
        this.apellidopaterno = apellidopaterno;
        this.apellidomaterno = apellidomaterno;
        this.nacionalidad = nacionalidad;
        this.idcarreras = idcarreras; // Or relevant field like 'idmaterias'? Check API if needed.
        this.usuario = usuario;
    }
}

// Export if using modules in the future
// export default ProfesorModel;