<template>
  <div id="app" class="min-h-screen bg-gray-900">
    <Navbar v-if="mostrarNavbar" />
    <router-view />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()

const mostrarNavbar = computed(() => route.path !== '/')
</script>