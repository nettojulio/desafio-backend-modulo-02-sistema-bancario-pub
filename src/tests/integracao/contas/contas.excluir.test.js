const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');

describe("Testando rota de exclusão de conta bancária", () => {
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

    it("Excluir conta bancária com número inexistente", async () => {
        const res = await request(servidor).delete('/contas/9');

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem')
    });

    it("Excluir conta bancária com saldo maior que zero", async () => {
        const res = await request(servidor).delete('/contas/1')

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem')
    });

    it("Excluir conta bancária", async () => {
        const res = await request(servidor).delete('/contas/2');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mensagem')
    });
});
