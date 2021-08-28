const express = require('express');
const { listar_contas, criar_conta, atualizar_conta, excluir_conta, deposito, saque, transferencia, saldo, extrato } = require('./controladores/cubosbank');

const roteador = express();

roteador.get('/contas', listar_contas);
roteador.post('/contas', criar_conta);
roteador.put('/contas/:numeroConta/usuario', atualizar_conta);
roteador.delete('/contas/:numeroConta', excluir_conta);
roteador.post('/transacoes/depositar', deposito);
roteador.post('/transacoes/sacar', saque);
roteador.post('/transacoes/transferir', transferencia);
roteador.get('/contas/saldo', saldo);
roteador.get('/contas/extrato', extrato);

module.exports = roteador;