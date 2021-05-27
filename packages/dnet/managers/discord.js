const webhook = require("webhook-discord");

let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let user = require('../user');

let discord = exports;

discord.report = "https://discordapp.com/api/webhooks/682573681415028740/l0tkdhaVqlCLa_JZQ6xnAE1lE2aZejqq8Zj_x8QvUlAH8hoIB6frc6uZpUPfx3C7K8Ah";
discord.deadlist = "https://discord.com/api/webhooks/800625907323633676/6i7L7D9R0_WnwyNZdzZJHrkT3ZqUltCrOdu-UFzZzxg7N4jbJ-iP40UGBAUeYTSniKYB";
discord.invaderAd = "https://discord.com/api/webhooks/800626231351312425/No7GOZ8TxubI-CbIX9ylGQmRoNv3sxG2ONJSSY2bwIrGdjwdILeulTYqgnedvl36-GPc";
discord.invaderNews = "https://discordapp.com/api/webhooks/749837863985610853/8TJa5mtY2hdq1_2NWXoJEiiXT9o4BsDaUgrTungw5xJ5l3BNBVclgXMIiQo8Pf1L1Dkj";
discord.fractionNews = "https://discordapp.com/api/webhooks/682956739792076838/xnKY61UPcvyakdcRkMIFEsaFCMGKuK9u4wT7KK4lN_Spo1EdA_ySlzMOSLtfyW44QWMb";

discord.workBcsd = "https://discord.com/api/webhooks/793982959157248030/RPNJVWyyqk8LrqVkzmEo-7wrke_OPKiouBa0FepwEMj3tdOFIPUYdydirNRzcfv-2xy3";
discord.workLspd = "https://discord.com/api/webhooks/793982785542946846/6YZb1qRNvw03bV8rQkr-uhDeEbasw9LeUiFLLENNJE4s6-2rTUeWKOrR7_fNcqLGAfrG";
discord.workUsmc = "https://discord.com/api/webhooks/793982506390913065/7irBRWrmVfiXlJg3_RVKv3W_4YInkEzYEON55Ucn5sHSBtXHczT9t7FxhRPSCQXSpzNO";
discord.workNews = "https://discord.com/api/webhooks/793982310009012244/AC6aL2bazUf0G2t1g28rYWLx0b8M6z5R38Jp59KK20rb47yEQVo5kLI3y5XvOuJC6lm5";
discord.workEms = "https://discord.com/api/webhooks/793982662549307403/u3zvwVQfmOJ6qOyiK4bnSGZcel9wKSVFR8JMT3-vRPWIYH95RgePHDKYjATEwGzVvb4M";
discord.workGov = "https://discordapp.com/api/webhooks/756864667233812531/KgEtvxABddRxRW7ppLql2kTy4ZPFhFx5cCpvsSVlfdtKmj6i-1A5cJ4LFya9g-xVwbUw";

discord.marketProperty = "https://discord.com/api/webhooks/793983974397181962/x5MReHfl4s02-C2HI5Q6xOBjWdIAY9-gkeW-_aMqrXugJ_yXC9u1EFDCQL6gXl7MSDvg";
discord.marketBusiness = "https://discord.com/api/webhooks/793983974397181962/x5MReHfl4s02-C2HI5Q6xOBjWdIAY9-gkeW-_aMqrXugJ_yXC9u1EFDCQL6gXl7MSDvg";
discord.marketVehicles = "https://discord.com/api/webhooks/793983974397181962/x5MReHfl4s02-C2HI5Q6xOBjWdIAY9-gkeW-_aMqrXugJ_yXC9u1EFDCQL6gXl7MSDvg";

discord.dednetImg = "https://i.imgur.com/WhubVMp.png";
discord.socialClub = "https://a.rsg.sc//n/";

discord.imgGov = "https://i.imgur.com/eFGOitl.png";
discord.imgLspd = "https://i.imgur.com/uRUp6ig.png";
discord.imgFib = "https://i.imgur.com/KaMdGAl.png";
discord.imgUsmc = "";
discord.imgSheriff = "https://i.imgur.com/sOPdklt.png";
discord.imgEms = "https://i.imgur.com/MoMutqI.png";
discord.imgInvader = "https://i.imgur.com/xxUGqJi.png";

discord.colorGov = "#795548";
discord.colorLspd = "#2196F3";
discord.colorFib = "#212121";
discord.colorUsmc = "#9E9E9E";
discord.colorSheriff = "#8BC34A";
discord.colorEms = "#f44336";
discord.colorInvader = "#FFEB3B";

discord.sendFractionList = function (title, sender, message, senderImg = discord.dednetImg, avatar = discord.imgGov, color = "#f44336") {
    const Hook = new webhook.Webhook(discord.fractionNews);

    const msg = new webhook.MessageBuilder()
        .setName('Новости Штата')
        .setTitle(sender)
        .setAvatar(avatar)
        .setDescription(message)
        .setFooter(title, senderImg)
        .setColor(color)
        .setTime();

    Hook.send(msg);
};

discord.sendDeadList = function (target, desc, reason, sender = 'Server', senderImg = discord.dednetImg, color = "#f44336") {
    const Hook = new webhook.Webhook(discord.deadlist);

    const msg = new webhook.MessageBuilder()
        .setName("DEAD LIST")
        .setTitle(target)
        .addField("Описание", desc)
        .addField("Причина", reason)
        .setFooter(sender, senderImg)
        .setColor(color)
        .setTime();

    Hook.send(msg);
};

discord.sendAd = function (title, name, text, phone, editor, editorImg) {
    const Hook = new webhook.Webhook(discord.invaderAd);

    let color = "#607D8B";
    if (title === 'Покупка')
        color = "#03A9F4";
    if (title === 'Продажа')
        color = "#8BC34A";
    if (title === 'Услуга')
        color = "#FFEB3B";

    const msg = new webhook.MessageBuilder()
        .setName('Рекламное объявление')
        .setTitle(title)
        .setAvatar(discord.imgInvader)
        .addField(`Phone Number`, `\`\`\`${phone}\`\`\``, true)
        .addField(`Customer`, `\`\`\`${name}\`\`\``, true)
        .setDescription(`\`\`\`fix\n${text}\`\`\``)
        .setFooter(editor, 'https://a.rsg.sc//n/' + editorImg.toLowerCase())
        .setColor(color)
        .setTime();

    Hook.send(msg);
};

discord.sendNews = function (title, text, editor, editorImg) {
    const Hook = new webhook.Webhook(discord.invaderNews);
    const msg = new webhook.MessageBuilder()
        .setName('Новости')
        .setTitle(title)
        .setDescription(text)
        .setFooter(editor, 'https://a.rsg.sc//n/' + editorImg)
        .setColor("#f44336")
        .setTime();

    Hook.send(msg);
};

discord.sendWork = function (url, player, dscrd, text) {

    if (!user.isLogin(player))
        return;

    let history = '';
    let sender = `${user.getRpName(player)} (${user.getId(player)})`;
    let phone = methods.phoneFormat(user.get(player, 'phone'));
    let senderImg = player.socialClub;

    mysql.executeQuery(`SELECT * FROM log_player WHERE user_id = ${user.getId(player)} AND type = 1 ORDER BY id DESC LIMIT 5`, (err, rows, fields) => {
        if (rows.length > 0) {
            try {
                rows.forEach(row => {
                    history += `${methods.unixTimeStampToDateTimeShort(row['timestamp'])} | ${row['do']}\n`;
                });
            }
            catch (e) {
                methods.debug(e);
            }
        }

        if (history === '')
            history = 'Криминальной истории - нет';

        const Hook = new webhook.Webhook(url);
        const msg = new webhook.MessageBuilder()
            .setName('Заявление')
            .setTitle(sender)
            .setDescription(text)
            .addField(`Телефон`, `\`\`\`${phone}\`\`\``, true)
            .addField(`Дискорд`, `\`\`\`${dscrd}\`\`\``, true)
            .addField(`Work ID`, `\`\`\`${user.get(player, 'work_lvl')} / ${user.get(player, 'work_exp')}\`\`\``, true)
            .addField(`История`, `\`\`\`${history}\`\`\``)
            .setFooter(sender, 'https://a.rsg.sc//n/' + senderImg)
            .setColor("#f44336")
            .setTime();

        Hook.send(msg);
    });
};

discord.sendMarketProperty = function (title, text) {
    const Hook = new webhook.Webhook(discord.marketProperty);
    const msg = new webhook.MessageBuilder()
        .setName('Новости имущества')
        .setTitle(title)
        .setDescription(`\`\`\`ml\n${text}\`\`\``)
        .setFooter('Правительство', discord.imgGov)
        .setColor("#f44336")
        .setTime();
    Hook.send(msg);
};

discord.sendMarketBusiness = function (title, text) {
    const Hook = new webhook.Webhook(discord.marketBusiness);
    const msg = new webhook.MessageBuilder()
        .setName('Новости бизнеса')
        .setTitle(title)
        .setDescription(`\`\`\`ml\n${text}\`\`\``)
        .setFooter('Правительство', discord.imgGov)
        .setColor("#f44336")
        .setTime();
    Hook.send(msg);
};

discord.sendMarketVehicles = function (title, text, imgUrl) {
    const Hook = new webhook.Webhook(discord.marketVehicles);
    const msg = new webhook.MessageBuilder()
        .setName('Новости транспорта')
        .setTitle(title)
        .setDescription(`\`\`\`ml\n${text}\`\`\``)
        .setImage(imgUrl)
        .setFooter('Правительство', discord.imgGov)
        .setColor("#f44336")
        .setTime();
    Hook.send(msg);
};