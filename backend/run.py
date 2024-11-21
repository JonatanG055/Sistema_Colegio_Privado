from flask import Flask
from flask_cors import CORS
from app import app  

# Configuración de la aplicación Flask
app = Flask(__name__)
CORS(app) 


from app.routes import main_routes, profesor_bp, curso_bp,inscripcion_bp,calificacion_bp,asistencia_bp,usuarios_bp
app.register_blueprint(main_routes)
app.register_blueprint(profesor_bp)
app.register_blueprint(curso_bp)
app.register_blueprint(inscripcion_bp)
app.register_blueprint(calificacion_bp)
app.register_blueprint(asistencia_bp)
app.register_blueprint(usuarios_bp)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)  
