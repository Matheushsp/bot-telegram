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


