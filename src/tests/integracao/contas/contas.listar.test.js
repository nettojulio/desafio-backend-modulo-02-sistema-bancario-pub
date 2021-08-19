const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');

describe("Testando rota de listagem de contas bancárias", () => {
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

    it("Listar contas bancárias sem a senha do banco", async () => {
        const res = await request(servidor).get('/contas');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Listar contas bancárias com a senha do banco inválida", async () => {
        const res = await request(servidor).get('/contas?senha_banco=123');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Listar contas bancárias", async () => {
        const res = await request(servidor).get('/contas?senha_banco=Cubos123Bank')

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([
            {
                "numero": "1",
                "usuario": {
                    "nome": "Daniel",
                    "cpf": "12312312312",
                    "data_nascimento": "10/01/2000",
                    "telefone": "71999998888",
                    "email": "daniel@daniel.com"
                }
            }
        ]);
    });
});