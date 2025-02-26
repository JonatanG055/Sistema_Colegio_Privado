document.addEventListener("DOMContentLoaded", () => {
    loadCourses();
});

const apiUrl = 'http://192.168.1.44:5000/cursos'; 

// Función para cargar la lista de cursos
function loadCourses() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const courseList = document.getElementById("courseList");
            courseList.innerHTML = ''; 
            data.forEach(course => {
                courseList.innerHTML += `
                    <div class="contents-row d-flex" data-id="${course.CursoID}">
                        <div class="content-cell">${course.Nombre}</div>
                        <div class="content-cell">${course.Descripcion}</div>
                        <div class="content-cell">${course.Creditos}</div>
                        <div class="content-cell">
                            <button onclick="showEditModal(${course.CursoID})" class="btn btn-warning mr-2">Editar</button>
                            <button onclick="showDeleteModal(${course.CursoID})" class="btn btn-danger">Eliminar</button>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error('Error al cargar cursos:', error));
}


// Función para agregar un nuevo curso
function addCourse() {
    const courseData = {
        Nombre: document.getElementById("addCourseName").value, 
        Descripcion: document.getElementById("addCourseDescription").value, 
        Creditos: document.getElementById("addCourseCredits").value
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
    })
    .then(response => response.json())
    .then(() => {
        $('#addModal').modal('hide');
        loadCourses(); 
        clearModalFields(); 
    })
    .catch(error => console.error('Error al añadir curso:', error));
}


// Función para mostrar el modal de edición con los datos del curso
function showEditModal(courseId) {
    fetch(`${apiUrl}/${courseId}`)
        .then(response => response.json())
        .then(course => {
            document.getElementById("editCourseName").value = course.Nombre;
            document.getElementById("editCourseDescription").value = course.Descripcion;
            document.getElementById("editCourseCredits").value = course.Creditos;
            document.getElementById("editCourseForm").dataset.courseId = courseId; 
            $('#editModal').modal('show');
        })
        .catch(error => console.error('Error al cargar datos del curso para edición:', error));
}


// Función para editar un curso
function editCourse() {
    const courseId = document.getElementById("editCourseForm").dataset.courseId;
    const updatedData = {
        Nombre: document.getElementById("editCourseName").value,
        Descripcion: document.getElementById("editCourseDescription").value,
        Creditos: document.getElementById("editCourseCredits").value
    };

    fetch(`${apiUrl}/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(() => {
        $('#editModal').modal('hide');
        loadCourses(); 
    })
    .catch(error => console.error('Error al editar curso:', error));
}


// Función para mostrar el modal de eliminación
function showDeleteModal(courseId) {
    document.getElementById("deleteModal").dataset.courseId = courseId;
    $('#deleteModal').modal('show');
}


// Función para eliminar un curso
function deleteCourse() {
    const courseId = document.getElementById("deleteModal").dataset.courseId;

    fetch(`${apiUrl}/${courseId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        $('#deleteModal').modal('hide');
        loadCourses(); 
    })
    .catch(error => console.error('Error al eliminar curso:', error));
}


// Función para limpiar los campos del formulario
function clearModalFields() {
    document.getElementById("addCourseForm").reset();
}


// Limpiar el formulario cuando se cierre el modal de añadir
$('#addModal').on('hidden.bs.modal', function () {
    clearModalFields();
});
