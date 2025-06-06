<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Contraseña" />
    <button @click="login">Ingresar</button>
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
    console.log('Usuario encontrado:', user)

    if (!user) {
      error.value = 'Credenciales incorrectas'
      return
    }

    localStorage.setItem('usuario', JSON.stringify(user))
    console.log('Tipo de usuario:', user.tipoUsuario)

    if (user.tipoUsuario === 'admin') {
      console.log('Redirigiendo a dashboard')
      router.push('/dashboard')
    } else {
      console.log('Redirigiendo a turnos')
      router.push('/turnos')
    }
  } catch (e) {
    error.value = 'Error al iniciar sesión'
    console.error(e)
  }
}
</script>