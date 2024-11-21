const inscriptionApiUrl = 'http://192.168.1.44:5000/asistencias';
const studentApiUrl = 'http://192.168.1.44:5000/api/estudiantes';
const courseApiUrl = 'http://192.168.1.44:5000/cursos';

document.addEventListener("DOMContentLoaded", function() {
    cargarAsistencias();
    cargarEstudiantesYCursos(); // Cargar estudiantes y cursos
});

function cargarAsistencias() {
    fetch(inscriptionApiUrl)
        .then(response => response.json())
        .then(asistencias => {
            let asistenciaList = document.getElementById('asistenciaList');
            asistenciaList.innerHTML = '';
            asistencias.forEach(asistencia => {
                let row = document.createElement('div');
                row.classList.add('contents-row');
                row.innerHTML = `
                    <div class="content-cell">${asistencia.NombreEstudiante}</div>
                    <div class="content-cell">${asistencia.NombreCurso}</div>
                    <div class="content-cell">${asistencia.Fecha}</div>
                    <div class="content-cell">${asistencia.Estado}</div>
                    <div class="content-cell">
                        <button class="btn btn-warning" onclick="editarAsistencia(${asistencia.AsistenciaID})">Editar</button>
                        <button class="btn btn-danger" onclick="openDeleteAsistenciaModal(${asistencia.AsistenciaID})">Eliminar</button>
                    </div>
                `;
                asistenciaList.appendChild(row);
            });
        })
    .catch(error => console.error('Error al cargar asistencias:', error));
}


function cargarEstudiantesYCursos() {
    // Cargar estudiantes
    fetch(studentApiUrl)
        .then(response => response.json())
        .then(estudiantes => {
            let estudianteSelect = document.getElementById('addAsistenciaStudent');
            let estudianteEditSelect = document.getElementById('editAsistenciaStudent');
            estudianteSelect.innerHTML = '';  // Limpiar las opciones previas
            estudianteEditSelect.innerHTML = ''; // Limpiar las opciones previas

            estudiantes.forEach(estudiante => {
                let option = document.createElement('option');
                option.value = estudiante.EstudianteID;  // Asignar el ID del estudiante
                option.textContent = estudiante.Nombre;  // Mostrar el nombre del estudiante
                estudianteSelect.appendChild(option);
                estudianteEditSelect.appendChild(option.cloneNode(true));  // Crear las mismas opciones para el formulario de edición
            });
        })
        .catch(error => console.error('Error al cargar estudiantes:', error));

    // Cargar cursos
    fetch(courseApiUrl)
        .then(response => response.json())
        .then(cursos => {
            let cursoSelect = document.getElementById('addAsistenciaCourse');
            let cursoEditSelect = document.getElementById('editAsistenciaCourse');
            cursoSelect.innerHTML = '';  // Limpiar las opciones previas
            cursoEditSelect.innerHTML = ''; // Limpiar las opciones previas

            cursos.forEach(curso => {
                let option = document.createElement('option');
                option.value = curso.CursoID;  // Asignar el ID del curso
                option.textContent = curso.Nombre;  // Mostrar el nombre del curso
                cursoSelect.appendChild(option);
                cursoEditSelect.appendChild(option.cloneNode(true));  // Crear las mismas opciones para el formulario de edición
            });
        })
        .catch(error => console.error('Error al cargar cursos:', error));
}

function addAsistencia() {
    const estudianteID = document.getElementById('addAsistenciaStudent').value;
    const cursoID = document.getElementById('addAsistenciaCourse').value;
    const fecha = document.getElementById('addAsistenciaDate').value;
    const estado = document.getElementById('addAsistenciaState').value;

    const data = {
        EstudianteID: estudianteID,
        CursoID: cursoID,
        Fecha: fecha,
        Estado: estado
    };

    fetch(inscriptionApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar mensaje de éxito con el mismo diseño que editar
        mostrarMensajeExito("Asistencia añadida correctamente");
        $('#addModal').modal('hide'); // Ocultar el modal
        cargarAsistencias(); // Recargar la lista de asistencias
    })
    .catch(error => console.error('Error al añadir asistencia:', error));
}

function mostrarMensajeExito(mensaje) {
    // Crear un contenedor de notificación
    const notificacion = document.createElement('div');
    notificacion.classList.add('custom-notification');
    notificacion.innerHTML = `
        <div class="notification-content">
            <span>${mensaje}</span>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove();">&times;</button>
        </div>
    `;

    // Agregar la notificación al cuerpo del documento
    document.body.appendChild(notificacion);

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

function editarAsistencia(asistenciaID) {
    // Realizar la solicitud a la API para obtener los datos de la asistencia
    fetch(`${inscriptionApiUrl}/${asistenciaID}`)
        .then(response => response.json())
        .then(asistencia => {
            // Rellenar el campo oculto con el ID de la asistencia
            document.getElementById('editAsistenciaID').value = asistenciaID;

            // Rellenar los demás campos con los datos de la asistencia
            document.getElementById('editAsistenciaStudent').value = asistencia.EstudianteID;
            document.getElementById('editAsistenciaCourse').value = asistencia.CursoID;
            document.getElementById('editAsistenciaDate').value = asistencia.Fecha;
            document.getElementById('editAsistenciaState').value = asistencia.Estado;

            // Mostrar el modal
            $('#editModal').modal('show');
        })
        .catch(error => console.error('Error al cargar asistencia para edición:', error));
}
function mostrarMensajeExito(mensaje) {
    // Crear un contenedor de notificación
    const notificacion = document.createElement('div');
    notificacion.classList.add('custom-notification');
    notificacion.innerHTML = `
        <div class="notification-content">
            <span>${mensaje}</span>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove();">&times;</button>
        </div>
    `;

    // Agregar la notificación al cuerpo del documento
    document.body.appendChild(notificacion);

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

function saveAsistencia() {
    const asistenciaID = document.getElementById('editAsistenciaID').value;
    if (!asistenciaID) {
        alert("ID de asistencia no válido");
        return;
    }

    const estudianteID = document.getElementById('editAsistenciaStudent').value;
    const cursoID = document.getElementById('editAsistenciaCourse').value;
    const fecha = document.getElementById('editAsistenciaDate').value;
    const estado = document.getElementById('editAsistenciaState').value;

    const data = {
        EstudianteID: estudianteID,
        CursoID: cursoID,
        Fecha: fecha,
        Estado: estado
    };

    fetch(`${inscriptionApiUrl}/${asistenciaID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        mostrarMensajeExito("Asistencia editada correctamente");
        $('#editModal').modal('hide');
        cargarAsistencias();
    })
    .catch(error => console.error('Error al guardar asistencia:', error));
}

function openDeleteAsistenciaModal(asistenciaID) {
    const modal = document.getElementById("deleteAsistenciaModal");
    modal.dataset.asistenciaId = asistenciaID; // Asigna el ID de la asistencia al modal
    $('#deleteAsistenciaModal').modal('show'); // Muestra el modal
}


function deleteAsistencia() {
    const asistenciaID = document.getElementById("deleteAsistenciaModal").dataset.asistenciaId;

    fetch(`${inscriptionApiUrl}/${asistenciaID}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo eliminar la asistencia.`);
        }
        return response.json();
    })
    .then(() => {
        $('#deleteAsistenciaModal').modal('hide'); // Cierra el modal
        cargarAsistencias(); // Recargar la lista de asistencias después de la eliminación
    })
    .catch(error => console.error('Error al eliminar asistencia:', error));
}


