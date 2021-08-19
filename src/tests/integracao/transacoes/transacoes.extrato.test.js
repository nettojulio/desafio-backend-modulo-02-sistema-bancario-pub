const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');
const extratoSchema = require('../../validacoes/extratoSchema');

describe("Testando rota de extratos", () => {
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

        await request(servidor).post('/contas').send({
            nome: "Guido",
            cpf: "32132132112",
            data_nascimento: "10/01/2000",
            telefone: "71999998888",
            email: "guido@guido.com",
            senha: "123456"
        });

        await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "1",
            valor: 10000
        });

        await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "1",
            valor: 3000
        });

        await request(servidor).post('/transacoes/depositar').send({
            numero_conta: "2",
            valor: 15000
        });

        await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "1",
            valor: 5000,
            senha: "123456"
        });

        await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "1",
            valor: 1500,
            senha: "123456"
        });

        await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "2",
            valor: 2500,
            senha: "123456"
        });

        await request(servidor).post('/transacoes/sacar').send({
            numero_conta: "2",
            valor: 4000,
            senha: "123456"
        });

        await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "2",
            valor: 2000,
            senha: "123456"
        });

        await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "2",
            valor: 1000,
            senha: "123456"
        });

        await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "2",
            numero_conta_destino: "1",
            valor: 500,
            senha: "123456"
        });

        await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "2",
            numero_conta_destino: "1",
            valor: 1000,
            senha: "123456"
        });
    });

    it("Emitir extrato com senha ou conta bancária inválida", async () => {
        const res = await request(servidor).get('/transacoes/extrato?senha=1234');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Emitir extrato de conta bancária não existente", async () => {
        const res = await request(servidor).get('/transacoes/extrato?senha=1234&numero_conta=10');

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Emitir extrato de conta bancária com senha inválida", async () => {
        const res = await request(servidor).get('/transacoes/extrato?senha=1234&numero_conta=1');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Emitir extrato de conta bancária", async () => {
        const res = await request(servidor).get('/transacoes/extrato?senha=123456&numero_conta=1');

        expect(res.statusCode).toEqual(200);
        const validate = await extratoSchema.validate(res.body);
        expect(!!validate).toEqual(true);
    });
});

