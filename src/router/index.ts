import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import EntregasPage from '../views/EntregasPage.vue'
import FinanceiroPage from '../views/FinanceiroPage.vue'
import MotoristasPage from '../views/MotoristasPage.vue'
import RelatoriosPage from '../views/RelatoriosPage.vue'
import CaminhaoPage from '../views/CaminhaoPage.vue'


const routes = [
{ path: '/', name: 'Login', component: LoginPage },
{ path: '/dashboard', name: 'Dashboard', component: DashboardPage },
{ path: '/entregas', name: 'Entregas', component: EntregasPage },
{ path: '/financeiro', name: 'Financeiro', component: FinanceiroPage },
{ path: '/caminhao', name: 'Caminhão', component: CaminhaoPage},
{ path: '/motoristas', name: 'Motoristas', component: MotoristasPage },
{ path: '/relatorios', name: 'Relatorios', component: RelatoriosPage },
]


const router = createRouter({
history: createWebHistory(),
routes,
})


export default router