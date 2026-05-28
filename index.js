/*
====================================================
🤖 BOT TELEGRAM - validar_cpf_js_bot
====================================================
*/

require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
    polling: true
});

console.log('🤖 Bot iniciado com sucesso!');


/*
====================================================
📌 TECLADOS
====================================================
*/

const tecladoPrincipal = {
    reply_markup: {
        keyboard: [
            ['✅ Validar CPF'],
            ['ℹ️ Sobre'],
            ['❌ Sair']
        ],
        resize_keyboard: true
    }
};

const removerTeclado = {
    reply_markup: {
        remove_keyboard: true
    }
};


/*
====================================================
📌 FUNÇÕES
====================================================
*/

function formatarCPF(cpf) {

    return cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
    );
}


function validarCPF(cpf) {

    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    // evita CPF repetido
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    // primeiro dígito
    for (let i = 1; i <= 9; i++) {

        soma += Number(cpf[i - 1]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    // segundo dígito
    for (let i = 1; i <= 10; i++) {

        soma += Number(cpf[i - 1]) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== Number(cpf[10])) {
        return false;
    }

    return true;
}


function enviarMenu(chatId) {

    bot.sendMessage(
        chatId,
        `
📋 <b>MENU PRINCIPAL</b>

Escolha uma opção:
        `,
        {
            parse_mode: 'HTML',
            ...tecladoPrincipal
        }
    );
}


function enviarErroCPF(chatId) {

    bot.sendMessage(
        chatId,
        `
⚠️ <b>CPF inválido</b>

Digite um CPF válido.

Exemplo:
<code>529.982.247-25</code>
        `,
        {
            parse_mode: 'HTML',
            ...tecladoPrincipal
        }
    );
}
