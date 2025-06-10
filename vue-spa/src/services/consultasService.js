import axios from 'axios'

const API_URL = 'http://localhost:8000/chat' 

export const getConsultas = (userId) =>
  axios.get(`${API_URL}/users/${userId}/messages`)

export const createConsulta = (userId, consulta) =>
  axios.post(`${API_URL}/users/${userId}/messages`, consulta)
