<template>
  <div class="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-purple-700 mb-6 text-center">¡Turno reservado!</h2>
    <div v-if="turno">
      <div class="mb-4">
        <span class="font-semibold">Servicio:</span> {{ turno.servicioNombre }}
      </div>
      <div class="mb-4">
        <span class="font-semibold">Profesional:</span> {{ nombreProfesional }}
      </div>
      <div class="mb-4">
        <span class="font-semibold">Fecha:</span> {{ turno.fecha }}
      </div>
      <div class="mb-4">
        <span class="font-semibold">Horario:</span> {{ turno.horario }}
      </div>
      <div class="mb-4">
        <span class="font-semibold">Estado:</span> <span class="capitalize">{{ turno.estado }}</span>
      </div>
      <div class="mb-4">
        <span class="font-semibold">Cliente:</span> {{ turno.cliente }}
      </div>
      <router-link to="/servicios" class="block mt-6 text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold">Volver a servicios</router-link>
    </div>
    <div v-else class="text-center text-gray-500">No se encontró información del turno.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProfesionales } from '@/services/profesionalesService'

const route = useRoute()
const turno = ref(null)
const nombreProfesional = ref('')

onMounted(async () => {
  const turnoId = route.query.turnoId
  const turnos = JSON.parse(localStorage.getItem('turnos')) || []
  turno.value = turnos.find(t => String(t.id) === String(turnoId))
  if (turno.value) {
    const res = await getProfesionales()
    const profesional = res.data.find(p => String(p.id) === String(turno.value.profesionalId))
    nombreProfesional.value = profesional ? profesional.name : 'Desconocido'
  }
})
</script>
