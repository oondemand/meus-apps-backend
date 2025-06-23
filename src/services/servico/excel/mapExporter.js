const mapExporter = () => {
  const servico = {
    "Tipo serviço tomado": "tipoServicoTomado",
    Descrição: "descricao",
    Valor: "valor",
    "Data contratação": "dataContratacao",
    "Data conclusão": "dataConclusao",
  };

  return servico;
};

module.exports = { mapExporter };
