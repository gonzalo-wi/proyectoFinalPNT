<template>
  <div class="max-w-4xl mx-auto mt-10 px-4">
    <h2 class="text-2xl font-bold mb-6 text-purple-700">📅 Listado de Turnos</h2>

    
    <form @submit.prevent="modoEdicion ? actualizarTurnoForm() : crearTurnoForm()" class="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Profesional:</label>
        <select
          v-model="turnoForm.profesionalId"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option disabled value="">Seleccioná uno</option>
          <option v-for="p in profesionales" :key="p.id" :value="p.id">
            {{ p.name }} - {{ p.especialidad }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Fecha y hora:</label>
        <input
          type="datetime-local"
          v-model="turnoForm.fecha"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Estado:</label>
        <select
          v-model="turnoForm.estado"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold"
      >
        {{ modoEdicion ? 'Actualizar Turno' : 'Crear Turno' }}
      </button>
      <button
        v-if="modoEdicion"
        type="button"
        @click="cancelarEdicion"
        class="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold"
      >
        Cancelar Edición
      </button>
    </form>

    
    <div v-if="loadingTurnos" class="text-gray-500 text-center">Cargando turnos...</div>

    <div v-else class="space-y-4">
      <div
        v-for="t in turnos"
        :key="t.id"
        class="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-600"
      >
        <div v-if="turnoEditando && turnoEditando.id === t.id">
          <p class="text-gray-700 mb-2">✏️ Editando turno...</p>
        </div>
        <div v-else>
          <p><strong>Cliente:</strong> {{ t.cliente }}</p>
          <p><strong>Profesional:</strong> {{ getNombreProfesional(t.profesionalId) }}</p>
          <p><strong>Fecha:</strong> {{ new Date(t.fecha).toLocaleString() }}</p>
          <p><strong>Estado:</strong>
            <span
              class="px-2 py-1 rounded-full text-white text-xs"
              :class="{
                'bg-yellow-500': t.estado === 'pendiente',
                'bg-green-600': t.estado === 'confirmado',
                'bg-gray-500': t.estado === 'cancelado'
              }"
            >
              {{ t.estado }}
            </span>
          </p>

          <div class="mt-2 flex gap-4">
            <button
              @click="editarTurno(t)"
              class="text-sm text-purple-600 hover:underline"
            >
              Editar
            </button>
            <button
              @click="eliminarTurnoForm(t.id)"
              class="text-sm text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfesionales } from '../services/profesionalesService'
import { listarTurnos, crearTurno, eliminarTurno, actualizarTurno } from '../services/turnosService'

const turnos = ref([])
const profesionales = ref([])
const loadingTurnos = ref(true)

const turnoForm = ref({
  cliente: '',
  profesionalId: '',
  fecha: '',
  estado: 'pendiente'
})

const turnoOriginalParaCancelar = ref(null)
const turnoEditando = ref(null)
const modoEdicion = ref(false)

onMounted(async () => {
  await cargarTurnos()
  const resProfesionales = await getProfesionales()
  profesionales.value = resProfesionales.data
})

async function cargarTurnos() {
  loadingTurnos.value = true
  try {
    const res = await listarTurnos()
    turnos.value = res.data
  } catch (e) {
    turnos.value = []
  }
  loadingTurnos.value = false
}

const getNombreProfesional = (profesionalId) => {
  const profesional = profesionales.value.find(p => String(p.id) === String(profesionalId))
  return profesional ? profesional.name : 'Desconocido'
}

const crearTurnoForm = async () => {
  try {
    
    let fechaISO = turnoForm.value.fecha
    if (fechaISO && fechaISO.length === 16) {
      fechaISO += ':00' 
    }
    await crearTurno({
      cliente: turnoForm.value.cliente || 'cliente@correo.com',
      profesionalId: String(turnoForm.value.profesionalId),
      fecha: fechaISO,
      estado: turnoForm.value.estado
    })
    await cargarTurnos()
    turnoForm.value = { cliente: '', profesionalId: '', fecha: '', estado: 'pendiente' }
  } catch (e) {
    alert('Error al crear el turno')
    console.error(e)
  }
}

const editarTurno = (turno) => {
  turnoOriginalParaCancelar.value = { ...turno }
  turnoForm.value = { ...turno }
  turnoEditando.value = turno
  modoEdicion.value = true
}

const actualizarTurnoForm = async () => {
  if (!turnoEditando.value) return
  try {
    await actualizarTurno(turnoEditando.value.id, { ...turnoForm.value })
    await cargarTurnos()
    cancelarEdicion()
  } catch (e) {
    alert('Error al actualizar el turno')
  }
}

const cancelarEdicion = () => {
  modoEdicion.value = false
  turnoEditando.value = null
  turnoOriginalParaCancelar.value = null
  turnoForm.value = { cliente: '', profesionalId: '', fecha: '', estado: 'pendiente' }
}

const eliminarTurnoForm = async (id) => {
  if (window.confirm('¿Estás seguro de que querés eliminar este turno?')) {
    try {
      await eliminarTurno(id)
      await cargarTurnos()
      if (turnoEditando.value && turnoEditando.value.id === id) {
        cancelarEdicion()
      }
    } catch (e) {
      alert('Error al eliminar el turno')
    }
  }
}
</script>