<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-3xl font-bold text-purple-700 mb-4 text-center">Reservar Turno</h2>

    <div v-if="servicio">
      <img :src="servicio.imagen" class="w-full h-48 object-cover rounded-lg mb-4" />
      <h3 class="text-2xl font-semibold text-purple-800 mb-2 text-center">{{ servicio.nombre }}</h3>
      <p class="text-center text-gray-600 mb-6">{{ servicio.descripcion }}</p>
    </div>

    <form @submit.prevent="confirmarTurno">
      <label class="block text-gray-700 font-medium mb-2">Fecha</label>
      <input
        type="date"
        v-model="fecha"
        required
        class="w-full border rounded px-3 py-2 mb-4 focus:ring-purple-400"
      />

      <label class="block text-gray-700 font-medium mb-2">Profesional</label>
      <select
        v-model="profesionalId"
        required
        @change="cargarHorarios"
        class="w-full border rounded px-3 py-2 mb-4 focus:ring-purple-400"
      >
        <option disabled value="">Seleccioná un profesional</option>
        <option
          v-for="pro in profesionalesFiltrados"
          :key="pro.id"
          :value="pro.id"
        >{{ pro.name }}</option>
      </select>

      <label class="block text-gray-700 font-medium mb-2">Horario</label>
      <select
        v-model="horario"
        required
        class="w-full border rounded px-3 py-2 mb-6 focus:ring-purple-400"
      >
        <option disabled value="">Seleccioná un horario</option>
        <option
          v-for="h in horarios"
          :key="h"
          :value="h"
        >{{ h }}</option>
      </select>

      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition boton-animado-boton flex items-center justify-center gap-2"
        :disabled="loadingConfirmar"
      >
        <svg v-if="loadingConfirmar" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span v-else>Confirmar Turno</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProfesionalesByEspecialidad } from '@/services/profesionalesService'
import { crearTurno } from '@/services/turnosService'

const route = useRoute()
const router = useRouter()

const servicio = ref(null)
const profesionalesFiltrados = ref([])
const fecha = ref('')
const profesionalId = ref('')
const horarios = ref([])
const horario = ref('')
const loadingConfirmar = ref(false)

const especialistas = {
  1: 'reikista',
  2: 'cosmetologa',
  3: 'masajista'
}


const serviciosDisponibles = [
  {
    id: 1,
    nombre: 'Reiki',
    descripcion: 'Técnica de sanación energética que armoniza cuerpo, mente y emociones.',
    imagen: '/src/assets/reiki.png'
  },
  {
    id: 2,
    nombre: 'Limpieza Facial',
    descripcion: 'Tratamiento profundo que limpia, exfolia y revitaliza la piel.',
    imagen: '/src/assets/facial.png'
  },
  {
    id: 3,
    nombre: 'Masajes Descontracturantes',
    descripcion: 'Alivia tensiones musculares y mejora la circulación.',
    imagen: '/src/assets/masajes.png'
  }
]

onMounted(async () => {
  const id = route.query.servicioId
  servicio.value = serviciosDisponibles.find(s => s.id == id)

  if (servicio.value) {
    const especialidad = especialistas[servicio.value.id]
    profesionalesFiltrados.value = await getProfesionalesByEspecialidad(especialidad)
  }
})

function cargarHorarios() {
  const profesional = profesionalesFiltrados.value.find(p => p.id === profesionalId.value)
  horarios.value = profesional?.horariosDispo || []
  horario.value = ''
}

async function confirmarTurno() {
  if (loadingConfirmar.value) return
  loadingConfirmar.value = true
  setTimeout(async () => {
    loadingConfirmar.value = false
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if (!usuario) {
      alert('No estás logueado. Redirigiendo al login.')
      router.push({ name: 'Login', query: { redirect: 'NuevoTurno' } })
      return
    }

    const nuevoTurno = {
      cliente: usuario.email || usuario.name || 'Cliente',
      profesionalId: profesionalId.value,
      fecha: fecha.value + 'T' + (horario.value || '00:00:00'),
      estado: 'pendiente'
    }

    try {
      const res = await crearTurno(nuevoTurno)
      const turnoCreado = res.data
      alert('¡Turno reservado con éxito!')
      router.push({ name: 'MiTurno', query: { turnoId: turnoCreado.id } })
    } catch (e) {
      alert('Error al reservar el turno. Intenta nuevamente.')
      console.error(e)
    }
  }, 1200)
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