import axios from 'axios'

const api = axios.create({
  baseURL: 'https://68423ef9e1347494c31c39f7.mockapi.io/api/v1' 
})

export const getProfesionales = () => api.get('/profesional')
export const createProfesional = (data) => api.post('/profesional', data)
export const deleteProfesional = (id) => api.delete(`/profesional/${id}`)
export const getProfesionalesByEspecialidad = async (especialidad) => {
  const res = await getProfesionales()
  return res.data.filter(p => p.especialidad && p.especialidad.toLowerCase().includes(especialidad.toLowerCase()))
}