<template>
  <div class="page">
    <!-- Botão voltar -->
    <div class="voltar">
      <button @click="goDashboard">← Voltar</button>
    </div>

    <!-- Título azul -->
    <h2 class="titulo">Relatórios</h2>

    <!-- Filtros -->
    <div class="filtros">
      <!-- Campos de datas -->
      <div class="datas">
        <div class="campo">
          <label>Data Início:</label>
          <input type="date" v-model="filtros.dataInicio" />
        </div>
        <div class="campo">
          <label>Data Fim:</label>
          <input type="date" v-model="filtros.dataFim" />
        </div>
      </div>

      <!-- Botões de relatórios -->
      <div class="botoes">
        <button @click="gerarRelatorioEntregas">📄 Relatório de Entregas</button>
        <button @click="gerarRelatorioDespesas">📄 Relatório de Despesas</button>
        <button @click="gerarRelatorioLucroPrejuizo">📄 Lucro/Prejuízo Mensal</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const goDashboard = () => router.push("/dashboard");

const filtros = ref({
  dataInicio: "",
  dataFim: ""
});

const validarPeriodo = () => {
  if (!filtros.value.dataInicio || !filtros.value.dataFim) {
    alert("Preencha o período antes de gerar o relatório!");
    return false;
  }
  return true;
};

const baixarPDF = (blobData: Blob, nomeArquivo: string) => {
  const url = window.URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  window.URL.revokeObjectURL(url);
};

const gerarRelatorioEntregas = async () => {
  if (!validarPeriodo()) return;
  try {
    const response = await axios.post(
      "http://localhost:3000/api/relatorio/entregas",
      filtros.value,
      { responseType: "blob" }
    );
    baixarPDF(new Blob([response.data], { type: "application/pdf" }), "relatorio_entregas.pdf");
  } catch (error: any) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar relatório de entregas!");
  }
};

const gerarRelatorioDespesas = async () => {
  if (!validarPeriodo()) return;
  try {
    const response = await axios.post(
      "http://localhost:3000/api/relatorio/despesas",
      filtros.value,
      { responseType: "blob" }
    );
    baixarPDF(new Blob([response.data], { type: "application/pdf" }), "relatorio_despesas.pdf");
  } catch (error: any) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar relatório de despesas!");
  }
};

const gerarRelatorioLucroPrejuizo = async () => {
  if (!validarPeriodo()) return;
  try {
    const response = await axios.post(
      "http://localhost:3000/api/relatorio/lucro-prejuizo",
      filtros.value,
      { responseType: "blob" }
    );
    baixarPDF(new Blob([response.data], { type: "application/pdf" }), "relatorio_lucro_prejuizo.pdf");
  } catch (error: any) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar relatório de lucro/prejuízo!");
  }
};
</script>

<style scoped>
.page {
  max-width: 600px;
  margin: auto;
  padding: 20px;
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
}
.voltar button:hover {
  opacity: 0.85;
}

/* Título azul */
.titulo {
  text-align: center;
  color: #0066ff;
  font-weight: bold;
  margin-bottom: 25px;
  font-size: 24px;
}

/* Filtros */
.filtros {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Campos de datas centralizados */
.datas {
  display: flex;
  justify-content: center;
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
.campo input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  transition: 0.2s;
}
.campo input[type="date"]:focus {
  border-color: #0066ff;
  outline: none;
  box-shadow: 0 0 3px #0066ff;
}

/* Botões */
.botoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}
button:hover {
  opacity: 0.9;
}
</style>
