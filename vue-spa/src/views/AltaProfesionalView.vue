<template>
  <div class="max-w-4xl mx-auto mt-10 px-4 bg-white p-8 rounded-lg shadow-md border border-purple-200">
    <h2 class="text-3xl font-bold text-purple-700 mb-8 text-center flex items-center justify-center gap-2">
      <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm0 0v8"/></svg>
      Alta de Profesionales
    </h2>
    <form @submit.prevent="editando ? actualizarProfesional() : crearProfesional()" class="space-y-6 bg-purple-50 rounded-xl p-6 shadow-inner">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input v-model="nombre" type="text" required class="w-full border border-purple-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
          <input v-model="especialidad" type="text" required class="w-full border border-purple-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Horarios Disponibles <span class="text-xs text-gray-400">(separados por coma)</span></label>
        <input v-model="horariosInput" type="text" placeholder="Ej: 10:00, 11:00, 12:00" class="w-full border border-purple-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition" />
      </div>
      <div class="flex gap-2">
        <button type="submit" class="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 rounded-lg shadow transition text-lg flex items-center justify-center gap-2 boton-animado-boton" :disabled="loadingAgregar">
          <svg v-if="loadingAgregar" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span v-else>
            <svg v-if="!editando" class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            <svg v-else class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            {{ editando ? 'Actualizar Profesional' : 'Agregar Profesional' }}
          </span>
        </button>
        <button v-if="editando" type="button" @click="cancelarEdicion" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg shadow transition text-lg">Cancelar</button>
      </div>
    </form>
    <div v-if="mensaje" class="mt-4 text-center text-green-600 font-semibold">{{ mensaje }}</div>
    <div v-if="error" class="mt-4 text-center text-red-600 font-semibold">{{ error }}</div>
    <div class="mt-10">
      <h3 class="text-xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
        <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0"/></svg>
        Profesionales actuales
      </h3>
      <ul class="divide-y divide-purple-100">
        <li v-for="p in profesionales" :key="p.id" class="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <span class="font-bold text-purple-800">{{ p.name }}</span>
            <span class="text-gray-600 ml-2">({{ p.especialidad }})</span>
          </div>
          <div class="text-xs text-gray-500 mt-1 md:mt-0">Horarios: <span class="font-mono">{{ p.horariosDispo?.join(', ') }}</span></div>
          <div class="flex gap-2 mt-2 md:mt-0">
            <button @click="iniciarEdicion(p)" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded shadow text-xs font-semibold">Editar</button>
            <button @click="eliminarProfesional(p.id)" class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded shadow text-xs font-semibold">Eliminar</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfesionales, createProfesional, updateProfesional, deleteProfesional } from '@/services/profesionalesService'

const nombre = ref('')
const especialidad = ref('')
const horariosInput = ref('')
const mensaje = ref('')
const error = ref('')
const profesionales = ref([])
const editando = ref(false)
const profesionalEditandoId = ref(null)
const loadingAgregar = ref(false)

const cargarProfesionales = async () => {
  const res = await getProfesionales()
  profesionales.value = res.data
}

onMounted(() => {
  cargarProfesionales()
})

async function crearProfesional() {
  if (loadingAgregar.value) return
  loadingAgregar.value = true
  mensaje.value = ''
  error.value = ''
  setTimeout(async () => {
    try {
      const horarios = horariosInput.value.split(',').map(h => h.trim()).filter(Boolean)
      await createProfesional({
        name: nombre.value,
        especialidad: especialidad.value,
        horariosDispo: horarios
      })
      mensaje.value = 'Profesional agregado correctamente.'
      nombre.value = ''
      especialidad.value = ''
      horariosInput.value = ''
      cargarProfesionales()
    } catch (e) {
      error.value = 'Error al agregar profesional.'
    } finally {
      loadingAgregar.value = false
    }
  }, 1200)
}

function iniciarEdicion(p) {
  editando.value = true
  profesionalEditandoId.value = p.id
  nombre.value = p.name
  especialidad.value = p.especialidad
  horariosInput.value = p.horariosDispo?.join(', ') || ''
  mensaje.value = ''
  error.value = ''
}

function cancelarEdicion() {
  editando.value = false
  profesionalEditandoId.value = null
  nombre.value = ''
  especialidad.value = ''
  horariosInput.value = ''
}

async function actualizarProfesional() {
  mensaje.value = ''
  error.value = ''
  try {
    const horarios = horariosInput.value.split(',').map(h => h.trim()).filter(Boolean)
    await updateProfesional(profesionalEditandoId.value, {
      name: nombre.value,
      especialidad: especialidad.value,
      horariosDispo: horarios
    })
    mensaje.value = 'Profesional actualizado correctamente.'
    cancelarEdicion()
    cargarProfesionales()
  } catch (e) {
    error.value = 'Error al actualizar profesional.'
  }
}

async function eliminarProfesional(id) {
  if (!confirm('¿Seguro que deseas eliminar este profesional?')) return
  mensaje.value = ''
  error.value = ''
  try {
    await deleteProfesional(id)
    mensaje.value = 'Profesional eliminado correctamente.'
    if (editando.value && profesionalEditandoId.value === id) {
      cancelarEdicion()
    }
    cargarProfesionales()
  } catch (e) {
    error.value = 'Error al eliminar profesional.'
  }
}
</script>

<style scoped>
.boton-animado-boton {
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
}
.boton-animado-boton:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 4px 16px 0 rgba(80, 0, 120, 0.13);
}
</style>
