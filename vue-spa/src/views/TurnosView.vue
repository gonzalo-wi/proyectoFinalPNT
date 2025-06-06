<template>
  <div>
    <h2>Listado de Turnos</h2>

    <form @submit.prevent="crearTurno">
      <div>
        <label>Profesional:</label>
        <select v-model="nuevoTurno.profesionalId" required>
          <option disabled value="">Seleccioná uno</option>
          <option v-for="p in profesionales" :key="p.id" :value="p.id">
            {{ p.name }} - {{ p.especialidad }}
          </option>
        </select>
      </div>

      <div>
        <label>Fecha y hora:</label>
        <input type="datetime-local" v-model="nuevoTurno.fecha" required />
      </div>

      <button type="submit">Crear Turno</button>
    </form>

    <hr />

    <div v-if="loadingTurnos">Cargando turnos...</div>
    <ul v-else>
      <li v-for="t in turnos" :key="t.id">
        Cliente: {{ t.cliente }} |
        Profesional ID: {{ t.profesionalId }} |
        Fecha: {{ new Date(t.fecha).toLocaleString() }} |
        Estado: {{ t.estado }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfesionales } from '../services/profesionalesService'


const turnos = ref([])
const profesionales = ref([])
const loadingTurnos = ref(true)
const nuevoTurno = ref({
  cliente: 'cliente1@correo.com', 
  profesionalId: '',
  fecha: '',
  estado: 'pendiente'
})


onMounted(async () => {
  
  const resTurnos = await fetch('/turnos.json')
  turnos.value = await resTurnos.json()
  loadingTurnos.value = false

  
  const resProfesionales = await getProfesionales()
  profesionales.value = resProfesionales.data
})


const crearTurno = () => {
  const nuevo = { ...nuevoTurno.value, id: crypto.randomUUID() }
  turnos.value.push(nuevo)

  
  nuevoTurno.value.profesionalId = ''
  nuevoTurno.value.fecha = ''
}
</script>