<template>
  <div class="max-w-5xl mx-auto mt-10 px-4">
    <h2 class="text-3xl font-bold text-purple-700 mb-8 text-center flex items-center justify-center gap-2">
      <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z"/></svg>
      Dashboard
    </h2>
    <div class="grid md:grid-cols-2 gap-8">
      
      <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center">
        <h3 class="text-xl font-semibold text-purple-700 mb-4">Turnos por Profesional</h3>
        <canvas ref="chartCanvas" id="turnosPorProfesionalChart" class="w-full max-w-xs"></canvas>
      </div>
     
      <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
        <h3 class="text-xl font-semibold text-purple-700 mb-4">KPIs</h3>
        <div class="flex flex-col gap-4 w-full items-center">
          <div class="bg-purple-50 rounded-lg px-6 py-4 text-center shadow w-full">
            <div class="text-2xl font-bold text-purple-800">{{ totalTurnos }}</div>
            <div class="text-sm text-purple-600">Total de turnos</div>
          </div>
          <div class="bg-blue-50 rounded-lg px-6 py-4 text-center shadow w-full">
            <div class="text-2xl font-bold text-blue-800">{{ totalProfesionales }}</div>
            <div class="text-sm text-blue-600">Profesionales activos</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { listarTurnos } from '@/services/turnosService'
import { getProfesionales } from '@/services/profesionalesService'

const totalTurnos = ref(0)
const totalProfesionales = ref(0)
const turnosPorProfesional = ref([])
const profesionalesNombres = ref([])
const chartInstance = ref(null)
const chartCanvas = ref(null)

onMounted(async () => {
  
  const turnos = (await listarTurnos()).data
  const profesionales = (await getProfesionales()).data

  totalTurnos.value = turnos.length
  totalProfesionales.value = profesionales.length

  
  const conteo = {}
  turnos.forEach(t => {
    conteo[t.profesionalId] = (conteo[t.profesionalId] || 0) + 1
  })
  turnosPorProfesional.value = profesionales.map(p => conteo[p.id] || 0)
  profesionalesNombres.value = profesionales.map(p => p.name)

  await nextTick()
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  const ctx = chartCanvas.value.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: profesionalesNombres.value,
      datasets: [{
        label: 'Turnos',
        data: turnosPorProfesional.value,
        backgroundColor: [
          '#a78bfa', '#818cf8', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#facc15'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  })
})
</script>

<style scoped>
#turnosPorProfesionalChart {
  min-height: 260px;
}
</style>