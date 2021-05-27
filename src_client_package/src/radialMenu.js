import user from "./user";
import methods from "./modules/methods";
import ui from "./modules/ui";
import enums from "./enums";

let radialMenu = {};

let userMenu = [
    {
        id   : 'walk',
        title: 'Походки'
    },
    {
        id   : 'shoot',
        title: 'Стиль стрельбы',
        items: []
    },
    {
        id   : 'run',
        title: 'Документы',
        items: [
            {
                id   : 'showGosDoc',
                title: 'Удостоверение'
            },
            {
                id   : 'showCardId',
                title: 'Паспорт'
            },
            {
                id   : 'showLic',
                title: 'Лицензии'
            }
        ]
    },
    {
        id   : 'run1',
        title: 'Действия',
        items: [
            {
                id   : 'showGosDoc',
                title: 'Вкл/Выкл Наушники'
            },
            {
                id   : 'showCardId',
                title: 'Следующая станция'
            },
            {
                id   : 'showLic',
                title: 'Взаимодействовать с прической'
            },
            {
                id   : 'showCardId',
                title: 'Предыдущая станция'
            },
        ]
    },
    {
        id   : 'anim',
        title: 'Анимации'
    }
];

radialMenu.showUserMenu = function() {
    try {
        let data = userMenu;

        let prevItems = [];
        enums.clipsetW.forEach((item, idx) => {
            data[1].items.push(
                {
                    id: 'changeShoot',
                    title: methods.removeQuotesAll(item[0]),
                    params: {id: item[1]},
                }
            );
        });

        let sendData = {
            type: 'updateData',
            choiceData: data,
            currentData: data,
        };
        ui.callCef('radial', JSON.stringify(sendData));
        ui.callCef('radial', '{"type": "show"}');
    }
    catch (e) {
        methods.debug(e);
    }
    return false;
};

export default radialMenu;


/*if (user.getSex() === 1) {
    enums.clopsetFemale.forEach(item => {
        pushData.push(
            {
                id   : 'changeWalk',
                title: methods.removeQuotesAll(item[0]),
                params: {id: item[1]},
            }
        );
    })
}
else {

    let array = methods.sliceArray(enums.clopsetMale, 7);
    let prevItems = [];
    array.reverse().forEach((item, idx) => {

        let items = [];
        item.forEach(item2 => {
            items.push(
                {
                    id: 'changeWalk',
                    title: methods.removeQuotesAll(item2[0]),
                    icon: item2[1] + '_' + item2[2],
                    params: {id: item2[1]},
                }
            );
        });

        if (prevItems.length > 0) {
            items.push(
                {
                    id: 'm',
                    title: 'Ещё',
                    items: prevItems,
                    params: {},
                }
            );
        }
        prevItems = items;

        methods.debug(items.length);
    });

    methods.debug(JSON.stringify(prevItems));

    data[0].items = prevItems;
}*/