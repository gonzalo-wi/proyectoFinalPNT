<template>
  <div class="relative p-6">
    
    <img src="/src/assets/wave.svg" alt="Decoración Ola" class="pointer-events-none select-none absolute left-0 bottom-0 w-full z-0" style="min-height:80px;" />
    
    <div class="relative z-10">
      <div class="relative max-w-5xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
        <img src="/src/assets/banner.png" alt="Banner Centro de Bienestar" class="w-full h-96 object-cover object-center" />
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <h1 class="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2 animate-banner-title">Centro de Bienestar</h1>
          <p class="text-lg md:text-2xl text-white font-medium bg-black/30 rounded-xl px-6 py-2 animate-banner-sub">Tu espacio para el equilibrio y la armonía</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold text-center mb-2 text-purple-700 animate-title-pop">Servicios de Bienestar</h2>
      <div class="h-2 w-24 mx-auto mb-12 rounded-full bg-gradient-to-r from-purple-400 via-blue-300 to-purple-400 opacity-70 animate-gradient-bar"></div>

      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <ServicioCard
          v-for="servicio in servicios"
          :key="servicio.id"
          :nombre="servicio.nombre"
          :imagen="servicio.imagen"
          :descripcion="servicio.descripcion"
          :onSolicitarTurno="() => solicitarTurno(servicio)"
          :onCardClick="() => verDetalles(servicio)"
          :onVerDetalles="() => verDetalles(servicio)"
        />
      </div>

      
      <div class="h-24 md:h-32"></div>

      <div class="bg-purple-50 rounded-xl shadow p-6 text-center max-w-3xl mx-auto animate-carrusel-in">
        <div class="mb-4 min-h-[70px] flex flex-col items-center justify-center">
          <transition name="fade" mode="out-in">
            <div :key="carruselIndex" class="w-full">
              <p class="italic text-lg text-purple-700">{{ carruselItems[carruselIndex].texto }}</p>
              <div v-if="carruselItems[carruselIndex].autor" class="mt-2 text-purple-500 font-semibold">— {{ carruselItems[carruselIndex].autor }}</div>
            </div>
          </transition>
        </div>
        <div class="flex justify-center gap-2 mt-2">
          <button v-for="(item, idx) in carruselItems" :key="idx" @click="carruselIndex = idx"
            :class="['w-2 h-2 rounded-full', idx === carruselIndex ? 'bg-purple-500' : 'bg-purple-200']"
            aria-label="Ir a frase" />
        </div>
      </div>
    </div>

    
    <div v-if="servicioSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl p-0 max-w-3xl w-full shadow-2xl relative overflow-hidden animate-fade-in">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-8">
            <img :src="servicioSeleccionado.imagen" class="w-full h-80 object-cover rounded-2xl shadow-md" />
          </div>
          <div class="md:w-1/2 flex flex-col justify-between p-8">
            <button @click="cerrarModal" class="absolute top-4 right-6 text-gray-400 hover:text-red-600 text-3xl font-bold boton-animado-boton"> 
              &times;
            </button>
            <h3 class="text-3xl font-bold text-purple-800 mb-4">{{ servicioSeleccionado.nombre }}</h3>
            <p class="text-gray-700 mb-8 text-lg leading-relaxed">{{ servicioSeleccionado.descripcion }}</p>
            <button
              class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow transition boton-animado-boton flex items-center justify-center gap-2"
              @click="solicitarTurno(servicioSeleccionado)"
              :disabled="loadingReservar"
            >
              <svg v-if="loadingReservar" class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span v-else>Reservar este servicio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ServicioCard from '@/components/ServicioCard.vue'


const carruselItems = ref([
  { texto: '“El bienestar no es un destino, es una forma de vivir.”', autor: '' },
  { texto: '“Cuidar tu cuerpo es un acto de amor propio.”', autor: '' },
  { texto: '“Regalate un momento para volver a vos.”', autor: '' },
  { texto: '“La paz interior se cultiva todos los días.”', autor: '' },
  { texto: '“Tu bienestar es tu poder.”', autor: '' },
  { texto: '“Invertir en ti mismo es el mejor regalo que puedes darte.”', autor: '' },
  { texto: '“La salud es la mayor posesión. La alegría es el mayor tesoro.”', autor: '' }
])
const carruselIndex = ref(0)
let carruselTimer = null

onMounted(() => {
  carruselTimer = setInterval(() => {
    carruselIndex.value = (carruselIndex.value + 1) % carruselItems.value.length
  }, 5000)
})
onBeforeUnmount(() => {
  clearInterval(carruselTimer)
})

const router = useRouter()
const servicioSeleccionado = ref(null)

const servicios = ref([
  {
    id: 1,
    nombre: 'Reiki',
    descripcion: 'Técnica milenaria de sanación energética que busca armonizar cuerpo, mente y emociones. Ideal para reducir el estrés, aliviar tensiones y equilibrar tu energía vital.',
    imagen: '/src/assets/reiki.png'
  },
  {
    id: 2,
    nombre: 'Limpieza Facial',
    descripcion: 'Tratamiento profundo que elimina impurezas, células muertas y exceso de grasa. Devuelve luminosidad y frescura a tu piel, dejándola suave, limpia y renovada.',
    imagen: '/src/assets/facial.png'
  },
  {
    id: 3,
    nombre: 'Masajes Descontracturantes',
    descripcion: 'Relajá tu cuerpo y liberá tensiones profundas con un masaje descontracturante. Perfecto para aliviar dolores musculares, mejorar la circulación y recuperar tu bienestar físico.',
    imagen: '/src/assets/masajes.png'
  }
])

const loadingReservar = ref(false)

function solicitarTurno(servicio) {
  if (loadingReservar.value) return
  loadingReservar.value = true
  setTimeout(() => {
    loadingReservar.value = false
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    if (!usuario) {
      router.push({
        name: 'Login',
        query: { redirect: 'NuevoTurno', servicioId: servicio.id }
      })
      return
    } else {
      router.push({ name: 'NuevoTurno', query: { servicioId: servicio.id } })
    }
  }, 2000)
}

function verDetalles(servicio) {
  servicioSeleccionado.value = servicio
}

function cerrarModal() {
  servicioSeleccionado.value = null
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.25s cubic-bezier(0.4,0,0.2,1);
}
@keyframes banner-title {
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-banner-title {
  animation: banner-title 0.7s cubic-bezier(0.4,0,0.2,1);
}
@keyframes banner-sub {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-banner-sub {
  animation: banner-sub 1s 0.2s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes title-pop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-title-pop {
  animation: title-pop 0.5s cubic-bezier(0.4,0,0.2,1);
}
@keyframes gradient-bar {
  0% { opacity: 0; transform: scaleX(0.7); }
  100% { opacity: 1; transform: scaleX(1); }
}
.animate-gradient-bar {
  animation: gradient-bar 0.7s 0.2s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes carrusel-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-carrusel-in {
  animation: carrusel-in 0.7s cubic-bezier(0.4,0,0.2,1);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.boton-animado .texto-animado {
  display: inline-block;
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
}
.boton-animado:hover .texto-animado {
  transform: translateY(-4px) scale(1.08);
}
.boton-animado-boton {
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
}
.boton-animado-boton:hover {
  transform: translateY(-6px) scale(1.07);
  box-shadow: 0 8px 32px 0 rgba(80, 0, 120, 0.18);
}
</style>