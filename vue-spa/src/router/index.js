import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import TurnosView from '../views/TurnosView.vue'
import ConsultasView from '../views/ConsultasView.vue'
import ProfesionalesView from '../views/ProfesionalesView.vue'
import ReportesView from '../views/ReportesView.vue'
import ServiciosView from '../views/ServiciosView.vue'
import NuevoTurnoView from '../views/NuevoTurnoView.vue'
import RegistrarUserView from '../views/RegistrarUserView.vue'


const routes = [
  { path: '/', name: 'Login',component: LoginView },
  { path: '/dashboard', component: DashboardView },
  { path: '/turnos', component: TurnosView },
  { path: '/consultas', component: ConsultasView },
  { path: '/profesionales', component: ProfesionalesView },
  { path: '/reportes', component: ReportesView },
  { path: '/servicios', component: ServiciosView },
  { path: '/registrar', name: 'Registrar', component: RegistrarUserView },
  { path: '/nuevoTurno',name: 'NuevoTurno', component: NuevoTurnoView },
  { path: '/mi-turno', name: 'MiTurno', component: () => import('../views/MiTurnoView.vue') },
  { path: '/mis-turnos', name: 'MisTurnos', component: () => import('../views/MisTurnosView.vue') },
  { path: '/alta-profesional', name: 'AltaProfesional', component: () => import('../views/AltaProfesionalView.vue') },
  { path: '/consultas-admin', name: 'ConsultasAdmin', component: () => import('../views/ConsultasAdminView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router