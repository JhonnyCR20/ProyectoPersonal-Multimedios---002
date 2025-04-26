// models/EstudianteModel.js

class EstudianteModel {
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
        this.idCarreras = idcarreras;
        this.usuario = usuario;
    }
}

// Export if using modules in the future
// export default EstudianteModel;