const request = require('supertest');
const servidor = require('../../../servidor');
const resetDB = require('../../utils/resetDB');

describe("Testando rota de criação de conta bancária", () => {
    beforeEach(() => {
        resetDB();
    });

    it("Criar conta bancária", async () => {
        const res = await request(servidor).post('/contas').send({
            nome: "Daniel",
            cpf: "12312312312",
            data_nascimento: "10/01/1992",
            telefone: "(18) 99797-9797",
            email: "daniel.lopes@cubos.academy",
            senha: "123456"
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            numero: '1',
            saldo: 0,
            usuario: {
                nome: 'Daniel',
                cpf: '12312312312',
                data_nascimento: '10/01/1992',
                telefone: '(18) 99797-9797',
                email: 'daniel.lopes@cubos.academy',
                senha: '123456'
            }
        });

        const resTodasContas = await request(servidor).get('/contas?senha_banco=Cubos123Bank');

        expect(resTodasContas.body).toEqual([
            {
                "numero": "1",
                "usuario": {
                    "cpf": "12312312312",
                    "data_nascimento": "10/01/1992",
                    "email": "daniel.lopes@cubos.academy",
                    "nome": "Daniel",
                    "telefone": "(18) 99797-9797"
                }
            }
        ]);
    });

    it("Criar conta bancária com o body inválido", async () => {
        const res = await request(servidor).post('/contas').send({
            nome: "",
            cpf: "22222222212",
            data_nascimento: "10/01/1992",
            telefone: "(18) 99797-9797",
            email: "guido.cerqueira@cubos.academy",
            senha: "22245678"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Criar conta bancária com cpf ou email já existente", async () => {
        const res = await request(servidor).post('/contas').send({
            nome: "Daniel",
            cpf: "12312312312",
            data_nascimento: "10/01/1992",
            telefone: "(18) 99797-9797",
            email: "daniel.lopes@cubos.academy",
            senha: "123456"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it("Criar conta bancária com dados inválidos", async () => {
        const res = await request(servidor).post('/contas').send({
            nome: "Daniel Lopes",
            cpf: "12312312312",
            data_nascimento: "10/01/1992",
            telefone: "(18) 99797-9797",
            email: "danieldeandradelopes@gmail.com",
            senha: "12345678"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('mensagem');
    });
});
