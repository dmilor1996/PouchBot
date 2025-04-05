const TelegramBot = require('node-telegram-bot-api');

// Замени 'YOUR_BOT_TOKEN' на свой токен
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Данные о ценах
const pouchPrices = {
    "Хлопок": {
        "Без брендирования, лента хлопок": {
            "S 8x10": { "50-199": 85, "200-499": 80, "500+": 70 },
            "M 10x15": { "50-199": 95, "200-499": 90, "500+": 80 },
            "L 20x30": { "50-199": 110, "200-499": 105, "500+": 100 }
        },
        "Брендирование штампом": {
            "S 8x10": { "100-199": 90, "200-499": 85, "500+": 75 },
            "M 10x15": { "100-199": 100, "200-499": 95, "500+": 85 },
            "L 20x30": { "100-199": 120, "200-499": 110, "500+": 105 }
        },
        "Термоперенос": {
            "S 8x10": { "100-199": 95, "200-499": 90, "500+": 85 },
            "M 10x15": { "100-199": 105, "200-499": 100, "500+": 95 },
            "L 20x30": { "100-199": 125, "200-499": 120, "500+": 115 }
        },
        "С помощью ленты с печатью": {
            "S 8x10": { "50-199": 90, "200-499": 85, "500+": 80 },
            "M 10x15": { "50-199": 100, "200-499": 95, "500+": 90 },
            "L 20x30": { "50-199": 115, "200-499": 110, "500+": 105 }
        }
    },
    "Хлопок с двойной лентой": {
        "Термоперенос": {
            "S 8x10": { "100-199": 155, "200-499": 145, "500+": 135 },
            "M 15x15": { "100-199": 180, "200-499": 170, "500+": 145 },
            "L 25x25": { "100-199": 220, "200-499": 210, "500+": 175 },
            "XL 40x40": { "100-199": 285, "200-499": 275, "500+": 225 }
        },
        "Штамп": {
            "S 8x10": { "100-199": 145, "200-499": 140, "500+": 122 },
            "M 15x15": { "100-199": 165, "200-499": 160, "500+": 133 },
            "L 25x25": { "100-199": 195, "200-499": 185, "500+": 155 },
            "XL 40x40": { "100-199": 255, "200-499": 245, "500+": 205 }
        }
    },
    "Саржа с двойной лентой": {
        "Термоперенос": {
            "S 8x10": { "100-199": 175, "200-499": 165, "500+": 140 },
            "M 15x15": { "100-199": 210, "200-499": 195, "500+": 170 },
            "L 25x25": { "100-199": 265, "200-499": 255, "500+": 220 },
            "XL 40x40": { "100-199": 345, "200-499": 335, "500+": 305 }
        }
    },
    "Фатин": {
        "Лента с логотипом": {
            "S 8x15": { "50-199": 105, "200-499": 80, "500+": 75 },
            "M 14x20": { "50-199": 115, "200-499": 90, "500+": 85 },
            "L 18x30": { "50-199": 130, "200-499": 105, "500+": 100 }
        }
    },
    "Велюр": {
        "Лента с логотипом": {
            "S 7x9": { "50-199": 90, "200-499": 85, "500+": 80 },
            "M 9x12": { "50-199": 100, "200-499": 95, "500+": 90 },
            "L 12x18": { "50-199": 115, "200-499": 110, "500+": 105 }
        },
        "Термоперенос": {
            "S 7x9": { "100-199": 115, "200-499": 105, "500+": 90 },
            "M 9x12": { "100-199": 125, "200-499": 115, "500+": 95 },
            "L 12x18": { "100-199": 135, "200-499": 125, "500+": 110 }
        }
    },
    "Велюр с двойной лентой": {
        "Термоперенос": {
            "S 8x10": { "100-199": 145, "200-499": 140, "500+": 120 },
            "M 15x15": { "100-199": 185, "200-499": 175, "500+": 160 },
            "L 25x25": { "100-199": 265, "200-499": 255, "500+": 240 },
            "XL 40x40": { "100-199": 410, "200-499": 395, "500+": 380 }
        }
    }
};

// Доступные опции
const availablePouchTypes = [
    "Хлопок",
    "Хлопок с двойной лентой",
    "Саржа с двойной лентой",
    "Фатин",
    "Велюр",
    "Велюр с двойной лентой"
];

const brandingKeys = {
    "no_branding": "Без брендирования, лента хлопок",
    "stamp": "Брендирование штампом",
    "thermo": "Термоперенос",
    "print_tape": "С помощью ленты с печатью",
    "logo_tape": "Лента с логотипом",
    "stamp_double": "Штамп"
};

const availableBrandingTypes = {
    "Хлопок": ["no_branding", "stamp", "thermo", "print_tape"],
    "Хлопок с двойной лентой": ["thermo", "stamp_double"],
    "Саржа с двойной лентой": ["thermo"],
    "Фатин": ["logo_tape"],
    "Велюр": ["logo_tape", "thermo"],
    "Велюр с двойной лентой": ["thermo"]
};

const availableSizes = {
    "Хлопок": {
        "Без брендирования, лента хлопок": ["S 8x10", "M 10x15", "L 20x30"],
        "Брендирование штампом": ["S 8x10", "M 10x15", "L 20x30"],
        "Термоперенос": ["S 8x10", "M 10x15", "L 20x30"],
        "С помощью ленты с печатью": ["S 8x10", "M 10x15", "L 20x30"]
    },
    "Хлопок с двойной лентой": {
        "Термоперенос": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"],
        "Штамп": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"]
    },
    "Саржа с двойной лентой": {
        "Термоперенос": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"]
    },
    "Фатин": {
        "Лента с логотипом": ["S 8x15", "M 14x20", "L 18x30"]
    },
    "Велюр": {
        "Лента с логотипом": ["S 7x9", "M 9x12", "L 12x18"],
        "Термоперенос": ["S 7x9", "M 9x12", "L 12x18"]
    },
    "Велюр с двойной лентой": {
        "Термоперенос": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"]
    }
};

const minQuantity = {
    "Без брендирования, лента хлопок": 50,
    "Брендирование штампом": 100,
    "Термоперенос": 100,
    "С помощью ленты с печатью": 50,
    "Штамп": 100,
    "Лента с логотипом": 50
};

// Хранилище данных пользователя
const userData = {};

// Приветственное сообщение
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Команда /start от ${chatId}`);

    if (userData[chatId] && userData[chatId].messageId) {
        bot.deleteMessage(chatId, userData[chatId].messageId)
            .catch(err => console.error(`Ошибка удаления: ${err.message}`));
    }

    userData[chatId] = { step: 'material', messageId: null };

    const keyboard = availablePouchTypes.map(type => [{ text: type, callback_data: `material_${type}` }]);
    bot.sendMessage(chatId, "Выбери материал:", {
        reply_markup: { inline_keyboard: keyboard }
    })
        .then(msg => {
            userData[chatId].messageId = msg.message_id;
            console.log(`Сообщение отправлено, messageId: ${msg.message_id}`);
        })
        .catch(err => console.error(`Ошибка отправки: ${err.message}`));
});

// Обработка выбора
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const messageId = query.message.message_id;

    console.log(`Получен callback: ${data} для messageId: ${messageId}`);

    try {
        userData[chatId].messageId = messageId;

        if (data === 'back') {
            if (userData[chatId].step === 'branding') {
                showMaterialMenu(chatId, messageId);
            } else if (userData[chatId].step === 'size') {
                showBrandingMenu(chatId, messageId);
            } else if (userData[chatId].step === 'quantity') {
                showSizeMenu(chatId, messageId);
            }
            return;
        } else if (data === 'start') {
            userData[chatId] = { step: 'material', messageId };
            showMaterialMenu(chatId, messageId);
            return;
        }

        if (data.startsWith('material_')) {
            const material = data.replace('material_', '');
            userData[chatId] = { step: 'branding', material, messageId };
            showBrandingMenu(chatId, messageId);
        } else if (data.startsWith('branding_')) {
            const brandingKey = data.replace('branding_', '');
            const branding = brandingKeys[brandingKey];
            userData[chatId].branding = branding;
            userData[chatId].step = 'size';
            showSizeMenu(chatId, messageId);
        } else if (data.startsWith('size_')) {
            const size = data.replace('size_', '');
            userData[chatId].size = size;
            userData[chatId].step = 'quantity';
            bot.editMessageText(`Вы выбрали ${size}. Введи количество (например, 200):`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Назад', callback_data: 'back' }],
                        [{ text: 'В начало', callback_data: 'start' }]
                    ]
                }
            });
        }
    } catch (error) {
        console.error(`Ошибка: ${error.message}`);
        bot.editMessageText("Произошла ошибка. Попробуй начать заново с /start.", {
            chat_id: chatId,
            message_id: messageId
        });
    }
});

// Обработка ввода количества
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        if (userData[chatId] && userData[chatId].messageId) {
            bot.deleteMessage(chatId, userData[chatId].messageId)
                .catch(err => console.error(`Ошибка удаления: ${err.message}`));
        }
        userData[chatId] = { step: 'material', messageId: null };
        showMaterialMenu(chatId);
        return;
    }

    const user = userData[chatId];
    if (!user || user.step !== 'quantity') return;

    const quantity = parseInt(text);
    const { material, branding, size, messageId } = user;

    if (isNaN(quantity) || quantity <= 0) {
        bot.editMessageText("Ошибка: введи корректное количество (положительное число).", {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Назад', callback_data: 'back' }],
                    [{ text: 'В начало', callback_data: 'start' }]
                ]
            }
        });
        return;
    }

    const minQty = minQuantity[branding] || 50;
    if (quantity < minQty) {
        bot.editMessageText(`Ошибка: минимальное количество — ${minQty} шт.`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Назад', callback_data: 'back' }],
                    [{ text: 'В начало', callback_data: 'start' }]
                ]
            }
        });
        return;
    }

    const quantityCategory = minQty === 50 ?
        (quantity >= 500 ? "500+" : quantity >= 200 ? "200-499" : "50-199") :
        (quantity >= 500 ? "500+" : quantity >= 200 ? "200-499" : "100-199");

    const pricePerUnit = pouchPrices[material]?.[branding]?.[size]?.[quantityCategory];
    if (!pricePerUnit) {
        bot.editMessageText("Ошибка: цены для выбранных параметров не найдены.", {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Назад', callback_data: 'back' }],
                    [{ text: 'В начало', callback_data: 'start' }]
                ]
            }
        });
        return;
    }

    const totalPrice = pricePerUnit * quantity;
    const response = `Материал: ${material}\n` +
                     `Брендирование: ${branding}\n` +
                     `Размер: ${size} см\n` +
                     `Количество: ${quantity} шт\n` +
                     `Цена за 1 шт: ${pricePerUnit} рублей\n` +
                     `Итоговая цена: ${totalPrice} рублей`;

    bot.editMessageText(response, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
            inline_keyboard: [[{ text: 'В начало', callback_data: 'start' }]]
        }
    });
    delete userData[chatId];
});

// Функции для отображения меню
function showMaterialMenu(chatId, messageId) {
    const keyboard = availablePouchTypes.map(type => [{ text: type, callback_data: `material_${type}` }]);
    bot.editMessageText("Выбери материал:", {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: keyboard }
    });
}

function showBrandingMenu(chatId, messageId) {
    const material = userData[chatId].material;
    const keyboard = [
        ...availableBrandingTypes[material].map(key => [{ text: brandingKeys[key], callback_data: `branding_${key}` }]),
        [{ text: 'Назад', callback_data: 'back' }],
        [{ text: 'В начало', callback_data: 'start' }]
    ];
    bot.editMessageText(`Вы выбрали ${material}. Теперь выбери тип брендирования:`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: keyboard }
    });
}

function showSizeMenu(chatId, messageId) {
    const { material, branding } = userData[chatId];
    const sizes = availableSizes[material][branding];
    const keyboard = [
        ...sizes.map(size => [{ text: size, callback_data: `size_${size}` }]),
        [{ text: 'Назад', callback_data: 'back' }],
        [{ text: 'В начало', callback_data: 'start' }]
    ];
    bot.editMessageText(`Вы выбрали ${branding}. Теперь выбери размер:`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: keyboard }
    });
}
