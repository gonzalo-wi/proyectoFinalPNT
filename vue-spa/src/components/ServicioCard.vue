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
          class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition font-semibold transform hover:scale-105 hover:-translate-y-1 duration-200"
          @click.stop="onSolicitarTurno && onSolicitarTurno()"
        >
          Solicitar turno
        </button>
        <button
          v-if="onVerDetalles"
          class="w-full border border-purple-300 text-purple-700 py-2 px-4 rounded-lg font-semibold hover:bg-purple-50 transition"
          @click.stop="onVerDetalles && onVerDetalles()"
        >
          Ver detalles
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
</style>
