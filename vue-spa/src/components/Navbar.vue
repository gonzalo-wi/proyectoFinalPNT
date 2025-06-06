<template>
  <nav class="bg-purple-700 text-white px-4 py-3 flex justify-between items-center shadow-md">
    <div class="flex items-center gap-3">
      <img src="/src/assets/LogoEste.png" alt="Logo" class="h-8 w-8 rounded-full bg-white p-1" />
      <span class="text-xl font-bold">Centro de Bienestar</span>
    </div>

    <div class="flex items-center gap-6">
      <router-link
      v-if="tipoUsuario === 'admin'"
        to="/dashboard"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-yellow-300"
      >Dashboard</router-link>

      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/turnos"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-yellow-300"
      >Turnos</router-link>

      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/reportes"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-yellow-300"
      >Reportes</router-link>

      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/consultas"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-yellow-300"
      >Consultas</router-link>

      <span class="hidden sm:flex items-center gap-2 bg-purple-900 px-2 py-1 rounded-full">
        <span class="bg-white text-purple-700 rounded-full w-6 h-6 flex items-center justify-center font-bold">{{ inicialUsuario }}</span>
        <span>Hola, {{ nombreUsuario }}</span>
        <span class="text-xs ml-2 px-2 py-0.5 rounded bg-purple-600">{{ tipoUsuario }}</span>
      </span>
      <button
        @click="confirmarCerrarSesion"
        class="bg-purple-900 hover:bg-purple-800 px-3 py-1 rounded transition-all duration-150"
      >
        Cerrar sesión
      </button>
    </div>
  </nav>
 
  <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-80">
      <p class="mb-4">¿Seguro que querés cerrar sesión?</p>
      <div class="flex justify-end gap-2">
        <button @click="cerrarSesion" class="bg-purple-700 text-white px-3 py-1 rounded">Sí</button>
        <button @click="mostrarModal = false" class="bg-gray-300 px-3 py-1 rounded">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mostrarModal = ref(false)

const usuarioObj = JSON.parse(localStorage.getItem('usuario')) || {}
const nombreUsuario = usuarioObj.name || 'Usuario'
const tipoUsuario = usuarioObj.tipoUsuario || 'cliente'
const inicialUsuario = nombreUsuario.charAt(0).toUpperCase()

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  mostrarModal.value = false
  router.push('/')
}

const confirmarCerrarSesion = () => {
  mostrarModal.value = true
}
</script>