<template>
  <div
    class="bg-white rounded-2xl shadow-lg flex flex-col h-full border border-purple-100 hover:shadow-2xl hover:-translate-y-1 transform transition min-h-[420px] cursor-pointer group animate-fade-in-up"
    @click="onCardClick && onCardClick()"
  >
    <div class="flex-1 flex items-center justify-center p-4 relative">
      <img :src="imagen" :alt="'imagen de ' + nombre" class="object-cover rounded-lg w-full" style="height:220px; max-height:220px;" />
      <div v-if="icono" class="absolute top-4 left-4 bg-white bg-opacity-80 rounded-full p-2 shadow">
        <component :is="icono" class="w-7 h-7 text-purple-500" />
      </div>
    </div>
    <div class="flex-1 flex flex-col justify-between px-4 pb-4">
      <h3 class="text-xl font-semibold text-purple-800 mb-1 text-center">{{ nombre }}</h3>
      <p v-if="descripcion" class="text-gray-600 text-sm mb-2 text-center line-clamp-2">{{ descripcion }}</p>
      <div class="flex justify-center gap-2 mb-2">
        <span v-if="duracion" class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">⏱ {{ duracion }}</span>
        <span v-if="precio" class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">${{ precio }}</span>
      </div>
      <div class="flex flex-col gap-2 mt-auto">
        <button
          class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition font-semibold boton-animado-boton flex items-center justify-center gap-2"
          @click.stop="handleSolicitarTurno"
          :disabled="loading"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span v-else>Solicitar turno</span>
        </button>
        <button
          v-if="onVerDetalles"
          class="w-full border border-purple-300 text-purple-700 py-2 px-4 rounded-lg font-semibold hover:bg-purple-50 transition boton-animado-boton flex items-center justify-center gap-2"
          @click.stop="onVerDetalles && onVerDetalles()"
        >
          Ver detalles
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const props = defineProps({
  nombre: String,
  imagen: String,
  descripcion: String,
  duracion: String,
  precio: [String, Number],
  icono: [Object, Function, String],
  onSolicitarTurno: Function,
  onCardClick: Function,
  onVerDetalles: Function
})

function handleSolicitarTurno() {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
    props.onSolicitarTurno && props.onSolicitarTurno()
  }, 1000)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.4,0,0.2,1);
}
.boton-animado-boton {
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
}
.boton-animado-boton:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 4px 16px 0 rgba(80, 0, 120, 0.13);
}
.bg-white.rounded-2xl.shadow-lg.flex.flex-col.h-full.border.border-purple-100.hover\:shadow-2xl.hover\:-translate-y-1.transform.transition.min-h-\[420px\].cursor-pointer.group.animate-fade-in-up {
  transition: box-shadow 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1), filter 0.18s cubic-bezier(.4,0,.2,1);
}
.bg-white.rounded-2xl.shadow-lg.flex.flex-col.h-full.border.border-purple-100.hover\:shadow-2xl.hover\:-translate-y-1.transform.transition.min-h-\[420px\].cursor-pointer.group.animate-fade-in-up:hover {
  box-shadow: 0 8px 32px 0 rgba(80,0,120,0.13), 0 1.5px 8px 0 rgba(80,0,120,0.10);
  transform: translateY(-6px) scale(1.025) rotate(-0.5deg);
  filter: brightness(1.03) saturate(1.08);
}
</style>
