const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');

describe("Testando rota de saldo", () => {
    beforeEach(async () => {
        resetDB();

        await request(servidor).post('/contas').send({
            nome: "Daniel",
            cpf: "12312312312",
            data_nascimento: "10/01/2000",
            telefone: "71999998888",
            email: "daniel@daniel.com",
            senha: "123456"
        });
    });

    it("Consultar saldo com com senha ou conta bancária inválida", async () => {
        const res = await request(servidor).get('/transacoes/saldo?senha=1234');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Consultar saldo de conta banária não existente", async () => {
        const res = await request(servidor).get('/transacoes/saldo?senha=1234&numero_conta=10');

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Consultar saldo de conta banária com senha inválida", async () => {
        const res = await request(servidor).get('/transacoes/saldo?senha=1234&numero_conta=1');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Consultar saldo de conta banária", async () => {
        await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "1",
            valor: 10000
        });

        const res = await request(servidor).get('/transacoes/saldo?senha=123456&numero_conta=1')

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ saldo: 10000 });
    });
})
