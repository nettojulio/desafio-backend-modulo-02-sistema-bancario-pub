const { contas, saques, depositos, transferencias, banco: { senha: rootpassword } } = require('../bancodedados');
const { validar_dados, gerar_nova_conta, buscar_conta, tratar_cpf, validar_nome, validar_cpf, validar_data_nascimento, validar_telefone, validar_email, validar_senha } = require('../servicos/validacoes');
const { format } = require('date-fns');

async function listar_contas(req, res) {
    req.query.senha_banco !== rootpassword ? res.status(400).json([]) : res.status(200).json(contas);
}

async function criar_conta(req, res) {
    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const erro = validar_dados(req.body);
    if (erro) return res.status(400).json({ erro });

    const nova_conta = {
        numero: gerar_nova_conta().toString(),
        saldo: 0,
        usuario: {
            nome: nome.trim(),
            cpf: tratar_cpf(cpf),
            data_nascimento: data_nascimento.trim(),
            telefone: telefone.trim(),
            email: email.trim(),
            senha
        }
    }

    contas.push(nova_conta);
    contas.sort((a, b) => a.numero - b.numero);
    res.status(201).json(nova_conta);
}

async function atualizar_conta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) return res.status(404).json({ erro: "Nenhum dado a ser atualizado" });
    const conta = buscar_conta(req.params.numeroConta);
    if (!conta) return res.status(404).json({ erro: "Conta não encontrada" });

    let erro

    if (nome) {
        erro = validar_nome(nome);
        if (erro) return res.status(400).json({ erro });
    }
    if (cpf) {
        erro = validar_cpf(cpf);
        if (erro) return res.status(400).json({ erro });
    }
    if (data_nascimento) {
        erro = validar_data_nascimento(data_nascimento);
        if (erro) return res.status(400).json({ erro });
    }
    if (telefone) {
        erro = validar_telefone(telefone);
        if (erro) return res.status(400).json({ erro });
    }
    if (email) {
        erro = validar_email(email);
        if (erro) return res.status(400).json({ erro });
    }
    if (senha) {
        erro = validar_senha(senha);
        if (erro) return res.status(400).json({ erro });
    }

    nome ? conta.usuario.nome = nome.trim() : nome;
    cpf ? conta.usuario.cpf = tratar_cpf(cpf) : cpf;
    data_nascimento ? conta.usuario.data_nascimento = data_nascimento.trim() : data_nascimento;
    telefone ? conta.usuario.telefone = telefone.trim() : telefone;
    email ? conta.usuario.email = email.trim() : email;
    senha ? conta.usuario.senha = senha : senha;

    res.status(201).json({ mensagem: "Conta atualizada com sucesso!" });
}

async function excluir_conta(req, res) {
    const conta = buscar_conta(req.params.numeroConta);
    if (!conta) return res.status(404).json({ erro: "Conta não encontrada" });
    if (conta.saldo !== 0) return res.status(400).json({ erro: "Conta possui saldo!" });
    contas.splice(contas.indexOf(conta), 1);
    res.status(200).json({ mensagem: "Conta excluída com sucesso!" });
}

async function deposito(req, res) {
    const { conta: conta_deposito, valor: valor_deposito } = req.body;
    if (!conta_deposito || !valor_deposito) return res.status(400).json({ erro: "Dados insuficientes para realizar a transação!" });
    const conta = buscar_conta(conta_deposito.toString());
    if (!conta) return res.status(404).json({ erro: "Conta não encontrada" });
    if (valor_deposito <= 0 || typeof valor_deposito !== 'number') return res.status(400).json({ erro: "Valor de depósito incorreto." });

    conta.saldo += valor_deposito;
    const registro_deposito = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta: conta.numero,
        valor: valor_deposito
    }

    depositos.push(registro_deposito);
    res.status(200).json({ mensagem: "Depósito realizado com sucesso!" })
}

async function saque(req, res) {
    const { conta: conta_saque, valor: valor_saque, senha: senha_saque } = req.body;
    if (!conta_saque || !valor_saque || !senha_saque) return res.status(400).json({ erro: "Dados insuficientes para realizar a transação!" });
    const conta = buscar_conta(conta_saque.toString());
    if (!conta) return res.status(404).json({ erro: "Conta não encontrada" });
    if (valor_saque <= 0 || typeof valor_saque !== 'number') return res.status(400).json({ erro: "Valor de saque incorreto." });
    const { saldo, usuario: { senha } } = conta;
    if (senha_saque !== senha) return res.status(400).json({ erro: "Senha incorreta." });
    if (valor_saque > saldo) return res.status(400).json({ erro: "Valor de saque superior ao saldo." });

    conta.saldo -= valor_saque;
    const registro_saque = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta: conta.numero,
        valor: valor_saque
    }

    saques.push(registro_saque);
    res.status(200).json({ mensagem: "Saque realizado com sucesso!" });
}

async function transferencia(req, res) {
    const { conta_origem: conta_origem_transferencia, conta_destino: conta_destino_transferencia, senha: senha_transferencia, valor: valor_transferencia } = req.body;
    if (!conta_origem_transferencia || !valor_transferencia || !senha_transferencia || !conta_destino_transferencia) return res.status(400).json({ erro: "Dados insuficientes para realizar a transação!" });
    const conta_origem = buscar_conta(conta_origem_transferencia.toString());
    const conta_destino = buscar_conta(conta_destino_transferencia.toString());
    if (!conta_origem) return res.status(404).json({ erro: "Conta de origem não encontrada" });
    if (!conta_destino) return res.status(404).json({ erro: "Conta de destino não encontrada" });
    if (conta_origem.numero.toString() === conta_destino.numero.toString()) return res.status(400).json({ erro: "Conta de destino é a mesma que a conta de origem!" });
    let { numero: numero_conta_origem, saldo: saldo_conta_origem, usuario: { senha: senha_conta_origem } } = conta_origem;
    let { numero: numero_conta_destino } = conta_destino;
    if (senha_conta_origem !== senha_transferencia) return res.status(400).json({ erro: "Senha Inválida!" });
    if (valor_transferencia > saldo_conta_origem) return res.status(400).json({ erro: "Valor de transferência superior ao saldo!" });
    if (typeof valor_transferencia !== 'number') return res.status(400).json({ erro: "Valor de transferência informado incorreto!" });

    conta_destino.saldo += valor_transferencia;
    conta_origem.saldo -= valor_transferencia;
    const registro_transferencia = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor_transferencia
    }

    transferencias.push(registro_transferencia);
    res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
}

async function saldo(req, res) {
    const { numero_conta, senha } = req.query;
    if (!numero_conta || !senha) return res.status(400).json({ erro: "Dados insuficientes para realizar a transação!" });
    const conta = buscar_conta(numero_conta.toString());
    if (!conta) return res.status(404).json({ erro: "Conta não encontrada" });
    const { saldo, usuario: { senha: senha_usuario } } = conta;
    if (senha !== senha_usuario) return res.status(400).json({ erro: "Senha Inválida!" });

    res.status(200).json({ saldo });
}

async function extrato(req, res) {
    const { numero_conta, senha } = req.query;
    if (!numero_conta || !senha) return res.status(400).json({ erro: "Dados insuficientes para realizar a transação!" });
    const conta = buscar_conta(numero_conta.toString());
    if (!conta) return res.status(404).json({ erro: "Conta não encontrada" });
    const { saldo, usuario: { senha: senha_usuario } } = conta;
    if (senha_usuario !== senha) return res.status(400).json({ erro: "Senha Inválida" });

    const relatorio = {
        depositos: depositos.filter(x => conta.numero === x.numero_conta),
        saques: saques.filter(x => conta.numero === x.numero_conta),
        transferenciasEnviadas: transferencias.filter(x => conta.numero === x.numero_conta_origem),
        transferenciasRecebidas: transferencias.filter(x => conta.numero === x.numero_conta_destino)
    }
    res.status(200).json(relatorio);
}

module.exports = { listar_contas, criar_conta, atualizar_conta, excluir_conta, deposito, saque, transferencia, saldo, extrato }