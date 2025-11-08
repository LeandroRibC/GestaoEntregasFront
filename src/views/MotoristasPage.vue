<template>
  <div class="page">
    <h2>Cadastro de Motorista</h2>

    <!-- Botão Voltar -->
    <div class="voltar">
      <button @click="goDashboard">← Voltar</button>
    </div>

    <form @submit.prevent="addMotorista" class="form-motorista">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input id="nome" v-model="novoMotorista.nome" placeholder="Nome completo" required />
      </div>

      <div class="form-group">
        <label for="cnh">CNH</label>
        <input id="cnh" v-model="novoMotorista.cnh" placeholder="Número da CNH" required />
      </div>

      <div class="form-group">
        <label for="categoria_cnh">Categoria CNH</label>
        <input id="categoria_cnh" v-model="novoMotorista.categoria_cnh" placeholder="Ex: B, C, D" required />
      </div>

      <div class="form-group">
        <label for="telefone">Telefone</label>
        <input id="telefone" v-model="novoMotorista.telefone" placeholder="(xx) xxxx-xxxx" required />
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="novoMotorista.status">
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <button type="submit">Salvar</button>
    </form>

    <div class="lista-scroll">
      <h3>Motoristas Cadastrados</h3>
      <ul>
        <li v-for="m in motoristasFiltrados" :key="m.id">
          {{ m.nome }} - CNH: {{ m.cnh }} - Categoria: {{ m.categoria_cnh }} - Tel: {{ m.telefone }} - Status: {{ m.status }}
          <button @click="removerMotorista(m.id)">Excluir</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CadastroMotorista",
  setup() {
    const router = useRouter();
    const goDashboard = () => router.push("/dashboard");

    const motoristas = ref<any[]>([]);
    const novoMotorista = ref({ nome: "", cnh: "", categoria_cnh: "", telefone: "", status: "Ativo" });
    const pesquisaMotorista = ref("");

    const motoristasFiltrados = computed(() =>
      motoristas.value.filter(m =>
        m.nome.toLowerCase().includes(pesquisaMotorista.value.toLowerCase()) ||
        m.cnh.includes(pesquisaMotorista.value)
      )
    );

    const addMotorista = async () => {
      try {
        const payload = { ...novoMotorista.value };
        const res = await fetch("http://localhost:3000/motoristas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw await res.json();
        const data = await res.json();
        motoristas.value.push(data);
        novoMotorista.value = { nome: "", cnh: "", categoria_cnh: "", telefone: "", status: "Ativo" };
      } catch (err: any) {
        alert(`Erro ao salvar motorista: ${err.message || err.detalhe || "Erro desconhecido"}`);
      }
    };

    const removerMotorista = async (id: number) => {
      if (!confirm("Deseja realmente excluir este motorista?")) return;
      try {
        const res = await fetch(`http://localhost:3000/motoristas/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erro ao deletar");
        motoristas.value = motoristas.value.filter(m => m.id !== id);
      } catch (error) {
        alert("Erro ao excluir motorista");
      }
    };

    onMounted(async () => {
      try {
        const res = await fetch("http://localhost:3000/motoristas");
        motoristas.value = await res.json();
      } catch (error) {
        console.error("Erro ao carregar motoristas:", error);
      }
    });

    return {
      motoristas,
      novoMotorista,
      pesquisaMotorista,
      motoristasFiltrados,
      addMotorista,
      removerMotorista,
      goDashboard
    };
  }
});
</script>

<style scoped>
.page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

h2, h3 {
  text-align: center;
  margin-bottom: 20px;
}

/* Botão voltar */
.voltar {
  margin-bottom: 20px;
  text-align: left;
}

.voltar button {
  padding: 8px 14px;
  background-color: #888;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.voltar button:hover {
  opacity: 0.85;
}

.form-motorista {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

button[type="submit"] {
  padding: 10px;
  background-color: #1976d2;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

button[type="submit"]:hover {
  opacity: 0.85;
}

.lista-scroll {
  margin-top: 30px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  border-bottom: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 6px;
  background: #fff;
}

li button {
  background-color: #e53935;
  padding: 5px 10px;
  font-size: 13px;
}

li button:hover {
  opacity: 0.8;
}
</style>
