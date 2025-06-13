<template>
  <nav class="bg-[#E6E6FA] text-purple-900 px-4 py-3 flex justify-between items-center shadow-md relative">
    <div class="flex items-center gap-3">
      <img src="/src/assets/LogoEste.png" alt="Logo" class="h-8 w-8 rounded-full bg-white p-1" />
      <span class="text-xl font-bold">Centro de Bienestar</span>
    </div>

    
    <button @click="menuAbierto = !menuAbierto" class="sm:hidden focus:outline-none ml-2" aria-label="Abrir menú">
      <svg v-if="!menuAbierto" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>

    
    <div class="hidden sm:flex items-center gap-6">
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
        class="px-3 py-1 rounded transition-all duration-150 text-white boton-animado-boton"
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

   
    <transition name="fade">
      <div v-if="menuAbierto" class="sm:hidden fixed inset-0 z-40">
        
        <div class="absolute inset-0 bg-[#E6E6FA]" style="opacity: 1 !important; pointer-events: auto; z-index: 40;"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-[#E6E6FA] bg-opacity-100 shadow-lg animate-slide-down flex flex-col gap-3 py-6 px-5 overflow-y-auto z-50">
          <button @click="menuAbierto = false" aria-label="Cerrar menú" class="self-end mb-2 text-purple-700 hover:text-purple-900 text-3xl font-bold focus:outline-none">&times;</button>
          <router-link
            v-if="tipoUsuario === 'admin'"
            to="/dashboard"
            class="py-2 px-2 rounded hover:bg-purple-100 transition"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Dashboard</router-link>
          <router-link
            v-if="tipoUsuario === 'admin'"
            to="/turnos"
            class="py-2 px-2 rounded hover:bg-purple-100 transition"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Turnos</router-link>
          <router-link
            v-if="tipoUsuario === 'admin'"
            to="/reportes"
            class="py-2 px-2 rounded hover:bg-purple-100 transition"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Reportes</router-link>
          <router-link
            v-if="tipoUsuario === 'admin'"
            to="/consultas-admin"
            class="py-2 px-2 rounded hover:bg-purple-100 transition"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Consultas</router-link>
          <router-link
            v-if="tipoUsuario === 'admin'"
            to="/alta-profesional"
            class="py-2 px-2 rounded hover:bg-purple-100 transition font-semibold"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Alta Profesional</router-link>
          <router-link
            v-if="usuarioLogueado && tipoUsuario !== 'admin'"
            to="/mis-turnos"
            class="py-2 px-2 rounded hover:bg-purple-100 transition font-semibold"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Mis Turnos</router-link>
          <router-link
            v-if="usuarioLogueado"
            to="/servicios"
            class="py-2 px-2 rounded hover:bg-purple-100 transition font-semibold"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Servicios</router-link>
          <router-link
            v-if="usuarioLogueado && tipoUsuario !== 'admin'"
            to="/consultas"
            class="py-2 px-2 rounded hover:bg-purple-100 transition font-semibold"
            active-class="font-bold text-purple-600"
            @click="menuAbierto = false"
          >Mis Consultas</router-link>
          <span
            v-if="usuarioLogueado"
            class="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8BFD8] mt-2"
          >
            <span class="bg-white text-purple-700 rounded-full w-6 h-6 flex items-center justify-center font-bold">{{ inicialUsuario }}</span>
            <span>Hola, {{ nombreUsuario }}</span>
            <span class="text-xs ml-2 px-2 py-0.5 rounded bg-purple-300">{{ tipoUsuario }}</span>
          </span>
          <button
            v-if="usuarioLogueado"
            @click="confirmarCerrarSesion; menuAbierto = false"
            class="px-3 py-1 rounded transition-all duration-150 text-white mt-4 boton-animado-boton"
            style="background-color: #CBA0D4;"
          >Cerrar sesión</button>
          <button
            v-else
            @click="irALogin; menuAbierto = false"
            class="px-3 py-1 rounded transition-all duration-150 text-white mt-4"
            style="background-color: #CBA0D4;"
          >Iniciar sesión</button>
        </div>
      </div>
    </transition>
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
const menuAbierto = ref(false)

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

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes slide-down {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-down {
  animation: slide-down 0.18s cubic-bezier(.4,0,.2,1);
}
.bg-\[\#E6E6FA\] {
  background-color: #E6E6FA !important;
  opacity: 1 !important;
}
.boton-animado-boton {
  transition: transform 0.13s cubic-bezier(.4,0,.2,1), box-shadow 0.13s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 2px 8px 0 rgba(124,58,237,0.08);
}
.boton-animado-boton:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px 0 rgba(124,58,237,0.13);
}
</style>