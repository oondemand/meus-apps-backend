# Central OnDemand - Documentação do Desenvolvedor

## Introdução

Bem-vindo à documentação do desenvolvedor Central OonDemand! Este guia foi criado para ajudar desenvolvedores a entender, utilizar e contribuir com o sistema de forma eficiente.

---

## 🔧 Como criar uma nova coleção

Chamamos de `coleção` (ou módulo) o conjunto de rotas necessárias para renderizar o componente completo `datagrid` no front-end.

Essas rotas se consistem basicamente de:

- Rota de criação
- Rota de atualização
- Listagem com paginação
- Obter registro por id
- Excluir registro

A depender do registro também podemos ter as seguintes rotas:

- Exportar registros (usando os mesmos filtros de listagem)
- Importar registros

> Tanto importar quando exportar referem se a arquivos no formato `excel`

### Rotas

Quando criando uma coleção, o primeiro arquivo a ser criado é o arquivo de rotas em `/src/routers`.

> ⚠ Por questões de convenção o arquivo deve conter Router no nome, ex: `arquivoRouter.js`

Nosso arquivo deve conter as rotas (previamente citadas) que são obrigatórias para nossa coleção. Além disso cada rota deve receber uma função `handler` que deve estar localizada em `controllers`.

#### É válido ressaltar também a presença de alguns middlewares e helpers importantes que podem ser utilizados em cada rota.

- `registrarAcaoMiddleware` espera a resposta da API, e se tudo der certo, salva no sistema de controle que o usuário fez uma ação (ex: criou ou alterou algo) numa entidade (ex: "usuário", "lista").

- `asyncHandler` esse é um helper que envolve 99,9% das nossas rotas, é um `wrapper` para tratar erros automaticamente em nossos `handlers`, evitando ter que usar try/catch em todas elas.

### Controllers

Nossas rotas, como dito antes, devem receber uma função `handler` localizada em nosso controller `/src/controllers`. Essa função handler se comunica com nossos `service` e nos retorna uma resposta. Essa é a estrutura básica de uma função `handler` ou `controller`. Em código ficaria mais ou menos assim (salvo raras exceções)

```javascript
// Usuario controller
import UsuarioService = require("../../services/usuario")

// função handler para criar usuario
const criar = async(req, res) => {
  const usuario = await UsuarioService.criar(req.body)
  return sendResponse({ res, statusCode: 200, usuario })
}
```

> ⚠ Vale ressaltar que nosso controller deve seguir o padrão `controllers/nomeDoController/index.js`

### Para nossos controllers temos também alguns helpers importantes

- `sendResponse` Serve para retornar uma resposta "simples" com status code,
  message (não obrigatória) e o objeto retorno, ex: usuario, pedido etc
- `sendPaginatedResponse` Usado para retornar uma resposta paginada, segue o padrão de message (não obrigatória) status code, results (registros encontrados paginados) e paginação (current page, total pages, total items, items per page).
- `sendErrorResponse` Esse helper geralmente não é muito utilizado, salvo exceções, uma vez que usamos nosso `asyncHandler` para lidar com os erros em nossas funções handlers, mas em casos específicos esse helper é essencial.

É muito importante a utilização desses helpers em nosso controllers, pois para que `asyncHandler` e `registrarAcaoMiddleware` funcionem corretamente precisamos ter `responses` muito bem padronizadas.

### Services

Services `src/services` são uma parte muito importante da aplicação é aqui que esta concentrada a comunicação entre a camada do `moongose` com o banco de dados e as regras de negócio que podem ser modificadas de cliente para cliente.

Cada service deve seguir uma estrutura de pastas pre-definida:

```plaintext
services/
└── nomeDoService/
    ├── index.js              # Concentra todo nosso crud (create read delete...). Caso algumas dessa funções tenha uma regra de negócio especifica, essa função deverá fazer um túnel para `business.js`
    ├── business.js           # Concentra funções do crud com regra de negócio especificas, geralmente em create, update, delete.
    ├── validation.js         # As validações usadas em nosso service deve ficar isolada nessa arquivo, ex: validar se um usuário é existente ou duplicado.
    ├── excel
        ├── index.js          # Aqui temos as funções de exportar e importar
        ├── mapExporter.js    # Função que retorna estrutura usada para exportar
        └── mapImporter.js    # Função que retorna estrutura usada para exportar
    └──  omie
        └──  index.js         # Nesse arquivo se concentra toda lógica de comunicação/integração como omie, por exemplo a sincronização com omie;
```

#### Vale destacar também que em `src/services` temos uma pasta erros

Essa pasta é onde alocamos os nossos errors previstos e personalizados, como por exemplo erro de usuário não encontrado, **geralmente** quando há um erro previsto, mas ele não é um erro que se repete por toda aplicação usamos um `genericError` ao invés de lançar um `error` do `javascript`, mas quando o erro se repete por vário lugares da aplicação é comum criarmos um classe de erro personalizada que estende a classe `genericError` deste modo:

```javascript
const GenericError = require("../generic");

class UsuarioNaoEncontradoError extends GenericError {
  constructor() {
    super("Usuario não encontrado!", 404);
  }
}

module.exports = UsuarioNaoEncontradoError;
```

> Essa é uma prática muito importante para que `asyncHandler` e `registrarAcaoMiddleware` funcionem corretamente

#### Um util muito importante para os nossos services são os `pagination` e `filters` utils em `utils/pagination`

Esse util é muito importante para criar as rotas de listagem com paginação. Exemplo de como usar esses utils:

```javascript
const listarComPaginacao = async ({
  pageIndex,
  pageSize,
  searchTerm,
  filtros,
  ...rest
}) => {
  const camposBusca = ["status", "nome", "email", "tipo"];

  // Filter utils
  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Pessoa.schema,
    searchTerm,
    camposBusca,
  });

  // PaginationUtils
  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [pessoas, totalDePessoas] = await Promise.all([
    Pessoa.find({
      $and: [...query, { status: { $ne: "arquivado" } }],
    })
      .skip(skip)
      .limit(limite),
    Pessoa.countDocuments({
      $and: [...query, { status: { $ne: "arquivado" } }],
    }),
  ]);

  return { pessoas, totalDePessoas, page, limite };
};
```

---

_Esta documentação está em constante evolução. Sua contribuição é bem-vinda!_
