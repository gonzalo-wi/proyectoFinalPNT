<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-purple-700 mb-6 text-center">Crear una cuenta</h2>

    <form @submit.prevent="registrarse">
      <label class="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
      <input v-model="nombre" type="text" required class="w-full border px-3 py-2 mb-4 rounded-lg focus:ring-purple-400" />

      <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
      <input v-model="email" type="email" required class="w-full border px-3 py-2 mb-4 rounded-lg focus:ring-purple-400" />

      <label class="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
      <input v-model="password" type="password" required class="w-full border px-3 py-2 mb-6 rounded-lg focus:ring-purple-400" />

      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
        :disabled="loading"
      >
        <span v-if="loading">
          <svg class="animate-spin h-5 w-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Registrando...
        </span>
        <span v-else>Registrarse</span>
      </button>
    </form>

    <div v-if="error" class="text-center text-red-500 text-sm mt-2">{{ error }}</div>
    <div v-if="success" class="text-center text-green-600 text-sm mt-2">{{ success }}</div>

    <p class="mt-4 text-center text-sm text-gray-600">
      ¿Ya tenés cuenta?
      <router-link :to="{ name: 'Login', query: { redirect: $route.query.redirect, servicioId: $route.query.servicioId } }" class="text-purple-700 font-semibold hover:underline">Iniciá sesión</router-link>
    </p>

    <div v-if="loading" class="mt-4 text-center">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { registrarUsuario } from '@/services/usuariosService'

const router = useRouter()
const route = useRoute()

const nombre = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

async function registrarse() {
  error.value = null
  success.value = null
  loading.value = true
  try {
    await registrarUsuario({
      name: nombre.value,
      email: email.value,
      password: password.value,
      tipoUsuario: 'cliente'
    })
    success.value = 'Registro exitoso. ¡Ahora podés iniciar sesión!'
    setTimeout(() => {
      
      const redirect = route.query.redirect
      const servicioId = route.query.servicioId
      if (redirect) {
        if (servicioId) {
          router.push({ name: 'Login', query: { redirect, servicioId } })
        } else {
          router.push({ name: 'Login', query: { redirect } })
        }
      } else {
        router.push({ name: 'Login' })
      }
    }, 1000)
  } catch (err) {
    error.value = 'Hubo un error al registrarse. Intentalo de nuevo.'
    console.error('Error al registrarse:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style>
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>