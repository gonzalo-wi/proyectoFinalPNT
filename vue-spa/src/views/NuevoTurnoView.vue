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
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Confirmar Turno
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProfesionalesByEspecialidad } from '@/services/profesionalesService'

const fs = window.require ? window.require('fs') : null 
const path = '/Users/gonzalowinazki/Desktop/Proyectos/proFinal/vue-spa/public/turnos.json'

const route = useRoute()
const router = useRouter()

const servicio = ref(null)
const profesionalesFiltrados = ref([])
const fecha = ref('')
const profesionalId = ref('')
const horarios = ref([])
const horario = ref('')


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

function confirmarTurno() {
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  if (!usuario) {
    alert('No estás logueado. Redirigiendo al login.')
    router.push({ name: 'Login', query: { redirect: 'NuevoTurno' } })
    return
  }

  const nuevoTurno = {
    id: Date.now(),
    servicioId: servicio.value.id,
    servicioNombre: servicio.value.nombre,
    fecha: fecha.value,
    profesionalId: profesionalId.value,
    horario: horario.value,
    cliente: usuario.email || usuario.name || 'Cliente',
    estado: 'pendiente'
  }

 
  const turnos = JSON.parse(localStorage.getItem('turnos')) || []
  turnos.push(nuevoTurno)
  localStorage.setItem('turnos', JSON.stringify(turnos))

  
  if (fs) {
    try {
      let fileTurnos = []
      if (fs.existsSync(path)) {
        fileTurnos = JSON.parse(fs.readFileSync(path, 'utf-8'))
      }
      fileTurnos.push(nuevoTurno)
      fs.writeFileSync(path, JSON.stringify(fileTurnos, null, 2))
    } catch (e) {
      
      console.error('No se pudo guardar en turnos.json:', e)
    }
  }

  alert('¡Turno reservado con éxito!')
  router.push({ name: 'MiTurno', query: { turnoId: nuevoTurno.id } }) 
}
</script>