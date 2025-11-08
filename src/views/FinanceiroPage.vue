<template>
  <div class="page">
    <h2 class="titulo">Gestão de Despesas</h2>

    <div class="acoes-topo">
      <button class="btn-nova" @click="abrirFormulario = !abrirFormulario">
        {{ abrirFormulario ? "Fechar Formulário" : "Nova Despesa" }}
      </button>
    </div>

    <div class="voltar">
      <button @click="goDashboard">← Voltar</button>
    </div>

    <!-- === FORMULÁRIO DE CADASTRO === -->
    <form v-if="abrirFormulario" @submit.prevent="salvarDespesa" class="formulario">
      <div class="grid-dupla">
        <div class="campo">
          <label>Tipo de Despesa:</label>
          <select v-model="novaDespesa.tipo_despesa" required>
            <option value="" disabled>Selecione</option>
            <option>Manutenção</option>
            <option>Despesas Diversas</option>
            <option>Pagamentos</option>
          </select>
        </div>
        <div class="campo">
          <label>Valor (R$):</label>
          <input type="number" step="0.01" v-model="novaDespesa.valor" required placeholder="Ex: 150.00" />
        </div>
      </div>

      <div class="grid-dupla">
        <div class="campo">
          <label>Data da Despesa:</label>
          <input type="date" v-model="novaDespesa.data_despesa" required />
        </div>
        <div class="campo">
          <label>Observação:</label>
          <input type="text" v-model="novaDespesa.observacao" placeholder="Detalhes da despesa..." />
        </div>
      </div>

      <button type="submit" class="btn-salvar">Salvar Despesa</button>
    </form>

    <!-- === GRID DAS DESPESAS === -->
    <div v-if="despesas.length" class="grid-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo de Despesa</th>
            <th>Valor (R$)</th>
            <th>Data</th>
            <th>Observação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="despesa in despesas" :key="despesa.id">
            <td>{{ despesa.id }}</td>
            <td>{{ despesa.tipo_despesa }}</td>
            <td>{{ despesa.valor.toFixed(2) }}</td>
            <td>{{ formatarData(despesa.data_despesa) }}</td>
            <td>{{ despesa.observacao || "-" }}</td>
            <td>
              <button class="btn-excluir" @click="excluirDespesa(despesa.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Nenhuma despesa cadastrada.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goDashboard = () => router.push("/dashboard");

const despesas = ref([]);
const abrirFormulario = ref(false);

const novaDespesa = ref({
  tipo_despesa: "",
  valor: 0,
  data_despesa: "",
  observacao: ""
});

// Funções
async function carregarDespesas() {
  try {
    const res = await fetch("http://localhost:3000/despesas");
    despesas.value = await res.json();
  } catch (err) {
    console.error("Erro ao carregar despesas:", err);
  }
}

async function salvarDespesa() {
  try {
    const res = await fetch("http://localhost:3000/despesas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaDespesa.value)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Despesa cadastrada com sucesso!");
      novaDespesa.value = { tipo_despesa: "", valor: 0, data_despesa: "", observacao: "" };
      abrirFormulario.value = false;
      carregarDespesas();
    } else {
      alert("Erro ao salvar despesa: " + (data.detalhe || data.message));
    }
  } catch (err) {
    console.error(err);
  }
}

async function excluirDespesa(id) {
  if (!confirm("Deseja realmente excluir esta despesa?")) return;
  await fetch(`http://localhost:3000/despesas/${id}`, { method: "DELETE" });
  carregarDespesas();
}

function formatarData(data) {
  return data ? new Date(data).toLocaleDateString("pt-BR") : "-";
}

onMounted(() => {
  carregarDespesas();
});
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
}
.titulo {
  text-align: center;
  color: #0066ff;
  font-weight: bold;
  margin-bottom: 10px;
}
.acoes-topo {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}
.btn-nova {
  background: #0066ff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
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
.formulario {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.grid-dupla {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.campo {
  display: flex;
  flex-direction: column;
}
.campo label {
  font-weight: bold;
  margin-bottom: 5px;
}
input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn-salvar {
  margin-top: 15px;
  background: #0066ff;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.grid-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
th {
  background: #f0f0f0;
}
.btn-excluir {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}
</style>
