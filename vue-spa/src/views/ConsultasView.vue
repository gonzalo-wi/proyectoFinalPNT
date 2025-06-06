<template>
  <div class="max-w-3xl mx-auto mt-10 px-4">
    <h2 class="text-2xl font-bold text-purple-700 mb-6">📩 Consultas</h2>

  
    <div v-if="usuario.tipoUsuario === 'cliente'" class="bg-white shadow rounded-lg p-6 mb-8">
      <form @submit.prevent="enviarConsulta" class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Escribí tu consulta:</label>
        <textarea
          v-model="nuevaConsulta"
          placeholder="Ej: ¿Qué horarios hay disponibles?"
          required
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
          rows="4"
        ></textarea>
        <button
          type="submit"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-semibold"
        >
          Enviar
        </button>
      </form>
    </div>

    
    <div v-if="consultas.length" class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        {{ usuario.tipoUsuario === 'admin' ? '📋 Todas las Consultas' : '📝 Tus Consultas' }}
      </h3>
      <div
        v-for="c in consultasFiltradas"
        :key="c.id"
        class="bg-white shadow rounded-lg p-4 border-l-4"
        :class="{
          'border-purple-600': !c.respondido,
          'border-green-600': c.respondido
        }"
      >
        <p class="text-sm text-gray-600"><strong>{{ c.cliente }}</strong></p>
        <p class="text-gray-800 mt-1">{{ c.mensaje }}</p>
        <p v-if="usuario.tipoUsuario === 'admin'" class="mt-2 text-xs text-gray-500">
          Estado: 
          <span
            :class="c.respondido ? 'text-green-600 font-semibold' : 'text-yellow-500 font-semibold'"
          >
            {{ c.respondido ? 'Respondida' : 'Pendiente' }}
          </span>
        </p>
       
        <div v-if="c.respuesta" class="mt-2 p-2 bg-green-50 rounded">
          <p class="text-xs text-green-700"><strong>Respuesta:</strong> {{ c.respuesta }}</p>
          <p class="text-xs text-gray-400 mt-1">Respondido el: {{ c.fechaRespuesta ? new Date(c.fechaRespuesta).toLocaleString() : '' }}</p>
        </div>
        
        <div v-if="usuario.tipoUsuario === 'admin' && !c.respondido" class="mt-2">
          <form @submit.prevent="responderConsulta(c)" class="flex gap-2">
            <input
              v-model="respuestas[c.id]"
              type="text"
              placeholder="Escribí una respuesta..."
              class="flex-1 border border-gray-300 rounded-md p-2 text-sm"
              required
            />
            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
            >
              Responder
            </button>
          </form>
        </div>
        
        <div v-if="usuario.tipoUsuario === 'admin' && c.respondido" class="mt-2 flex gap-2">
          <button @click="editarRespuesta(c)" class="text-xs text-blue-600 hover:underline">Editar respuesta</button>
          <button @click="eliminarConsulta(c.id)" class="text-xs text-red-600 hover:underline">Eliminar consulta</button>
        </div>
        
        <div v-if="editandoRespuestaId === c.id" class="mt-2 flex gap-2">
          <input
            v-model="respuestas[c.id]"
            type="text"
            class="flex-1 border border-blue-300 rounded-md p-2 text-sm"
            required
          />
          <button @click="guardarEdicionRespuesta(c)" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-semibold">Guardar</button>
          <button @click="cancelarEdicionRespuesta" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Si no hay consultas -->
    <div v-else class="text-center text-gray-500 mt-10">
      <p>No hay consultas todavía.</p>
    </div>

    <div v-if="mensaje" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded shadow z-50">{{ mensaje }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const usuario = ref(JSON.parse(localStorage.getItem('usuario')))
const consultas = ref([])
const nuevaConsulta = ref('')
const respuestas = ref({}) 
const editandoRespuestaId = ref(null)
const mensaje = ref('') 

onMounted(async () => {
  const res = await fetch('/consultas.json')
  consultas.value = await res.json()
})

const enviarConsulta = () => {
  if (!nuevaConsulta.value.trim()) return
  consultas.value.push({
    id: crypto.randomUUID(),
    cliente: usuario.value.email,
    mensaje: nuevaConsulta.value,
    respondido: false,
    respuesta: '',
    fecha: new Date().toISOString(),
    fechaRespuesta: ''
  })
  nuevaConsulta.value = ''
  mensaje.value = 'Consulta enviada correctamente.'
  setTimeout(() => mensaje.value = '', 2000)
}

const responderConsulta = (consulta) => {
  const respuesta = respuestas.value[consulta.id]
  if (!respuesta || !respuesta.trim()) return
  consulta.respuesta = respuesta
  consulta.respondido = true
  consulta.fechaRespuesta = new Date().toISOString()
  respuestas.value[consulta.id] = ''
  mensaje.value = 'Respuesta enviada.'
  setTimeout(() => mensaje.value = '', 2000)
}

const editarRespuesta = (consulta) => {
  respuestas.value[consulta.id] = consulta.respuesta
  editandoRespuestaId.value = consulta.id
}

const guardarEdicionRespuesta = (consulta) => {
  const nueva = respuestas.value[consulta.id]
  if (!nueva || !nueva.trim()) return
  consulta.respuesta = nueva
  consulta.fechaRespuesta = new Date().toISOString()
  editandoRespuestaId.value = null
  respuestas.value[consulta.id] = ''
  mensaje.value = 'Respuesta editada.'
  setTimeout(() => mensaje.value = '', 2000)
}

const cancelarEdicionRespuesta = () => {
  editandoRespuestaId.value = null
}

const eliminarConsulta = (id) => {
  if (window.confirm('¿Seguro que querés eliminar esta consulta?')) {
    consultas.value = consultas.value.filter(c => c.id !== id)
    mensaje.value = 'Consulta eliminada.'
    setTimeout(() => mensaje.value = '', 2000)
  }
}


const consultasFiltradas = computed(() => {
  let arr = usuario.value.tipoUsuario === 'admin'
    ? consultas.value
    : consultas.value.filter(c => c.cliente === usuario.value.email)
  
  return arr.slice().sort((a, b) => {
    if (a.respondido !== b.respondido) return a.respondido - b.respondido
    return new Date(b.fecha) - new Date(a.fecha)
  })
})
</script>