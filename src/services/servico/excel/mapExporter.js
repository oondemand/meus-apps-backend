const mapExporter = () => {
  const pessoa = {
    "Tipo serviço tomado": "tipoServicoTomado",
    Descrição: "descricao",
    Valor: "valor",
    "Data contratação": "dataContratacao",
    "Data conclusão": "dataConclusao",
  };

  return pessoa;
};

module.exports = { mapExporter };
