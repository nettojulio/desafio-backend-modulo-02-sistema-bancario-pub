const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');

describe("Testando rota de depositos", () => {
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

    it("Depositar em conta bancária com body inválido", async () => {
        const res = await request(servidor).post('/transacoes/depositar').send({ valor: 10000 });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Depositar em conta bancária com valor zerado ou negativo", async () => {
        const res = await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "2",
            valor: -1000,
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Depositar em conta bancária não existente", async () => {
        const res = await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "10",
            valor: 10000
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Depositar em conta bancária", async () => {
        const res = await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "1",
            valor: 10000
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mensagem');
    });
});