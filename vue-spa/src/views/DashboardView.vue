<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <motion.div
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }"
      class="text-center mb-12"
    >
      <h2 class="text-4xl font-bold text-purple-700 flex justify-center items-center gap-3">
        <svg class="w-10 h-10 text-purple-400 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" />
        </svg>
        <span>Panel de Estadisticas</span>
      </h2>
      <p class="text-gray-500 mt-6 text-lg">Visualización de turnos, clientes y KPIs del centro</p>
    </motion.div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <motion.div
        v-motion="{
          initial: { opacity: 0, scale: 0.9 },
          enter: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } }
        }"
        class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
      >
        <h3 class="text-lg font-semibold text-purple-700 mb-4 text-center">Turnos por Profesional</h3>
        <canvas ref="chartCanvas" class="w-full h-64 max-w-full" style="aspect-ratio: 1.7 / 1;"></canvas>
        <div class="mt-6 w-full flex flex-col items-center">
          <div class="bg-white rounded-lg shadow text-center py-4 w-full mb-2">
            <div class="text-2xl font-bold text-purple-700">{{ totalTurnos }}</div>
            <div class="text-sm text-gray-500">Total de turnos</div>
          </div>
          <div class="bg-white rounded-lg shadow text-center py-4 w-full">
            <div class="text-lg font-bold text-purple-700">{{ profesionalesNombres[turnosPorProfesional.indexOf(Math.max(...turnosPorProfesional))] || '-' }}</div>
            <div class="text-sm text-gray-500">Profesional con más turnos</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        v-motion="{
          initial: { opacity: 0, scale: 0.9 },
          enter: { opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.5 } }
        }"
        class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
      >
        <h3 class="text-lg font-semibold text-purple-700 mb-4 text-center">Turnos por Día (Mes Actual)</h3>
        <canvas ref="turnosMesCanvas" class="w-full h-64 max-w-full" style="aspect-ratio: 1.7 / 1;"></canvas>
        <div class="mt-6 w-full flex flex-col items-center">
          <div class="bg-white rounded-lg shadow text-center py-4 w-full mb-2">
            <div class="text-2xl font-bold text-purple-700">{{ Math.max(...turnosPorDia) }}</div>
            <div class="text-sm text-gray-500">Máximo turnos en un día</div>
          </div>
          <div class="bg-white rounded-lg shadow text-center py-4 w-full">
            <div class="text-lg font-bold text-purple-700">{{ turnosPorDia.indexOf(Math.max(...turnosPorDia)) + 1 }}</div>
            <div class="text-sm text-gray-500">Día con más turnos</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        v-motion="{
          initial: { opacity: 0, scale: 0.9 },
          enter: { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.5 } }
        }"
        class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
      >
        <h3 class="text-lg font-semibold text-purple-700 mb-4 text-center">Cliente con Más Turnos</h3>
        <canvas ref="clienteTopCanvas" class="w-full h-64 max-w-full" style="aspect-ratio: 1.7 / 1;"></canvas>
        <div class="mt-6 w-full flex flex-col items-center">
          <div class="bg-white rounded-lg shadow text-center py-4 w-full mb-2">
            <div class="text-2xl font-bold text-purple-700">{{ clienteTop }}</div>
            <div class="text-sm text-gray-500">Cantidad de turnos</div>
          </div>
          <div class="bg-white rounded-lg shadow text-center py-4 w-full">
            <div class="text-lg font-bold text-purple-700">{{ clienteTopNombre }}</div>
            <div class="text-sm text-gray-500">Cliente top</div>
          </div>
        </div>
      </motion.div>

     
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { useMotion } from '@vueuse/motion'
import { listarTurnos } from '@/services/turnosService'
import { getProfesionales } from '@/services/profesionalesService'

const totalTurnos = ref(0)
const totalProfesionales = ref(0)
const turnosPorProfesional = ref([])
const profesionalesNombres = ref([])
const chartCanvas = ref(null)
const turnosMesCanvas = ref(null)
const clienteTopCanvas = ref(null)
const turnosPorDia = ref([])
const clienteTop = ref(0)
const clienteTopNombre = ref('-')
let chartInstance, chartMesInstance, chartClienteInstance

onMounted(async () => {
  const turnos = (await listarTurnos()).data
  const profesionales = (await getProfesionales()).data
  totalTurnos.value = turnos.length
  totalProfesionales.value = profesionales.length

  
  const conteo = {}
  turnos.forEach(t => conteo[t.profesionalId] = (conteo[t.profesionalId] || 0) + 1)
  turnosPorProfesional.value = profesionales.map(p => conteo[p.id] || 0)
  profesionalesNombres.value = profesionales.map(p => p.name)

  
  const now = new Date()
  const mes = now.getMonth()
  const anio = now.getFullYear()
  const dias = new Date(anio, mes + 1, 0).getDate()
  const turnosDiaArr = Array(dias).fill(0)
  turnos.forEach(t => {
    const f = new Date(t.fecha)
    if (f.getMonth() === mes && f.getFullYear() === anio) turnosDiaArr[f.getDate() - 1]++
  })
  turnosPorDia.value = turnosDiaArr

 
  const conteoClientes = {}
  turnos.forEach(t => {
    const nombre = t.cliente || t.clienteNombre
    if (nombre) conteoClientes[nombre] = (conteoClientes[nombre] || 0) + 1
  })
  const clientes = Object.keys(conteoClientes)
  const datos = Object.values(conteoClientes)
  if (clientes.length > 0) {
    const maxIdx = datos.indexOf(Math.max(...datos))
    clienteTop.value = datos[maxIdx]
    clienteTopNombre.value = clientes[maxIdx]
  } else {
    clienteTop.value = 0
    clienteTopNombre.value = '-'
  }

  await nextTick()
  chartInstance?.destroy()
  chartInstance = new Chart(chartCanvas.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: profesionalesNombres.value,
      datasets: [{ data: turnosPorProfesional.value, backgroundColor: '#a78bfa', borderRadius: 8 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  })

  const mesActual = new Date().getMonth()
  const anioActual = new Date().getFullYear()
  const diasDelMes = new Date(anioActual, mesActual + 1, 0).getDate()
  const turnosPorDiaDelMes = Array(diasDelMes).fill(0)
  turnos.forEach(t => {
    const fechaTurno = new Date(t.fecha)
    if (fechaTurno.getMonth() === mesActual && fechaTurno.getFullYear() === anioActual) {
      turnosPorDiaDelMes[fechaTurno.getDate() - 1]++
    }
  })

  chartMesInstance?.destroy()
  chartMesInstance = new Chart(turnosMesCanvas.value.getContext('2d'), {
    type: 'line',
    data: {
      labels: Array.from({ length: diasDelMes }, (_, i) => `${i + 1}`),
      datasets: [{ data: turnosPorDiaDelMes, fill: true, backgroundColor: 'rgba(129, 140, 248, 0.2)', borderColor: '#7c3aed', tension: 0.3 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })

  chartClienteInstance?.destroy()
  chartClienteInstance = new Chart(clienteTopCanvas.value.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: clientes,
      datasets: [{ data: datos, backgroundColor: ['#a78bfa', '#818cf8', '#f472b6', '#fbbf24'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '70%' }
  })
})
</script>

<style scoped>
canvas {
  max-height: 300px;
  width: 100% !important;
  height: auto !important;
  display: block;
}
</style>
