// models/GrupoModel.js

class GrupoModel {
    constructor(id, numero_grupo, id_asignatura, id_profesor, id_periodo) {
        this.id = id;
        this.numero_grupo = numero_grupo;
        this.id_asignatura = id_asignatura; // Foreign key to Asignatura table
        this.id_profesor = id_profesor;     // Foreign key to Profesor table
        this.id_periodo = id_periodo;       // Foreign key to Periodo table (e.g., semester, trimester)
        // Add other relevant fields as needed, e.g., horario, aula
    }
}

// Export if using modules in the future
// export default GrupoModel;