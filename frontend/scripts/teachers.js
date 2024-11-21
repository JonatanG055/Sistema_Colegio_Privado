document.addEventListener("DOMContentLoaded", () => {
    loadProfesores();
});

const apiUrl = 'http://192.168.1.44:5000/profesores'; 

// Función para cargar la lista de profesores
function loadProfesores() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const profesorList = document.getElementById("profesorList");
            profesorList.innerHTML = '';
            data.forEach(profesor => {
                profesorList.innerHTML += `
                    <div class="contents-row d-flex" data-id="${profesor.ProfesorID}">
                        <div class="content-cell">${profesor.Nombre}</div>
                        <div class="content-cell">${profesor.Apellido}</div>
                        <div class="content-cell">${profesor.Especialidad}</div>
                        <div class="content-cell">${profesor.Telefono}</div>
                        <div class="content-cell">${profesor.Email}</div>
                        <div class="content-cell">
                            <button onclick="showEditModal(${profesor.ProfesorID})" class="btn btn-warning mr-2">Editar</button>
                            <button onclick="showDeleteModal(${profesor.ProfesorID})" class="btn btn-danger">Eliminar</button>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error('Error al cargar profesores:', error));
}


// Función para agregar un nuevo profesor
function addProfesor() {
    const profesorData = {
        Nombre: document.getElementById("addProfesorName").value,
        Apellido: document.getElementById("addProfesorLastName").value,
        Especialidad: document.getElementById("addProfessorSpecialty").value,
        Telefono: document.getElementById("addProfesorPhone").value,
        Email: document.getElementById("addProfesorEmail").value
    };
    
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profesorData)
    })
    .then(response => response.json())
    .then(() => {
        $('#addModal').modal('hide');
        loadProfesores();
        clearModalFields();
    })
    .catch(error => console.error('Error al añadir profesor:', error));
}


// Función para mostrar el modal de edición con los datos del profesor
function showEditModal(profesorId) {
    fetch(`${apiUrl}/${profesorId}`)
        .then(response => response.json())
        .then(profesor => {
            document.getElementById("editProfesorName").value = profesor.Nombre;
            document.getElementById("editProfesorLastName").value = profesor.Apellido;
            document.getElementById("editProfessorSpecialty").value = profesor.Especialidad;
            document.getElementById("editProfesorPhone").value = profesor.Telefono;
            document.getElementById("editProfesorEmail").value = profesor.Email;
            document.getElementById("editProfesorForm").dataset.profesorId = profesorId; 
            $('#editModal').modal('show');
        })
        .catch(error => console.error('Error al cargar datos del profesor para edición:', error));
}


// Función para editar un profesor
function editProfesor() {
    const profesorId = document.getElementById("editProfesorForm").dataset.profesorId;
    const updatedData = {
        Nombre: document.getElementById("editProfesorName").value,
        Apellido: document.getElementById("editProfesorLastName").value,
        Especialidad: document.getElementById("editProfessorSpecialty").value,
        Telefono: document.getElementById("editProfesorPhone").value,
        Email: document.getElementById("editProfesorEmail").value
    };

    fetch(`${apiUrl}/${profesorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(() => {
        $('#editModal').modal('hide');
        loadProfesores(); 
    })
    .catch(error => console.error('Error al editar profesor:', error));
}


// Función para mostrar el modal de eliminación
function showDeleteModal(profesorId) {
    document.getElementById("deleteModal").dataset.profesorId = profesorId;
    $('#deleteModal').modal('show');
}


// Función para eliminar un profesor
function deleteProfesor() {
    const profesorId = document.getElementById("deleteModal").dataset.profesorId;

    fetch(`${apiUrl}/${profesorId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        $('#deleteModal').modal('hide');
        loadProfesores(); 
    })
    .catch(error => console.error('Error al eliminar profesor:', error));
}


// Función para limpiar los campos de los modales
function clearModalFields() {
    document.getElementById("addProfesorForm").reset();
}


// Limpiar el formulario cuando se cierre el modal de añadir
$('#addModal').on('hidden.bs.modal', function () {
    clearModalFields();
});

