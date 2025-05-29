document.querySelector("#gerar-btn").addEventListener("click", gerarPDF);

async function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const dadosEmissor = {
    nome: document.querySelector("#emissor-nome").value,
    cpf: document.querySelector("#emissor-cpf").value,
    endereco: document.querySelector("#emissor-endereco").value,
    telefone: document.querySelector("#emissor-telefone").value,
    email: document.querySelector("#emissor-email").value,
  };

  const dadosCliente = {
    nome: document.querySelector("#cliente-nome").value,
    telefone: document.querySelector("#cliente-telefone").value,
    cpf: document.querySelector("#cliente-cpf").value,
    endereco: document.querySelector("#cliente-endereco").value,
  };

  const orcamento = {
    numero: document.querySelector("#orc-numero").value,
    data: document.querySelector("#orc-data").value,
    validade: document.querySelector("#orc-valido").value,
    acrescimo: parseFloat(document.querySelector("#orc-acrescimo").value || 0),
    desconto: parseFloat(document.querySelector("#orc-desconto").value || 0),
    pagamento: document.querySelector("#orc-pagamento").value,
    observacoes: document.querySelector("#orc-observacoes").value,
  };

  doc.setFontSize(12);
  doc.text(dadosEmissor.nome, 105, 15, { align: "center" });
  doc.setFontSize(10);
  doc.text(`CPF/CNPJ: ${dadosEmissor.cpf}`, 105, 21, { align: "center" });
  doc.text(dadosEmissor.endereco, 105, 26, { align: "center" });
  doc.text(`Contato: ${dadosEmissor.telefone}`, 105, 31, { align: "center" });
  doc.text(`Email: ${dadosEmissor.email}`, 105, 36, { align: "center" });

  doc.line(10, 40, 200, 40);

  doc.text(`Orçamento nº: ${orcamento.numero}`, 15, 47);
  doc.text(`Emitido em: ${orcamento.data}`, 105, 47, { align: "center" });
  doc.text(`Válido até: ${orcamento.validade}`, 200 - 15, 47, { align: "right" });
  doc.line(10, 50, 200, 50);

  doc.setFontSize(11);
  doc.text("DADOS DO CLIENTE", 105, 57, { align: "center" });
  doc.setFontSize(10);
  doc.autoTable({
    startY: 60,
    theme: "plain",
    margin: { left: 10, right: 10 },
    body: [
      [`CLIENTE: ${dadosCliente.nome}`],
      [`TELEFONE: ${dadosCliente.telefone}`, `CPF/CNPJ: ${dadosCliente.cpf}`],
      [`ENDEREÇO: ${dadosCliente.endereco}`],
    ]
  });

  let dadosItens = [];
  const linhas = document.querySelectorAll(".item-linha");
  let total = 0;
  linhas.forEach((linha, i) => {
    const produto = linha.children[0].value;
    const qtd = linha.children[1].value;
    const valor = parseFloat(linha.children[2].value || 0);
    const subtotal = valor * (parseFloat(qtd) || 0);
    total += subtotal;
    dadosItens.push([
      String(i + 1).padStart(2, "0"),
      produto,
      qtd,
      `R$${valor.toFixed(2)}`,
      `R$${subtotal.toFixed(2)}`
    ]);
  });

  const totalComAcrescimo = total + orcamento.acrescimo - orcamento.desconto;

  doc.text("ORÇAMENTO", 105, doc.lastAutoTable.finalY + 10, { align: "center" });
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 13,
    head: [["ITEM", "PRODUTO/SERVIÇO", "QUANT.", "VALOR", "SUB-TOTAL"]],
    body: dadosItens,
    theme: "grid",
    styles: { halign: "center" }
  });

  let y = doc.lastAutoTable.finalY + 5;
  doc.text(`SUB-TOTAL GERAL: R$${total.toFixed(2)}`, 15, y);
  doc.text(`DESCONTO: R$${orcamento.desconto.toFixed(2)}`, 15, y + 6);
  doc.text(`TOTAL GERAL: R$${totalComAcrescimo.toFixed(2)}`, 15, y + 12);

  doc.setFontSize(11);
  doc.text("OBSERVAÇÕES", 105, y + 22, { align: "center" });
  doc.setFontSize(10);
  doc.text(`FORMA DE PAGAMENTO: ${orcamento.pagamento}`, 15, y + 30);
  doc.text(`OUTRAS OBSERVAÇÕES: ${orcamento.observacoes}`, 15, y + 36);

  doc.line(60, 275, 150, 275);
  doc.text(dadosCliente.nome, 105, 280, { align: "center" });

  doc.save(`orcamento_${orcamento.numero}.pdf`);
}