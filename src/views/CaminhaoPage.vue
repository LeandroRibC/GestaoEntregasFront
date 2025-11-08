<template>
  <div class="page">
    <h2>Cadastro de Caminhão</h2>

    <!-- Botão Voltar -->
    <div class="voltar">
      <button @click="goDashboard">← Voltar</button>
    </div>

    <form @submit.prevent="addCaminhao" class="form-caminhao">
      <div class="form-group">
        <label for="placa">Placa</label>
        <input id="placa" v-model="novoCaminhao.placa" placeholder="Ex: ABC-1234" required />
      </div>

      <div class="form-group">
        <label for="modelo">Modelo</label>
        <input id="modelo" v-model="novoCaminhao.modelo" placeholder="Modelo do caminhão" required />
      </div>

      <div class="form-group">
        <label for="marca">Marca</label>
        <input id="marca" v-model="novoCaminhao.marca" placeholder="Marca do caminhão" required />
      </div>

      <div class="form-group">
        <label for="ano">Ano</label>
        <input id="ano" v-model="novoCaminhao.ano" type="number" placeholder="Ano de fabricação" required />
      </div>

      <div class="form-group">
        <label for="tipo">Tipo</label>
        <input id="tipo" v-model="novoCaminhao.tipo" placeholder="Ex: Baú, Sider, Tanque" required />
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="novoCaminhao.status">
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <button type="submit">Salvar</button>
    </form>

    <div class="lista-scroll">
      <h3>Caminhões Cadastrados</h3>
      <ul>
        <li v-for="c in caminhoesFiltrados" :key="c.placa">
          {{ c.placa }} - {{ c.marca }} {{ c.modelo }} - Ano: {{ c.ano }} - Tipo: {{ c.tipo }} - Status: {{ c.status }}
          <button @click="removerCaminhao(c.id)">Excluir</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CadastroCaminhao",
  setup() {
    const router = useRouter();
    const goDashboard = () => router.push("/dashboard");

    const caminhoes = ref<any[]>([]);
    const novoCaminhao = ref({ placa: "", modelo: "", marca: "", ano: "", tipo: "", status: "Ativo" });
    const pesquisaCaminhao = ref("");

    const caminhoesFiltrados = computed(() =>
      caminhoes.value.filter(c =>
        c.placa.toLowerCase().includes(pesquisaCaminhao.value.toLowerCase()) ||
        c.modelo.toLowerCase().includes(pesquisaCaminhao.value.toLowerCase())
      )
    );

  const addCaminhao = async () => {
  try {
    const payload = { ...novoCaminhao.value };
    const res = await fetch("http://localhost:3000/veiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text(); // lê a resposta como texto, não JSON
    console.log("🔍 RESPOSTA DO BACKEND:", text); // veja no console o que o servidor devolveu

    const data = JSON.parse(text); // tenta converter pra JSON
    if (!res.ok) throw new Error(data.message || "Erro ao salvar caminhão");

    caminhoes.value.push(data.caminhao || data);
    novoCaminhao.value = { placa: "", modelo: "", marca: "", ano: "", tipo: "", status: "Ativo" };
    alert("Caminhão cadastrado com sucesso!");
  } catch (err: any) {
    alert(`Erro ao salvar caminhão: ${err.message || "Erro desconhecido"}`);
  }
};

const removerCaminhao = async (id: number) => {
  if (!confirm("Deseja realmente excluir este caminhão?")) return;
  try {
    const res = await fetch(`http://localhost:3000/veiculos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar");
    caminhoes.value = caminhoes.value.filter(c => c.id !== id);
  } catch (error) {
    alert("Erro ao excluir caminhão");
  }
};

    onMounted(async () => {
      try {
        const res = await fetch("http://localhost:3000/veiculos");
        caminhoes.value = await res.json();
      } catch (error) {
        console.error("Erro ao carregar caminhões:", error);
      }
    });

    return {
      caminhoes,
      novoCaminhao,
      pesquisaCaminhao,
      caminhoesFiltrados,
      addCaminhao,
      removerCaminhao,
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

.form-caminhao {
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
