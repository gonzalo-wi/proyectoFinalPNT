import axios from 'axios'

const api = axios.create({
  baseURL: 'https://68423ef9e1347494c31c39f7.mockapi.io/api/v1'
})

export const obtenerUsuarios = () => api.get('/users')

export const registrarUsuario = async (nuevoUsuario) => {
  
  const res = await api.post('/users', nuevoUsuario)

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
  usuarios.push(res.data)
  localStorage.setItem('usuarios', JSON.stringify(usuarios))
  return res
}

export const loginUsuario = async (email, password) => {
  const { data: usuarios } = await obtenerUsuarios()
  return usuarios.find(u => u.email === email && u.password === password)
}