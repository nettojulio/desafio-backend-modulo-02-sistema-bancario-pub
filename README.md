![](https://i.imgur.com/xG74tOh.png)

# Desafio | Back-end - Módulo 2

Você acabou de ser contratado pela melhor empresa de tecnologia do mundo: a **CUBOS**.
Sua primeira tarefa como desenvolvedor é criar uma API para um Banco Digital. Esse será um projeto **piloto**, ou seja, no futuro outras funcionalidades serão implementadas, portanto, dados do banco (nome, agência, etc.) serão imutáveis.

Seu papel é construir uma RESTful API que permita:

-   Criar conta bancária
-   Atualizar os dados do usuário da conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário
-   Excluir uma conta bancária

## Requisitos obrigatórios

-   Sua API deve seguir o padrão REST
-   Seu código deve estar organizado, delimitando as responsabilidades de cada arquivo adequadamente. Ou seja, é esperado que ele tenha, no mínimo:
    -   Um arquivo index.js
    -   Um arquivo servidor.js
    -   Um arquivo de rotas
    -   Um pasta com controladores
-   Qualquer valor (dinheiro) deverá ser representado em centavos (Ex.: R$ 10,00 reais = 1000)
-   Evite códigos duplicados. Antes de copiar e colar, pense se não faz sentido esse pedaço de código estar centralizado numa função.

## Persistências dos dados

Os dados serão persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. Todas as transações e contas bancárias deverão ser inseridas dentro deste objeto, seguindo a estrutura que já existe.

### Estrutura do objeto no arquivo `bancodedados.js`

```javascript
{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```

## Status Code

Abaixo, listamos os possíveis `status code` esperados como resposta da API.

```javascript
// 200 = requisição bem sucedida
// 201 = requisição bem sucedida e algo foi criado
// 400 = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 404 = o servidor não pode encontrar o recurso solicitado
```

## Endpoints

### Listar contas bancárias

#### `GET` `/contas?senha_banco=123`

Esse endpoint deverá listar todas as contas bancárias existentes.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se a senha do banco foi informada (passado como query params na url)
    -   Validar se a senha do banco está correta

-   Entrada (query params)

    -   Senha do banco

-   Saída
    -   listagem de todas as contas bancárias existentes

#### Exemplo de retorno

```javascript
// 2 contas encontradas
[
    {
        numero: "1",
        saldo: 0,
        usuario: {
            nome: 'Foo Bar',
            cpf: '00011122233',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'foo@bar.com',
            senha: '1234'
        }
    },
    {
        numero: "2",
        saldo: 1000,
        usuario: {
            nome: 'Foo Bar 2',
            cpf: '00011122234',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'foo@bar2.com',
            senha: '12345'
        }
    }
]

// nenhuma conta encontrada
[]
```

### Criar conta bancária

#### `POST` `/contas`

Esse endpoint deverá criar uma conta bancária, onde será gerado um número único para identificação da conta (número da conta).

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Criar uma nova conta cujo número é único
    -   CPF deve ser um campo único.
    -   E-mail deve ser um campo único.
    -   Verificar se todos os campos foram informados (todos são obrigatórios)
    -   Definir o saldo inicial da conta como 0

-   Entradas

    -   Nome
    -   Cpf
    -   Data Nascimento
    -   Telefone
    -   Email
    -   Senha

-   Saída

    -   Dados usuário
    -   Número da conta
    -   Saldo

#### Função

```javascript
function criarConta(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 201
{
    numero:  "1",
    saldo: 0,
    usuario: {
        nome: 'Foo Bar',
        cpf: '00011122233',
        data_nascimento: '2021-03-15',
        telefone: '71999998888',
        email: 'foo@bar.com',
        senha: '1234'
    }
}

// HTTP Status 400, 404
{
    mensagem: 'Mensagem do erro!'
}
```

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint deverá atualizar apenas os dados do usuário de uma conta bancária.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se foi passado, ao menos, um campo no body da requisição
    -   Verificar se o numero da conta passado como parametro na URL é válida
    -   Se o CPF for informado, verificar se já existe outro registro com o mesmo CPF
    -   Se o E-mail for informado, verificar se já existe outro registro com o mesmo E-mail
    -   Atualizar um ou mais campos dos dados do usuário de uma conta bancária

-   Entradas

    -   Nome
    -   Cpf
    -   Data Nascimento
    -   Telefone
    -   Email
    -   Senha

-   Saída

    -   Dados usuário
    -   Número da conta
    -   Saldo

#### Função

```javascript
function atualizarUsuarioConta(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Conta atualizada com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint deve excluir uma conta bancária existente.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta passado como parametro na URL é válida
    -   Permitir excluir uma conta bancária apenas se o saldo for 0 (zero)
    -   Remover a conta do objeto de persistência de dados.

-   Entradas

    -   Numero da conta bancária (passado como parâmetro na rota)

-   Saida

    -   Sucesso ou erro

#### Função

```javascript
function excluirConta(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Conta excluída com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint deverá somar o valor do depósito ao saldo de uma conta válida e registrar essa transação.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta e o valor do deposito foram informados no body
    -   Verificar se a conta bancária informada existe
    -   Não permitir depósitos com valores negativos ou zerados
    -   Somar o valor de depósito ao saldo da conta encontrada

-   Entrada

    -   Número da conta
    -   Valor

-   Saida

    -   Sucesso ou erro

#### Função

```javascript
function depositar(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Depósito realizado com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

#### Exemplo do registro de um depósito

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta: "1",
    valor: 10000
}
```

### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint deverá realizar o saque de um valor em uma determinada conta bancária e registrar essa transação.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta, o valor do saque e a senha foram informados no body
    -   Verificar se a conta bancária informada existe
    -   Verificar se a senha informada é uma senha válida para a conta informada
    -   Verificar se há saldo disponível para saque
    -   Subtrair o valor sacado do saldo da conta encontrada

-   Entrada

    -   Número da conta
    -   Valor
    -   Senha

-   Saída

    -   Sucesso ou erro

#### Função

```javascript
function sacar(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Saque realizado com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

#### Exemplo do registro de um saque

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta: "1",
    valor: 10000
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint deverá permitir a transferência de recursos (dinheiro) de uma conta bancária para outra e registrar essa transação.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body
    -   Verificar se a conta bancária de origem informada existe
    -   Verificar se a conta bancária de destino informada existe
    -   Verificar se a senha informada é uma senha válida para a conta de origem informada
    -   Verificar se há saldo disponível na conta de origem para a transferência
    -   Subtrair o valor da transfência do saldo na conta de origem
    -   Somar o valor da transferência no saldo da conta de destino

-   Entrada

    -   Número da conta (origem)
    -   Senha da conta (origem)
    -   Valor
    -   Número da conta (destino)

-   Saída

    -   Sucesso ou erro

#### Função

```javascript
function tranferir(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Transferência realizada com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

#### Exemplo do registro de uma transferência

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta_origem: "1",
    numero_conta_destino: "2",
    valor: 10000
}
```

### Saldo

#### `GET` `/transacoes/saldo?numero_conta=123&senha=123`

Esse endpoint deverá retornar o saldo de uma conta bancária.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verificar se a conta bancária informada existe
    -   Verificar se a senha informada é uma senha válida
    -   Exibir o saldo da conta bancária em questão

-   Entrada (query params)

    -   Número da conta
    -   Senha

-   Saída

    -   Saldo da conta

#### Função

```javascript
function saldo(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
    saldo: 13000
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

### Extrato

#### `GET` `/conta/extrato?numero_conta=123&senha=123`

Esse endpoint deverá listar as transações realizadas de uma conta específica.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verificar se a conta bancária informada existe
    -   Verificar se a senha informada é uma senha válida
    -   Retornar a lista de transferências, depósitos e saques da conta em questão.

-   Entrada (query params)

    -   Número da conta
    -   Senha

-   Saída
    -   Relatório da conta

#### Função

```javascript
function extrato(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  depositos: [
    {
      data: "2021-08-18 20:46:03",
      numero_conta: "1",
      valor: 10000
    },
    {
      data: "2021-08-18 20:46:06",
      numero_conta: "1",
      valor: 10000
    }
  ],
  saques: [
    {
      data: "2021-08-18 20:46:18",
      numero_conta: "1",
      valor: 1000
    }
  ],
  transferenciasEnviadas: [
    {
      data: "2021-08-18 20:47:10",
      numero_conta_origem: "1",
      numero_conta_destino: "2",
      valor: 5000
    }
  ],
  transferenciasRecebidas: [
    {
      data: "2021-08-18 20:47:24",
      numero_conta_origem: "2",
      numero_conta_destino: "1",
      valor: 2000
    },
    {
      data: "2021-08-18 20:47:26",
      numero_conta_origem: "2",
      numero_conta_destino: "1",
      valor: 2000
    }
  ]
}

// HTTP Status 400, 404
{
    mensagem: 'Mensagem do erro!'
}
```

## Aulas úteis:

-   [Roteador e Controlador](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/17/05/2021/aula/9821747f-8d71-47ee-b48f-426997e37ce2/b5b395c1-1c49-4866-a749-8719a176c3c5)
-   [Reutilizando validações](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/17/05/2021/aula/9821747f-8d71-47ee-b48f-426997e37ce2/8206f90d-d0e5-472d-8e65-331dbe5f0ecd)
-   [Adicionando dias úteis com date-fns](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/24/05/2021/aula/567d09bf-b527-42fa-b063-63d9ff4743f1/7c3ac2fe-80e1-4646-9e34-8dd8b38f5a0d)
-   [async / await](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/31/05/2021/aula/e12827a0-8c67-4293-92aa-d5763020a2f7/bfa1c52e-6502-474f-aecf-1cf718deff88)
-   [try / catch](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/07/06/2021/aula/0304e88c-4ac5-42b8-924e-81216af18f35/f882d693-d529-4fa4-bc19-27464c856582)
-   [Criando transações pagarme](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/07/06/2021/aula/0304e88c-4ac5-42b8-924e-81216af18f35/9446fc5e-a71f-49b0-a285-62b306d7a0cd)

**LEMBRE-SE**: é melhor feito do que perfeito!!!

###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`
