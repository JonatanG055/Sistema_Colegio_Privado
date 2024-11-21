// URLs de las APIs
const inscriptionApiUrl = 'http://192.168.1.44:5000/inscripciones';
const studentApiUrl = 'http://192.168.1.44:5000/api/estudiantes';
const courseApiUrl = 'http://192.168.1.44:5000/cursos';

document.addEventListener("DOMContentLoaded", () => {
    loadInscriptions();
});


// Cargar estudiantes en el select del modal
function loadStudents() {
    return fetch(studentApiUrl)
        .then(response => response.json())
        .then(data => {
            const addSelect = document.getElementById("addInscriptionStudent");
            const editSelect = document.getElementById("editInscriptionStudent");
            addSelect.innerHTML = '<option value="">Seleccione un estudiante</option>';
            editSelect.innerHTML = '<option value="">Seleccione un estudiante</option>';
            data.forEach(student => {
                const option = `<option value="${student.EstudianteID}">${student.Nombre} ${student.Apellido}</option>`;
                addSelect.innerHTML += option;
                editSelect.innerHTML += option;
            });
        })
        .catch(error => console.error('Error al cargar estudiantes:', error));
}


// Cargar cursos en el select del modal
function loadCourses() {
    return fetch(courseApiUrl)
        .then(response => response.json())
        .then(data => {
            const addSelect = document.getElementById("addInscriptionCourse");
            const editSelect = document.getElementById("editInscriptionCourse");
            addSelect.innerHTML = '<option value="">Seleccione un curso</option>';
            editSelect.innerHTML = '<option value="">Seleccione un curso</option>';
            data.forEach(course => {
                const option = `<option value="${course.CursoID}">${course.Nombre}</option>`;
                addSelect.innerHTML += option;
                editSelect.innerHTML += option;
            });
        })
        .catch(error => console.error('Error al cargar cursos:', error));
}


// Cargar lista de inscripciones
function loadInscriptions() {
    fetch(inscriptionApiUrl)
        .then(response => response.json())
        .then(data => {
            const inscriptionList = document.getElementById("inscriptionList");
            inscriptionList.innerHTML = '';
            data.forEach(inscription => {
                inscriptionList.innerHTML += `
                    <div class="contents-row d-flex" data-id="${inscription.InscripcionID}">
                        <div class="content-cell">${inscription.NombreEstudiante}</div>
                        <div class="content-cell">${inscription.NombreCurso}</div>
                        <div class="content-cell">${inscription.FechaInscripcion}</div>
                        <div class="content-cell">
                            <button onclick="showEditModal(${inscription.InscripcionID})" class="btn btn-warning mr-2">Editar</button>
                            <button onclick="showDeleteModal(${inscription.InscripcionID})" class="btn btn-danger">Eliminar</button>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error('Error al cargar inscripciones:', error));
}


// Añadir inscripción
function addInscription() {
    const inscriptionData = {
        EstudianteID: document.getElementById("addInscriptionStudent").value,
        CursoID: document.getElementById("addInscriptionCourse").value,
        FechaInscripcion: document.getElementById("addInscriptionDate").value
    };

    fetch(inscriptionApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscriptionData)
    })
        .then(response => response.json())
        .then(() => {
            $('#addModal').modal('hide');
            loadInscriptions();
            clearModalFields();
        })
        .catch(error => console.error('Error al añadir inscripción:', error));
}


// Mostrar el modal de edición con los datos de la inscripción
function showEditModal(inscriptionId) {
    Promise.all([loadCourses(), loadStudents()])
        .then(() => {
            fetch(`${inscriptionApiUrl}/${inscriptionId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Error al obtener inscripción');
                    return response.json();
                })
                .then(inscription => {
                    if (!inscription) throw new Error('No se encontró la inscripción');

                    document.getElementById("editInscriptionDate").value = inscription.FechaInscripcion;
                    document.getElementById("editInscriptionForm").dataset.inscriptionId = inscriptionId;

                    var studentSelect = document.getElementById("editInscriptionStudent");
                    var courseSelect = document.getElementById("editInscriptionCourse");

                    studentSelect.value = inscription.EstudianteID;
                    courseSelect.value = inscription.CursoID;
                    $('#editModal').modal('show');
                })
                .catch(error => console.error('Error al obtener la inscripción:', error));
        })
        .catch(error => console.error('Error al cargar los datos de estudiantes y cursos:', error));
}


// Editar la inscripción 
function editInscription() {
    const inscriptionId = document.getElementById("editInscriptionForm").dataset.inscriptionId;

    const inscriptionData = {
        EstudianteID: document.getElementById("editInscriptionStudent").value,
        CursoID: document.getElementById("editInscriptionCourse").value,
        FechaInscripcion: document.getElementById("editInscriptionDate").value
    };

    fetch(`${inscriptionApiUrl}/${inscriptionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscriptionData)
    })
        .then(response => response.json())
        .then(() => {
            $('#editModal').modal('hide');
            loadInscriptions();
        })
        .catch(error => console.error('Error al editar inscripción:', error));
} 


// Mostrar modal de eliminación
function showDeleteModal(inscriptionId) {
    document.getElementById("deleteModal").dataset.inscriptionId = inscriptionId;
    $('#deleteModal').modal('show');
}


// Eliminar inscripción
function deleteInscription() {
    const inscriptionId = document.getElementById("deleteModal").dataset.inscriptionId;

    fetch(`${inscriptionApiUrl}/${inscriptionId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => {
            $('#deleteModal').modal('hide');
            loadInscriptions();
        })
        .catch(error => console.error('Error al eliminar inscripción:', error));
}


// Limpiar campos de los formularios del modal
function clearModalFields() {
    document.getElementById("addInscriptionForm").reset();
}


// Limpiar el formulario cuando se cierre el modal de añadir
$('#addModal').on('hidden.bs.modal', function () {
    clearModalFields();
});


// Cargar estudiantes y cursos al abrir el modal de añadir
document.getElementById('addInscriptionButton').addEventListener('click', () => {
    loadStudents();
    loadCourses();
    clearModalFields();
    $('#addModal').modal('show');
});
