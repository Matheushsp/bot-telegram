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


/*
====================================================
📌 COMANDOS
====================================================
*/

// START
bot.onText(/\/start/, (msg) => {

    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `
👋 Olá <b>${msg.from.first_name}</b>!

Bem-vindo ao sistema validador de CPF em JavaScript.
        `,
        {
            parse_mode: 'HTML'
        }
    );

    enviarMenu(chatId);
});


// MENU
bot.onText(/\/menu/, (msg) => {

    enviarMenu(msg.chat.id);
});


// AJUDA
bot.onText(/\/ajuda/, (msg) => {

    bot.sendMessage(
        msg.chat.id,
        `
📌 <b>COMANDOS DISPONÍVEIS</b>

/start
/menu
/ajuda

📄 Envie qualquer CPF para validar.
        `,
        {
            parse_mode: 'HTML'
        }
    );
});


/*
====================================================
📌 MENSAGENS
====================================================
*/

bot.on('message', async (msg) => {

    try {

        const chatId = msg.chat.id;

        if (!msg.text) return;

        const texto = msg.text.trim();

        // ignora comandos
        if (texto.startsWith('/')) {
            return;
        }


        /*
        ============================================
        ✅ VALIDAR CPF
        ============================================
        */

        if (
            texto === '✅ Validar CPF'
        ) {

            bot.sendMessage(
                chatId,
                `
📄 <b>Envie um CPF para validar</b>

Exemplos:

<code>52998224725</code>

<code>529.982.247-25</code>
                `,
                {
                    parse_mode: 'HTML',
                    ...removerTeclado
                }
            );

            return;
        }


        /*
        ============================================
        ℹ️ SOBRE
        ============================================
        */

        if (texto === 'ℹ️ Sobre') {

            bot.sendMessage(
                chatId,
                `
🤖 <b>BOT VALIDADOR DE CPF</b>

✅ Desenvolvido em JavaScript por:

* Gabriel Rodrigues  
* Guilherme Hibiner  
* Mateus Theobald  
* Matheus Santos  
* Rauan Silva
                `,
                {
                    parse_mode: 'HTML',
                    ...tecladoPrincipal
                }
            );

            return;
        }


        /*
        ============================================
        ❌ SAIR
        ============================================
        */

        if (texto === '❌ Sair') {

            bot.sendMessage(
                chatId,
                `
👋 Atendimento encerrado.

Digite /start para iniciar novamente.
                `,
                {
                    ...removerTeclado
                }
            );

            return;
        }


        /*
        ============================================
        📄 VALIDAR CPF
        ============================================
        */

        const cpf = texto.replace(/\D/g, '');

        if (cpf.length !== 11) {

            enviarErroCPF(chatId);

            return;
        }

        const valido = validarCPF(cpf);


        /*
        ============================================
        ✅ CPF VÁLIDO
        ============================================
        */

        if (valido) {

            bot.sendMessage(
                chatId,
                `
✅ <b>CPF VÁLIDO</b>

📄 CPF:
<code>${formatarCPF(cpf)}</code>

🟢 Situação:
Válido matematicamente.
                `,
                {
                    parse_mode: 'HTML',
                    ...tecladoPrincipal
                }
            );

        }


        /*
        ============================================
        ❌ CPF INVÁLIDO
        ============================================
        */

        else {

            bot.sendMessage(
                chatId,
                `
❌ <b>CPF INVÁLIDO</b>

📄 CPF:
<code>${formatarCPF(cpf)}</code>

🔴 Situação:
CPF não passou na validação.
                `,
                {
                    parse_mode: 'HTML',
                    ...tecladoPrincipal
                }
            );
        }

    } catch (erro) {

        console.error('❌ Erro interno:', erro);

        bot.sendMessage(
            msg.chat.id,
            `
❌ Ocorreu um erro interno.

Tente novamente mais tarde.
            `
        );
    }
});
