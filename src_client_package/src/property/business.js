import Container from '../modules/data';
import methods from '../modules/methods';
import ui from '../modules/ui';
import enums from '../enums';
import timer from "../manager/timer";

let business = {};

var TargetsToRender = [];
var scale = 0;
var name = "Office";
var font = 0;
var color = [0, 0, 0, 255];

let cityHall = new mp.Vector3(-1381.86328125, -478.4166564941406, 72.04215240478516);
let mazeBank = new mp.Vector3(-72.04210662841797, -814.3770141601562, 243.38595581054688);
let businessOffice = new mp.Vector3(-140.7121, -617.3683, 167.8204);

business.typeList = [
    "Банки", //0
    "Автомастерские", //1
    "Пункты аренды", //2
    "Заправочные станции", //3
    "Парикмахерские", //4
    "Тату салоны", //5
    "Развлечения", //6
    "Компании", //7
    "Остальное", //8
    "Магазины", //9
    "Магазины продуктов", //10
    "Магазины одежды", //11
    "Магазины оружия", //12
    "Станции тех. обслуживания", //13
    "Заправочные станции для воздушного ТС", //14
    "Заправочные станции для водного ТС", //15
];

business.interiorList = [
    "ex_dt1_02_office_02b",
    "ex_dt1_02_office_02c",
    "ex_dt1_02_office_02a",
    "ex_dt1_02_office_01a",
    "ex_dt1_02_office_01b",
    "ex_dt1_02_office_01c",
    "ex_dt1_02_office_03a",
    "ex_dt1_02_office_03b",
    "ex_dt1_02_office_03c"
];

business.BusinessOfficePos = new mp.Vector3(-140.7121, -617.3683, 167.8204);
business.BusinessMotorPos = new mp.Vector3(-138.6593, -592.6267, 166.0002);
business.BusinessStreetPos = new mp.Vector3(-116.8427, -604.7336, 35.28074);
business.BusinessGaragePos = new mp.Vector3(-155.6696, -577.3766, 31.42448);
business.BusinessRoofPos = new mp.Vector3(-136.6686, -596.3055, 205.9157);
business.BusinessBotPos = new mp.Vector3(-139.2922, -631.5964, 167.8204);

business.addMoney = function(id, money, itemName = 'Операция со счетом') {
    mp.events.callRemote('server:business:addMoney', id, money, itemName);
};

business.removeMoney = function(id, money, itemName = 'Операция со счетом') {
    mp.events.callRemote('server:business:removeMoney', id, money, itemName);
};

business.setMoney = function(id, money) {
    mp.events.callRemote('server:business:setMoney', id, money);
};

business.getMoney = async function(id) {
    try {
        return methods.parseFloat(await Container.Data.Get(enums.offsets.business + id, 'bank'));
    }
    catch (e) {
        methods.debug(e);
        return 0;
    }
};

business.addMoneyTax = function(id, money) {
    mp.events.callRemote('server:business:addMoneyTax', id, money);
};

business.removeMoneyTax = function(id, money) {
    mp.events.callRemote('server:business:removeMoneyTax', id, money);
};

business.setMoneyTax = function(id, money) {
    mp.events.callRemote('server:business:setMoneyTax', id, money);
};

business.getMoneyTax = async function(id) {
    try {
        return methods.parseFloat(await Container.Data.Get(enums.offsets.business + id, 'bank_tax'));
    }
    catch (e) {
        methods.debug(e);
        return 0;
    }
};

business.getPrice = async function(id) {
    if (id === 0)
        return 3;
    try {
        return methods.parseFloat(await Container.Data.Get(enums.offsets.business + id, 'price_product'));
    }
    catch (e) {
        methods.debug(e);
        return 3;
    }
};

business.getSale = function(price) {
    let newPrice = Math.round((price - 1) * 100);
    if (newPrice <= 50)
        return 50 - newPrice;
    return 0;
};

business.setPrice = function(id, price) {
    Container.Data.Set(enums.offsets.business + id, 'price_product', methods.parseFloat(price));
};

business.setName = function(id, name) {
    name = methods.removeQuotes(name);
    name = methods.removeQuotes2(name);
    Container.Data.Set(enums.offsets.business + id, 'name', name);
};

business.set = function(id, key, val) {
    return Container.Data.Set(enums.offsets.business + methods.parseInt(id), key, val);
};

business.get = async function(id, key) {
    return await Container.Data.Get(enums.offsets.business + methods.parseInt(id), key);
};

business.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.business + methods.parseInt(id));
};

business.save = function(id) {
    mp.events.callRemote('server:business:save', id);
};

business.isOpen = async function(id, minPrice = 0) {
    let data = await business.getData(id);
    return data.get('user_id') === 0 || (data.get('user_id') > 0 && data.get('bank_tax') > minPrice);
};

business.loadInterior = function(id, timeout = 0) {
    id = methods.parseInt(id);
    setTimeout(function () {
        business.interiorList.forEach(item => {
            mp.game.streaming.removeIpl(item);
        });

        mp.game.streaming.requestIpl(business.interiorList[id]);
    }, timeout);
};

business.loadScaleform = async function() {
    try {
        scale = mp.game.graphics.requestScaleformMovie("ORGANISATION_NAME");
        while(!mp.game.graphics.hasScaleformMovieLoaded(scale))
            await methods.sleep(1);

        let id = business.createRenderTarget("prop_ex_office_text", "ex_prop_ex_office_text");
        if(id != -1)
            TargetsToRender.push(id);
        else
            methods.debug("Could not create render target.");
    }
    catch (e) {
        methods.debug(e);
    }

    timer.createInterval('business.updateTarget', business.updateTarget, 5000);
};

business.setScaleformName = function(scName) {
    name = scName;
};

business.setScaleformParams = function(scFont = 0, scColor = 0, scAlpha = 0) {
    font = scFont;

    let alpha = 255;
    if (scAlpha == 1)
        alpha = 200;

    switch (scColor) {
        case 0:
            color = [0, 0, 0, alpha];
            break;
        case 1:
            color = [244, 67, 54, alpha];
            break;
        case 2:
            color = [233,30,99,alpha];
            break;
        case 3:
            color = [156,39,176,alpha];
            break;
        case 4:
            color = [103,58,183,alpha];
            break;
        case 5:
            color = [63,81,181,alpha];
            break;
        case 6:
            color = [33,150,243,alpha];
            break;
        case 7:
            color = [3,169,244,alpha];
            break;
        case 8:
            color = [0,188,212,alpha];
            break;
        case 9:
            color = [0,150,136,alpha];
            break;
        case 10:
            color = [76,175,80,alpha];
            break;
        case 11:
            color = [139,195,74,alpha];
            break;
        case 12:
            color = [255,193,7,alpha];
            break;
        case 13:
            color = [255,152,0,alpha];
            break;
        case 14:
            color = [255,87,34,alpha];
            break;
        case 15:
            color = [121,85,72,alpha];
            break;
        case 16:
            color = [96,125,139,alpha];
            break;
        case 17:
            color = [97,97,97,alpha];
            break;
    }

    font = scFont;
    switch (scFont) {
        case 3:
            font = 4;
            break;
        case 4:
            font = 7;
            break;
    }

    /*mp.game.graphics.pushScaleformMovieFunction(scale, 'SET_ORGANISATION_NAME');
    mp.game.graphics.pushScaleformMovieFunctionParameterString(name);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(0); //2 Прозрачный, 3 Нет
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(scColor);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(scFont);
    mp.game.graphics.popScaleformMovieFunctionVoid();*/
};

business.updateTarget = function()
{
    try {
        if (methods.distanceToPos(mp.players.local.position, cityHall) < 50) {
            business.setScaleformName('Maze Bank');
            business.setScaleformParams(2, 15, 1);
        }
        else if (methods.distanceToPos(mp.players.local.position, mazeBank) < 50) {
            business.setScaleformName('Maze Bank');
            business.setScaleformParams(2, 17, 1);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

business.createRenderTarget = function(name, model)
{
    if(!mp.game.ui.isNamedRendertargetRegistered(name))
        mp.game.ui.registerNamedRendertarget(name, false); //Register render target
    if(!mp.game.ui.isNamedRendertargetLinked(mp.game.joaat(model)))
        mp.game.ui.linkNamedRendertarget(mp.game.joaat(model)); //Link it to all models
    if(mp.game.ui.isNamedRendertargetRegistered(name))
        return mp.game.ui.getNamedRendertargetRenderId(name); //Get the handle
    return -1;
};

business.renderThings = function(id)
{
    try {
        mp.game.ui.setTextRenderId(id);
        mp.game.graphics.set2dLayer(4);
        if (name.length > 22)
            ui.drawText(name, 0.5, 0.09, 1, color[0], color[1], color[2], color[3], font, 1, color[3] == 255, false);
        else
            ui.drawText(name, 0.5, 0.3, 1, color[0], color[1], color[2], color[3], font, 1, color[3] == 255, false);
        mp.game.graphics.drawScaleformMovie(scale, 0.5, 0.5, 1, 1, 255, 255,255, 255, 0);
        mp.game.ui.setTextRenderId(1);
    }
    catch (e) {
        methods.debug(e);
    }
};

mp.events.add("render", () =>
{
    try {
        if (methods.distanceToPos(mp.players.local.position, cityHall) < 50 ||
            methods.distanceToPos(mp.players.local.position, mazeBank) < 50 ||
            methods.distanceToPos(mp.players.local.position, businessOffice) < 50) {
            for(let i = 0; i < TargetsToRender.length; i++)
                business.renderThings(TargetsToRender[i]);
        }
    }
    catch (e) {

    }
});

export default business;