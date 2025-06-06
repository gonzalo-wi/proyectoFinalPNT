<template>
  <div>
    <h2>Consultas</h2>

    <div v-if="usuario.tipoUsuario === 'cliente'">
      <form @submit.prevent="enviarConsulta">
        <textarea v-model="nuevaConsulta" placeholder="Escribí tu consulta..." required></textarea>
        <button type="submit">Enviar</button>
      </form>
    </div>

    <div v-if="consultas.length">
      <h3 v-if="usuario.tipoUsuario === 'admin'">Todas las consultas</h3>
      <ul>
        <li v-for="c in consultas" :key="c.id">
          <strong>{{ c.cliente }}</strong>: {{ c.mensaje }}
          <span v-if="usuario.tipoUsuario === 'admin'">
            - <em>{{ c.respondido ? 'Respondida' : 'Pendiente' }}</em>
          </span>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No hay consultas todavía.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const usuario = ref(JSON.parse(localStorage.getItem('usuario')))
const consultas = ref([])
const nuevaConsulta = ref('')

onMounted(async () => {
  const res = await fetch('/consultas.json')
  consultas.value = await res.json()
})


const enviarConsulta = () => {
  consultas.value.push({
    id: crypto.randomUUID(),
    cliente: usuario.value.email,
    mensaje: nuevaConsulta.value,
    respondido: false
  })
  nuevaConsulta.value = ''
}
</script>