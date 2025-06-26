const mapExporter = () => {
  const servico = {
    "Cliente/Prestador": "pessoa.nome",
    Tipo: "pessoa.tipo",
    Documento: "pessoa.documento",
    "Tipo serviço tomado": "tipoServicoTomado",
    Descrição: "descricao",
    Valor: "valor",
    "Data contratação": "dataContratacao",
    "Data conclusão": "dataConclusao",
  };

  return servico;
};

module.exports = { mapExporter };
