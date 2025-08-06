async function buscarDados() {
  const nomeDigitado = document.getElementById("nomeCliente").value.trim().toLowerCase();
  const resultado = document.getElementById("resultado");

  // Oculta áreas ao iniciar
  document.getElementById("areaPremios").style.display = "none";
  document.getElementById("painelADM").style.display = "none";
  document.getElementById("formularioADM").style.display = "none";
  document.getElementById("campoSenhaADM").style.display = "none";
  resultado.innerHTML = "";

  if (!nomeDigitado) {
    resultado.innerHTML = "Por favor, digite um nome.";
    return;
  }

  // Acesso administrativo
  if (nomeDigitado === "admin") {
    resultado.innerHTML = "Acesso administrativo detectado. Digite a senha:";
    document.getElementById("campoSenhaADM").style.display = "block";
    return;
  }

  resultado.innerHTML = "Buscando...";

  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-9DdM3ltziPQKBrPhiYn6VrECajxh88UidF0PxP9Kbv1QOBmILUkWblvbVvwdTl6cYmwRlEDXfyBZ/pub?output=csv";

  try {
    const response = await fetch(url);
    const data = await response.text();
    const linhas = data.split("\n").slice(1);

    let encontrado = false;

    for (let linha of linhas) {
      const [nome, ultimaVisita, totalVisitas, pontosAcumulados, pontosExpirados] = linha.split(",");

      if (nome && nome.toLowerCase().trim() === nomeDigitado) {
        resultado.innerHTML = `
          <div class="resultado-card">
            <h2>${nome}</h2>
            <p>📅 <strong>Última visita:</strong> ${ultimaVisita}</p>
            <p>💈 <strong>Total de visitas:</strong> ${totalVisitas}</p>
            <p>🎯 <strong>Pontos acumulados:</strong> ${pontosAcumulados}</p>
            <p>⏳ <strong>Pontos expirados:</strong> ${pontosExpirados}</p>
          </div>
        `;

        // Oculta campo de busca
        document.getElementById("buscaCliente").style.display = "none";

        // Exibe prêmios
        document.getElementById("areaPremios").style.display = "block";

        encontrado = true;
        break;
      }
    }

    if (!encontrado) {
      resultado.innerHTML = `
        <p>Cliente não encontrado.</p>
        <p>Verifique se o nome está escrito corretamente ou fale com a recepção.</p>
      `;
    }
  } catch (error) {
    resultado.innerHTML = "Erro ao carregar dados.";
    console.error("Erro ao buscar dados:", error);
  }
}

function validarSenhaADM() {
  const senha = document.getElementById("senhaADM").value;

  if (senha === "1234") {
    document.getElementById("painelADM").style.display = "block";
    document.getElementById("formularioADM").style.display = "block";
    document.getElementById("campoSenhaADM").style.display = "none";
    atualizarListaADM();
  } else {
    alert("Senha incorreta.");
  }
}

// Sistema de Tabela de Trocas com ADM
let listaTrocas = JSON.parse(localStorage.getItem("trocas")) || [];

function atualizarTabelaTrocas() {
  const corpo = document.getElementById("corpoTabelaTrocas");
  corpo.innerHTML = "";

  listaTrocas.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.pontos}</td>
      <td>${item.disponivel}</td>
    `;
    corpo.appendChild(tr);
  });
}

function atualizarListaADM() {
  const lista = document.getElementById("listaADM");
  lista.innerHTML = "";

  listaTrocas.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} - ${item.pontos} pts - ${item.disponivel}
      <button onclick="removerItem(${index})">Excluir</button>
    `;
    lista.appendChild(li);
  });
}

function adicionarItem() {
  const nome = document.getElementById("produtoNome").value;
  const pontos = document.getElementById("produtoPontos").value;
  const disponivel = document.getElementById("produtoDisponivel").value;

  if (!nome || !pontos) {
    alert("Preencha todos os campos!");
    return;
  }

  listaTrocas.push({ nome, pontos, disponivel });
  localStorage.setItem("trocas", JSON.stringify(listaTrocas));
  atualizarTabelaTrocas();
  atualizarListaADM();

  document.getElementById("produtoNome").value = "";
  document.getElementById("produtoPontos").value = "";
}

function removerItem(index) {
  listaTrocas.splice(index, 1);
  localStorage.setItem("trocas", JSON.stringify(listaTrocas));
  atualizarTabelaTrocas();
  atualizarListaADM();
}

// Inicializa a tabela ao carregar
atualizarTabelaTrocas();