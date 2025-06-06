import axios from 'axios'

const api = axios.create({
  baseURL: 'https://68423ef9e1347494c31c39f7.mockapi.io/api/v1'
})

export const obtenerUsuarios = () => api.get('/users')

export const loginUsuario = async (email, password) => {
  const { data: usuarios } = await obtenerUsuarios()
  return usuarios.find(u => u.email === email && u.password === password)
}