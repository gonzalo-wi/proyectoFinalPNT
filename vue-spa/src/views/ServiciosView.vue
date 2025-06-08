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
          :onSolicitarTurno="() => solicitarTurno(servicio)"
          :onCardClick="() => verDetalles(servicio)"
        />
      </div>

      
      <div class="h-24 md:h-32"></div>

      <div class="bg-purple-50 rounded-xl shadow p-6 text-center max-w-3xl mx-auto animate-carrusel-in">
        <carousel v-slot="{ current }" :autoplay="true" :interval="5000" class="mb-4">
          <div v-for="(item, idx) in carruselItems" :key="idx" v-show="current === idx" class="transition-all duration-500">
            <p class="italic text-lg text-purple-700">{{ item.texto }}</p>
            <div v-if="item.autor" class="mt-2 text-purple-500 font-semibold">— {{ item.autor }}</div>
          </div>
        </carousel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import ServicioCard from '@/components/ServicioCard.vue'


const carruselItems = ref([
  { texto: '“El bienestar no es un destino, es una forma de vivir.”', autor: '' },
  { texto: '“Cuidar tu cuerpo es un acto de amor propio.”', autor: '' },
  { texto: '“Regalate un momento para volver a vos.”', autor: '' },
  { texto: '“La paz interior se cultiva todos los días.”', autor: '' },
  { texto: '“Tu bienestar es tu poder.”', autor: '' },
  { texto: '“Invertir en ti mismo es el mejor regalo que puedes darte.”', autor: 'Deepak Chopra' },
  { texto: '“La salud es la mayor posesión. La alegría es el mayor tesoro.”', autor: 'Lao Tse' }
])


const carousel = defineComponent({
  name: 'carousel',
  props: {
    interval: { type: Number, default: 5000 },
    autoplay: { type: Boolean, default: true }
  },
  data() {
    return { current: 0, timer: null, total: 1 }
  },
  mounted() {
    
    this.updateTotal();
    if (this.autoplay) this.start();
  },
  updated() {
    
    this.updateTotal();
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    updateTotal() {
      const slotFn = this.$slots.default;
      const slotContent = slotFn ? slotFn({ current: this.current }) : [];
      this.total = Array.isArray(slotContent) ? slotContent.length : 1;
    },
    start() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.current = (this.current + 1) % this.total;
      }, this.interval);
    }
  },
  render() {
    const slotFn = this.$slots.default;
    if (!slotFn) return null;
    const slotContent = slotFn({ current: this.current });
    return h('div', {}, slotContent)
  }
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

function solicitarTurno(servicio) {
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
</style>