<template>
  <div class="dashboard">
    <h1>Controle de Frotas</h1>
    <p>Escolha um módulo:</p>
    <div class="botoes">
      <button @click="go('/entregas')">Gestão de Entregas</button>
      <button @click="go('/financeiro')">Gestão de Despesas</button>
      <button @click="go('/motoristas')">Cadastro de Motoristas</button>
      <button @click="go('/caminhao')">Cadastro de Caminhões</button>
      <button @click="go('/relatorios')">Relatórios</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const go = (path: string) => router.push(path)
    return { go }
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  min-height: 80vh;
}

.botoes {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

button {
  padding: 12px 18px;
  border-radius: 6px;
  border: 0;
  background: #1976d2;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.85;
}
</style>
