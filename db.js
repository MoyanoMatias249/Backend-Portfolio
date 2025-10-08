// backend/db.js
import postgres from 'postgres'
import dotenv from 'dotenv'
dotenv.config()

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  prepare: false,
  idle_timeout: 5,
  connect_timeout: 10
})

export default sql
