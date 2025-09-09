// backend/dbconnection.js
import mysql2 from 'mysql2/promise';

export async function conectarBD() {
    try {
        const conexion = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'tp4_react'
        });
        console.log("Base de datos conectada");
        return conexion;
        
    } catch (err) {
        console.error("Error en la conexión:", err);
        return null;
    }
}
