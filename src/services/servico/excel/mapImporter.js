const mapImporter = async ({ row }) => {
  const servico = {
    pessoa: {
      nome: row[0],
      tipo: row[1],
      documento: row[2]?.toLowerCase(),
    },
    tipoServicoTomado: row[3],
    descricao: row[4],
    valor: row[5],
    dataContratacao: row[6],
    dataConclusao: row[7],
  };

  return servico;
};

module.exports = { mapImporter };
