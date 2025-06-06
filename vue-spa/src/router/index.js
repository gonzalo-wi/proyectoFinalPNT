import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import TurnosView from '../views/TurnosView.vue'
import ConsultasView from '../views/ConsultasView.vue'
import ProfesionalesView from '../views/ProfesionalesView.vue'
import ReportesView from '../views/ReportesView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/dashboard', component: DashboardView },
  { path: '/turnos', component: TurnosView },
  { path: '/consultas', component: ConsultasView },
  { path: '/profesionales', component: ProfesionalesView },
  { path: '/reportes', component: ReportesView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router