const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');

describe("Testando rota de saques", () => {
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

        await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "1",
            valor: 10000
        });
    });

    it("Sacar em conta bancária com body inválido", async () => {
        const res = await request(servidor).post('/transacoes/sacar').send({ valor: 10000 });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Sacar em conta bancária não existente", async () => {

        const res = await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "10",
            valor: 1000,
            senha: "1234"
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Sacar em conta bancária com senha inválida", async () => {

        const res = await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "1",
            valor: 1000,
            senha: "123123"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Sacar em conta bancária com valor negativo ou zero", async () => {
        const res = await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "1",
            valor: -1000,
            senha: "1234"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Sacar em conta bancária com valor maior que o saldo", async () => {
        const res = await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "1",
            valor: 100000,
            senha: "1234"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Sacar em conta bancária", async () => {
        const res = await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "1",
            valor: 1000,
            senha: "123456"
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mensagem');
    });
});
