<template>
  <div class="page">
    <h2 class="titulo">Gestão de Entregas</h2>

    <div class="acoes-topo">
      <button class="btn-nova" @click="abrirFormulario = !abrirFormulario">
        {{ abrirFormulario ? "Fechar Formulário" : "Nova Entrega" }}
      </button>
    </div>

    <div class="voltar">
      <button @click="goDashboard">← Voltar</button>
    </div>

    <!-- === FORMULÁRIO DE CADASTRO === -->
    <form v-if="abrirFormulario" @submit.prevent="salvarEntrega" class="formulario">
      <div class="grid-dupla">
        <div class="campo">
          <label>Destino:</label>
          <input type="text" v-model="novaEntrega.destino" placeholder="Ex: Fortaleza" required />
        </div>
        <div class="campo">
          <label>Status:</label>
          <select v-model="novaEntrega.status">
            <option>Em andamento</option>
            <option>Concluída</option>
            <option>Cancelada</option>
          </select>
        </div>
      </div>

      <div class="grid-dupla">
        <div class="campo">
          <label>Data de saída:</label>
          <input type="date" v-model="novaEntrega.data_saida" required />
        </div>
        <div class="campo">
          <label>Data de retorno:</label>
          <input type="date" v-model="novaEntrega.data_retorno" />
        </div>
      </div>

      <div class="grid-dupla">
        <div class="campo">
          <label>KM Inicial:</label>
          <input type="number" v-model="novaEntrega.km_inicial" min="0" />
        </div>
        <div class="campo">
          <label>KM Final:</label>
          <input type="number" v-model="novaEntrega.km_final" min="0" />
        </div>
      </div>

      <!-- === CAMPO DE VALOR FORMATADO === -->
      <div class="campo">
        <label>Valor aproximado (R$):</label>
        <input
          type="text"
          v-model="valorFormatado"
          @input="formatarValor"
          placeholder="Ex: 1.500,00"
        />
      </div>

      <div class="campo">
        <label>Observações:</label>
        <textarea v-model="novaEntrega.observacoes" placeholder="Detalhes da viagem..."></textarea>
      </div>

      <!-- === GRID MOTORISTAS === -->
      <div class="grid-container" v-if="abrirFormulario && motoristas.length">
        <h3>Motoristas</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="motorista in motoristas" :key="motorista.id">
              <td>{{ motorista.id }}</td>
              <td>{{ motorista.nome }}</td>
              <td>
                <button type="button" @click="selecionarMotorista(motorista.id)">Selecionar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="novaEntrega.id_motorista">Motorista selecionado: {{ novaEntrega.id_motorista }}</p>
      </div>

      <!-- === GRID VEÍCULOS === -->
      <div class="grid-container" v-if="abrirFormulario && veiculos.length">
        <h3>Veículos</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="veiculo in veiculos" :key="veiculo.id">
              <td>{{ veiculo.id }}</td>
              <td>{{ veiculo.placa }}</td>
              <td>{{ veiculo.modelo }}</td>
              <td>{{ veiculo.marca }}</td>
              <td>
                <button type="button" @click="selecionarVeiculo(veiculo.id)">Selecionar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="novaEntrega.id_veiculo">Veículo selecionado: {{ novaEntrega.id_veiculo }}</p>
      </div>

      <button type="submit" class="btn-salvar">Salvar Entrega</button>
    </form>

    <!-- === GRID DAS ENTREGAS === -->
    <div v-if="entregas.length" class="grid-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Destino</th>
            <th>Data Saída</th>
            <th>Data Retorno</th>
            <th>Status</th>
            <th>KM</th>
            <th>Valor Aprox. (R$)</th>
            <th>Motorista</th>
            <th>Veículo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entrega in entregas" :key="entrega.id">
            <td>{{ entrega.id }}</td>
            <td>{{ entrega.destino }}</td>
            <td>{{ formatarData(entrega.data_saida) }}</td>
            <td>{{ formatarData(entrega.data_retorno) }}</td>
            <td>
              <select v-model="entrega.status" @change="alterarStatus(entrega)">
                <option>Em andamento</option>
                <option>Concluída</option>
                <option>Cancelada</option>
              </select>
            </td>
            <td>{{ entrega.km_inicial }} / {{ entrega.km_final }}</td>
            <td>{{ formatarMoeda(entrega.valor_aproximado) }}</td>
            <td>{{ entrega.motorista || "-" }}</td>
            <td>{{ entrega.veiculo || "-" }}</td>
            <td>
              <button class="btn-excluir" @click="excluirEntrega(entrega.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>Nenhuma entrega cadastrada.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goDashboard = () => router.push("/dashboard");

const entregas = ref([]);
const motoristas = ref([]);
const veiculos = ref([]);
const abrirFormulario = ref(false);

const novaEntrega = ref({
  destino: "",
  data_saida: "",
  data_retorno: "",
  km_inicial: 0,
  km_final: 0,
  status: "Em andamento",
  observacoes: "",
  valor_aproximado: 0,
  id_motorista: null,
  id_veiculo: null,
});

// Campo de texto formatado para moeda
const valorFormatado = ref("");

// === FUNÇÃO DE FORMATAÇÃO ===
function formatarValor(e) {
  let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
  valor = (parseInt(valor, 10) / 100).toFixed(2); // divide por 100 para ter 2 casas decimais
  valorFormatado.value = valor
    .replace(".", ",") // troca ponto por vírgula
    .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // adiciona pontos de milhar
  novaEntrega.value.valor_aproximado = parseFloat(valor); // guarda o valor numérico real
}

function formatarMoeda(valor) {
  return valor
    ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "-";
}

// Seleção de motorista e veículo
const selecionarMotorista = (id) => (novaEntrega.value.id_motorista = id);
const selecionarVeiculo = (id) => (novaEntrega.value.id_veiculo = id);

// Funções de carregamento
async function carregarEntregas() {
  const res = await fetch("http://localhost:3000/viagens");
  entregas.value = await res.json();
}
async function carregarMotoristas() {
  const res = await fetch("http://localhost:3000/motoristas");
  motoristas.value = await res.json();
}
async function carregarVeiculos() {
  const res = await fetch("http://localhost:3000/veiculos");
  veiculos.value = await res.json();
}

// Salvar entrega
async function salvarEntrega() {
  const res = await fetch("http://localhost:3000/viagens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaEntrega.value),
  });
  if (res.ok) {
    alert("Entrega cadastrada com sucesso!");
    abrirFormulario.value = false;
    carregarEntregas();
  } else {
    alert("Erro ao salvar entrega");
  }
}

// Excluir entrega
async function excluirEntrega(id) {
  if (!confirm("Deseja realmente excluir esta entrega?")) return;
  await fetch(`http://localhost:3000/viagens/${id}`, { method: "DELETE" });
  carregarEntregas();
}

function formatarData(data) {
  return data ? new Date(data).toLocaleDateString("pt-BR") : "-";
}

onMounted(() => {
  carregarEntregas();
  carregarMotoristas();
  carregarVeiculos();
});
</script>

<style scoped>
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
textarea,
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
