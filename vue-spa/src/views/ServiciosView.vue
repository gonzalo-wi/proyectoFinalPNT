<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-center mb-8 text-purple-700">Servicios de Bienestar</h2>

    <div class="grid md:grid-cols-3 gap-8">
      <ServicioCard
        v-for="servicio in servicios"
        :key="servicio.id"
        :nombre="servicio.nombre"
        :imagen="servicio.imagen"
        :onSolicitarTurno="() => solicitarTurno(servicio)"
        :onCardClick="() => verDetalles(servicio)"
      />
    </div>

    
    <div v-if="servicioSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl p-0 max-w-3xl w-full shadow-2xl relative overflow-hidden animate-fade-in">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-8">
            <img :src="servicioSeleccionado.imagen" class="w-full h-80 object-cover rounded-2xl shadow-md" />
          </div>
          <div class="md:w-1/2 flex flex-col justify-between p-8">
            <button @click="cerrarModal" class="absolute top-4 right-6 text-gray-400 hover:text-red-600 text-3xl font-bold">&times;</button>
            <h3 class="text-3xl font-bold text-purple-800 mb-4">{{ servicioSeleccionado.nombre }}</h3>
            <p class="text-gray-700 mb-8 text-lg leading-relaxed">{{ servicioSeleccionado.descripcion }}</p>
            <button
              class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow transition"
              @click="solicitarTurno(servicioSeleccionado)"
            >
              Reservar este servicio
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ServicioCard from '@/components/ServicioCard.vue'

const router = useRouter()
const servicioSeleccionado = ref(null)

const servicios = ref([
  {
    id: 1,
    nombre: 'Reiki',
    descripcion: 'Técnica milenaria de sanación energética que busca armonizar cuerpo, mente y emociones. Ideal para reducir el estrés, aliviar tensiones y equilibrar tu energía vital.',
    imagen: '/src/assets/reiki.png'
  },
  {
    id: 2,
    nombre: 'Limpieza Facial',
    descripcion: 'Tratamiento profundo que elimina impurezas, células muertas y exceso de grasa. Devuelve luminosidad y frescura a tu piel, dejándola suave, limpia y renovada.',
    imagen: '/src/assets/facial.png'
  },
  {
    id: 3,
    nombre: 'Masajes Descontracturantes',
    descripcion: 'Relajá tu cuerpo y liberá tensiones profundas con un masaje descontracturante. Perfecto para aliviar dolores musculares, mejorar la circulación y recuperar tu bienestar físico.',
    imagen: '/src/assets/masajes.png'
  }
])

function solicitarTurno(servicio) {
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  if (!usuario) {
    // Redirige al login y pasa el servicioId como redirect
    router.push({
      name: 'Login',
      query: { redirect: 'NuevoTurno', servicioId: servicio.id }
    })
    return
  } else {
    router.push({ name: 'NuevoTurno', query: { servicioId: servicio.id } })
  }
}

function verDetalles(servicio) {
  servicioSeleccionado.value = servicio
}

function cerrarModal() {
  servicioSeleccionado.value = null
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.25s cubic-bezier(0.4,0,0.2,1);
}
</style>