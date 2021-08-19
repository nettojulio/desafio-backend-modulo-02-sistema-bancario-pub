const yup = require('yup');

const depositosSaques = yup.object().shape({
    data: yup.date().required(),
    numero_conta: yup.string().required(),
    valor: yup.number().integer().required()
});

const transferencias = yup.object().shape({
    data: yup.date().required(),
    numero_conta_destino: yup.string().required(),
    numero_conta_origem: yup.string().required(),
    valor: yup.number().integer().required()
});

const extrato = yup.object().shape({
    depositos: yup.array().of(depositosSaques),
    saques: yup.array().of(depositosSaques),
    transferenciasEnviadas: yup.array().of(transferencias),
    transferenciasRecebidas: yup.array().of(transferencias)
});

module.exports = extrato;