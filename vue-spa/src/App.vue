<template>
  <div id="app" class="min-h-screen bg-gray-900 flex flex-col">
    <Navbar v-if="mostrarNavbar" />
    <div class="flex-1">
      <router-view />
    </div>
    <Footer />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

const mostrarNavbar = computed(() => route.path !== '/')
</script>