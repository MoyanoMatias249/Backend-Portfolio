// backend/db.js
import postgres from 'postgres'
import dotenv from 'dotenv'
dotenv.config()

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })
export default sql

// export async function conectarBD() {
//     try {
//         const conexion = await mysql2.createConnection({
//             host: 'localhost',
//             user: 'root',
//             password: '',
//             database: 'tp4_react'
//         });
//         console.log("Base de datos conectada");
//         return conexion;
        
//     } catch (err) {
//         console.error("Error en la conexión:", err);
//         return null;
//     }
// }
