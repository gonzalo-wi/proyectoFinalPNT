<template>
  <div class="max-w-4xl mx-auto mt-10 px-4">
    <h2 class="text-2xl font-bold text-purple-700 mb-6">👩‍⚕️ Profesionales</h2>

    <!-- Solo admin puede ver el formulario -->
    <div
      v-if="usuario.tipoUsuario === 'admin'"
      class="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4 border border-gray-200"
    >
      <h3 class="text-lg font-semibold text-gray-700">Agregar nuevo profesional</h3>

      <form @submit.prevent="crear" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          v-model="nuevo.name"
          placeholder="Nombre"
          required
          class="border border-gray-300 rounded-md p-2 w-full"
        />
        <input
          v-model="nuevo.especialidad"
          placeholder="Especialidad"
          required
          class="border border-gray-300 rounded-md p-2 w-full"
        />
        <div class="sm:col-span-2">
          <button
            type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md"
          >
            Agregar
          </button>
        </div>
      </form>
    </div>

    <!-- Listado de profesionales -->
    <div class="space-y-4">
      <div
        v-for="p in profesionales"
        :key="p.id"
        class="bg-white p-4 rounded-lg shadow flex justify-between items-center border-l-4 border-purple-600"
      >
        <div>
          <p class="font-semibold text-gray-800">{{ p.name }}</p>
          <p class="text-sm text-gray-600">{{ p.especialidad }}</p>
        </div>
        <button
          v-if="usuario.tipoUsuario === 'admin'"
          @click="eliminar(p.id)"
          class="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
        >
          Eliminar
        </button>
      </div>
    </div>
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