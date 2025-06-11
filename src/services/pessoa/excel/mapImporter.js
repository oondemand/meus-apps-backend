const mapImporter = async ({ row }) => {
  const pessoa = {
    grupo: row[0],
    nome: row[1],
    tipo: row[2],
    documento: row[3],
  };

  return pessoa;
};

module.exports = { mapImporter };
