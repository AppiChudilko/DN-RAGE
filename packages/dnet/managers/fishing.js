let Container = require('../modules/data');

let items = require('../items');
let enums = require('../enums');

let methods = require('../modules/methods');

let fishing = exports;
let prices = [];

fishing.loadAll = function () {
    prices = [];
    enums.fishList.forEach(item => {
        prices.push([item[0], item[1], item[2], item[3], items.getItemPrice(item[0])])
    });
    Container.Data.Set(-99, 'fishTrade', JSON.stringify(prices));
    fishing.trade();
};

fishing.getPrices = function () {
    return prices;
};

fishing.trade = function () {
    prices.forEach((item, idx) => {
        if (item[4] > items.getItemPrice(item[0]) * 3) {
            prices[idx][4] = item[4] - items.getItemPrice(item[0]) / methods.getRandomInt(3, 10);
            return;
        }
        if (item[4] < items.getItemPrice(item[0]) / 2) {
            prices[idx][4] = item[4] + items.getItemPrice(item[0]) / methods.getRandomInt(3, 10);
            return;
        }
        if (methods.getRandomInt(0, 2) === 0)
            prices[idx][4] = item[4] + items.getItemPrice(item[0]) / methods.getRandomInt(5, 10);
        else
            prices[idx][4] = item[4] - items.getItemPrice(item[0]) / methods.getRandomInt(5, 10);
    });
    Container.Data.Set(-99, 'fishTrade', JSON.stringify(prices));
    setTimeout(fishing.trade, methods.getRandomInt(30, 45) * 1000 * 60);

    methods.notifyWithPictureToAll(
        `Биржа рыбаков`,
        "~y~Новости биржи",
        `Цены на рыбу были изменены`,
        "CHAR_LIFEINVADER",
        1
    );
};