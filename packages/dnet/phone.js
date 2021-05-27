let methods = require('./modules/methods');
let mysql = require('./modules/mysql');

let vehicles = require('./property/vehicles');
let fraction = require('./property/fraction');
let family = require('./property/family');

let gangWar = require('./managers/gangWar');
let canabisWar = require('./managers/canabisWar');
let weather = require('./managers/weather');

let user = require('./user');
let enums = require('./enums');
let coffer = require('./coffer');
let inventory = require('./inventory');

let phone = exports;

phone.getUserInfo = function(player, text) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.getUserInfo');

    text = methods.removeQuotes(text);

    mysql.executeQuery(`SELECT * FROM users WHERE id = '${methods.parseInt(text)}' OR name = '${methods.removeQuotes2(methods.removeQuotes(text))}'`, (err, rows, fields) => {

        rows.forEach(row => {
            let subItems = [];
            let items = [];

            subItems.push(phone.getMenuItem(
                row['name'],
                'CardID: ' + row['id'],
                { name: 'none' },
                0,
                '',
                false,
                'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
            ));

            subItems.push(phone.getMenuItemButton(
                'Личная история',
                '',
                { name: 'history', id: row['id'] },
                '',
                true,
            ));

            subItems.push(phone.getMenuItemButton(
                'Список штрафов',
                '',
                { name: 'tickets', id: row['id'] },
                '',
                true,
            ));

            subItems.push(phone.getMenuItemButton(
                'Возраст',
                row['age'],
                { name: 'none' },
            ));

            let regName = '';

            switch (row['reg_status'])
            {
                case 1:
                    regName = "Регистрация";
                    break;
                case 2:
                    regName = "Гражданство США";
                    break;
                default:
                    regName = "Нет";
                    break;
            }

            subItems.push(phone.getMenuItemButton(
                'Вид на жительство',
                regName,
                { name: 'none' },
            ));

            let repName = '';
            let rep = row['rep'];

            if (rep > 900)
                repName = 'Идеальная';
            if (rep > 800 && rep <= 900)
                repName = 'Очень хорошая';
            if (rep > 700 && rep <= 800)
                repName = 'Хорошая';
            if (rep > 600 && rep <= 700)
                repName = 'Положительная';
            if (rep >= 400 && rep <= 600)
                repName = 'Нейтральная';
            if (rep >= 300 && rep < 400)
                repName = 'Отрицательная';
            if (rep >= 200 && rep < 300)
                repName = 'Плохая';
            if (rep >= 100 && rep < 200)
                repName = 'Очень плохая';
            if (rep < 100)
                repName = 'Наихудшая';

            subItems.push(phone.getMenuItemButton(
                'Репутация',
                repName,
                { name: 'none' },
            ));

            let wanted = 'Нет';
            if (row['wanted_level'] > 0)
                wanted = 'Уровень опасности: ' + row['wanted_level'];

            subItems.push(phone.getMenuItemButton(
                'Розыск',
                wanted,
                { name: 'none' },
            ));

            if (row['phone'] != '') {
                subItems.push(phone.getMenuItemButton(
                    'Мобильный телефон',
                    row['phone'],
                    { name: 'none' },
                ));
            }

            if (row['bank_card'] > 0) {
                subItems.push(phone.getMenuItemButton(
                    'Банковская карта',
                    methods.bankFormat(row['bank_card']),
                    { name: 'none' },
                ));
            }

            items.push(phone.getMenuMainItem('Основной раздел', subItems));

            subItems = [];

            let label = 'Отсутствует';
            if (row['a_lic']) {
                label = `С ${row['a_lic_create']} по ${row['a_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия категории А',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['b_lic'])
            {
                label = `С ${row['b_lic_create']} по ${row['b_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия категории B',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['c_lic'])
            {
                label = `С ${row['c_lic_create']} по ${row['c_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия категории C',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['air_lic'])
            {
                label = `С ${row['air_lic_create']} по ${row['air_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на воздушный транспорт',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['ship_lic'])
            {
                label = `С ${row['ship_lic_create']} по ${row['ship_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на водный транспорт',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['gun_lic'])
            {
                label = `С ${row['gun_lic_create']} по ${row['gun_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на оружие',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['taxi_lic'])
            {
                label = `С ${row['taxi_lic_create']} по ${row['taxi_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на перевозку пассажиров',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['law_lic'])
            {
                label = `С ${row['law_lic_create']} по ${row['law_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на юриста',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['biz_lic'])
            {
                label = `С ${row['biz_lic_create']} по ${row['biz_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на предпринимательство',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['fish_lic'])
            {
                label = `С ${row['fish_lic_create']} по ${row['fish_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Разрешение на рыболовство',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['med_lic'])
            {
                label = `С ${row['med_lic_create']} по ${row['med_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Мед. страховка',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['marg_lic'])
            {
                label = `С ${row['marg_lic_create']} по ${row['marg_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Разрешение на употребление марихуаны',
                label,
                { name: 'none' },
            ));

            items.push(phone.getMenuMainItem('Лицензии', subItems));

            phone.showMenu(player, 'userInfo', 'База данных', items);
        });

        if (rows.length == 0) {
            let items = [];
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Поиск ничего не нашел`,
                    ``
                )
            ]));
            phone.showMenu(player, 'userInfo', 'База данных', items);
        }
    });
};

phone.getVehInfo = function(player, text) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.getVehInfo');

    text = methods.removeQuotes(text);

    mysql.executeQuery(`SELECT * FROM cars WHERE id = '${methods.parseInt(text)}' OR number = '${methods.removeQuotes2(methods.removeQuotes(text))}'`, (err, rows, fields) => {

        rows.forEach(row => {
            let subItems = [];
            let items = [];

            subItems.push(phone.getMenuItem(
                row['name'],
                '' + row['number'],
                { name: 'none' },
                0,
                '',
                false,
                enums.getVehicleImg(row['name']),
            ));

            if (row['user_id'] > 0) {
                subItems.push(phone.getMenuItemButton(
                    'Владелец',
                    `${row['user_name']} (${row['user_id']})`,
                    { name: 'none' },
                ));
            } else {
                subItems.push(phone.getMenuItemButton(
                    'Владелец',
                    `Отсуствует`,
                    { name: 'none' },
                ));
            }

            items.push(phone.getMenuMainItem('Транспорт', subItems));
            phone.showMenu(player, 'vehInfo', 'База данных', items);
        });

        if (rows.length == 0) {
            let items = [];
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Поиск ничего не нашел`,
                    ``
                )
            ]));
            phone.showMenu(player, 'vehInfo', 'База данных', items);
        }
    });
};

phone.getGunInfo = function(player, text) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.getGunInfo');

    text = methods.removeQuotes(methods.removeQuotes2(text));

    mysql.executeQuery(`SELECT * FROM items WHERE params LIKE '%${text}%'`, (err, rows, fields) => {

        rows.forEach(row => {
            let subItems = [];
            let items = [];

            try {
                let params = JSON.parse(row['params']);

                if (params.owner) {
                    subItems.push(phone.getMenuItemButton(
                        'Организация',
                        `${params.owner.toString()}`,
                        {name: 'none'},
                    ));
                }
                if (params.userName) {
                    subItems.push(phone.getMenuItemButton(
                        'Владелец',
                        `${params.userName.toString()}`,
                        {name: 'none'},
                    ));
                }
                if (params.serial) {
                    subItems.push(phone.getMenuItemButton(
                        'Серийный номер',
                        `${params.serial.toString()}`,
                        {name: 'none'},
                    ));
                }
                items.push(phone.getMenuMainItem('Оружие', subItems));
            }
            catch (e) {
                
            }

            phone.showMenu(player, 'gunInfo', 'База данных', items);
        });

        if (rows.length == 0) {
            let items = [];
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Поиск ничего не нашел`,
                    ``
                )
            ]));
            phone.showMenu(player, 'gunInfo', 'База данных', items);
        }
    });
};

phone.memberAction = function(player, id) {
    if (!user.isLogin(player))
        return;

    if (user.getId(player) == id) {
        player.notify('~r~Данный профиль для просмотра не доступен');
        return;
    }

    methods.debug('phone.memberAction');
    let fractionId = user.get(player, 'fraction_id');
    mysql.executeQuery(`SELECT id, social, name, fraction_id, rank, rank_type, is_sub_leader FROM users WHERE id = '${methods.parseInt(id)}'`, (err, rows, fields) => {

        rows.forEach(row => {

            let fractionItem = enums.fractionListId[fractionId];
            let items = [];

            items.push(phone.getMenuItem(
                row['name'],
                '',
                { name: 'none' },
                0,
                '',
                false,
                'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
            ));

            if (!row['is_sub_leader']) {
                if (user.isLeader(player)) {
                    items.push(phone.getMenuItemModal(
                        'Выдать должность заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите выдать должность ${row['name']}?`,
                        'Выдать',
                        'Отмена',
                        { name: 'memberGiveSubLeader', memberId: row['id'] },
                        '',
                        true
                    ));
                }

                let rankList = [];
                fractionItem.rankList[row['rank_type']].forEach((item, id) => {
                    if (id == row['rank'])
                        rankList.push({title: item, checked: true, params: { name: 'memberNewRank', memberId: row['id'], rankId: id }})
                    else
                        rankList.push({title: item, params: { name: 'memberNewRank', memberId: row['id'], rankId: id }})
                });

                items.push(phone.getMenuItemRadio(
                    'Изменить должность',
                    'Текущая должность: ' + fractionItem.rankList[row['rank_type']][row['rank']],
                    'Выберите должность',
                    rankList,
                    { name: 'none' },
                    '',
                    true
                ));

                if (user.isLeader(player) || user.isSubLeader(player)) {
                    let depList = [];

                    fractionItem.departmentList.forEach((item, id) => {
                        if (id == row['rank_type'])
                            depList.push({title: item, checked: true, params: { name: 'memberNewDep', memberId: row['id'], depId: id }})
                        else
                            depList.push({title: item, params: { name: 'memberNewDep', memberId: row['id'], depId: id }})
                    });

                    items.push(phone.getMenuItemRadio(
                        'Перевести в другой отдел',
                        'Текущий отдел: ' + fractionItem.departmentList[row['rank_type']],
                        'Выберите отдел',
                        depList,
                        { name: 'none' },
                        '',
                        true
                    ));
                }
            }
            else {
                if (user.isLeader(player)) {
                    items.push(phone.getMenuItemModal(
                        'Снять с должности заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите снять с должности ${row['name']}?`,
                        'Снять',
                        'Отмена',
                        { name: 'memberTakeSubLeader', memberId: row['id'] },
                        '',
                        true
                    ));
                }
            }

            if (user.isLeader(player) || user.isSubLeader(player)) {
                items.push(phone.getMenuItemModal(
                    'Уволить',
                    '',
                    'Уволить',
                    `Вы точно хотите уволить ${row['name']}?`,
                    'Уволить',
                    'Отмена',
                    { name: 'memberUninvite', memberId: row['id'] },
                    '',
                    true
                ));
            }

            phone.showMenu(player, 'fraction', 'Действия', [phone.getMenuMainItem('', items)]);
        });
    });
};

phone.memberAction2 = function(player, id) {
    if (!user.isLogin(player))
        return;

    if (user.getId(player) == id) {
        player.notify('~r~Данный профиль для просмотра не доступен');
        return;
    }

    methods.debug('phone.memberAction');
    let fractionId = user.get(player, 'fraction_id2');
    mysql.executeQuery(`SELECT id, social, name, fraction_id2, rank2, rank_type2, is_sub_leader2 FROM users WHERE id = '${methods.parseInt(id)}'`, (err, rows, fields) => {

        rows.forEach(row => {

            let fractionItem = fraction.getData(fractionId);
            let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));
            let fractionItemDep = JSON.parse(fractionItem.get('rank_type_list'));

            let items = [];

            items.push(phone.getMenuItem(
                row['name'],
                '',
                { name: 'none' },
                0,
                '',
                false,
                'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
            ));

            if (!row['is_sub_leader2']) {
                if (user.isLeader2(player)) {
                    items.push(phone.getMenuItemModal(
                        'Выдать должность заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите выдать должность ${row['name']}?`,
                        'Выдать',
                        'Отмена',
                        { name: 'memberGiveSubLeader2', memberId: row['id'] },
                        '',
                        true
                    ));
                    items.push(phone.getMenuItemModal(
                        'Передать организацию',
                        '',
                        'Передача',
                        `Вы точно хотите передать организацию ${row['name']}?`,
                        'Выдать',
                        'Отмена',
                        { name: 'memberGiveLeader2', memberId: row['id'] },
                        '',
                        true
                    ));
                }

                let rankList = [];
                fractionItemRanks[row['rank_type2']].forEach((item, id) => {
                    if (id == row['rank2'])
                        rankList.push({title: item, checked: true, params: { name: 'memberNewRank2', memberId: row['id'], rankId: id }})
                    else
                        rankList.push({title: item, params: { name: 'memberNewRank2', memberId: row['id'], rankId: id }})
                });

                items.push(phone.getMenuItemRadio(
                    'Изменить должность',
                    'Текущая должность: ' + fractionItemRanks[row['rank_type2']][row['rank2']],
                    'Выберите должность',
                    rankList,
                    { name: 'none' },
                    '',
                    true
                ));

                if (user.isLeader2(player) || user.isSubLeader2(player)) {
                    let depList = [];

                    fractionItemDep.forEach((item, id) => {
                        if (id == row['rank_type2'])
                            depList.push({title: item, checked: true, params: { name: 'memberNewDep2', memberId: row['id'], depId: id }})
                        else
                            depList.push({title: item, params: { name: 'memberNewDep2', memberId: row['id'], depId: id }})
                    });

                    items.push(phone.getMenuItemRadio(
                        'Перевести в другой отдел',
                        'Текущий отдел: ' + fractionItemDep[row['rank_type2']],
                        'Выберите отдел',
                        depList,
                        { name: 'none' },
                        '',
                        true
                    ));
                }
            }
            else {
                if (user.isLeader2(player)) {
                    items.push(phone.getMenuItemModal(
                        'Снять с должности заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите снять с должности ${row['name']}?`,
                        'Снять',
                        'Отмена',
                        { name: 'memberTakeSubLeader2', memberId: row['id'] },
                        '',
                        true
                    ));
                }
            }

            if (user.isLeader2(player) || user.isSubLeader2(player)) {
                items.push(phone.getMenuItemModal(
                    'Уволить',
                    '',
                    'Уволить',
                    `Вы точно хотите уволить ${row['name']}?`,
                    'Уволить',
                    'Отмена',
                    { name: 'memberUninvite2', memberId: row['id'] },
                    '',
                    true
                ));
            }

            phone.showMenu(player, 'fraction2', 'Действия', [phone.getMenuMainItem('', items)]);
        });
    });
};

phone.memberActionF = function(player, id) {
    if (!user.isLogin(player))
        return;

    if (user.getId(player) == id) {
        player.notify('~r~Данный профиль для просмотра не доступен');
        return;
    }

    methods.debug('phone.memberAction');
    let fractionId = user.get(player, 'family_id');
    mysql.executeQuery(`SELECT id, social, name, family_id, rankf, rank_typef, is_sub_leaderf FROM users WHERE id = '${methods.parseInt(id)}'`, (err, rows, fields) => {

        rows.forEach(row => {

            let fractionItem = family.getData(fractionId);
            let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));
            let fractionItemDep = JSON.parse(fractionItem.get('rank_type_list'));

            let items = [];

            items.push(phone.getMenuItem(
                row['name'],
                '',
                { name: 'none' },
                0,
                '',
                false,
                'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
            ));

            if (!row['is_sub_leaderf']) {
                if (user.isLeaderF(player)) {
                    items.push(phone.getMenuItemModal(
                        'Выдать должность заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите выдать должность ${row['name']}?`,
                        'Выдать',
                        'Отмена',
                        { name: 'memberGiveSubLeaderF', memberId: row['id'] },
                        '',
                        true
                    ));
                    items.push(phone.getMenuItemModal(
                        'Передать организацию',
                        '',
                        'Передача',
                        `Вы точно хотите передать организацию ${row['name']}?`,
                        'Выдать',
                        'Отмена',
                        { name: 'memberGiveLeaderF', memberId: row['id'] },
                        '',
                        true
                    ));
                }

                let rankList = [];
                fractionItemRanks[row['rank_typef']].forEach((item, id) => {
                    if (id == row['rankf'])
                        rankList.push({title: item, checked: true, params: { name: 'memberNewRankF', memberId: row['id'], rankId: id }})
                    else
                        rankList.push({title: item, params: { name: 'memberNewRankF', memberId: row['id'], rankId: id }})
                });

                items.push(phone.getMenuItemRadio(
                    'Изменить должность',
                    'Текущая должность: ' + fractionItemRanks[row['rank_typef']][row['rankf']],
                    'Выберите должность',
                    rankList,
                    { name: 'none' },
                    '',
                    true
                ));

                if (user.isLeaderF(player) || user.isSubLeaderF(player)) {
                    let depList = [];

                    fractionItemDep.forEach((item, id) => {
                        if (id == row['rank_typef'])
                            depList.push({title: item, checked: true, params: { name: 'memberNewDepF', memberId: row['id'], depId: id }})
                        else
                            depList.push({title: item, params: { name: 'memberNewDepF', memberId: row['id'], depId: id }})
                    });

                    items.push(phone.getMenuItemRadio(
                        'Перевести в другой отдел',
                        'Текущий отдел: ' + fractionItemDep[row['rank_typef']],
                        'Выберите отдел',
                        depList,
                        { name: 'none' },
                        '',
                        true
                    ));
                }
            }
            else {
                if (user.isLeaderF(player)) {
                    items.push(phone.getMenuItemModal(
                        'Снять с должности заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите снять с должности ${row['name']}?`,
                        'Снять',
                        'Отмена',
                        { name: 'memberTakeSubLeaderF', memberId: row['id'] },
                        '',
                        true
                    ));
                }
            }

            if (user.isLeaderF(player) || user.isSubLeaderF(player)) {
                items.push(phone.getMenuItemModal(
                    'Уволить',
                    '',
                    'Уволить',
                    `Вы точно хотите уволить ${row['name']}?`,
                    'Уволить',
                    'Отмена',
                    { name: 'memberUninviteF', memberId: row['id'] },
                    '',
                    true
                ));
            }

            phone.showMenu(player, 'family', 'Действия', [phone.getMenuMainItem('', items)]);
        });
    });
};

phone.fractionVehicleAction = function(player, id) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.fractionVehicleAction');
    let fractionId = user.get(player, 'fraction_id');

    let fractionItem = enums.fractionListId[fractionId];
    let items = [];

    let veh = vehicles.getFractionVehicleInfo(id);

    items.push(phone.getMenuItemImg(
        undefined,
        { name: "none" },
        enums.getVehicleImg(veh.name)
    ));

    /*let rankList = [];
    fractionItem.rankList[veh.rank_type].forEach((item, id) => {
        if (id == veh.rank)
            rankList.push({title: item, checked: true, params: { name: 'vehicleNewRank', memberId: veh.id, rankId: id }});
        else
            rankList.push({title: item, params: { name: 'vehicleNewRank', memberId: veh.id, rankId: id }});
    });

    items.push(phone.getMenuItemRadio(
        'Изменить доступ',
        'Текущий доступ: ' + fractionItem.rankList[veh.rank_type][veh.rank],
        'Выберите доступ',
        rankList,
        { name: 'none' },
        '',
        true
    ));*/

    if (user.isLeader(player) || user.isSubLeader(player)) {
        let depList = [];

        fractionItem.departmentList.forEach((item, id) => {
            if (id == veh.rank_type)
                depList.push({title: item, checked: true, params: { name: 'vehicleNewDep', memberId: veh.id, depId: id }});
            else
                depList.push({title: item, params: { name: 'vehicleNewDep', memberId: veh.id, depId: id }});
        });

        items.push(phone.getMenuItemRadio(
            'Перевести в другой отдел',
            'Текущий отдел: ' + fractionItem.departmentList[veh.rank_type],
            'Выберите отдел',
            depList,
            { name: 'none' },
            '',
            true
        ));

        items.push(phone.getMenuItemButton(
            `Зареспавнить`,
            '',
            {name: 'respawnVeh', memberId: veh.id},
            '',
            true
        ));

        if (user.isLeader(player) && !veh.is_default) {
            items.push(phone.getMenuItemModal(
                'Продать',
                'По цене: ' + methods.moneyFormat(methods.getVehicleInfo(veh.name).price / 2),
                'Продажа',
                `Вы точно хотите продать ${veh.name}?`,
                'Продать',
                'Отмена',
                { name: 'fractionVehicleSell', vehId: veh.id, price: veh.price / 2 },
                '',
                true
            ));
        }
    }

    phone.showMenu(player, 'fraction', 'Действия', [phone.getMenuMainItem(`${veh.name} | ${veh.number}`, items)]);
};

phone.fractionVehicleAction2 = function(player, id) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.fractionVehicleAction');
    let fractionId = user.get(player, 'fraction_id2');

    let items = [];

    let veh = vehicles.getFractionVehicleInfo(id);

    items.push(phone.getMenuItemImg(
        undefined,
        { name: "none" },
        enums.getVehicleImg(veh.name)
    ));

    /*let rankList = [];
    fractionItem.rankList[veh.rank_type].forEach((item, id) => {
        if (id == veh.rank)
            rankList.push({title: item, checked: true, params: { name: 'vehicleNewRank', memberId: veh.id, rankId: id }});
        else
            rankList.push({title: item, params: { name: 'vehicleNewRank', memberId: veh.id, rankId: id }});
    });

    items.push(phone.getMenuItemRadio(
        'Изменить доступ',
        'Текущий доступ: ' + fractionItem.rankList[veh.rank_type][veh.rank],
        'Выберите доступ',
        rankList,
        { name: 'none' },
        '',
        true
    ));*/

    items.push(phone.getMenuItemButton(
        'Найти транспорт',
        '',
        { name: 'fractionVehicleFind2', vehId: veh.id },
        '',
        true
    ));

    items.push(phone.getMenuItemButton(
        `Зареспавнить`,
        '',
        {name: 'respawnVeh', memberId: veh.id},
        '',
        true
    ));

    if (user.isLeader2(player)) {
        items.push(phone.getMenuItemModal(
            'Продать',
            'По цене: ' + methods.moneyFormat(methods.getVehicleInfo(veh.name).price / 2),
            'Продажа',
            `Вы точно хотите продать ${veh.name}?`,
            'Продать',
            'Отмена',
            { name: 'fractionVehicleSell2', vehId: veh.id, price: veh.price / 2 },
            '',
            true
        ));
    }

    phone.showMenu(player, 'fraction2', 'Действия', [phone.getMenuMainItem(`${veh.name} | ${veh.number}`, items)]);
};

phone.fractionMoney = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionMoney');
    let fractionId = user.get(player, 'fraction_id');
    let cofferId = coffer.getIdByFraction(fractionId);

    let items = [];

    items.push(phone.getMenuItemButton(
        'Текущее состояние бюджета',
        '' + methods.moneyFormat(coffer.getMoney(cofferId)),
    ));

    if (user.isGos(player) || user.isCartel(player))
    {
        items.push(phone.getMenuItemButton(
            `Оружие: ${coffer.get(cofferId, 'stock_gun')}ед.`,
            '',
        ));
        items.push(phone.getMenuItemButton(
            `Модули: ${coffer.get(cofferId, 'stock_gunm')}ед.`,
            '',
        ));
        items.push(phone.getMenuItemButton(
            `Патроны: ${coffer.get(cofferId, 'stock_ammo')}ед.`,
            '',
        ));
        items.push(phone.getMenuItemButton(
            `Бронежилеты: ${coffer.get(cofferId, 'stock_armour')}ед.`,
            '',
        ));
        items.push(phone.getMenuItemButton(
            `Медицина: ${coffer.get(cofferId, 'stock_med')}ед.`,
            '',
        ));
        items.push(phone.getMenuItemButton(
            `Сухпайки: ${coffer.get(cofferId, 'stock_eat')}ед.`,
            '',
        ));
        items.push(phone.getMenuItemButton(
            `Разное: ${coffer.get(cofferId, 'stock_other')}ед.`,
            '',
        ));
    }

    if (user.isCartel(player)) {
        items.push(phone.getMenuItemButton(
            'Получить фургон с наркотиками',
            'Затраты: Медицина 500ед',
            { name: 'getDrugVans' },
            '',
            true
        ));
    }

    items.push(phone.getMenuItemButton(
        'Лог организации',
        '',
        { name: 'log' },
        '',
        true
    ));

    items.push(phone.getMenuItemModalInput(
        'Прибавка к зарплате',
        'Текущее значение: ' + methods.moneyFormat(coffer.getBenefit(cofferId)),
        'Введите значение',
        coffer.getBenefit(cofferId).toString(),
        'Применить',
        'Отмена',
        { name: 'fractionBenefit' },
        '',
        true
    ));

    items.push(phone.getMenuItemModalInput(
        'Снять средства',
        '',
        'Введите значение',
        0,
        'Применить',
        'Отмена',
        { name: 'fractionTake' },
        '',
        true
    ));

    phone.showMenu(player, 'fraction', 'Управление бюджетом', [phone.getMenuMainItem(`Основной раздел`, items)]);
};

phone.fractionLog = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionLog');

    let fractionId = user.get(player, 'fraction_id');

    mysql.executeQuery(`SELECT * FROM log_fraction WHERE fraction_id = ${fractionId} ORDER BY id DESC LIMIT 50`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            try {
                let columns = [
                    { title: '№', field: 'id' },
                    { title: 'Имя', field: 'name' },
                    { title: 'Описание', field: 'text' },
                    { title: 'Сумма', field: 'text2' },
                    { title: 'Дата', field: 'datetime' },
                ];
                let data = [];

                rows.forEach(row => {

                    data.push({
                        id: row['id'], name: row['name'], text: row['text'].replace('\"', '').replace('"', ''), text2: row['text2'].replace('\"', '').replace('"', ''), datetime: `${row['rp_datetime']} (( ${methods.unixTimeStampToDateTimeShort(row['timestamp'])} ))`
                    });
                });

                let item = phone.getMenuItemTable('История организации', columns, data);
                items.push(phone.getMenuMainItem(``, [item]));
            }
            catch (e) {

                items.push(phone.getMenuMainItem(`Список пуст`, [
                    phone.getMenuItemButton(
                        `Произошла ошибка, попробуйте еще раз`,
                        ``
                    )
                ]));

                methods.debug(e);
            }
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных транзакций`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'fractionHistory', `История организации`, items);
    });
};

phone.fractionLog2 = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionLog');

    let fractionId = user.get(player, 'fraction_id2');

    mysql.executeQuery(`SELECT * FROM log_fraction_2 WHERE fraction_id = ${fractionId} ORDER BY id DESC LIMIT 50`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            try {
                let columns = [
                    { title: '№', field: 'id' },
                    { title: 'Имя', field: 'name' },
                    { title: 'Описание', field: 'text' },
                    { title: 'Сумма', field: 'text2' },
                    { title: 'Дата', field: 'datetime' },
                ];
                let data = [];

                rows.forEach(row => {

                    data.push({
                        id: row['id'], name: row['name'], text: row['text'].replace('\"', '').replace('"', ''), text2: row['text2'].replace('\"', '').replace('"', ''), datetime: `${row['rp_datetime']} (( ${methods.unixTimeStampToDateTimeShort(row['timestamp'])} ))`
                    });
                });

                let item = phone.getMenuItemTable('История организации', columns, data);
                items.push(phone.getMenuMainItem(``, [item]));
            }
            catch (e) {

                items.push(phone.getMenuMainItem(`Список пуст`, [
                    phone.getMenuItemButton(
                        `Произошла ошибка, попробуйте еще раз`,
                        ``
                    )
                ]));

                methods.debug(e);
            }
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных транзакций`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'fraction2History', `История организации`, items);
    });
};

phone.showGangList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.showGangList');
    let items = [];
    gangWar.getZoneList().forEach(zone => {
        let subItems = [];

        /*subItems.push(
            phone.getMenuItemButton(
                `${gangWar.get(zone.id, 'zone')}`,
                `${gangWar.get(zone.id, 'street')}`
            )
        );*/


        let frName = gangWar.get(zone.id, 'fraction_name');
        subItems.push(
            phone.getMenuItemButton(
                `Зона под контролем`,
                `${(frName == '' ? 'Нет' : frName)}`
            )
        );

        subItems.push(
            phone.getMenuItemButton(
                `Узнать местоположение`,
                ``,
                { name: "getPos", x: zone.x, y: zone.y },
                ``,
                true,
            )
        );

        if (user.isLeader2(player) || user.isSubLeader2(player))
        {
            subItems.push(
                phone.getMenuItemButton(
                    `Начать захват`,
                    ``,
                    { name: "attackStreet", zone: zone.id },
                    ``,
                    true,
                )
            );
        }

        items.push(phone.getMenuMainItem(`#${zone.id}`, subItems));
    });
    phone.showMenu(player, 'fraction2', `Список улиц`, items);
};

phone.showGangWarList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.showGangList');
    let items = [];
    gangWar.getZoneWarList().forEach((value, key) => {
        let subItems = [];

        /*subItems.push(
            phone.getMenuItemButton(
                `${gangWar.get(value.zoneId, 'zone')}`,
                `${gangWar.get(value.zoneId, 'street')}`
            )
        );*/

        subItems.push(
            phone.getMenuItemButton(
                `Атака`,
                `${fraction.getName(value.attack)}`
            )
        );

        let frName = gangWar.get(value.zoneId, 'fraction_name');
        subItems.push(
            phone.getMenuItemButton(
                `Оборона`,
                `${(frName == '' ? 'Нет' : frName)}`
            )
        );

        subItems.push(
            phone.getMenuItemButton(
                `Начало захвата`,
                `${value.timeLabel}`
            )
        );
        subItems.push(
            phone.getMenuItemButton(
                `Оружие`,
                `${value.gunLabel}`
            )
        );
        subItems.push(
            phone.getMenuItemButton(
                `Броня`,
                `${value.armorLabel}`
            )
        );
        subItems.push(
            phone.getMenuItemButton(
                `Количество`,
                `${value.count} vs ${value.count}`
            )
        );

        subItems.push(
            phone.getMenuItemButton(
                `Узнать местоположение`,
                ``,
                { name: "getPos", x: gangWar.get(value.zoneId, 'x'), y: gangWar.get(value.zoneId, 'y') },
                ``,
                true,
            )
        );

        items.push(phone.getMenuMainItem(`#${value.zoneId}`, subItems));
    });
    phone.showMenu(player, 'fraction2', `Список улиц`, items);
};


phone.showCanabisList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.showCanabisList');
    let items = [];
    canabisWar.getZoneList().forEach(zone => {
        let subItems = [];

        /*subItems.push(
            phone.getMenuItemButton(
                `${canabisWar.get(zone.id, 'zone')}`,
                `${canabisWar.get(zone.id, 'street')}`
            )
        );*/


        let frName = canabisWar.get(zone.id, 'fraction_name');
        subItems.push(
            phone.getMenuItemButton(
                `Зона под контролем`,
                `${(frName == '' ? 'Государство' : frName)}`
            )
        );

        subItems.push(
            phone.getMenuItemButton(
                `Узнать местоположение`,
                ``,
                { name: "getPos", x: zone.x, y: zone.y },
                ``,
                true,
            )
        );

        if (user.isLeader2(player) || user.isSubLeader2(player) || user.isLeader(player) || user.isSubLeader(player))
        {
            subItems.push(
                phone.getMenuItemButton(
                    `Начать захват`,
                    ``,
                    { name: "attackCanabis", zone: zone.id },
                    ``,
                    true,
                )
            );
        }

        items.push(phone.getMenuMainItem(`#${zone.id}`, subItems));
    });
    phone.showMenu(player, 'fraction2', `Список территорий`, items);
};

phone.showCanabisWarList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.showCanabisWarList');
    let items = [];
    canabisWar.getZoneWarList().forEach((value, key) => {
        let subItems = [];

        /*subItems.push(
            phone.getMenuItemButton(
                `${canabisWar.get(value.zoneId, 'zone')}`,
                `${canabisWar.get(value.zoneId, 'street')}`
            )
        );*/

        subItems.push(
            phone.getMenuItemButton(
                `Атака`,
                `${fraction.getName(value.attack)}`
            )
        );

        let frName = canabisWar.get(value.zoneId, 'fraction_name');
        subItems.push(
            phone.getMenuItemButton(
                `Оборона`,
                `${(frName == '' ? 'Государство' : frName)}`
            )
        );

        subItems.push(
            phone.getMenuItemButton(
                `Начало захвата`,
                `${value.timeLabel}`
            )
        );
        subItems.push(
            phone.getMenuItemButton(
                `Оружие`,
                `${value.gunLabel}`
            )
        );
        subItems.push(
            phone.getMenuItemButton(
                `Броня`,
                `${value.armorLabel}`
            )
        );
        subItems.push(
            phone.getMenuItemButton(
                `Количество`,
                `${value.count} vs ${value.count}`
            )
        );

        subItems.push(
            phone.getMenuItemButton(
                `Узнать местоположение`,
                ``,
                { name: "getPos", x: canabisWar.get(value.zoneId, 'x'), y: canabisWar.get(value.zoneId, 'y') },
                ``,
                true,
            )
        );

        items.push(phone.getMenuMainItem(`#${value.zoneId}`, subItems));
    });
    phone.showMenu(player, 'fraction2', `Список территорий`, items);
};

phone.fractionList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionList');

    let fractionId = user.get(player, 'fraction_id');

    mysql.executeQuery(`SELECT id, social, name, fraction_id, rank, rank_type, is_leader, is_sub_leader, is_online, login_date FROM users WHERE fraction_id = '${fractionId}' ORDER BY is_leader ASC, is_sub_leader ASC, rank_type ASC, is_online DESC, rank ASC, name ASC`, (err, rows, fields) => {
        let items = [];
        let depName = '';
        let depList = [];
        let depPrev = -1;

        let isLeader = user.isLeader(player);
        let isSubLeader = user.isSubLeader(player);

        let fractionItem = enums.fractionListId[fractionId];

        let leaderItem = [];
        let subLeaderItem = [];

        let rankType = user.get(player, 'rank_type');
        let canEdit = user.get(player, 'rank') == 0 || user.get(player, 'rank') == 1;

        rows.forEach(row => {

            let desc = '';
            if (row['is_online'] === 0)
                desc = ` (${methods.unixTimeStampToDateTimeShort(row['login_date'])})`;

            if (row['is_leader']) {
                leaderItem.push(phone.getMenuItemUser(
                    row['name'],
                    fractionItem.leaderName + desc,
                    row['is_online'] === 1,
                    { name: 'none' },
                    'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                ));
            }
            else if (row['is_sub_leader']) {
                if (isLeader) {
                    subLeaderItem.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.subLeaderName + desc,
                        row['is_online'] === 1,
                        { name: 'memberAction', memberId: row['id'] },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                        true,
                    ));
                }
                else {
                    subLeaderItem.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.subLeaderName + 'desc',
                        row['is_online'] === 1,
                        { name: 'none' },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                    ));
                }

            }
            else {
                if (depPrev != row['rank_type']) {
                    if (depList.length > 0)
                        items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));
                    depName = fractionItem.departmentList[row['rank_type']];
                    depList = [];
                }

                if (isLeader || isSubLeader || (canEdit && rankType == row['rank_type'])) {
                    depList.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.rankList[row['rank_type']][row['rank']] + desc,
                        row['is_online'] === 1,
                        { name: 'memberAction', memberId: row['id'] },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                        true,
                    ));
                }
                else {
                    depList.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.rankList[row['rank_type']][row['rank']] + desc,
                        row['is_online'] === 1,
                        { name: 'none' },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                    ));
                }

                depPrev = row['rank_type'];
            }
        });

        if (depList.length > 0)
            items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));

        let newItems = [];
        let leaderItems = [];
        if (leaderItem.length > 0)
            leaderItems = leaderItems.concat(leaderItem);
        if (subLeaderItem.length > 0)
            leaderItems = leaderItems.concat(subLeaderItem);

        if (leaderItems.length > 0)
            newItems.push(phone.getMenuMainItem('Руководство', leaderItems));

        phone.showMenu(player, 'fraction', `Список членов организации | ${rows.length} чел.`, newItems.concat(items));
    });
};

phone.fractionList2 = function(player, showStats = false) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionList2');

    let fractionId = user.get(player, 'fraction_id2');

    mysql.executeQuery(`SELECT id, social, name, fraction_id2, rank2, rank_type2, is_leader2, is_sub_leader2, is_sub_leader2, st_order_atm_f, st_order_atm_d, st_order_drug_f, st_order_drug_d, st_order_lamar_f, st_order_lamar_d, login_date, is_online FROM users WHERE fraction_id2 = '${fractionId}' ORDER BY is_leader2 ASC, is_sub_leader2 ASC, rank_type2 ASC, is_online DESC, rank2 ASC, name ASC`, (err, rows, fields) => {
        let items = [];
        let depName = '';
        let depList = [];
        let depPrev = -1;

        let isLeader = user.isLeader2(player);
        let isSubLeader = user.isSubLeader2(player);

        let fractionItem = fraction.getData(fractionId);
        let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));
        let fractionItemDep = JSON.parse(fractionItem.get('rank_type_list'));

        let leaderItem = [];
        let subLeaderItem = [];

        let rankType = user.get(player, 'rank_type2');
        let canEdit = user.get(player, 'rank2') == 0 || user.get(player, 'rank2') == 1;

        rows.forEach(row => {

            try {

                let desc = '';
                if (row['is_online'] === 0)
                    desc = ` (${methods.unixTimeStampToDateTimeShort(row['login_date'])})`;
                if (showStats)
                    desc = ` (З: ${row['st_order_drug_d']}/${row['st_order_drug_f']} | Б: ${row['st_order_atm_d']}/${row['st_order_atm_f']} | Л: ${row['st_order_lamar_d']}/${row['st_order_lamar_f']})`;

                if (row['is_leader2']) {
                    leaderItem.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.get('rank_leader') + desc,
                        row['is_online'] === 1,
                        { name: 'none' },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                    ));
                }
                else if (row['is_sub_leader2']) {
                    if (isLeader) {
                        subLeaderItem.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItem.get('rank_sub_leader') + desc,
                            row['is_online'] === 1,
                            { name: 'memberAction', memberId: row['id'] },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                            true,
                        ));
                    }
                    else {
                        subLeaderItem.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItem.get('rank_sub_leader') + desc,
                            row['is_online'] === 1,
                            { name: 'none' },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                        ));
                    }

                }
                else {
                    if (depPrev != row['rank_type2']) {
                        if (depList.length > 0)
                            items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));
                        depName = fractionItemDep[row['rank_type2']];
                        depList = [];
                    }

                    if (isLeader || isSubLeader || (canEdit && rankType == row['rank_type2'])) {
                        depList.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItemRanks[row['rank_type2']][row['rank2']] + desc,
                            row['is_online'] === 1,
                            { name: 'memberAction', memberId: row['id'] },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                            true,
                        ));
                    }
                    else {
                        depList.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItemRanks[row['rank_type2']][row['rank2']] + desc,
                            row['is_online'] === 1,
                            { name: 'none' },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                        ));
                    }

                    depPrev = row['rank_type2'];
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });

        try {
            if (depList.length > 0)
                items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));

            let newItems = [];
            let leaderItems = [];
            if (leaderItem.length > 0)
                leaderItems = leaderItems.concat(leaderItem);
            if (subLeaderItem.length > 0)
                leaderItems = leaderItems.concat(subLeaderItem);

            if (leaderItems.length > 0)
                newItems.push(phone.getMenuMainItem('Руководство', leaderItems));

            phone.showMenu(player, 'fraction2', `Список членов организации | ${rows.length} чел.`, newItems.concat(items));
        }
        catch (e) {
            methods.debug(e);
        }
    });
};


phone.fractionListF = function(player, showStats = false) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionListF');

    let fractionId = user.get(player, 'family_id');

    mysql.executeQuery(`SELECT id, social, name, family_id, rankf, rank_typef, is_leaderf, is_sub_leaderf, is_sub_leaderf, st_order_atm_f, st_order_atm_d, st_order_drug_f, st_order_drug_d, st_order_lamar_f, st_order_lamar_d, login_date, is_online FROM users WHERE family_id = '${fractionId}' ORDER BY is_leaderf ASC, is_sub_leaderf ASC, rank_typef ASC, is_online DESC, rankf ASC, name ASC`, (err, rows, fields) => {
        let items = [];
        let depName = '';
        let depList = [];
        let depPrev = -1;

        let isLeader = user.isLeaderF(player);
        let isSubLeader = user.isSubLeaderF(player);

        let fractionItem = family.getData(fractionId);
        let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));
        let fractionItemDep = JSON.parse(fractionItem.get('rank_type_list'));

        let leaderItem = [];
        let subLeaderItem = [];

        let rankType = user.get(player, 'rank_typef');
        let canEdit = user.get(player, 'rankf') == 0 || user.get(player, 'rankf') == 1;

        rows.forEach(row => {

            try {

                let desc = '';
                if (row['is_online'] === 0)
                    desc = ` (${methods.unixTimeStampToDateTimeShort(row['login_date'])})`;
                if (showStats)
                    desc = ` (З: ${row['st_order_drug_d']}/${row['st_order_drug_f']} | Б: ${row['st_order_atm_d']}/${row['st_order_atm_f']} | Л: ${row['st_order_lamar_d']}/${row['st_order_lamar_f']})`;

                if (row['is_leaderf']) {
                    leaderItem.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.get('rank_leader') + desc,
                        row['is_online'] === 1,
                        { name: 'none' },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                    ));
                }
                else if (row['is_sub_leaderf']) {
                    if (isLeader) {
                        subLeaderItem.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItem.get('rank_sub_leader') + desc,
                            row['is_online'] === 1,
                            { name: 'memberActionF', memberId: row['id'] },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                            true,
                        ));
                    }
                    else {
                        subLeaderItem.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItem.get('rank_sub_leader') + desc,
                            row['is_online'] === 1,
                            { name: 'none' },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                        ));
                    }

                }
                else {
                    if (depPrev != row['rank_typef']) {
                        if (depList.length > 0)
                            items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));
                        depName = fractionItemDep[row['rank_typef']];
                        depList = [];
                    }

                    if (isLeader || isSubLeader || (canEdit && rankType == row['rank_typef'])) {
                        depList.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItemRanks[row['rank_typef']][row['rankf']] + desc,
                            row['is_online'] === 1,
                            { name: 'memberActionF', memberId: row['id'] },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                            true,
                        ));
                    }
                    else {
                        depList.push(phone.getMenuItemUser(
                            row['name'],
                            fractionItemRanks[row['rank_typef']][row['rankf']] + desc,
                            row['is_online'] === 1,
                            { name: 'none' },
                            'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                        ));
                    }

                    depPrev = row['rank_typef'];
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });

        try {
            if (depList.length > 0)
                items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));

            let newItems = [];
            let leaderItems = [];
            if (leaderItem.length > 0)
                leaderItems = leaderItems.concat(leaderItem);
            if (subLeaderItem.length > 0)
                leaderItems = leaderItems.concat(subLeaderItem);

            if (leaderItems.length > 0)
                newItems.push(phone.getMenuMainItem('Руководство', leaderItems));

            phone.showMenu(player, 'family', `Список членов семьи | ${rows.length} чел.`, newItems.concat(items));
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

phone.fractionVehicles = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionList');

    let fractionId = user.get(player, 'fraction_id');

    let items = [];
    let depName = '';
    let depList = [];
    let depPrev = -1;

    let isLeader = user.isLeader(player);
    let isSubLeader = user.isSubLeader(player);
    let isDepLeader = user.isDepLeader(player);

    let fractionItem = enums.fractionListId[fractionId];

    let rankType = user.get(player, 'rank_type');
    let canEdit = isSubLeader || isLeader;

    if (isLeader) {
        items.push(phone.getMenuMainItem(`Основной раздел`, [
            phone.getMenuItemButton(
                'Покупка транспорта',
                '',
                { name: 'vehicleBuyList' },
                '',
                true,
            )
        ]));
    }

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE fraction_id = '${fractionId}' AND is_buy = '1' ORDER BY rank_type ASC, rank DESC, name ASC`, (err, rows, fields) => {
        rows.forEach(veh => {
            if (depPrev != veh['rank_type']) {
                if (depList.length > 0)
                    items.push(phone.getMenuMainItem(`${depName} | ${depList.length} шт.`, depList));
                depName = fractionItem.departmentList[veh['rank_type']];
                depList = [];
            }

            let rankName = fractionItem.rankList[veh['rank_type']][veh['rank']];

            if (isDepLeader && veh['rank_type'] == rankType || canEdit) {
                let item = phone.getMenuItemTitle(
                    `${veh['name']} | ${veh['number']}`,
                    //`Доступно с ${rankName}`,
                    ``,
                    { name: 'fractionVehicleAction', vehId: veh['id'] },
                    enums.getVehicleImg(veh['name']),
                    true,
                );
                depList.push(item);
            }
            else {
                let item = phone.getMenuItemTitle(
                    `${veh['name']} | ${veh['number']}`,
                    //`Доступно с ${rankName}`,
                    ``,
                    { name: 'none' },
                    enums.getVehicleImg(veh['name'])
                );
                depList.push(item);
            }

            depPrev = veh['rank_type'];
        });

        if (depList.length > 0)
            items.push(phone.getMenuMainItem(`${depName} | ${depList.length} шт.`, depList));

        phone.showMenu(player, 'fraction', `Автопарк организации`, items);
    });
};

phone.fractionVehicles2 = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionList');

    let fractionId = user.get(player, 'fraction_id2');

    let items = [];
    let depList = [];
    let depPrev = -1;

    let canEdit = user.isLeader2(player);

    if (canEdit) {
        items.push(phone.getMenuMainItem(`Основной раздел`, [
            phone.getMenuItemButton(
                'Покупка транспорта',
                '',
                { name: 'vehicleBuyList' },
                '',
                true,
            )
        ]));
    }

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE fraction_id = '${fractionId * -1}' AND is_buy = '1' ORDER BY rank_type ASC, rank DESC, name ASC`, (err, rows, fields) => {
        rows.forEach(veh => {
            if (depPrev != veh['rank_type']) {
                if (depList.length > 0)
                    items.push(phone.getMenuMainItem(`Список транспорта`, depList));
                depList = [];
            }

            if (canEdit) {
                let item = phone.getMenuItemTitle(
                    `${veh['name']} | ${veh['number']}`,
                    ``,
                    { name: 'fractionVehicleAction2', vehId: veh['id'] },
                    enums.getVehicleImg(veh['name']),
                    true,
                );
                depList.push(item);
            }
            else {
                let item = phone.getMenuItemTitle(
                    `${veh['name']} | ${veh['number']}`,
                    ``,
                    { name: 'none' },
                    enums.getVehicleImg(veh['name'])
                );
                depList.push(item);
            }

            depPrev = veh['rank_type'];
        });

        if (depList.length > 0)
            items.push(phone.getMenuMainItem(`Список транспорта - ${depList.length} шт.`, depList));

        phone.showMenu(player, 'fraction2', `Автопарк организации`, items);
    });
};

phone.fractionVehiclesBuyList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehiclesBuyList');
    let fractionId = user.get(player, 'fraction_id');

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE fraction_id = '${fractionId}' AND is_buy = '0' ORDER BY name ASC, price ASC`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            let subItems = [];
            let name = '';

            rows.forEach(row => {

                if (name != row['name']) {
                    if (subItems.length > 0)
                        items.push(phone.getMenuMainItem(`${name} | ${subItems.length} шт.`, subItems));
                    name = row['name'];
                    subItems = [];
                }

                let item = phone.getMenuItemTitle(
                    `${row['name']} | ${row['number']}`,
                    `Цена: ${methods.moneyFormat(row['price'], 1)}`,
                    { name: 'fractionVehicleBuyInfo', id: row['id'] },
                    enums.getVehicleImg(row['name']),
                    true,
                );
                subItems.push(item);
            });

            if (subItems.length > 0)
                items.push(phone.getMenuMainItem(`${name} | ${subItems.length} шт.`, subItems));
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных вариантов`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'fraction', `Покупка транспорта`, items);
    });
};

phone.fractionVehiclesBuyList2 = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehiclesBuyList');

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE fraction_id = '0' AND is_buy = '0' ORDER BY name ASC, price ASC`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            let subItems = [];
            let name = '';

            rows.forEach(row => {

                if (name != row['name']) {
                    if (subItems.length > 0)
                        items.push(phone.getMenuMainItem(`${name} | ${subItems.length} шт.`, subItems));
                    name = row['name'];
                    subItems = [];
                }

                let item = phone.getMenuItemTitle(
                    `${row['name']} | ${row['number']}`,
                    `Цена: ${methods.moneyFormat(row['price'], 1)}`,
                    { name: 'fractionVehicleBuyInfo', id: row['id'] },
                    enums.getVehicleImg(row['name']),
                    true,
                );
                subItems.push(item);
            });

            if (subItems.length > 0)
                items.push(phone.getMenuMainItem(`${name} | ${subItems.length} шт.`, subItems));
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных вариантов`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'fraction2', `Покупка транспорта`, items);
    });
};

phone.userAdList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.userAdList');

    mysql.executeQuery(`SELECT * FROM rp_inv_ad ORDER BY id DESC LIMIT 30`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            rows.forEach(row => {

                let subItems = [];
                let item = phone.getMenuItemButton(
                    `${row['text']}`,
                    ``,
                    { name: 'none' }
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    `${methods.phoneFormat(row['phone'])} (${row['name']})`,
                    `${row['rp_datetime']}`,
                    { name: 'sendMessage', phone: row['phone'] },
                    '',
                    true
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    `${row['editor']}`,
                    `Редактор`,
                    { name: 'none' }
                );
                subItems.push(item);

                items.push(phone.getMenuMainItem(`${row['title']}`, subItems));
            });

        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных объявлений`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'adList', `Список объявлений`, items);
    });
};

phone.userNewsList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.userAdList');

    mysql.executeQuery(`SELECT * FROM rp_inv_news ORDER BY id DESC LIMIT 30`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            rows.forEach(row => {

                let subItems = [];
                let item = phone.getMenuItemButton(
                    `${row['text']}`,
                    ``,
                    { name: 'none' }
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    `${row['name']}`,
                    `Автор | ${row['rp_datetime']}`,
                    { name: 'none' }
                );
                subItems.push(item);

                items.push(phone.getMenuMainItem(`${row['title']}`, subItems));
            });

        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных новостей`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'adList', `Список объявлений`, items);
    });
};

phone.bankHistory = function(player, bankCard) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.bankHistory');

    if (bankCard === undefined)
        bankCard = user.get(player, 'bank_card');

    mysql.executeQuery(`SELECT * FROM log_bank_user WHERE card = ${methods.parseInt(bankCard)} ORDER BY id DESC LIMIT 100`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            try {
                let columns = [
                    { title: '№', field: 'id' },
                    { title: 'Описание', field: 'text' },
                    { title: 'Сумма', field: 'price' },
                    { title: 'Дата', field: 'datetime' },
                ];
                let data = [];

                rows.forEach(row => {

                    data.push({
                        id: row['id'], text: row['text'], price: methods.moneyFormat(row['price']), datetime: `${row['rp_datetime']} (( ${methods.unixTimeStampToDateTimeShort(row['timestamp'])} ))`
                    });
                });

                let item = phone.getMenuItemTable('Банковские операции', columns, data);
                items.push(phone.getMenuMainItem(``, [item]));
            }
            catch (e) {

                items.push(phone.getMenuMainItem(`Список пуст`, [
                    phone.getMenuItemButton(
                        `Произошла ошибка, попробуйте еще раз`,
                        ``
                    )
                ]));

                methods.debug(e);
            }
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных транзакций`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'bankHistory', `История транзакций`, items);
    });
};

phone.openInvaderStatsList = function(player, days = 30) {
    if (!user.isLogin(player))
        return;
    try {
        mysql.executeQuery(`SELECT editor, count(*) as c FROM rp_inv_ad WHERE timestamp > ${(methods.getTimeStamp() - days * 86400)} GROUP BY (editor) ORDER BY c DESC`, (err, rows, fields) => {

            let idx = 1;
            let items = [];

            if (rows.length > 0) {
                try {
                    let columns = [
                        { title: '№', field: 'id' },
                        { title: 'Имя', field: 'n' },
                        { title: 'Проверено', field: 'c' },
                    ];
                    let data = [];

                    rows.forEach(row => {
                        data.push({
                            id: idx++, n: row['editor'], c: `${row['c']}`
                        });
                    });

                    let item = phone.getMenuItemTable('Редактирование обявлений', columns, data);
                    items.push(phone.getMenuMainItem(`Статистика за ${days}д.`, [item]));
                }
                catch (e) {

                    items.push(phone.getMenuMainItem(`Список пуст`, [
                        phone.getMenuItemButton(
                            `Произошла ошибка, попробуйте еще раз`,
                            ``
                        )
                    ]));

                    methods.debug(e);
                }
            }
            else {
                items.push(phone.getMenuMainItem(`Список пуст`, [
                    phone.getMenuItemButton(
                        `Список пуст`,
                        ``
                    )
                ]));
            }

            phone.showMenu(player, 'statsad', `Статистика`, items);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.userHistory = function(player, id) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.userHistory');

    if (id === undefined)
        id = user.get(player, 'id');

    mysql.executeQuery(`SELECT * FROM log_player WHERE user_id = ${methods.parseInt(id)} ORDER BY id DESC LIMIT 100`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            try {
                let columns = [
                    { title: '№', field: 'id' },
                    { title: 'Описание', field: 'do' },
                    { title: 'Дата', field: 'datetime' },
                ];
                let data = [];

                rows.forEach(row => {
                    data.push({
                        id: row['id'], do: row['do'], datetime: `${row['rp_datetime']} (( ${methods.unixTimeStampToDateTimeShort(row['timestamp'])} ))`
                    });
                });

                let item = phone.getMenuItemTable('Личная история', columns, data);
                items.push(phone.getMenuMainItem(``, [item]));
            }
            catch (e) {

                items.push(phone.getMenuMainItem(`Список пуст`, [
                    phone.getMenuItemButton(
                        `Произошла ошибка, попробуйте еще раз`,
                        ``
                    )
                ]));

                methods.debug(e);
            }
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Список пуст`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'userHistory', `Личная история`, items);
    });
};

phone.userTickets = function(player, id) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.userTickets');

    if (id === undefined)
        id = user.getId(player);

    mysql.executeQuery(`SELECT * FROM tickets WHERE user_id = ${methods.parseInt(id)} ORDER BY is_pay ASC, id DESC LIMIT 50`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            try {
                let columns = [
                    { title: '№', field: 'id' },
                    { title: 'Выдал', field: 'do' },
                    { title: 'Отменил', field: 'do2' },
                    { title: 'Сумма', field: 'price' },
                    { title: 'Статус', field: 'status' },
                    { title: 'Дата', field: 'datetime' },
                ];
                let data = [];

                rows.forEach(row => {
                    data.push({
                        id: row['id'], do: row['do'], do2: row['do2'], price: methods.moneyFormat(row['price']), status: row['is_pay'] ? 'Оплачен' : 'Не оплачен', datetime: `${row['rp_datetime']} (( ${methods.unixTimeStampToDateTimeShort(row['timestamp'])} ))`
                    });
                });

                let item = phone.getMenuItemTable('История штрафов', columns, data);
                items.push(phone.getMenuMainItem(``, [item]));
            }
            catch (e) {

                items.push(phone.getMenuMainItem(`Список пуст`, [
                    phone.getMenuItemButton(
                        `Произошла ошибка, попробуйте еще раз`,
                        ``
                    )
                ]));

                methods.debug(e);
            }
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Список пуст`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'userTickets', `История штрафов`, items);
    });
};

phone.changeBg = function(player, str) {
    if (!user.isLogin(player))
        return;

    let phoneNumber = user.get(player, 'phone');
    mysql.executeQuery(`SELECT * FROM items WHERE params LIKE '%"number":${phoneNumber}%' OR params LIKE '%"number": ${phoneNumber}%'`, function (err, rows, fields) {

        rows.forEach(function (item) {
            try {
                if (user.isLogin(player)) {
                    str = methods.removeQuotes(methods.removeQuotes2(str));
                    user.set(player, 'phone_bg', str);
                    let params = JSON.parse(item['params']);
                    params.bg = str;
                    inventory.updateItemParams(item['id'], JSON.stringify(params));
                    user.updateClientCache(player);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });
    });
};

phone.createFraction = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.createFraction');

    mysql.executeQuery(`SELECT * FROM fraction_list WHERE owner_id = 0`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            let subItems = [];
            rows.forEach(row => {

                let item = phone.getMenuItemButton(
                    `Слот свободен`,
                    `Взнос 500₿`,
                    { name: 'buyFraction', id: row['id'] },
                    '',
                    true,
                );
                subItems.push(item);
            });
            items.push(phone.getMenuMainItem(`Список доступных слотов`, subItems));
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных слотов`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'ecorp', `E-CORP`, items);
    });
};

phone.fractionAll = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionAll');

    mysql.executeQuery(`SELECT * FROM fraction_list WHERE owner_id > 0`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            let subItems = [];
            rows.forEach(row => {

                let item = phone.getMenuItemButton(
                    `${row['name']}`,
                    ``,
                    { name: 'none' }
                );
                subItems.push(item);
            });
            items.push(phone.getMenuMainItem(`Список организаций`, subItems));
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных организаций`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'ecorp', `E-CORP`, items);
    });
};

phone.userVehicleAppMenu = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehiclesBuyList');

    mysql.executeQuery(`SELECT * FROM cars WHERE user_id = '${user.getId(player)}' ORDER BY name ASC`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {

            rows.forEach(row => {

                let subItems = [];
                let name = row['name'];

                let item = phone.getMenuItemTitle(
                    `${row['name']}`,
                    `Гос. цена: ${methods.moneyFormat(row['price'], 1)}`,
                    { name: 'none' },
                    enums.getVehicleImg(row['name'])
                );
                subItems.push(item);

                let price = methods.parseInt(row['price'] * 0.001 + 100);
                if (user.get(player, 'vip_type') > 0)
                    price = methods.parseInt(price / 2);

                item = phone.getMenuItemButton(
                    'Вызвать эвакуатор',
                    'Стоимость: ' + methods.moneyFormat(price),
                    { name: "respawn", price: price, id: row['id'] },
                    '',
                    true,
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    'Узнать местоположение',
                    '',
                    { name: "getPos", id: row['id'] },
                    '',
                    true,
                );
                subItems.push(item);

                if (row['is_special'])
                {
                    item = phone.getMenuItemButton(
                        'Открыть / Закрыть двери',
                        'Удаленное управление транспортом',
                        { name: "lock", id: row['id'] },
                        '',
                        true,
                    );
                    subItems.push(item);

                    item = phone.getMenuItemButton(
                        'Запустить / Заглушить двигатель',
                        'Удаленное управление транспортом',
                        { name: "engine", id: row['id'] },
                        '',
                        true,
                    );
                    subItems.push(item);

                    if (row['is_neon'] > 0) {
                        item = phone.getMenuItemButton(
                            'Вкл / Выкл неон',
                            'Удаленное управление транспортом',
                            { name: "neon", id: row['id'] },
                            '',
                            true,
                        );
                        subItems.push(item);
                    }
                }

                items.push(phone.getMenuMainItem(`${name} | ${row['number']}`, subItems));
            });
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `У вас нет транспорта`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'uvehicle', `UVehicle`, items);
    });
};

phone.fractionVehicleBuyInfo = function(player, id) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehicleBuyInfo');

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, (err, rows, fields) => {
        let items = [];
        let subItems = [];
        let name = '';

        rows.forEach(row => {

            let vInfo = methods.getVehicleInfo(row['name']);

            let item = phone.getMenuItemImg(
                undefined,
                { name: 'none' },
                enums.getVehicleImg(row['name']),
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                vInfo.display_name,
                row['number'],
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Топливо',
                `${vehicles.getFuelLabel(vInfo.fuel_type)}/${vInfo.fuel_min}${vehicles.getFuelPostfix(vInfo.fuel_type)}/${vInfo.fuel_full}${vehicles.getFuelPostfix(vInfo.fuel_type)}`,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Стоимость обслуживания',
                `${methods.moneyFormat(vehicles.getFractionDay(vInfo.price))} в неделю (( В день ))`,
            );
            subItems.push(item);

            item = phone.getMenuItemModal(
                'Купить',
                `Цена: ${methods.moneyFormat(vInfo.price)}`,
                'Покупка',
                `Вы точно хотите купить ${vInfo.display_name}?`,
                'Купить',
                'Отмена',
                { name: 'fractionVehicleBuy', vehId: row['id'], price: vInfo.price },
                '',
                true
            );
            subItems.push(item);
        });

        items.push(phone.getMenuMainItem(`${name}`, subItems));
        phone.showMenu(player, 'fraction', `Покупка транспорта`, items);
    });
};

phone.fractionVehicleBuyInfo2 = function(player, id) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehicleBuyInfo');

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, (err, rows, fields) => {
        let items = [];
        let subItems = [];
        let name = '';

        rows.forEach(row => {

            let vInfo = methods.getVehicleInfo(row['name']);

            let item = phone.getMenuItemImg(
                undefined,
                { name: 'none' },
                enums.getVehicleImg(row['name']),
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                vInfo.display_name,
                row['number'],
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Топливо',
                `${vehicles.getFuelLabel(vInfo.fuel_type)}/${vInfo.fuel_min}${vehicles.getFuelPostfix(vInfo.fuel_type)}/${vInfo.fuel_full}${vehicles.getFuelPostfix(vInfo.fuel_type)}`,
            );
            subItems.push(item);

            item = phone.getMenuItemModal(
                'Купить',
                `Цена: ${methods.moneyFormat(vInfo.price)}`,
                'Покупка',
                `Вы точно хотите купить ${vInfo.display_name}?`,
                'Купить',
                'Отмена',
                { name: 'fractionVehicleBuy2', vehId: row['id'], price: vInfo.price },
                '',
                true
            );
            subItems.push(item);
        });

        items.push(phone.getMenuMainItem(`${name}`, subItems));
        phone.showMenu(player, 'fraction2', `Покупка транспорта`, items);
    });
};

phone.updateContactList = function(player) {
    if (!user.isLogin(player))
        return;

    try {
        mysql.executeQuery(`SELECT * FROM phone_contact WHERE phone = '${user.get(player, 'phone')}' LIMIT 40`, (err, rows, fields) => {

            let array = [];

            rows.forEach(row => {
                array.push(
                    {
                        id: row['id'],
                        name: row['name'],
                        numbers: JSON.parse(row['numbers']),
                        mail: '',
                        isFavorite: row['is_fav'] === 1,
                        img: 'https://a.rsg.sc//n/socialclub',
                    }
                );
            });

            let contacts = {
                type: 'updatePhonebook',
                phonebook: {
                    editing_contact: false,
                    selected_contact: {},
                    history: [],
                    contact: array,
                }
            };

            user.callCef(player, 'phone' + user.get(player, 'phone_type'), JSON.stringify(contacts));
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.updateDialogList = function(player) {
    if (!user.isLogin(player))
        return;

    let myPhone = user.get(player, 'phone').toString();
    try {
        mysql.executeQuery(`SELECT * FROM phone_sms WHERE number_from = '${myPhone}' OR number_to = '${myPhone}' GROUP BY number_from, number_to ORDER BY id DESC`, (err, rows, fields) => {

            let array = [];
            let numbers = [myPhone];

            rows.forEach(row => {

                let phoneNumber = row['number_from'];
                let messageType = 2;
                let newMessages = row['is_unread'];

                if (myPhone === row['number_from']) {
                    phoneNumber = row['number_to'];
                    messageType = 1;
                    newMessages = 0;
                }

                if (numbers.indexOf(phoneNumber) >= 0)
                    return;

                numbers.push(phoneNumber);

                array.push(
                    {
                        phone_number: phoneNumber,
                        is_online: true, // был(а) в сети 12.01.2019
                        last_login: '01.01.1990',
                        new_messages: newMessages,
                        message: [
                            {type: messageType, text: methods.replaceAll(methods.replaceAll(row['text'], '\n', ''), '"', '`'), date: row['date'], time: row['time'] + ':00'},
                        ]
                    },
                );
            });

            let contacts = {
                type: 'updateMessenger',
                chats: array
            };
            user.callCef(player, 'phone' + user.get(player, 'phone_type'), JSON.stringify(contacts));
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.selectChat = function(player, phoneNumber, chat) {
    if (!user.isLogin(player))
        return;

    let myPhone = user.get(player, 'phone');

    mysql.executeQuery(`UPDATE phone_sms SET is_unread = '0' WHERE number_to = '${myPhone}' AND number_from = '${phoneNumber}'`);

    mysql.executeQuery(`SELECT * FROM phone_sms WHERE (number_from = '${myPhone}' AND number_to = '${phoneNumber}') OR (number_to = '${myPhone}' AND number_from = '${phoneNumber}') ORDER BY id DESC LIMIT 100`, (err, rows, fields) => {

        let array = [];

        rows.forEach(row => {

            let messageType = 1;
            if (myPhone.toString() === row['number_from'])
                messageType = 2;

            array.push(
                {type: messageType, text: methods.replaceAll(methods.replaceAll(row['text'], '\n', ''), '"', '`'), date: row['date'], time: row['time'] + ':00'},
            );
        });

        let contacts = {
            type: 'updateMessengerChat',
            idx: chat,
            messages: array,
        };

        user.callCef(player, 'phone' + user.get(player, 'phone_type'), JSON.stringify(contacts));
    });
};

phone.deleteChat = function(player, phoneNumber) {
    if (!user.isLogin(player))
        return;

    let myPhone = methods.parseInt(user.get(player, 'phone'));
    mysql.executeQuery(`DELETE FROM phone_sms WHERE (number_from = '${myPhone}' AND number_to = '${phoneNumber}') OR (number_to = '${myPhone}' AND number_from = '${phoneNumber}')`);
    player.notify('~b~Чат был удалён');
};

phone.sendMessageByNumber = function(numberFrom, phoneNumber, message) {
    try {
        message = methods.removeQuotes(methods.removeQuotes2(message));
        let date = weather.getFullRpDate().replace('/', '.').replace('/', '.');
        mysql.executeQuery(`INSERT INTO phone_sms (number_from, number_to, text, date, time) VALUES ('${numberFrom.toString()}', '${phoneNumber}', '${message}', '${date}', '${weather.getFullRpTime()}')`);

        mp.players.forEach(p => {
            if (user.isLogin(p) && user.get(p, 'phone_type') > 0 && user.get(p, 'phone') === methods.parseInt(phoneNumber)) {
                user.sendPhoneNotify(p, methods.phoneFormat(numberFrom), '~b~Новое сообщение', message);

                let msg = {
                    type: 'addMessengerMessage',
                    phone: numberFrom.toString(),
                    text: message,
                    date: date,
                    time: weather.getFullRpTime() + ':00',
                };

                user.callCef(p, 'phone' + user.get(p, 'phone_type'), JSON.stringify(msg));
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.showMenu = function(player, uuid, title, items) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.showMenu');

    let menu = {
        UUID: uuid,
        title: title,
        items: items,
    };

    player.call('client:phone:showMenu', [JSON.stringify(menu)]);
};

phone.getMenuItem = function(title, text, params = { name: "null" }, type = 1, img = undefined, clickable = false, value = undefined, background = undefined, online = false) {
    return {
        title: title,
        text: text,
        type: type,
        img: img,
        background: background,
        clickable: clickable,
        value: value,
        online: online,
        params: params
    };
};

phone.getMenuItemTitle = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 0,
        value: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemButton = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 1,
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemCheckbox = function(title, text, checked = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 2,
        img: img,
        value: checked,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemUser = function(title, text, isOnline = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 4,
        img: img,
        online: isOnline,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemRadio = function(title, text, selectTitle, selectItems, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 5,
        img: img,
        background: background,
        clickable: clickable,
        scrollbarTitle: selectTitle,
        scrollbar: selectItems,
        params: params
    };
};

phone.getMenuItemImg = function(height = 150, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        type: 6,
        value: img,
        background: background,
        clickable: clickable,
        height: height,
        params: params
    };
};

phone.getMenuItemModal = function(title, text, modalTitle, modalText, modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 7,
        modalTitle: modalTitle,
        modalText: modalText,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemModalInput = function(title, text, modalTitle, modalValue = '', modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 8,
        modalTitle: modalTitle,
        modalValue: modalValue,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemTable = function(title, columns, data, readonly = true, params = { name: "null" }, clickable = false, background = undefined) {
    return {
        type: 10,
        title: title,
        columns: columns,
        data: data,
        readonly: readonly,
        params: params,
        background: background,
        clickable: clickable,
    };
};

phone.getMenuMainItem = function(title, items, hidden = false) {
    return {
        title: title,
        hidden: hidden,
        umenu: items,
    };
};