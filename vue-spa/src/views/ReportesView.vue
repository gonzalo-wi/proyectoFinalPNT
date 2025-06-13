<template>
  <div class="max-w-4xl mx-auto mt-10 px-4">
    <h2 class="text-3xl font-bold text-purple-700 mb-8 flex items-center gap-2">
      <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z"/></svg>
      Reportes de Turnos
    </h2>
    <div class="bg-white rounded-xl shadow p-6 mb-8 flex flex-wrap gap-6 items-center justify-between">
      <div class="flex flex-wrap gap-4 items-center">
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
          Profesional:
          <select v-model="filtroProfesional" class="border rounded px-2 py-1 focus:ring-purple-400">
            <option value="">Todos</option>
            <option v-for="p in profesionales" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
          Estado:
          <select v-model="filtroEstado" class="border rounded px-2 py-1 focus:ring-purple-400">
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </label>
      </div>
      <button @click="handleExportarCSV" :disabled="loadingExport" class="boton-animado-boton bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        <svg v-if="!loadingExport" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        <svg v-else class="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
        <span v-if="!loadingExport">Exportar CSV</span>
        <span v-else>Cargando...</span>
      </button>
    </div>
    <div class="overflow-x-auto bg-white rounded-xl shadow flex justify-center">
      <table class="min-w-full max-w-3xl mx-auto divide-y divide-purple-100 border border-purple-200 rounded-2xl text-sm overflow-hidden">
        <thead class="bg-gradient-to-r from-purple-100 to-purple-50 rounded-t-2xl">
          <tr>
            <th class="py-4 px-5 text-left font-bold text-purple-700 uppercase tracking-wider rounded-tl-2xl">Cliente</th>
            <th class="py-4 px-5 text-left font-bold text-purple-700 uppercase tracking-wider">Profesional</th>
            <th class="py-4 px-5 text-left font-bold text-purple-700 uppercase tracking-wider">Fecha</th>
            <th class="py-4 px-5 text-left font-bold text-purple-700 uppercase tracking-wider">Horario</th>
            <th class="py-4 px-5 text-left font-bold text-purple-700 uppercase tracking-wider rounded-tr-2xl">Estado</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-purple-50">
          <tr v-for="t in turnosFiltrados" :key="t.id" class="hover:bg-purple-50/70 transition group last:rounded-b-2xl">
            <td class="py-3 px-5 text-gray-900 group-hover:text-purple-700 font-medium">{{ t.cliente }}</td>
            <td class="py-3 px-5 text-gray-900 group-hover:text-purple-700">{{ getNombreProfesional(t.profesionalId) }}</td>
            <td class="py-3 px-5">{{ formatearFecha(t.fecha) }}</td>
            <td class="py-3 px-5">{{ formatearHora(t.fecha) }}</td>
            <td class="py-3 px-5">
              <span :class="estadoClass(t.estado)" class="px-4 py-1 rounded-full text-xs font-semibold capitalize shadow-sm border border-purple-100">
                {{ t.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="turnosFiltrados.length === 0" class="text-center text-gray-500 mt-6 mb-6 w-full">No hay turnos para los filtros seleccionados.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { listarTurnos } from '@/services/turnosService'
import { getProfesionales } from '@/services/profesionalesService'

const turnos = ref([])
const profesionales = ref([])
const filtroProfesional = ref('')
const filtroEstado = ref('')
const loadingExportar = ref(false)
const loadingExport = ref(false)

onMounted(async () => {
  const resTurnos = await listarTurnos()
  turnos.value = resTurnos.data
  const resProfesionales = await getProfesionales()
  profesionales.value = resProfesionales.data
})

const turnosFiltrados = computed(() => {
  return turnos.value.filter(t => {
    const matchProf = !filtroProfesional.value || String(t.profesionalId) === String(filtroProfesional.value)
    const matchEstado = !filtroEstado.value || t.estado === filtroEstado.value
    return matchProf && matchEstado
  })
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

function estadoClass(estado) {
  return {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-green-100 text-green-800',
    cancelado: 'bg-gray-200 text-gray-700'
  }[estado] || 'bg-gray-100 text-gray-700'
}

function exportarCSV() {
  if (loadingExportar.value) return
  loadingExportar.value = true
  setTimeout(() => {
    const rows = [
      ['Cliente', 'Profesional', 'Fecha', 'Horario', 'Estado'],
      ...turnosFiltrados.value.map(t => [
        t.cliente,
        getNombreProfesional(t.profesionalId),
        formatearFecha(t.fecha),
        formatearHora(t.fecha),
        t.estado
      ])
    ]
    const csvContent = rows.map(e => e.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `reporte_turnos_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    loadingExportar.value = false
  }, 1200)
}

async function handleExportarCSV() {
  loadingExport.value = true
  await new Promise(resolve => setTimeout(resolve, 1200)) 
  exportarCSV()
  loadingExport.value = false
}
</script>

<style scoped>
.bg-purple-50 { background-color: #f5f3ff; }
.bg-purple-100 { background-color: #ede9fe; }
.text-purple-700 { color: #7c3aed; }
.text-purple-400 { color: #a78bfa; }
.boton-animado-boton {
  transition: transform 0.13s cubic-bezier(.4,0,.2,1), box-shadow 0.13s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 2px 8px 0 rgba(124,58,237,0.08);
}
.boton-animado-boton:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px 0 rgba(124,58,237,0.13);
}
</style>