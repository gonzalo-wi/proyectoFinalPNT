<template>
  <div
    class="bg-white rounded-2xl shadow-lg flex flex-col h-full border border-purple-100 hover:shadow-2xl hover:-translate-y-1 transform transition min-h-[420px] cursor-pointer"
    @click="onCardClick && onCardClick()"
  >
    <div class="flex-1 flex items-center justify-center p-4">
      <img :src="imagen" :alt="'imagen de ' + nombre" class="object-cover rounded-lg w-full" style="height:260px; max-height:260px;" />
    </div>
    <div class="flex-1 flex flex-col justify-between px-4 pb-4">
      <h3 class="text-xl font-semibold text-purple-800 mb-2 text-center">{{ nombre }}</h3>
      <button
        class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition font-semibold mt-auto transform hover:scale-105 hover:-translate-y-1 duration-200"
        @click.stop="onSolicitarTurno && onSolicitarTurno()"
      >
        Solicitar turno
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nombre: String,
  imagen: String,
  onSolicitarTurno: Function,
  onCardClick: Function
})
</script>
