import pyodbc
from flask import Flask

def get_db_connection():
    try:
        connection = pyodbc.connect(
            "Driver={SQL Server};"
            "Server=DESKTOP-NFDMETJ\\SQLEXPRESS;"  
            "Database=RegistroAcademicoColegio;" 
            "Trusted_Connection=yes;"
        )
        print("Conexión exitosa a la base de datos!")  
        return connection
    except Exception as e:
        print("Error de conexión:", e)
        return None
