const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');

describe("Testando rota de transferências", () => {

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

    });

    it("Transferir valores entre contas bancárias com body inválido", async () => {
        const res = await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "2",
            senha: "1234"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Transferir valores entre contas bancárias para conta de origem não existente", async () => {
        const res = await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "9",
            numero_conta_destino: "2",
            valor: 3000,
            senha: "1234"
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Transferir valores entre contas bancárias para conta de destino não existente", async () => {
        const res = await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "10",
            valor: 3000,
            senha: "123456"
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Transferir valores entre contas bancárias com senha inválida", async () => {

        const res = await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "2",
            valor: 3000,
            senha: "12345678"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Transferir valores entre contas bancárias com valor zerado ou negativo", async () => {
        const res = await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "2",
            valor: -3000,
            senha: "1234"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Transferir valores entre contas bancárias com saldo insuficiente", async () => {
        const res = await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "2",
            valor: 30000,
            senha: "1234"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Transferir valores entre contas bancárias", async () => {
        const res = await request(servidor).post('/transacoes/transferir').send({
            numero_conta_origem: "1",
            numero_conta_destino: "2",
            valor: 3000,
            senha: "123456"
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mensagem');
    });
});

