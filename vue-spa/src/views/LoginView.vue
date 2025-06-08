<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-100 via-blue-100 to-purple-200">
    <div class="w-full max-w-xl bg-white/90 rounded-lg shadow-xl p-8 flex flex-col justify-center min-h-[32rem]">
      <h2 class="text-3xl font-extrabold text-center mb-6 text-purple-700">
        Iniciar sesión
      </h2>
      <div class="flex justify-center mb-6">
        <img src="/src/assets/LogoEste.png" alt="Logo Centro de Bienestar" class="h-24 w-24 rounded-full shadow bg-white p-2" />
      </div>
      <form class="space-y-6" @submit.prevent="login">
        
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out focus:shadow"
            placeholder="usuario@ejemplo.com"
            @blur="emailTouched = true"
          />
          <p v-if="emailTouched && !emailValido" class="text-xs text-red-500 mt-1">Email inválido</p>
        </div>

  
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div class="relative">
            <input
              v-model="password"
              id="password"
              :type="mostrarPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 placeholder-gray-400 border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out focus:shadow"
              placeholder="••••••••"
              @blur="passwordTouched = true"
              @keyup.enter="login"
              style="padding-right: 2.5rem;"
            />
            <button type="button" @click="mostrarPassword = !mostrarPassword" tabindex="-1"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none bg-transparent"
              style="height: 100%;">
              <svg v-if="!mostrarPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.876A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.293 5.066M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0l6 6m0-6l-6 6" />
              </svg>
            </button>
          </div>
          <p v-if="passwordTouched && !passwordValida" class="text-xs text-red-500 mt-1">La contraseña debe tener al menos 6 caracteres</p>
        </div>

        
        <button
          type="submit"
          class="w-full text-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center gap-2"
          :disabled="loading || !emailValido || !passwordValida"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>Ingresar</span>
        </button>

       
        <div v-if="error" class="text-center text-red-500 text-sm mt-2">{{ error }}</div>
        <div v-if="success" class="text-center text-green-600 text-sm mt-2">{{ success }}</div>
      </form>

      
      <p class="mt-6 text-center text-sm text-gray-600">
        ¿No tenés cuenta?
        <router-link
          :to="{ name: 'Registrar', query: { redirect: route.query.redirect, servicioId: route.query.servicioId } }"
          class="text-purple-700 font-semibold hover:underline"
        >
          Registrate acá
        </router-link>
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loginUsuario } from '../services/usuariosService'

const email = ref('')
const password = ref('')
const error = ref(null)
const success = ref(null)
const loading = ref(false)
const mostrarPassword = ref(false)
const emailTouched = ref(false)
const passwordTouched = ref(false)

const router = useRouter()
const route = useRoute()

const emailValido = computed(() => /.+@.+\..+/.test(email.value))
const passwordValida = computed(() => password.value.length >= 6)

const login = async () => {
  error.value = null
  success.value = null
  emailTouched.value = true
  passwordTouched.value = true

  if (!emailValido.value || !passwordValida.value) return

  loading.value = true
  try {
    const user = await loginUsuario(email.value, password.value)
    if (!user) {
      error.value = 'Credenciales incorrectas'
      loading.value = false
      return
    }

    localStorage.setItem('usuario', JSON.stringify(user))
    success.value = '¡Bienvenido! Redirigiendo...'

    setTimeout(() => {
      const redirect = route.query.redirect
      const servicioId = route.query.servicioId
      if (redirect) {
        
        if (servicioId) {
          router.push({ name: redirect, query: { servicioId } })
        } else {
          router.push({ name: redirect })
        }
      } else {
        router.push(user.tipoUsuario === 'admin' ? '/dashboard' : '/nuevoTurno')
      }
    }, 1000)

  } catch (e) {
    error.value = 'Error al iniciar sesión'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>