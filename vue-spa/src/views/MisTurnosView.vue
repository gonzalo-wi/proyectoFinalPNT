<template>
  <div class="max-w-3xl mx-auto mt-10 px-4">
    <h2 class="text-2xl font-bold text-purple-700 mb-6">🗓️ Mis Turnos</h2>
    <div v-if="misTurnos.length === 0" class="text-center text-gray-500 mt-10">
      <p>No tenés turnos reservados todavía.</p>
      <router-link to="/servicios" class="boton-animado-boton bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all inline-block mt-4">
        Reservar un turno
      </router-link>
    </div>
    <div v-else class="space-y-4">
      <div v-for="t in misTurnos" :key="t.id" class="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-600">
        <p><strong>Profesional:</strong> {{ getNombreProfesional(t.profesionalId) }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(t.fecha) }}</p>
        <p><strong>Horario:</strong> {{ formatearHora(t.fecha) }}</p>
        <p><strong>Estado:</strong> <span class="capitalize">{{ t.estado }}</span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfesionales } from '@/services/profesionalesService'
import { listarTurnosPorCliente } from '@/services/turnosService'

const misTurnos = ref([])
const profesionales = ref([])

onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  if (usuario) {
    try {
      const res = await listarTurnosPorCliente(usuario.email || usuario.name)
      misTurnos.value = res.data
    } catch (e) {
      misTurnos.value = []
    }
  }
  const res = await getProfesionales()
  profesionales.value = res.data
})

function getNombreProfesional(id) {
  const p = profesionales.value.find(pro => String(pro.id) === String(id))
  return p ? p.name : 'Desconocido'
}

function formatearFecha(fechaStr) {
  const d = new Date(fechaStr)
  return d.toLocaleDateString()
}

function formatearHora(fechaStr) {
  const d = new Date(fechaStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.boton-animado-boton {
  transition: transform 0.13s cubic-bezier(.4,0,.2,1), box-shadow 0.13s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 2px 8px 0 rgba(124,58,237,0.08);
}
.boton-animado-boton:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px 0 rgba(124,58,237,0.13);
}
</style>
