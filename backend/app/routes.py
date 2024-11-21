from flask import Blueprint, jsonify, request
from app.models import (
    obtener_estudiantes,
    agregar_estudiante,
    actualizar_estudiante,
    eliminar_estudiante,
    obtener_estudiante_por_id
)
from app.config import get_db_connection  

main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def index():
    return "Bienvenido a la aplicación de CRUD"

@main_routes.route('/check_db')
def check_db():
    conn = get_db_connection()
    if conn:
        print("Conexión exitosa a la base de datos!")
        conn.close()
        return "Conexión exitosa a la base de datos!"
    else:
        print("Fallo en la conexión a la base de datos.")
        return "Fallo en la conexión a la base de datos.", 500  

@main_routes.route('/api/estudiantes', methods=['GET'])
def get_estudiantes():
    estudiantes = obtener_estudiantes()
    return jsonify(estudiantes), 200  
@main_routes.route('/api/estudiantes', methods=['POST'])
def add_estudiante():
    data = request.get_json()
    if not data or not all(key in data for key in ('nombre', 'apellido', 'fecha_nacimiento', 'direccion', 'telefono', 'email')):
        return jsonify({"message": "Datos incompletos"}), 400  
    agregar_estudiante(data['nombre'], data['apellido'], data['fecha_nacimiento'], data['direccion'], data['telefono'], data['email'])
    return jsonify({"message": "Estudiante agregado exitosamente", "data": data}), 201 

@main_routes.route('/api/estudiantes/<int:estudiante_id>', methods=['GET'])
def get_estudiante(estudiante_id):
    estudiante = obtener_estudiante_por_id(estudiante_id)
    if estudiante:
        return jsonify(estudiante), 200  
    else:
        return jsonify({"message": "Estudiante no encontrado"}), 404  

@main_routes.route('/api/estudiantes/<int:estudiante_id>', methods=['PUT'])
def edit_estudiante(estudiante_id):
    data = request.get_json()
    if not data or not all(key in data for key in ('nombre', 'apellido', 'fecha_nacimiento', 'direccion', 'telefono', 'email')):
        return jsonify({"message": "Datos incompletos"}), 400  
    actualizar_estudiante(estudiante_id, data['nombre'], data['apellido'], data['fecha_nacimiento'], data['direccion'], data['telefono'], data['email'])
    return jsonify({"message": "Estudiante actualizado exitosamente"}), 200  

@main_routes.route('/api/estudiantes/<int:estudiante_id>', methods=['DELETE'])
def delete_estudiante(estudiante_id):
    eliminar_estudiante(estudiante_id)
    return jsonify({"message": "Estudiante eliminado exitosamente"}), 200  


#rutas para porfesores 
from app.models import obtener_profesores, agregar_profesor, actualizar_profesor, eliminar_profesor, obtener_profesor_por_id

profesor_bp = Blueprint('profesores', __name__)

@profesor_bp.route('/profesores', methods=['GET'])
def listar_profesores():
    profesores = obtener_profesores()
    return jsonify(profesores), 200

@profesor_bp.route('/profesores', methods=['POST'])
def crear_profesor():
    data = request.json
    agregar_profesor(data['Nombre'], data['Apellido'], data['Especialidad'], data['Telefono'], data['Email'])
    return jsonify({"message": "Profesor agregado exitosamente"}), 201

@profesor_bp.route('/profesores/<int:profesor_id>', methods=['PUT'])
def modificar_profesor(profesor_id):
    data = request.json
    actualizar_profesor(profesor_id, data['Nombre'], data['Apellido'], data['Especialidad'], data['Telefono'], data['Email'])
    return jsonify({"message": "Profesor actualizado exitosamente"}), 200

@profesor_bp.route('/profesores/<int:profesor_id>', methods=['DELETE'])
def eliminar_profesor_route(profesor_id):
    eliminar_profesor(profesor_id)
    return jsonify({"message": "Profesor eliminado exitosamente"}), 200

@profesor_bp.route('/profesores/<int:profesor_id>', methods=['GET'])
def obtener_profesor(profesor_id):
    profesor = obtener_profesor_por_id(profesor_id)
    return jsonify(profesor), 200 if profesor else 404

#rutas para curso
from app.models import obtener_cursos, agregar_curso, actualizar_curso, eliminar_curso, obtener_curso_por_id

curso_bp = Blueprint('cursos', __name__)

@curso_bp.route('/cursos', methods=['GET'])
def listar_cursos():
    cursos = obtener_cursos()
    return jsonify(cursos), 200

@curso_bp.route('/cursos', methods=['POST'])
def crear_curso():
    data = request.json
    agregar_curso(data['Nombre'], data['Descripcion'], data['Creditos'])
    return jsonify({"message": "Curso agregado exitosamente"}), 201

@curso_bp.route('/cursos/<int:curso_id>', methods=['PUT'])
def modificar_curso(curso_id):
    data = request.json
    actualizar_curso(curso_id, data['Nombre'], data['Descripcion'], data['Creditos'])
    return jsonify({"message": "Curso actualizado exitosamente"}), 200

@curso_bp.route('/cursos/<int:curso_id>', methods=['DELETE'])
def eliminar_curso_route(curso_id):
    eliminar_curso(curso_id)
    return jsonify({"message": "Curso eliminado exitosamente"}), 200

@curso_bp.route('/cursos/<int:curso_id>', methods=['GET'])
def obtener_curso(curso_id):
    curso = obtener_curso_por_id(curso_id)
    return jsonify(curso), 200 if curso else 404


#rutas para inscripciones 

from app.models import obtener_inscripciones, agregar_inscripcion, actualizar_inscripcion, eliminar_inscripcion, obtener_inscripcion_por_id

inscripcion_bp = Blueprint('inscripciones', __name__)

@inscripcion_bp.route('/inscripciones', methods=['GET'])
def listar_inscripciones():
    inscripciones = obtener_inscripciones()
    return jsonify(inscripciones), 200

# Ruta para obtener estudiantes registrados
@inscripcion_bp.route('/api/estudiantes', methods=['GET'])
def listar_estudiantes():
    estudiantes = obtener_estudiantes()
    return jsonify(estudiantes), 200

# Ruta para obtener cursos registrados
@inscripcion_bp.route('/cursos', methods=['GET'])
def listar_cursos():
    cursos = obtener_cursos()
    return jsonify(cursos), 200

@inscripcion_bp.route('/inscripciones', methods=['POST'])
def crear_inscripcion():
    data = request.json
    agregar_inscripcion(data['EstudianteID'], data['CursoID'], data['FechaInscripcion'])
    return jsonify({"message": "Inscripción agregada exitosamente"}), 201

@inscripcion_bp.route('/inscripciones/<int:inscripcion_id>', methods=['PUT'])
def modificar_inscripcion(inscripcion_id):
    data = request.json
    actualizar_inscripcion(inscripcion_id, data['EstudianteID'], data['CursoID'], data['FechaInscripcion'])
    return jsonify({"message": "Inscripción actualizada exitosamente"}), 200

@inscripcion_bp.route('/inscripciones/<int:inscripcion_id>', methods=['DELETE'])
def eliminar_inscripcion_route(inscripcion_id):
    eliminar_inscripcion(inscripcion_id)
    return jsonify({"message": "Inscripción eliminada exitosamente"}), 200

@inscripcion_bp.route('/inscripciones/<int:inscripcion_id>', methods=['GET'])
def obtener_inscripcion(inscripcion_id):
    inscripcion = obtener_inscripcion_por_id(inscripcion_id)
    return jsonify(inscripcion), 200 if inscripcion else 404


#rutas para calificaiones 

from app.models import obtener_calificaciones, agregar_calificacion, actualizar_calificacion, eliminar_calificacion, obtener_calificacion_por_id

calificacion_bp = Blueprint('calificaciones', __name__)


@calificacion_bp.route('/calificaciones', methods=['GET'])
def listar_calificaciones():
    calificaciones = obtener_calificaciones()
    return jsonify(calificaciones), 200


@calificacion_bp.route('/api/estudiantes', methods=['GET'])
def listar_estudiantes():
    estudiantes = obtener_estudiantes()
    return jsonify(estudiantes), 200


@calificacion_bp.route('/cursos', methods=['GET'])
def listar_cursos():
    cursos = obtener_cursos()
    return jsonify(cursos), 200


@calificacion_bp.route('/calificaciones', methods=['POST'])
def crear_calificacion():
    data = request.json
    agregar_calificacion(data['EstudianteID'], data['CursoID'], data['Nota'])
    return jsonify({"message": "Calificación agregada exitosamente"}), 201


@calificacion_bp.route('/calificaciones/<int:calificacion_id>', methods=['PUT'])
def modificar_calificacion(calificacion_id):
    data = request.json
    actualizar_calificacion(calificacion_id, data['EstudianteID'], data['CursoID'], data['Nota'])
    return jsonify({"message": "Calificación actualizada exitosamente"}), 200


@calificacion_bp.route('/calificaciones/<int:calificacion_id>', methods=['DELETE'])
def eliminar_calificacion_route(calificacion_id):
    eliminar_calificacion(calificacion_id)
    return jsonify({"message": "Calificación eliminada exitosamente"}), 200

@calificacion_bp.route('/calificaciones/<int:calificacion_id>', methods=['GET'])
def obtener_calificacion(calificacion_id):
    calificacion = obtener_calificacion_por_id(calificacion_id)
    return jsonify(calificacion), 200 if calificacion else 404


#ROUTES ASITENCIAS 
from app.models import obtener_asistencias, agregar_asistencia, actualizar_asistencia, eliminar_asistencia, obtener_asistencia_por_id

asistencia_bp = Blueprint('asistencias', __name__)

@asistencia_bp.route('/asistencias', methods=['GET'])
def listar_asistencias():
    asistencias = obtener_asistencias()
    return jsonify(asistencias), 200

@asistencia_bp.route('/asistencias', methods=['POST'])
def crear_asistencia():
    data = request.json
    if 'EstudianteID' not in data or 'CursoID' not in data or 'Fecha' not in data or 'Estado' not in data:
        return jsonify({"error": "Datos incompletos"}), 400
    agregar_asistencia(data['EstudianteID'], data['CursoID'], data['Fecha'], data['Estado'])
    return jsonify({"message": "Asistencia agregada exitosamente"}), 201

@asistencia_bp.route('/asistencias/<int:asistencia_id>', methods=['PUT'])
def modificar_asistencia(asistencia_id):
    data = request.json
    if 'EstudianteID' not in data or 'CursoID' not in data or 'Fecha' not in data or 'Estado' not in data:
        return jsonify({"error": "Datos incompletos"}), 400
    actualizar_asistencia(asistencia_id, data['EstudianteID'], data['CursoID'], data['Fecha'], data['Estado'])
    return jsonify({"message": "Asistencia actualizada exitosamente"}), 200

@asistencia_bp.route('/asistencias/<int:asistencia_id>', methods=['DELETE'])
def eliminar_asistencia_route(asistencia_id):
    eliminar_asistencia(asistencia_id)
    return jsonify({"message": "Asistencia eliminada exitosamente"}), 200

@asistencia_bp.route('/asistencias/<int:asistencia_id>', methods=['GET'])
def obtener_asistencia(asistencia_id):
    asistencia = obtener_asistencia_por_id(asistencia_id)
    return jsonify(asistencia), 200 if asistencia else (jsonify({"error": "Asistencia no encontrada"}), 404)

#RUTAS PARA USUAIROS


# routes.py

from app.models import obtener_usuarios, agregar_usuario, actualizar_usuario, eliminar_usuario, obtener_usuario_por_id

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = obtener_usuarios()
    return jsonify(usuarios), 200

@usuarios_bp.route('/usuarios', methods=['POST'])
def crear_usuario():
    data = request.json
    if not all(key in data for key in ('Nombre', 'Apellido', 'Email', 'Username', 'PasswordHash', 'Rol')):
        return jsonify({"error": "Datos incompletos"}), 400
    agregar_usuario(data['Nombre'], data['Apellido'], data['Email'], data['Username'], data['PasswordHash'], data['Rol'])
    return jsonify({"message": "Usuario creado exitosamente"}), 201

@usuarios_bp.route('/usuarios/<int:usuario_id>', methods=['PUT'])
def modificar_usuario(usuario_id):
    data = request.json
    if not all(key in data for key in ('Nombre', 'Apellido', 'Email', 'Username', 'Rol', 'Estado')):
        return jsonify({"error": "Datos incompletos"}), 400
    actualizar_usuario(usuario_id, data['Nombre'], data['Apellido'], data['Email'], data['Username'], data['Rol'], data['Estado'])
    return jsonify({"message": "Usuario actualizado exitosamente"}), 200

@usuarios_bp.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
def eliminar_usuario_route(usuario_id):
    eliminar_usuario(usuario_id)
    return jsonify({"message": "Usuario eliminado exitosamente"}), 200

@usuarios_bp.route('/usuarios/<int:usuario_id>', methods=['GET'])
def obtener_usuario(usuario_id):
    usuario = obtener_usuario_por_id(usuario_id)
    return jsonify(usuario), 200 if usuario else (jsonify({"error": "Usuario no encontrado"}), 404)
