<template>
  <div class="max-w-4xl mx-auto mt-10 px-4">
    <h2 class="text-2xl font-bold text-purple-700 mb-6">📋 Consultas de Usuarios</h2>
    <div v-if="consultas.length" class="space-y-4">
      <div
        v-for="c in preguntasConRespuesta"
        :key="c.id"
        class="bg-white shadow rounded-lg p-4 border-l-4 border-purple-600 mb-2"
      >
        <p class="text-sm text-gray-600"><strong>Email:</strong> {{ userIdToEmail[c.user_id] || 'Desconocido' }}</p>
        <p class="text-gray-800 mt-1">{{ c.message }}</p>
        <p class="text-xs text-gray-500 mt-1">Fecha: {{ new Date(c.timestamp).toLocaleString() }}</p>
        <div v-if="c.respuesta" class="mt-2 p-2 bg-green-50 rounded">
          <p class="text-xs text-green-700"><strong>Respuesta enviada:</strong> {{ c.respuesta.message }}</p>
          <p class="text-xs text-gray-400 mt-1">Respondido el: {{ new Date(c.respuesta.timestamp).toLocaleString() }}</p>
        </div>
        <div v-else class="mt-2 flex gap-2">
          <input
            v-model="respuestas[c.id]"
            type="text"
            placeholder="Escribí una respuesta..."
            class="flex-1 border border-gray-300 rounded-md p-2 text-sm"
          />
          <button
            @click="responderConsulta(c)"
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
          >
            Responder
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-10">
      <p>No hay consultas todavía.</p>
    </div>
    <div v-if="mensaje" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded shadow z-50">{{ mensaje }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { obtenerUsuarios } from '@/services/usuariosService'

const consultas = ref([])
const respuestas = ref({})
const mensaje = ref('')
const usuarios = ref([])

const userIdToEmail = computed(() => {
  const map = {}
  usuarios.value.forEach(u => { map[u.id] = u.email })
  return map
})

// Trae todas las preguntas y respuestas
const fetchConsultas = async () => {
  const res = await axios.get('http://localhost:8000/chat/messages')
  consultas.value = Array.isArray(res.data) ? res.data : []
}

const fetchUsuarios = async () => {
  try {
    const res = await obtenerUsuarios()
    usuarios.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    usuarios.value = []
  }
}

onMounted(() => {
  fetchConsultas()
  fetchUsuarios()
})


const preguntasUsuario = computed(() =>
  consultas.value.filter(c => !c.is_from_admin)
)


const respuestasPorPregunta = computed(() => {
  const map = {}
  preguntasUsuario.value.forEach((pregunta, idx, arr) => {
    
    const siguientePregunta = arr.slice(idx + 1).find(p => p.user_id === pregunta.user_id)
    
    const respuesta = consultas.value.find(c =>
      c.is_from_admin &&
      c.user_id === pregunta.user_id &&
      new Date(c.timestamp) > new Date(pregunta.timestamp) &&
      (!siguientePregunta || new Date(c.timestamp) < new Date(siguientePregunta.timestamp))
    )
    if (respuesta) map[pregunta.id] = respuesta
  })
  return map
})


const preguntasConRespuesta = computed(() =>
  preguntasUsuario.value.map(pregunta => ({
    ...pregunta,
    respuesta: respuestasPorPregunta.value[pregunta.id] || null
  }))
)

const responderConsulta = async (pregunta) => {
  const texto = respuestas.value[pregunta.id]
  if (!texto || !texto.trim()) return
  
  await axios.post(`http://localhost:8000/chat/users/${pregunta.user_id}/messages`, {
    message: texto,

    is_from_admin: true
  })
  await fetchConsultas()
  respuestas.value[pregunta.id] = ''
  mensaje.value = 'Respuesta enviada.'
  setTimeout(() => mensaje.value = '', 2000)
}
</script>
