<template>
  <div class="login-page">
    <div class="login-box">
      <h2>Controle de Frotas</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <input
          v-model="username"
          placeholder="Usuário"
          class="input"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Senha"
          class="input"
        />
        <button type="submit" class="btn">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const username = ref('')
    const password = ref('')
    const router = useRouter()

    const validUsers = [
      { user: 'marcos', pass: 'Marcos2107' },
      { user: 'roger', pass: 'roger1203' },
    ]

    const handleLogin = () => {
      const ok = validUsers.some(u => u.user === username.value && u.pass === password.value)
      if (ok) router.push('/dashboard')
      else alert('Usuário ou senha inválidos')
    }

    return { username, password, handleLogin }
  }
})
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f4f6f8;
}

.login-box {
  width: 380px;
  background: white;
  padding: 40px 32px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centraliza o conteúdo verticalmente */
  align-items: center; /* Centraliza horizontalmente */
  text-align: center;
  min-height: 360px; /* Define altura mínima para garantir o centro visual */
}

.login-box h2 {
  margin-bottom: 28px;
  color: #000;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  align-items: center;
}

.input {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.input:focus {
  border-color: #1976d2;
  outline: none;
  box-shadow: 0 0 4px rgba(25, 118, 210, 0.3);
}

.btn {
  width: 90%;
  padding: 10px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.btn:hover {
  background: #125aa0;
}
</style>
