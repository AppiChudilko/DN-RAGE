import UIMenu from './modules/menu';
import methods from './modules/methods';
import Container from './modules/data';
import ui from "./modules/ui";

import chat from './chat';
import items from './items';
import user from './user';
import enums from './enums';
import menuList from "./menuList";
import phone from "./phone";
import shopMenu from "./shopMenu";
import coffer from "./coffer";

import vehicles from "./property/vehicles";
import stocks from "./property/stocks";
import houses from "./property/houses";
import condos from "./property/condos";

import bind from "./manager/bind";
import weather from "./manager/weather";
import quest from "./manager/quest";

let inventory = {};

inventory.currentItem = -1;
inventory.ownerId = -1;
inventory.ownerType = -1;

let hidden = true;

inventory.show = function() {
    //chat.activate(false);
    try {
        mp.gui.cursor.show(false, true);
        mp.game.ui.notifications.show(`~b~Скрыть ивентарь на ~s~${bind.getKeyName(user.getCache('s_bind_inv'))}`);
        ui.DisableMouseControl = true;
        hidden = false;
        ui.hideHud();

        let data = {type: "updateLabel", uid: `${mp.players.local.remoteId} (${user.getCache('id')})`, uname: user.getCache('name')};
        ui.callCef('inventory', JSON.stringify(data));
        ui.callCef('inventory', JSON.stringify({type: "updateMaxW", val: inventory.calculatePlayerInvAmountMax()}));
        ui.callCef('inventory', '{"type": "show"}');

        mp.game.graphics.transitionToBlurred(100);

        inventory.getItemList(inventory.types.Player, user.getCache('id'));
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.hide = function() {
    //chat.activate(true);
    try {
        ui.callCef('inventory', '{"type": "hide"}');
        mp.gui.cursor.show(false, false);
        ui.DisableMouseControl = false;
        hidden = true;
        ui.showHud();
        mp.game.graphics.transitionFromBlurred(100);

        inventory.ownerId = -1;
        inventory.ownerType = -1;
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.isHide = function() {
    return hidden;
};

inventory.setCoolDown = function(itemId, time = 1) {
    let dataSend = {
        type: 'updateCooldown',
        itemid: itemId,
        time: time,
    };
    ui.callCef('inventory', JSON.stringify(dataSend));
};

inventory.updateEquipStatus = function(id, status) { //TODO, подумать как можно рессетнуть значения, чтобы не дюпали и не пропадли деньги
    mp.events.callRemote('server:inventory:updateEquipStatus', id, status);
};

inventory.updateItemCount = function(id, count) { //TODO, подумать как можно рессетнуть значения, чтобы не дюпали и не пропадли деньги
    mp.events.callRemote('server:inventory:updateItemCount', id, count);
};

inventory.updateItemsEquipByItemId = function(itemId, ownerId, ownerType, equip, count = -1) {
    mp.events.callRemote('server:inventory:updateItemsEquipByItemId', itemId, ownerId, ownerType, equip, count);
};

inventory.updateOwnerId = function(id, ownerId, ownerType) {
    ownerId = ownerId.toString();
    inventory.updateSubInvRadius(ownerId, ownerType);
    mp.events.callRemote('server:inventory:updateOwnerId', id, ownerId, ownerType);
};

inventory.updateOwnerIdWithPrice = function(id, ownerId, ownerType, price = 0) {
    ownerId = ownerId.toString();
    inventory.updateSubInvRadius(ownerId, ownerType);
    mp.events.callRemote('server:inventory:updateOwnerIdWithPrice', id, ownerId, ownerType, price);
};

inventory.updateOwnerAll = function(oldOwnerId, oldOwnerType, ownerId, ownerType) {
    ownerId = ownerId.toString();
    oldOwnerId = oldOwnerId.toString();
    inventory.updateSubInvRadius(ownerId, ownerType);
    mp.events.callRemote('server:inventory:updateOwnerAll', oldOwnerId, oldOwnerType, ownerId, ownerType);
};

inventory.updateItemParams = function(id, params) {
    try {
        if (typeof params != "string")
            params = JSON.stringify(params);
        mp.events.callRemote('server:inventory:updateItemParams', id, params);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.openInventoryByEntity = async function(entity) {

    if (entity.getType() == 2) {

        try {

            if (entity.getVariable('useless') === true && entity.getVariable('user_id') > 0) {
                menuList.showVehicleDoSellMenu(entity.remoteId);
                return;
            }
            if (entity.isDead()) {
                mp.game.ui.notifications.show("~r~Транспорт уничтожен");
            } else if (entity.getDoorLockStatus() !== 1) {
                menuList.showVehicleDoInvMenu(entity.remoteId, true);
            } else if (mp.players.local.isInAnyVehicle(false)) {
                mp.game.ui.notifications.show("~g~Вы должны находиться около багажника");
            } else if (entity.getVariable('useless') === true) {
                mp.game.ui.notifications.show("~r~Данный транспорт не доступен");
            }
            else {
                menuList.showVehicleDoInvMenu(entity.remoteId);
            }
        }
        catch (e) {
            methods.debug(e);
            mp.game.ui.notifications.show("~r~Произошла неизвестная ошибка #9998");
        }
    }
    else if (entity.getType() == 3) {
        try {
            if (entity.getVariable('isDrop'))
                inventory.takeItem(entity.getVariable('isDrop'), entity.getVariable('itemId'));
            else if (entity.getVariable('emsType') !== undefined && entity.getVariable('emsType') !== null) {

                /*if (!user.isEms()) {
                    mp.game.ui.notifications.show("~r~Доступно только для сотрудников EMS");
                    return;
                }*/

                let type = methods.parseInt(entity.getVariable('emsType').split('|')[0]);
                if (type === 0) {
                    user.playAnimation("amb@medic@standing@tendtodead@idle_a", "idle_a", 9);
                    methods.blockKeys(true);
                    setTimeout(function () {
                        mp.events.callRemote('server:ems:removeObject', entity.remoteId);
                        methods.blockKeys(false);
                        user.addRep(10);
                        user.stopAllAnimation();
                    }, 15000);
                }
                else if (type === 1) {
                    user.playAnimation("amb@medic@standing@tendtodead@idle_a", "idle_a", 9);
                    methods.blockKeys(true);
                    setTimeout(function () {
                        mp.events.callRemote('server:ems:attachObject', entity.remoteId);
                        methods.blockKeys(false);
                        user.addRep(10);
                        user.stopAllAnimation();
                    }, 8000);
                }
            }
            else if (entity.getVariable('stockId'))
                inventory.getItemList(entity.getVariable('stockId'), mp.players.local.dimension);
            else if (entity.getVariable('houseSafe')) {
                let data = await houses.getData(mp.players.local.dimension);
                let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                if (pass === data.get('is_safe'))
                    inventory.getItemList(inventory.types.House, entity.getVariable('houseSafe'));
                else
                    mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
            }
            else if (entity.getVariable('condoSafe')) {
                let data = await condos.getData(mp.players.local.dimension - enums.offsets.condo);
                let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                if (pass === data.get('is_safe'))
                    inventory.getItemList(inventory.types.Condo, entity.getVariable('condoSafe'));
                else
                    mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
            }
            else if (entity.invType) {
                if (entity.safe) {
                    let data = await stocks.getData(mp.players.local.dimension - enums.offsets.stock);
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                    if (pass == data.get('pin' + entity.safe))
                        inventory.getItemList(entity.invType, mp.players.local.dimension);
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                }
                else
                    inventory.getItemList(entity.invType, mp.players.local.dimension);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else if (entity.getType() == 4) {
        try {
            menuList.showPlayerDoMenu(entity.remoteId);
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else if (entity.getType() == 5) {
        try {
            menuList.showPlayerDoMenu(entity.remoteId);
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

inventory.useItem = function(id, itemId)    {
    mp.events.callRemote('server:inventory:useItem', id, itemId);
};

inventory.usePlayerItem = function(id, itemId)    {
    mp.events.callRemote('server:inventory:usePlayerItem', id, itemId);
};

inventory.dropItem = function(id, itemId, pos, rot) {
    mp.events.callRemote('server:inventory:dropItem', id, itemId, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
};

inventory.deleteItemProp = function(id) {
    mp.events.callRemote('server:inventory:deleteDropItem', id);
};

inventory.deleteItem = function(id) {
    mp.events.callRemote('server:inventory:deleteItem', id);
};

inventory.deleteItemByItemId = function(itemId, isEquip = 0) {
    mp.events.callRemote('server:inventory:deleteItemByItemId', itemId, isEquip);
};

inventory.deleteItemsRange = function(itemIdFrom, itemIdTo) {
    mp.events.callRemote('server:inventory:deleteItemsRange', itemIdFrom, itemIdTo);
};

inventory.takeNewItem = async function(itemId, params = "{}", count = 1) { //TODO
    try {
        let user_id = user.getCache('id');
        let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
        let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);
        if (items.getItemAmountById(itemId) + amount > amountMax) {
            inventory.updateAmount(user_id, inventory.types.Player);
            mp.game.ui.notifications.show("~r~Инвентарь заполнен");
            return;
        }
        inventory.addItem(itemId, 1, inventory.types.Player, user_id, count, 0, params, 1);
        inventory.updateAmount(user_id, inventory.types.Player);
        mp.game.ui.notifications.show(`~b~Вы взяли \"${items.getItemNameById(itemId)}\"`);
        chat.sendMeCommand(`взял \"${items.getItemNameById(itemId)}\"`);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.takeNewItemJust = function(itemId, params = "{}", count = 1) {
    try {
        let user_id = user.getCache('id');
        inventory.addItem(itemId, 1, inventory.types.Player, user_id, count, 0, params, 1);
        inventory.updateAmount(user_id, inventory.types.Player);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.takeNewWeaponItem = async function(itemId, params, text = 'Получено оружие', count = -1) { //TODO
    try {
        let user_id = user.getCache('id');
        let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
        let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);
        if (items.getItemAmountById(itemId) + amount > amountMax) {
            inventory.updateAmount(user_id, inventory.types.Player);
            mp.game.ui.notifications.show("~r~Инвентарь заполнен");
            return;
        }

        let fId = coffer.getIdByFraction(user.getCache('fraction_id'));
        let cofferData = await coffer.getAllData(fId);
        let endItem = 0;
        if (items.isWeaponComponent(itemId)) {
            if (cofferData.get('stock_gunm') < 1)
            {
                mp.game.ui.notifications.show("~r~На складе недостаточно модулей");
                return;
            }
            endItem = cofferData.get('stock_gunm') - 1;
            coffer.set(fId, 'stock_gunm', endItem);
        }
        else if (items.isWeapon(itemId)) {
            if (cofferData.get('stock_gun') < 1)
            {
                mp.game.ui.notifications.show("~r~На складе недостаточно оружия");
                return;
            }
            endItem = cofferData.get('stock_gun') - 1;
            coffer.set(fId, 'stock_gun', endItem);
        }
        else if (items.isAmmo(itemId) || itemId === 40) {
            if (cofferData.get('stock_ammo') < 1)
            {
                mp.game.ui.notifications.show("~r~На складе недостаточно патрон");
                return;
            }
            endItem = cofferData.get('stock_ammo') - 1;
            coffer.set(fId, 'stock_ammo', endItem);
        }
        else if (itemId === 252) {
            if (cofferData.get('stock_armour') < 1)
            {
                mp.game.ui.notifications.show("~r~На складе недостаточно бронежилетов");
                return;
            }
            endItem = cofferData.get('stock_armour') - 1;
            coffer.set(fId, 'stock_armour', endItem);
            count = 100;
            try {
                let paramsObj = JSON.parse(params);
                paramsObj.name = 'Тактический бронежилет';
                paramsObj.armor_color = 9;
                paramsObj.armor_color = 9;
                params = JSON.stringify(paramsObj);
            }
            catch (e) {}
        }
        else if (items.isMed(itemId)) {
            if (cofferData.get('stock_med') < 1)
            {
                mp.game.ui.notifications.show("~r~На складе недостаточно медикаментов");
                return;
            }
            endItem = cofferData.get('stock_med') - 1;
            coffer.set(fId, 'stock_med', endItem);
        }
        else if (items.isEat(itemId)) {
            if (cofferData.get('stock_eat') < 1)
            {
                mp.game.ui.notifications.show("~r~На складе недостаточно еды");
                return;
            }
            endItem = cofferData.get('stock_eat') - 1;
            coffer.set(fId, 'stock_eat', endItem);
        }
        else {
            if (cofferData.get('stock_other') < 1)
            {
                mp.game.ui.notifications.show("~r~На складе недостаточно ресурсов");
                return;
            }
            endItem = cofferData.get('stock_other') - 1;
            coffer.set(fId, 'stock_other', endItem);
        }

        inventory.addPlayerWeaponItem(itemId, 1, inventory.types.Player, user_id, count, 0, params, text, 1);
        inventory.updateAmount(user_id, inventory.types.Player);
        mp.game.ui.notifications.show(`~b~Вы взяли \"${items.getItemNameById(itemId)}\"`);
        chat.sendMeCommand(`взял \"${items.getItemNameById(itemId)}\"`);

        methods.saveFractionLog(
            user.getCache('name'),
            `Взял ${items.getItemNameById(itemId)}`,
            `Осталось: ${endItem}ед.`,
            user.getCache('fraction_id')
        );
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.takeItem = async function(id, itemId, notify = true) {
    try {
        let user_id = user.getCache('id');
        let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
        let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);
        //console.log(amount, amountMax, "amounts");
        if (items.getItemAmountById(itemId) + amount > amountMax) {
            inventory.updateAmount(user_id, inventory.types.Player);
            mp.game.ui.notifications.show("~r~Инвентарь заполнен");
            return;
        }

        inventory.updateOwnerId(id, user.getCache('id'), inventory.types.Player)
        user.playAnimation("pickup_object","pickup_low", 8);
        inventory.deleteItemProp(id);
        if (!notify) return;
        mp.game.ui.notifications.show(`~g~Вы взяли \"${items.getItemNameById(itemId)}\"`);
        chat.sendMeCommand(`взял \"${items.getItemNameById(itemId)}\"`);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.giveItem = async function(id, itemId, playerId, notify = true) {
    try {

        let target = mp.players.atRemoteId(playerId);

        if (!mp.players.exists(target)) {
            mp.game.ui.notifications.show("~r~Вы слишком далеко");
            return;
        }

        let targetId = target.getVariable('idLabel');

        let user_id = user.getCache('id');
        let amount = await inventory.getInvAmount(targetId, inventory.types.Player);
        let amountMax = await inventory.getInvAmountMax(targetId, inventory.types.Player);
        if (items.getItemAmountById(itemId) + amount > amountMax) {
            inventory.updateAmount(targetId, inventory.types.Player);
            mp.game.ui.notifications.show("~r~Инвентарь игрока заполнен");
            return;
        }

        user.playAnimationWithUser(playerId, 6); //TODO

        inventory.updateAmount(targetId, inventory.types.Player);
        inventory.updateAmount(user_id, inventory.types.Player);

        inventory.updateOwnerId(id, targetId, inventory.types.Player);

        if (!notify) return;
        mp.game.ui.notifications.show(`~g~Вы передали \"${items.getItemNameById(itemId)}\" игроку`);
        chat.sendMeCommand(`передал \"${items.getItemNameById(itemId)}\" человеку рядом`);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.takeDrugItem = async function(id, itemId, countItems, notify = true, takeCount = 1) {
    countItems = countItems - takeCount;

    let user_id = user.getCache('id');
    let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
    let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);

    let newItemId = 2;

    switch (itemId)
    {
        case 142:
        case 144:
        case 154:
        case 156:
            if (takeCount == 1)
                newItemId = 2;
            if (takeCount == 10)
                newItemId = 154;
            if (takeCount == 50)
                newItemId = 156;
            break;
        case 143:
        case 145:
        case 155:
        case 157:
            if (takeCount == 1)
                newItemId = 3;
            if (takeCount == 10)
                newItemId = 155;
            if (takeCount == 50)
                newItemId = 157;
            break;
        case 163:
        case 164:
        case 171:
        case 176:
            if (takeCount == 1)
                newItemId = 158;
            if (takeCount == 10)
                newItemId = 171;
            if (takeCount == 50)
                newItemId = 176;
            break;
        case 165:
        case 166:
        case 172:
        case 177:
            if (takeCount == 1)
                newItemId = 159;
            if (takeCount == 10)
                newItemId = 172;
            if (takeCount == 50)
                newItemId = 177;
            break;
        case 167:
        case 168:
        case 173:
        case 178:
            if (takeCount == 1)
                newItemId = 160;
            if (takeCount == 10)
                newItemId = 173;
            if (takeCount == 50)
                newItemId = 178;
            break;
        case 169:
        case 174:
        case 179:
            if (takeCount == 1)
                newItemId = 161;
            if (takeCount == 10)
                newItemId = 174;
            if (takeCount == 50)
                newItemId = 179;
            break;
        case 170:
        case 175:
        case 180:
            if (takeCount == 1)
                newItemId = 162;
            if (takeCount == 10)
                newItemId = 175;
            if (takeCount == 50)
                newItemId = 180;
            break;
    }

    if (items.getItemAmountById(itemId) + amount > amountMax) {
        mp.game.ui.notifications.show("~r~Инвентарь заполнен");
        return;
    }

    UIMenu.Menu.HideMenu();

    inventory.addItemServer(newItemId, 1, inventory.types.Player, user_id, takeCount, -1, -1, -1);
    inventory.updateAmount(user_id, inventory.types.Player);

    if (countItems <= 0)
        inventory.deleteItemServer(id);
    else
    {
        inventory.updateItemCountServer(id, countItems);
        inventory.getInfoItem(id);
    }

    if (!notify) return;
    mp.game.ui.notifications.show(`~g~Вы взяли \"${items.getItemNameById(newItemId)}\"`);
    chat.sendMeCommand(`взял ${takeCount}гр наркотиков`);
};

inventory.getInvAmount = async function(id, type) {
    //return await Container.Data.Get(id, "invAmount:" + type);
    if (Container.Data.HasLocally(id, "invAmount:" + type))
        return Container.Data.GetLocally(id, "invAmount:" + type);

    if (await Container.Data.Has(id, "invAmount:" + type))
        return await Container.Data.Get(id, "invAmount:" + type);

    inventory.updateAmount(id, type);
    await methods.sleep(1000);
    return Container.Data.GetLocally(id, "invAmount:" + type);
};

inventory.setInvAmount = function(id, type, data) {
    Container.Data.Set(id, "invAmount:" + type, data);
    Container.Data.SetLocally(id, "invAmount:" + type, data);
};

inventory.getInvAmountMax = async function(id, type) {

    let val = inventory.getAmountMaxByType(id, type);
    if (val > 0)
        return val;

    if (Container.Data.HasLocally(id, "invAmountMax:" + type)) {
        return Container.Data.GetLocally(id, "invAmountMax:" + type);
    }
    if (await Container.Data.Has(id, "invAmountMax:" + type)) {
        let maxVal = await Container.Data.Get(id, "invAmountMax:" + type);
        inventory.setInvAmountMax(id, type, maxVal);
        return maxVal;
    }
    inventory.updateAmountMax(id, type);
    await methods.sleep(1000);
    return Container.Data.GetLocally(id, "invAmountMax:" + type);
};

inventory.setInvAmountMax = function(id, type, data) {
    Container.Data.Set(id, "invAmountMax:" + type, data);
    Container.Data.SetLocally(id, "invAmountMax:" + type, data);
};

inventory.calculatePlayerInvAmountMax = function() {
    if (user.getCache('vip_type') === 2)
        return 35001;
    return 30001;
};

inventory.updateAmountMax = function(id, type) {
    if (type == inventory.types.Vehicle)
    {
        let veh = methods.getNearestVehicleWithCoords(mp.players.local.position, 5.0);
        if (veh) {
            inventory.setInvAmountMax(id, type, methods.getVehicleInfo(veh.model).stock);
        } else {
            return;
        }
    }
    else
    {
        let invAmountMax = inventory.calculatePlayerInvAmountMax();
        if (type == inventory.types.World)
            invAmountMax = 999999999;
        else if (type == inventory.types.Apartment)
            invAmountMax = 200000;
        else if (type == inventory.types.TradeBeach)
            invAmountMax = 999999999;
        else if (type == inventory.types.TradeBlack)
            invAmountMax = 999999999;
        else if (type == inventory.types.House)
            invAmountMax = 600000;
        else if (type == inventory.types.Player)
            invAmountMax = inventory.calculatePlayerInvAmountMax();
        else if (type == inventory.types.Bag)
            invAmountMax = 50000;
        else if (type == inventory.types.BagSmall)
            invAmountMax = 20000;
        else if (type == inventory.types.BagArm)
            invAmountMax = 10000;
        else if (type == inventory.types.StockGov)
            invAmountMax = 999999999;
        else if (type == inventory.types.Fridge)
            invAmountMax = 100000;
        else if (type >= inventory.types.UserStockDef && type < inventory.types.UserStock)
            invAmountMax = 100000;

        //Main.GetKitchenAmount();
        inventory.setInvAmountMax(id, type, invAmountMax);
    }
};

inventory.getAmountMaxByType = function(id, type) {
    let invAmountMax = 0;
    if (type == inventory.types.World)
        invAmountMax = 999999999;
    else if (type == inventory.types.Apartment)
        invAmountMax = 200000;
    else if (type == inventory.types.TradeBeach)
        invAmountMax = 999999999;
    else if (type == inventory.types.TradeBlack)
        invAmountMax = 999999999;
    else if (type == inventory.types.House)
        invAmountMax = 600000;
    else if (type == inventory.types.Player)
        invAmountMax = inventory.calculatePlayerInvAmountMax();
    else if (type == inventory.types.Bag)
        invAmountMax = 50000;
    else if (type == inventory.types.BagSmall)
        invAmountMax = 20000;
    else if (type == inventory.types.BagArm)
        invAmountMax = 10000;
    else if (type == inventory.types.StockGov)
        invAmountMax = 999999999;
    else if (type == inventory.types.Fridge)
        invAmountMax = 100000;
    else if (type >= inventory.types.UserStockDef && type < inventory.types.UserStock)
        invAmountMax = 100000;
    return invAmountMax;
};

inventory.sendToPlayerItemListUpdateAmountMenu = function(data, ownerType, ownerId) {
    try {
        let sum = 0;
        data.forEach(property => {
            sum = sum + items.getItemAmountById(property[1]);
        });
        inventory.setInvAmount(ownerId, ownerType, sum);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.updateAmount = function(id, type) {
    mp.events.callRemote('server:inventory:updateAmount', id, type); //TODO
};

let timeOut = null;
inventory.updateSubInvRadius = function(ownerId, ownerType, withMe = false) {
    try {
        if (timeOut) {
            clearTimeout(timeOut);
            timeOut = null;
        }
    }
    catch (e) {}
    timeOut = setTimeout(function () {
        if (methods.parseInt(ownerId === user.getCache('id')) && ownerType === inventory.types.Player)
            return;
        if (ownerType < 0 || ownerType === 1/* || ownerType === 7 || ownerType === 2*/)
            return;
        mp.events.callRemote('server:inventory:updateSubInvRadius', ownerId.toString(), ownerType, withMe);
        timeOut = null;
    }, 100)
};

inventory.addItem = function(itemId, count, ownerType, ownerId, countItems, isEquip = 0, params = "{}", timeout = 10) {
    mp.events.callRemote('server:inventory:addItem', itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);

    // mp.events.callRemote('server:inventory:addItem', 474, 1, 1, 1, 1, 0, JSON.stringify({id:3}), 10);
};

inventory.addItemSql = function(itemId, count, ownerType, ownerId, countItems, isEquip = 0, params = "{}", timeout = 10) {
    mp.events.callRemote('server:inventory:addItemSql', itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
};

inventory.addWorldItem = function(itemId, count, countItems, pos, rot, params = "{}", timeout = 10) {
    mp.events.callRemote('server:inventory:addWorldItem', itemId, count, countItems, pos.x, pos.y, pos.z + 1, rot.x, rot.y, rot.z, params, timeout);
};

inventory.dropWeaponItem = function(itemId, pos, rot) {
    mp.events.callRemote('server:inventory:dropWeaponItem', itemId, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
};

inventory.addPlayerWeaponItem = function(itemId, count, ownerType, ownerId, countItems, isEquip = 0, params = "{}", text = 'Получено оружие', timeout = 10) {
    mp.events.callRemote('server:inventory:addPlayerWeaponItem', itemId, count, ownerType, ownerId, countItems, isEquip, params, text, timeout);
};

inventory.updateItemServer = function(itemId, count, ownerType, ownerId, countItems, prefix, number, keyId) {
    //TriggerServerEvent("ARP:Inventory:UpdateItem", id, itemId, ownerType, ownerId, countItems, prefix, number, keyId);
};

inventory.updateItemOwnerServer = function(id, ownerType, ownerId) {
    mp.events.callRemote('server:inventory:updateItemOwner', id, ownerType, ownerId);
};

inventory.updateItemCountServer = function(id, count) {
    mp.events.callRemote('server:inventory:updateItemCount', id, count);
};

inventory.addItemPosServer = function(itemId, pos, rot, count, ownerType, ownerId) {
    //TriggerServerEvent("ARP:Inventory:AddItemPos", itemId, pos.X, pos.Y, pos.Z, rot.X, rot.Y, rot.Z, count, ownerType, ownerId);
};

inventory.updateItemPosServer = function(id, itemId, pos, rot, ownerType, ownerId) {
    //TriggerServerEvent("ARP:Inventory:UpdateItemPos", id, itemId, pos.X, pos.Y, pos.Z, rot.X, rot.Y, rot.Z, ownerType, ownerId);
};

inventory.getItemList = function(ownerType, ownerId) {
    mp.events.callRemote('server:inventory:getItemList', ownerType, ownerId.toString());
};

inventory.getItemListSell = function() {
    mp.events.callRemote('server:inventory:getItemListSell');
};

inventory.getItemListSellFish = function(shopId = 0) {
    mp.events.callRemote('server:inventory:getItemListSellFish', shopId);
};

inventory.startFishing = function(isUpgrade) {

    if (!user.isCanFishing())
    {
        mp.game.ui.notifications.show("~r~Вы должны быть в океане, озёрах, реках или на рыбацких причалах");
        return;
    }
    if (mp.players.local.isSwimming())
    {
        mp.game.ui.notifications.show("~r~Вы не должны плавать");
        return;
    }
    if (mp.players.local.vehicle)
    {
        mp.game.ui.notifications.show("~r~Вы не должны быть в транспорте");
        return;
    }
    if (Container.Data.HasLocally(0, 'fish'))
    {
        mp.game.ui.notifications.show("~r~Вы уже рыбачите");
        return;
    }

    Container.Data.SetLocally(0, 'fish', true);
    user.playScenario("WORLD_HUMAN_STAND_FISHING_" + methods.getRandomInt(0, 4));
    setTimeout(async function () {

        try {
            let offset = 0;
            if (user.isCanFishingPearceOcean() || user.isCanFishingPearceAlamo())
                offset = 7;

            let rare = 0;
            if (methods.getRandomInt(0, 100) < 50 + offset)
                rare = 1;

            let type = 0;
            if (user.isInOcean() || user.isCanFishingPearceOcean())
                type = 1;
            let day = 2;
            if (weather.getHour() > 7)
                day = 1;

            if (isUpgrade) {
                if (methods.getRandomInt(0, 100) < 40 + offset)
                    rare = 2;
                if (methods.getRandomInt(0, 100) < 30 + offset)
                    rare = 3;
                if (methods.getRandomInt(0, 100) < 20 + offset)
                    rare = 4;
                if (methods.getRandomInt(0, 100) < 10 + offset)
                    rare = 5;
            }

            let tradeList = JSON.parse(await Container.Data.Get(-99, 'fishTrade'));
            let fishRandom = [];
            tradeList.forEach((item, idx) => {
                if (item[1] === rare && item[2] === type && (item[3] === day || item[3] === 0))
                    fishRandom.push(idx);
            });

            let fishId = tradeList[fishRandom[methods.getRandomInt(0, fishRandom.length)]][0];
            inventory.takeNewItem(fishId);

            if (fishId === 488)
                quest.fish(false, -1, 4);
            if (fishId === 528)
                quest.fish(false, -1, 6);
            if (fishId === 519)
                quest.fish(false, -1, 7);
            quest.fish(false, -1, 2);
        }
        catch (e) {
            methods.debug(e);
        }

        user.stopScenario();
        Container.Data.ResetLocally(0, 'fish');
    }, methods.getRandomInt(15000, 30000))
};


inventory.data = function(id, itemId, prop, model, pos, rot, ownerType, ownerId, count, isCreate, isDelete) {
    this.id = id;
    this.itemId = itemId;
    this.prop = prop;
    this.model = model;
    this.pos = pos;
    this.rot = rot;
    this.ownerType = ownerType;
    this.ownerId = ownerId;
    this.count = count;
    this.isCreate = isCreate;
    this.isDelete = isDelete;
};

inventory.types = {
    World : 0,
    Player : 1,
    BagArm : 2,
    Condo : 3,
    BagSmall : 4,
    House : 5,
    Apartment : 6,
    Bag : 7,
    Vehicle : 8,
    StockGov : 9,
    Fridge : 10,
    StockTakeWeap : 11,
    TradeBeach : 12,
    TradeBlack : 13,
    UserStockDef : 75,
    UserStock : 100,
    UserStockEnd : 200,
};

export default inventory;