// backend/controllers/contactController.js
import sql from '../db.js'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export async function getDestino(req, res) {
  const result = await sql`SELECT email_destino FROM config_contacto LIMIT 1`
  res.json(result[0])
}

export async function addMensaje(req, res) {
  const { nombre, email, mensaje } = req.body
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }
  // Guardar en la base de datos
  await sql`INSERT INTO mensajes (nombre, email, mensaje) VALUES (${nombre}, ${email}, ${mensaje})`

  // Obtener email destino
  const result = await sql`SELECT email_destino FROM config_contacto LIMIT 1`
  const destino = result[0]?.email_destino

  // Configurar transporte
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Enviar correo
  try {
    await transporter.sendMail({
      from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`,
      to: destino,
      subject: `Nuevo mensaje de ${nombre}`,
      html: `
        <h3>Nuevo mensaje recibido</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${mensaje}</p>
      `
    })

    res.json({ mensaje: 'Mensaje guardado y enviado por correo' })
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    res.json({ mensaje: 'Mensaje guardado, pero no se pudo enviar el correo' })
  }
}