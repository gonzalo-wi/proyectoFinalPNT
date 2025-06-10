<template>
  <div class="max-w-3xl mx-auto mt-10 px-4">
    <h2 class="text-2xl font-bold text-purple-700 mb-6">📩 Consultas</h2>
    <div class="bg-white shadow rounded-lg p-6 mb-8">
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
    <div v-if="consultasFiltradas.length" class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">📝 Tus Consultas</h3>
      <div
        v-for="c in consultasFiltradas"
        :key="c.id"
        class="bg-white shadow rounded-lg p-4 border-l-4 border-purple-600"
      >
        <p class="text-gray-800 mt-1">{{ c.message }}</p>
        <div v-if="respuestasAdmin(c)" class="mt-2 p-2 bg-green-50 rounded">
          <p class="text-xs text-green-700"><strong>Respuesta del admin:</strong> {{ respuestasAdmin(c).message }}</p>
          <p class="text-xs text-gray-400 mt-1">Respondido el: {{ new Date(respuestasAdmin(c).timestamp).toLocaleString() }}</p>
        </div>
        <div v-else class="text-xs text-yellow-600 mt-2">Aún sin responder</div>
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
import { getConsultas, createConsulta } from '@/services/consultasService'

const usuario = ref(JSON.parse(localStorage.getItem('usuario')))
const consultas = ref([])
const nuevaConsulta = ref('')
const mensaje = ref('')

onMounted(async () => {
  if (usuario.value) {
    const res = await getConsultas(usuario.value.id)
    consultas.value = res.data
  }
})

const enviarConsulta = async () => {
  if (!nuevaConsulta.value.trim()) return
  const nueva = {
    message: nuevaConsulta.value
  }
  await createConsulta(usuario.value.id, nueva)
  const res = await getConsultas(usuario.value.id)
  consultas.value = res.data
  nuevaConsulta.value = ''
  mensaje.value = 'Consulta enviada correctamente.'
  setTimeout(() => mensaje.value = '', 2000)
}

const consultasFiltradas = computed(() =>
  consultas.value
    .filter(c => c.user_id === usuario.value.id && !c.is_from_admin)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
)


function respuestasAdmin(consulta) {
  
  return consultas.value.find(
    c => c.is_from_admin && c.user_id === consulta.user_id && new Date(c.timestamp) > new Date(consulta.timestamp)
  )
}
</script>