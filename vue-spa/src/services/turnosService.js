import axios from 'axios'

const API_URL = 'http://localhost:8000/turnos' 

export const listarTurnos = (skip = 0, limit = 100) =>
  axios.get(`${API_URL}/`, { params: { skip, limit } })

export const crearTurno = (turno) =>
  axios.post(`${API_URL}/`, turno)

export const listarTurnosPorCliente = (cliente) =>
  axios.get(`${API_URL}/cliente/${encodeURIComponent(cliente)}`)

export const listarTurnosPorProfesional = (profesionalId) =>
  axios.get(`${API_URL}/profesional/${encodeURIComponent(profesionalId)}`)

export const actualizarTurno = (id, turno) =>
  axios.put(`${API_URL}/${id}`, turno)

export const eliminarTurno = (id) =>
  axios.delete(`${API_URL}/${id}`)