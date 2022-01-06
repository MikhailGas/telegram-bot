const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options')
const token = "5013964166:AAHnVeyRl85y1MjbMouvRSQ6tq46fgccztI";
const bot = new TelegramApi(token, { polling: true });
const chats = {};


const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю число от 0 до 9. Попробуй его угадать."
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Запуск бота" },
    { command: "/info", description: "Информация о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name}`);
    }

    if (text === "/start") {
      await bot.sendMessage(chatId, `Привет, ${msg.chat.first_name}`);
      return bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/238/0b2/2380b2c5-e968-3b29-b114-0594c0387e66/11.webp"
      );
    }

    if (text === "/game") {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, "Я не понимаю");
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId)
    }
    console.log(chats[chatId], data)
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю! Ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не отгадал. Бот выбрал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
