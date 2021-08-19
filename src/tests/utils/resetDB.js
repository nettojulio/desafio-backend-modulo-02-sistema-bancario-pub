let bancodeDados = require('../../bancodedados');

function resetDatabase() {
  bancodeDados = {
    banco: {
      nome: 'Cubos Bank',
      numero: '123',
      agencia: '0001',
      senha: 'Cubos123Bank'
    },
    contas: [],
    saques: [],
    depositos: [],
    transferencias: []
  }
}

module.exports = resetDatabase;