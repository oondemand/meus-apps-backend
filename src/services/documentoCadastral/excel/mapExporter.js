const mapExporter = () => {
  const documentoCadastral = {
    Nome: "pessoa.nome",
    Documento: "pessoa.documento",
    "Tipo de cliente/prestador": "pessoa.tipo",
    "Tipo de documento fiscal": "tipoDocumento",
    Numero: "numero",
    Descrição: "descricao",
    "Motivo da recusa": "motivoRecusa",
    Observação: "observacao",
    "Status da validação": "statusValidacao",
  };

  return documentoCadastral;
};

module.exports = { mapExporter };
