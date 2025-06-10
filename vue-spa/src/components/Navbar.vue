<template>
  <nav class="bg-[#E6E6FA] text-purple-900 px-4 py-3 flex justify-between items-center shadow-md">
    <div class="flex items-center gap-3">
      <img src="/src/assets/LogoEste.png" alt="Logo" class="h-8 w-8 rounded-full bg-white p-1" />
      <span class="text-xl font-bold">Centro de Bienestar</span>
    </div>

    <div class="flex items-center gap-6">
      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/dashboard"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-purple-600"
      >Dashboard</router-link>

      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/turnos"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-purple-600"
      >Turnos</router-link>

      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/reportes"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-purple-600"
      >Reportes</router-link>

      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/consultas-admin"
        class="hover:underline transition-all duration-150"
        active-class="font-bold underline text-purple-600"
      >Consultas</router-link>

      <router-link
        v-if="tipoUsuario === 'admin'"
        to="/alta-profesional"
        class="hover:underline transition-all duration-150 font-semibold"
        active-class="font-bold underline text-purple-600"
      >Alta Profesional</router-link>

      <router-link
        v-if="usuarioLogueado && tipoUsuario !== 'admin'"
        to="/mis-turnos"
        class="hover:underline transition-all duration-150 font-semibold"
        active-class="font-bold underline text-purple-600"
      >Mis Turnos</router-link>

      <router-link
        v-if="usuarioLogueado"
        to="/servicios"
        class="hover:underline transition-all duration-150 font-semibold"
        active-class="font-bold underline text-purple-600"
      >Servicios</router-link>

      <router-link
        v-if="usuarioLogueado && tipoUsuario !== 'admin'"
        to="/consultas"
        class="hover:underline transition-all duration-150 font-semibold"
        active-class="font-bold underline text-purple-600"
      >Mis Consultas</router-link>

      <span
        v-if="usuarioLogueado"
        class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full"
        style="background-color: #D8BFD8;"
      >
        <span class="bg-white text-purple-700 rounded-full w-6 h-6 flex items-center justify-center font-bold">{{ inicialUsuario }}</span>
        <span>Hola, {{ nombreUsuario }}</span>
        <span class="text-xs ml-2 px-2 py-0.5 rounded bg-purple-300">{{ tipoUsuario }}</span>
      </span>

      <button
        v-if="usuarioLogueado"
        @click="confirmarCerrarSesion"
        class="px-3 py-1 rounded transition-all duration-150 text-white"
        style="background-color: #CBA0D4;"
      >
        Cerrar sesión
      </button>

      <button
        v-else
        @click="irALogin"
        class="px-3 py-1 rounded transition-all duration-150 text-white"
        style="background-color: #CBA0D4;"
      >
        Iniciar sesión
      </button>
    </div>
  </nav>

  <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-80">
      <p class="mb-4">¿Seguro que querés cerrar sesión?</p>
      <div class="flex justify-end gap-2">
        <button @click="cerrarSesion" class="bg-purple-400 text-white px-3 py-1 rounded">Sí</button>
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
const nombreUsuario = usuarioObj.name && typeof usuarioObj.name === 'string' ? usuarioObj.name : (usuarioObj.email ? usuarioObj.email.split('@')[0] : 'Usuario')
const tipoUsuario = usuarioObj.tipoUsuario || 'cliente'
const inicialUsuario = nombreUsuario.charAt(0).toUpperCase()
const usuarioLogueado = !!localStorage.getItem('usuario')

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  mostrarModal.value = false
  router.push('/')
}

const confirmarCerrarSesion = () => {
  mostrarModal.value = true
}

const irALogin = () => {
  router.push({ name: 'Login' })
}
</script>