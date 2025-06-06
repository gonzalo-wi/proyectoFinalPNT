<template>
  <nav class="bg-purple-700 text-white px-4 py-3 flex justify-between items-center shadow-md">
    <div class="text-xl font-bold">Centro de Bienestar</div>

    <div class="flex items-center gap-6">
      <!-- Links -->
      <router-link
        to="/dashboard"
        class="hover:underline"
        active-class="font-bold underline"
      >Dashboard</router-link>

      <router-link
        to="/turnos"
        class="hover:underline"
        active-class="font-bold underline"
      >Turnos</router-link>

     
      <span class="hidden sm:inline">Hola, {{ nombreUsuario }}</span>
      <button
        @click="cerrarSesion"
        class="bg-purple-900 hover:bg-purple-800 px-3 py-1 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  router.push('/')
}

const nombreUsuario = JSON.parse(localStorage.getItem('usuario'))?.name || 'Usuario'
</script>