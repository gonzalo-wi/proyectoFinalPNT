<template>
  <div>
    <h2>Profesionales</h2>

    <div v-if="usuario.tipoUsuario === 'admin'">
      <form @submit.prevent="crear">
        <input v-model="nuevo.name" placeholder="Nombre" required />
        <input v-model="nuevo.especialidad" placeholder="Especialidad" required />
        <button type="submit">Agregar</button>
      </form>
    </div>

    <ul>
      <li v-for="p in profesionales" :key="p.id">
        {{ p.name }} - {{ p.especialidad }}
        <button
          v-if="usuario.tipoUsuario === 'admin'"
          @click="eliminar(p.id)"
        >
          Eliminar
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getProfesionales,
  createProfesional,
  deleteProfesional
} from '../services/profesionalesService'

const profesionales = ref([])
const nuevo = ref({ name: '', especialidad: '' })
const usuario = JSON.parse(localStorage.getItem('usuario'))

const cargar = async () => {
  const res = await getProfesionales()
  profesionales.value = res.data
}

const crear = async () => {
  await createProfesional({ ...nuevo.value, horariosDispo: [] })
  nuevo.value.name = ''
  nuevo.value.especialidad = ''
  cargar()
}

const eliminar = async (id) => {
  await deleteProfesional(id)
  cargar()
}

onMounted(() => {
  cargar()
})
</script>