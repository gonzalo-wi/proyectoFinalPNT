export const getTurnos = async () => {
  const res = await fetch('/turnos.json')
  if (!res.ok) throw new Error('Error al obtener turnos')
  return await res.json()
}