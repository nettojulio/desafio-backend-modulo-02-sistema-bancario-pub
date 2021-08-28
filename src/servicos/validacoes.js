const { contas } = require('../bancodedados');

function validar_dados(dados) {
    let { nome, cpf, data_nascimento, telefone, email, senha } = dados;

    if (validar_nome(nome)) return validar_nome(nome);
    if (validar_cpf(cpf)) return validar_cpf(cpf);
    if (validar_data_nascimento(data_nascimento)) return validar_data_nascimento(data_nascimento);
    if (validar_telefone(telefone)) return validar_telefone(telefone);
    if (validar_email(email)) return validar_email(email);
    if (validar_senha(senha)) return validar_senha(senha);
}

function gerar_nova_conta() {
    let ultima_conta = 0;
    while (ultima_conta === 0 || (contas.some(conta => Number(conta.numero) === ultima_conta))) {
        ultima_conta++;
    }
    return ultima_conta;
}

function cpf_unico(cpf) {
    return contas.some(busca => busca.usuario.cpf === cpf);
}

function email_unico(email) {
    return contas.some(busca => busca.usuario.email === email);
}

function buscar_conta(conta) {
    return contas.find(busca => busca.numero === conta);
}

function validar_nome(nome) {
    if (typeof nome !== 'string' || !nome || !nome.trim()) return "Campo Nome é obrigatório!";
    if (!nome.trim().includes(' ')) return "Digite seu nome completo!";
}

function validar_cpf(cpf) {
    if (typeof cpf !== 'string' && typeof cpf !== 'number' || cpf.length !== 11) return "CPF inválido!";
    cpf = tratar_cpf(cpf);
    if (cpf.trim().length !== 11) return "CPF incorreto!";
    if (typeof cpf !== 'string' || !cpf.trim()) return "Campo CPF é obrigatório!";
    if (cpf_unico(cpf)) return "CPF já é correntista!";
}

function validar_data_nascimento(data_nascimento) {
    if (!data_nascimento || typeof data_nascimento !== 'string' || !data_nascimento.trim()) return "Campo Data de Nascimento é obrigatório!";
}

function validar_telefone(telefone) {
    if (!telefone || typeof telefone !== "string") return "Telefone inválido!";
    if (!telefone.trim()) return "Campo Telefone é obrigatório!";
}

function validar_email(email) {
    if (!email || typeof email !== "string" || !email.includes('@') || !email.includes('.')) return "E-Mail inválido!";
    if (!email.trim()) return "Campo E-Mail é obrigatório!";
    if (email_unico(email.trim())) return "E-Mail já cadastrado!";
}

function validar_senha(senha) {
    if (!senha || typeof senha !== "string") return "Senha inválida!"
    if (!senha.trim()) return "Campo Senha é obrigatório!";
}

function tratar_cpf(cpf) {
    if (typeof cpf === 'number') {
        cpf = cpf.toString().trim();
    }

    while (cpf.includes('.') || cpf.includes('-') || cpf.includes(' ')) {
        cpf = cpf.replace('.', '');
        cpf = cpf.replace('-', '');
        cpf = cpf.replace(' ', '');
    }
    cpf = cpf.trim();
    cpf = cpf.split('');

    for (let x = 0; x < cpf.length; x++) {
        cpf[x] = isNaN(Number((cpf[x]))) ? ' ' : Number((cpf[x]));
    }

    cpf = cpf.join('');

    while (cpf.includes(' ')) {
        cpf = cpf.replace(' ', '');
    }
    return cpf;
}

module.exports = { validar_dados, gerar_nova_conta, buscar_conta, tratar_cpf, cpf_unico, email_unico, validar_nome, validar_cpf, validar_data_nascimento, validar_telefone, validar_email, validar_senha }