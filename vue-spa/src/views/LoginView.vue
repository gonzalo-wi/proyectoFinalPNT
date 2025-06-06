
<template>
  <div class="h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
        Iniciar sesión
      </h2>

      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Correo electrónico
          </label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Contraseña
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Ingresar
        </button>

        <p v-if="error" class="text-center text-red-500 text-sm mt-2">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUsuario } from '../services/usuariosService'

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

const login = async () => {
  error.value = null
  try {
    const user = await loginUsuario(email.value, password.value)
    if (!user) {
      error.value = 'Credenciales incorrectas'
      return
    }
    localStorage.setItem('usuario', JSON.stringify(user))
    router.push(user.tipoUsuario === 'admin' ? '/dashboard' : '/turnos')
  } catch (e) {
    error.value = 'Error al iniciar sesión'
    console.error(e)
  }
}
</script>