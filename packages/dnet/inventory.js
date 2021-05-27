let Container = require('./modules/data');
let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let chat = require('./modules/chat');
let ctos = require('./modules/ctos');

let weather = require('./managers/weather');
let vSync = require('./managers/vSync');
let dispatcher = require('./managers/dispatcher');
let graffiti = require('./managers/graffiti');

let user = require('./user');
let enums = require('./enums');
let items = require('./items');
let weapons = require('./weapons');

let vehicles = require('./property/vehicles');
let fraction = require('./property/fraction');

let bank = require('./business/bank');

let inventory = exports;
let props = new Map();

inventory.loadAll = function() {

    mysql.executeQuery("DELETE FROM items WHERE owner_type = 0");
    mysql.executeQuery("DELETE FROM items WHERE owner_type = 9 AND owner_id = 2 AND timestamp_update < '" + (methods.getTimeStamp() - (60 * 60 * 24 * 7)) + "'");

    /*mysql.executeQuery(`SELECT * FROM items WHERE owner_type = 0 ORDER BY id DESC`, function (err, rows, fields) {
        rows.forEach(row => {

            let obj = mp.objects.new(items.getItemHashById(row['item_id']), new mp.Vector3(row['pos_x'], row['pos_y'], row['pos_z']),
            {
                rotation: new mp.Vector3(row['rot_x'], row['rot_x'], row['rot_x']),
                alpha: 255,
                dimension: 0
            });

            obj.setVariable('isDrop', row['id']);
            obj.setVariable('itemId', row['item_id']);
            props.set(row['id'].toString(), obj);
        });
    });*/
};

inventory.deleteWorldItems = function() {
    mysql.executeQuery("SELECT * FROM items WHERE owner_type = 0 AND timestamp_update < '" + (methods.getTimeStamp() - (60 * 60)) + "'", function (err, rows, fields) {
        rows.forEach(row => {
            inventory.deleteDropItem(row['id']);
        });
        mysql.executeQuery("DELETE FROM items WHERE owner_type = 0 AND timestamp_update < '" + (methods.getTimeStamp() - (60 * 60)) + "'");
    });
};

inventory.getItemList = function(player, ownerType, ownerId, isFrisk = false, justUpdate = false) {

    ownerId = methods.parseInt(ownerId);

    if (!user.isLogin(player))
        return;
    try {

        let data = [];
        //let data2 = new Map();

        let addWhere = '';
        /*if (isFrisk)
            addWhere = ' AND (item_id <> 50 AND item_id <> 27 AND item_id <> 28 AND item_id <> 29 AND item_id <> 30 AND item_id <> 265 AND item_id <> 266 AND item_id <> 267 AND item_id <> 268 AND item_id <> 269 AND item_id <> 270 AND item_id <> 271 AND item_id <> 272 AND item_id <> 273 AND item_id <> 274)';*/

        //SELECT * FROM items WHERE owner_id = '1' AND owner_type = '1' ORDER BY is_equip DESC, item_id DESC LIMIT 400
        let sql = `SELECT * FROM items WHERE owner_id = '${ownerId}' AND owner_type = '${ownerType}'${addWhere} ORDER BY is_equip DESC, item_id DESC`;
        if (ownerType === 1 && ownerId === user.getId(player))
            sql = `SELECT * FROM items WHERE owner_id = '${ownerId}' AND owner_type = '${ownerType}'${addWhere} ORDER BY is_equip DESC, item_id DESC LIMIT 400`;
        if (ownerId == 0 && ownerType == 0)
            sql = `SELECT * FROM items WHERE DISTANCE(POINT(pos_x, pos_y), POINT(${player.position.x}, ${player.position.y})) < 2 AND owner_type = 0 ORDER BY is_equip DESC, item_id DESC LIMIT 400`;

        mysql.executeQuery(sql, function (err, rows, fields) {
            rows.forEach(row => {

                let label = "";

                if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                    label = row['prefix'] + "-" + row['number'];
                } else if (row['key_id'] > 0) {

                    if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                        if (row['prefix'] == 1)
                            label = enums.clothF[row['key_id']][9];
                        else
                            label = enums.clothM[row['key_id']][9];
                    }
                    else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                        if (row['prefix'] == 1)
                            label = enums.propF[row['key_id']][5];
                        else
                            label = enums.propM[row['key_id']][5];
                    }
                    else {
                        label = "#" + row['key_id'];
                    }
                }

                /*if (isTie && items.isWeapon(row['item_id']) && row['is_equip'])
                    return;*/

                data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
            });
            //player.call('client:showToPlayerItemListMenu', [data.slice(0, 300), ownerType, ownerId.toString(), isFrisk]);

            for (let i = 0; i < methods.parseInt(data.length / 300) + 1; i++) {
                if (i === 0)
                    player.call('client:showToPlayerItemListMenu', [data.slice(i * 300, i * 300 + 299), ownerType, ownerId.toString(), isFrisk, justUpdate]);
                else
                    player.call('client:showToPlayerItemListAddMenu', [data.slice(i * 300, i * 300 + 299), ownerType, ownerId.toString(), isFrisk]);
            }
        });
    } catch(e) {
        methods.debug(e);
    }
};

inventory.getItemListSell = function(player) {

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        try {

            let data = [];
            //let data2 = new Map();

            let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 ORDER BY item_id DESC LIMIT 400`;

            mysql.executeQuery(sql, function (err, rows, fields) {
                rows.forEach(row => {

                    let label = "";

                    if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                        label = row['prefix'] + "-" + row['number'];
                    } else if (row['key_id'] > 0) {

                        if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                            if (row['prefix'] == 1)
                                label = enums.clothF[row['key_id']][9];
                            else
                                label = enums.clothM[row['key_id']][9];
                        }
                        else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                            if (row['prefix'] == 1)
                                label = enums.propF[row['key_id']][5];
                            else
                                label = enums.propM[row['key_id']][5];
                        }
                        else {
                            label = "#" + row['key_id'];
                        }
                    }

                    data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
                });

                player.call('client:showSellItemsMenu', [data]);
            });
        } catch(e) {
            methods.debug(e);
        }
    }, 1000);
};

inventory.getItemListTrade = function(player, ownerId, ownerType) {

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        try {

            let data = [];
            //let data2 = new Map();

            let sql = `SELECT * FROM items WHERE owner_id = '${ownerId}' AND owner_type = '${ownerType}' AND price > 0 ORDER BY item_id DESC LIMIT 400`;

            mysql.executeQuery(sql, function (err, rows, fields) {
                rows.forEach(row => {

                    let label = "";

                    if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                        label = row['prefix'] + "-" + row['number'];
                    } else if (row['key_id'] > 0) {

                        if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                            if (row['prefix'] == 1)
                                label = enums.clothF[row['key_id']][9];
                            else
                                label = enums.clothM[row['key_id']][9];
                        }
                        else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                            if (row['prefix'] == 1)
                                label = enums.propF[row['key_id']][5];
                            else
                                label = enums.propM[row['key_id']][5];
                        }
                        else {
                            label = "#" + row['key_id'];
                        }
                    }

                    data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], price: row['price'], params: row['params']});
                });
                
                if (data.length > 0)
                    player.call('client:showTradeMenu', [data, ownerId, ownerType]);
                else 
                    player.notify('~r~В данный момент нет товаров')
            });
        } catch(e) {
            methods.debug(e);
        }
    }, 10);
};

inventory.getItemListGunTranferSell = function(player) {
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        try {

            let data = [];
            //let data2 = new Map();

            let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 AND (item_id > 69 AND item_id < 127 OR item_id = 146 OR item_id = 147)  ORDER BY item_id DESC LIMIT 400`;

            mysql.executeQuery(sql, function (err, rows, fields) {
                rows.forEach(row => {

                    let label = "";

                    if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                        label = row['prefix'] + "-" + row['number'];
                    } else if (row['key_id'] > 0) {

                        if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                            if (row['prefix'] == 1)
                                label = enums.clothF[row['key_id']][9];
                            else
                                label = enums.clothM[row['key_id']][9];
                        }
                        else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                            if (row['prefix'] == 1)
                                label = enums.propF[row['key_id']][5];
                            else
                                label = enums.propM[row['key_id']][5];
                        }
                        else {
                            label = "#" + row['key_id'];
                        }
                    }

                    data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
                });

                player.call('client:showSellGunMenu', [data]);
            });
        } catch(e) {
            methods.debug(e);
        }
    }, 1000);
};

inventory.getItemListGunFix = function(player) {
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        try {

            let data = [];
            //let data2 = new Map();

            let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 AND (item_id > 69 AND item_id < 127 OR item_id = 146 OR item_id = 147 OR item_id = 252)  ORDER BY item_id DESC LIMIT 400`;

            mysql.executeQuery(sql, function (err, rows, fields) {
                rows.forEach(row => {

                    let label = "";

                    if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                        label = row['prefix'] + "-" + row['number'];
                    } else if (row['key_id'] > 0) {

                        if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                            if (row['prefix'] == 1)
                                label = enums.clothF[row['key_id']][9];
                            else
                                label = enums.clothM[row['key_id']][9];
                        }
                        else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                            if (row['prefix'] == 1)
                                label = enums.propF[row['key_id']][5];
                            else
                                label = enums.propM[row['key_id']][5];
                        }
                        else {
                            label = "#" + row['key_id'];
                        }
                    }

                    data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
                });

                player.call('client:showFixGunMenu', [data]);
            });
        } catch(e) {
            methods.debug(e);
        }
    }, 1000);
};

inventory.getItemListGunColor = function(player) {
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        try {

            let data = [];
            //let data2 = new Map();

            let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 AND (item_id > 69 AND item_id < 127 OR item_id = 146 OR item_id = 147) ORDER BY item_id DESC LIMIT 400`;

            mysql.executeQuery(sql, function (err, rows, fields) {
                rows.forEach(row => {

                    let label = "";

                    if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                        label = row['prefix'] + "-" + row['number'];
                    } else if (row['key_id'] > 0) {

                        if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                            if (row['prefix'] == 1)
                                label = enums.clothF[row['key_id']][9];
                            else
                                label = enums.clothM[row['key_id']][9];
                        }
                        else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                            if (row['prefix'] == 1)
                                label = enums.propF[row['key_id']][5];
                            else
                                label = enums.propM[row['key_id']][5];
                        }
                        else {
                            label = "#" + row['key_id'];
                        }
                    }

                    data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
                });

                player.call('client:showColorGunMenu', [data]);
            });
        } catch(e) {
            methods.debug(e);
        }
    }, 1000);
};

inventory.getItemListGunFixFree = function(player) {
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        try {

            let data = [];
            //let data2 = new Map();

            let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 AND (item_id > 69 AND item_id < 127 OR item_id = 146 OR item_id = 147 OR item_id = 252)  ORDER BY item_id DESC LIMIT 400`;

            mysql.executeQuery(sql, function (err, rows, fields) {
                rows.forEach(row => {

                    let label = "";

                    if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                        label = row['prefix'] + "-" + row['number'];
                    } else if (row['key_id'] > 0) {

                        if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                            if (row['prefix'] == 1)
                                label = enums.clothF[row['key_id']][9];
                            else
                                label = enums.clothM[row['key_id']][9];
                        }
                        else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                            if (row['prefix'] == 1)
                                label = enums.propF[row['key_id']][5];
                            else
                                label = enums.propM[row['key_id']][5];
                        }
                        else {
                            label = "#" + row['key_id'];
                        }
                    }

                    data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
                });

                player.call('client:showFixGunFreeMenu', [data]);
            });
        } catch(e) {
            methods.debug(e);
        }
    }, 1000);
};

inventory.getItemListClothTranferSell = function(player) {
    if (!user.isLogin(player))
        return;
    try {

        let data = [];
        //let data2 = new Map();

        let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 AND (item_id = 265 OR item_id = 266 OR item_id = 267 OR item_id = 269 OR item_id = 274) ORDER BY item_id DESC LIMIT 400`;

        mysql.executeQuery(sql, function (err, rows, fields) {
            rows.forEach(row => {

                let label = "";

                if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                    label = row['prefix'] + "-" + row['number'];
                } else if (row['key_id'] > 0) {

                    if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                        if (row['prefix'] == 1)
                            label = enums.clothF[row['key_id']][9];
                        else
                            label = enums.clothM[row['key_id']][9];
                    }
                    else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                        if (row['prefix'] == 1)
                            label = enums.propF[row['key_id']][5];
                        else
                            label = enums.propM[row['key_id']][5];
                    }
                    else {
                        label = "#" + row['key_id'];
                    }
                }

                data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
            });

            player.call('client:showSellClothMenu', [data]);
        });
    } catch(e) {
        methods.debug(e);
    }
};

inventory.getItemListSellFish = function(player, shopId) {
    if (!user.isLogin(player))
        return;
    try {

        let data = [];
        //let data2 = new Map();

        let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 AND (item_id > 486 AND item_id < 537) ORDER BY item_id DESC LIMIT 400`;

        mysql.executeQuery(sql, function (err, rows, fields) {
            rows.forEach(row => {

                let label = "";

                if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                    label = row['prefix'] + "-" + row['number'];
                } else if (row['key_id'] > 0) {

                    if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                        if (row['prefix'] == 1)
                            label = enums.clothF[row['key_id']][9];
                        else
                            label = enums.clothM[row['key_id']][9];
                    }
                    else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                        if (row['prefix'] == 1)
                            label = enums.propF[row['key_id']][5];
                        else
                            label = enums.propM[row['key_id']][5];
                    }
                    else {
                        label = "#" + row['key_id'];
                    }
                }

                data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
            });

            player.call('client:showSellFishMenu', [data, shopId]);
        });
    } catch(e) {
        methods.debug(e);
    }
};

inventory.unEquip = function(player, id, itemId) {
    if (!user.isLogin(player))
        return;

    if (itemId === 50) {
        let money = user.getBankMoney(player);
        user.set(player, 'bank_card', 0);
        user.set(player, 'bank_owner', '');
        user.set(player, 'bank_pin', 0);
        user.setBankMoney(player, 0);
        inventory.updateItemCount(id, money);
        user.save(player);
    }
};

inventory.upgradeWeapon = function(player, id, itemId, weaponStr) {

    if (!user.isLogin(player))
        return;
    try {

        let sql = `SELECT * FROM items WHERE id = ${id} AND owner_id = ${user.getId(player)} AND owner_type = ${inventory.types.Player}`;

        mysql.executeQuery(sql, function (err, rows, fields) {
            if (rows.length === 0) {
                player.notify('~r~Этот предмет Вам не принадлежит');
                return;
            }

            let weapon = JSON.parse(weaponStr);

            let wpName = items.getItemNameHashById(weapon.item_id);
            let wpHash = weapons.getHashByName(wpName);

            let wpModifer = items.getItemNameHashById(itemId);
            let hashModifer = items.getItemHashModiferById(itemId);

            if (wpModifer != wpName) {
                player.notify(`~r~Данная модификация не подходит к этому оружию`);
                return;
            }

            let wpSlot = weapons.getUpgradeSlot(wpName, hashModifer);

            if (wpSlot == 1) {
                if (weapon.params.slot1) {
                    player.notify(`~r~Слот уже занят`);
                    return;
                }
                weapon.params.slot1 = true;
                weapon.params.slot1hash = hashModifer;
            }
            if (wpSlot == 2) {
                if (weapon.params.slot2) {
                    player.notify(`~r~Слот уже занят`);
                    return;
                }
                weapon.params.slot2 = true;
                weapon.params.slot2hash = hashModifer;
            }
            if (wpSlot == 3) {
                if (weapon.params.slot3) {
                    player.notify(`~r~Слот уже занят`);
                    return;
                }
                weapon.params.slot3 = true;
                weapon.params.slot3hash = hashModifer;
            }
            if (wpSlot == 4) {
                if (weapon.params.slot4) {
                    player.notify(`~r~Слот уже занят`);
                    return;
                }
                weapon.params.slot4 = true;
                weapon.params.slot4hash = hashModifer;
            }

            if (wpSlot == -1) {
                player.notify(`~r~Произошла неизвестная ошибка #weapon`);
                return;
            }

            user.giveWeaponComponent(player, methods.parseInt(wpHash), methods.parseInt(hashModifer));

            inventory.updateItemParams(weapon.id, JSON.stringify(weapon.params));
            inventory.deleteItem(id);

            user.callCef(player, 'inventory', JSON.stringify({ type: 'removeItemId', itemId: id }));
            user.callCef(player, 'inventory', JSON.stringify({ type: 'updateWeaponParams', itemId: weapon.id, params: weapon.params }));
        });
    } catch (e) {

    }
};

inventory.fixItem = function(player, id) {
    if (!user.isLogin(player))
        return;
    try {
        let sql = `SELECT * FROM items WHERE item_id = 476 AND owner_id = ${user.getId(player)} AND owner_type = ${inventory.types.Player} LIMIT 1`;
        mysql.executeQuery(sql, function (err, rows, fields) {
            if (rows.length === 0) {
                player.notify('~r~У вас нет стальных пластин');
                return;
            }
            inventory.updateItemCount(id, 100);
            inventory.deleteItem(rows[0]['id']);
            player.notify('~y~Вы выполнили починку');
        });
    } catch (e) {

    }
};

inventory.colorItem = function(player, id, tint, sTint) {
    if (!user.isLogin(player))
        return;
    try {
        let count = 5;
        if (methods.parseInt(sTint) !== 0)
            count = 10;
        let sql = `SELECT * FROM items WHERE item_id = 477 AND owner_id = ${user.getId(player)} AND owner_type = ${inventory.types.Player}`;
        mysql.executeQuery(sql, function (err, rows, fields) {
            if (rows.length < count) {
                player.notify(`~r~У вас столько балончиков. Необходимо: ${count}шт.`);
                return;
            }

            mysql.executeQuery(`SELECT params FROM items WHERE id = ${id} LIMIT 1`, function (err, rows2, fields) {
                if (rows2.length === 0) {
                    player.notify('~r~Оружие не было найдено');
                    return;
                }
                try {
                    let params = JSON.parse(rows2[0]['params']);
                    params.tint = tint;
                    if (sTint !== 0)
                        params.superTint = methods.parseInt(sTint);
                    inventory.updateItemParams(id, JSON.stringify(params));

                    rows.forEach((row, idx) => {
                        if (count > idx)
                            inventory.deleteItem(row['id']);
                    });

                    player.notify('~g~Вы выполнили покраску');
                }
                catch (e) {
                    player.notify('~y~Произошла ошибка покраски');
                }
            });
        });
    } catch (e) {

    }
};

inventory.fixItemFree = function(player, id) {
    if (!user.isLogin(player))
        return;
    try {
        inventory.updateItemCount(id, 100);
        player.notify('~y~Вы выполнили починку');
    } catch (e) {

    }
};

inventory.craft = function(player, id, itemId, countItems, count, params) {

    if (!user.isLogin(player))
        return;
    try {
        let sql2 = '';

        items.recipes[id].craft.forEach(item => {
            sql2 += ` OR item_id=${item}`;
        });

        let sql = `SELECT * FROM items WHERE owner_id = ${user.getId(player)} AND owner_type = ${inventory.types.Player} AND (item_id = '-1' ${sql2})`;
        mysql.executeQuery(sql, function (err, rows, fields) {
            if (rows.length === 0) {
                player.notify('~r~У вас нет всех компонентов для крафта');
                inventory.getItemList(player, inventory.types.Player, user.getId(player));
                return;
            }

            items.recipes[id].craft.forEach(item => {
                setTimeout(function () {
                    inventory.deleteUserItemByItemId(inventory.types.Player, user.getId(player), item, 0, 1);
                }, methods.getRandomInt(1, 500))
            });

            inventory.addItem(itemId, countItems, inventory.types.Player, user.getId(player), count, 0, params);
            setTimeout(function () {
                inventory.getItemList(player, inventory.types.Player, user.getId(player));
            }, 1000);
        });
    } catch (e) {

    }
};

inventory.equip = function(player, id, itemId, count, aparams) {

    if (!user.isLogin(player))
        return;
    try {

        let sql = `SELECT * FROM items WHERE id = ${id} AND owner_id = ${user.getId(player)} AND owner_type = ${inventory.types.Player}`;
        if (itemId === 264 || itemId === 263 || itemId === 252)
            sql = `SELECT * FROM items WHERE id = ${id}`;

        mysql.executeQuery(sql, function (err, rows, fields) {
            if (rows.length === 0) {
                player.notify('~r~Этот предмет Вам не принадлежит');
                return;
            }

            if (rows[0]['is_equip'] === 1 && itemId === 50) {
                player.notify('~r~Карта уже экипирована');
                return;
            }

            methods.saveLog('log_inventory',
                ['type', 'text'],
                ['EQUIP', `id:${id}, itemId:${itemId}, count:${count}, params:${aparams}`],
            );

            inventory.deleteItemByUsers(id);
            inventory.deleteDropItem(id);
            inventory.updateOwnerId(id, user.getId(player), inventory.types.Player);

            let params = {};

            try {
                params = JSON.parse(aparams);
            }
            catch (e) {
                methods.debug(e);
            }

            if (itemId == 50) {
                if (user.get(player, 'bank_card') == 0) {
                    user.set(player, 'bank_card', methods.parseInt(params.number));
                    user.set(player, 'bank_owner', params.owner);
                    user.set(player, 'bank_pin', methods.parseInt(params.pin));
                    user.setBankMoney(player, methods.parseFloat(rows[0]['count']));
                    user.save(player);
                }
                else {
                    player.notify("~r~Карта уже экипирована, для начала снимите текущую");
                    return;
                }
            }
            else if (itemId >= 27 && itemId <= 30) {
                if (user.get(player, 'phone_type') === 0) {
                    user.set(player, 'phone', methods.parseInt(params.number));
                    user.set(player, 'phone_type', methods.parseInt(params.type));
                    user.set(player, 'phone_bg', methods.parseInt(params.bg));
                    user.save(player);
                }
                else {
                    player.notify("~r~Телефон уже экипирован, для начала снимите текущий");
                    return;
                }
            }
            else if (items.isWeapon(itemId)) {

                try {
                    let slot = weapons.getGunSlotIdByItem(itemId);
                    if (user.get(player, 'weapon_' + slot) == '') {

                        user.set(player, 'weapon_' + slot, params.serial);
                        user.set(player, 'weapon_' + slot + '_ammo', 0);

                        user.giveWeapon(player, items.getItemNameHashById(itemId), 0);
                        user.callCef(player, 'inventory', JSON.stringify({type: "updateSelectWeapon", selectId: id}));

                        let wpHash = weapons.getHashByName(items.getItemNameHashById(itemId));

                        player.removeAllWeaponComponents(wpHash);
                        player.setWeaponTint(wpHash, 0);

                        if (params.slot1)
                            player.giveWeaponComponent(wpHash, params.slot1hash);
                        if (params.slot2)
                            player.giveWeaponComponent(wpHash, params.slot2hash);
                        if (params.slot3)
                            player.giveWeaponComponent(wpHash, params.slot3hash);
                        if (params.slot4)
                            player.giveWeaponComponent(wpHash, params.slot4hash);
                        if (params.superTint)
                            player.giveWeaponComponent(wpHash, params.superTint);
                        if (params.tint)
                            player.setWeaponTint(wpHash, params.tint);

                        user.updateClientCache(player);
                        user.save(player);
                    }
                    else {
                        user.callCef(player, 'inventory', JSON.stringify({type: "weaponToInventory", itemId: id}));
                        player.notify("~r~Слот под оружие уже занят");
                        return;
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }
            else if (itemId == 264 || itemId == 263) {
                user.set(player, "hand", params.hand);
                user.set(player, "hand_color", params.hand_color);
                user.updateCharacterCloth(player);
                user.save(player);
            }
            else if (itemId == 275) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }
                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "gloves", params.gloves);
                user.set(player, "gloves_color", params.gloves_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 265) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);

                user.set(player, "torso", params.torso);
                user.set(player, "torso_color", params.torso_color);
                user.set(player, "body", params.body);
                user.set(player, "body_color", params.body_color);
                user.set(player, "parachute", params.parachute);
                user.set(player, "parachute_color", params.parachute_color);
                user.set(player, "decal", 0);
                user.set(player, "decal_color", 0);
                user.set(player, "tprint_o", params.tprint_o);
                user.set(player, "tprint_c", params.tprint_c);

                user.updateCharacterCloth(player);
                user.updateTattoo(player);
            }
            else if (itemId == 266) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }
                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "leg", params.leg);
                user.set(player, "leg_color", params.leg_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 267) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "foot", params.foot);
                user.set(player, "foot_color", params.foot_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 268) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "accessorie", params.accessorie);
                user.set(player, "accessorie_color", params.accessorie_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 269) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "hat", params.hat);
                user.set(player, "hat_color", params.hat_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 270) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "glasses", params.glasses);
                user.set(player, "glasses_color", params.glasses_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 271) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "ear", params.ear);
                user.set(player, "ear_color", params.ear_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 272) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "watch", params.watch);
                user.set(player, "watch_color", params.watch_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 273) {

                if (params.sex !== user.getSex(player)) {
                    player.notify("~r~Одежда подходит только для противоположного");
                    return;
                }

                inventory.updateItemsEquipByItemId(itemId, user.getId(player), inventory.types.Player, 0);
                user.set(player, "bracelet", params.bracelet);
                user.set(player, "bracelet_color", params.bracelet_color);
                user.updateCharacterCloth(player);
            }
            else if (itemId == 274) {
                if (user.get(player, 'mask') == -1) {
                    user.set(player, "mask", params.mask);
                    user.set(player, "mask_color", 1);
                    user.updateCharacterCloth(player);
                    user.updateCharacterFace(player);
                    user.playAnimation(player, 'mp_masks@on_foot', 'put_on_mask', 48);
                }
                else {
                    player.notify("~r~Одежда уже экипирована, для начала снимите текущую");
                    return;
                }
            }
            else if (itemId == 252) {
                user.set(player, "armor", params.armor);
                user.set(player, "armor_color", params.armor_color);
                if (user.get(player, 'parachute_color') !== 170 &&
                    user.get(player, 'parachute_color') !== 172 &&
                    user.get(player, 'parachute_color') !== 207 &&
                    user.get(player, 'parachute_color') !== 210
                )
                    user.setComponentVariation(player, 9, params.armor, params.armor_color);
                user.setArmour(player, methods.parseInt(rows[0]['count']));
            }

            user.updateClientCache(player);
            setTimeout(function () {
                try {
                    inventory.updateEquipStatus(id, true);
                }
                catch (e) {}
            }, 1000)
        });
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateEquipStatus = function(id, status) {
    try {
        let newStatus = 0;
        if (status == true)
            newStatus = 1;
        mysql.executeQuery(`UPDATE items SET is_equip = '${newStatus}' WHERE id = '${methods.parseInt(id)}'`);
    }
    catch (e) {
        methods.debug('inventory.updateEquipStatus', e);
    }
};

inventory.updateItemsEquipByItemId = function(itemId, ownerId, ownerType, equip, count = -1) {
    try {
        if (count >= 0)
            mysql.executeQuery(`UPDATE items SET is_equip = '${equip}', count = '${count}' where item_id = '${itemId}' AND is_equip = '${(equip === 0 ? 1 : 0)}' AND owner_type = '${ownerType}' AND owner_id = '${ownerId}'`);
        else
            mysql.executeQuery(`UPDATE items SET is_equip = '${equip}' where item_id = '${itemId}' AND owner_type = '${ownerType}' AND owner_id = '${ownerId}'`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateOwnerId = function(id, ownerId, ownerType) {
    try {
        mysql.executeQuery(`UPDATE items SET owner_type = '${ownerType}', owner_id = '${methods.parseInt(ownerId)}' where id = '${id}'`);

        methods.saveLog('log_inventory',
            ['type', 'text'],
            ['UPDATE_OWNER', `id:${id}, ownerId:${ownerId}, ownerType:${ownerType}`],
        );
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateOwnerIdWithPrice = function(id, ownerId, ownerType, price) {
    try {
        mysql.executeQuery(`UPDATE items SET owner_type = '${ownerType}', owner_id = '${methods.parseInt(ownerId)}', price = '${methods.parseInt(price)}' where id = '${id}'`);

        methods.saveLog('log_inventory',
            ['type', 'text'],
            ['UPDATE_OWNER', `id:${id}, ownerId:${ownerId}, ownerType:${ownerType}, price:${price}`],
        );
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateOwnerAll = function(oldOwnerId, oldOwnerType, ownerId, ownerType) {
    try {
        mysql.executeQuery(`UPDATE items SET owner_type = '${ownerType}', owner_id = '${methods.parseInt(ownerId)}' where owner_type = '${oldOwnerType}' AND owner_id = '${methods.parseInt(oldOwnerId)}' AND is_equip = '0'`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateItemParams = function(id, params) {
    try {
        mysql.executeQuery(`UPDATE items SET params = '${params}' where id = '${methods.parseInt(id)}'`);

        methods.saveLog('log_inventory',
            ['type', 'text'],
            ['UPDATE_PARAMS', `id:${id}, params:${params}`],
        );
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateItemCount = function(id, count) {
    try {
        mysql.executeQuery(`UPDATE items SET count = '${count}', timestamp_update = '${methods.getTimeStamp()}' where id = '${id}'`);

        methods.saveLog('log_inventory',
            ['type', 'text'],
            ['UPDATE_COUNT', `id:${id}, count:${count}`],
        );
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateItemCountByItemId = function(itemId, count, ownerId, ownerType = 1, isEquip = 1) {
    try {
        mysql.executeQuery(`UPDATE items SET count = '${count}', timestamp_update = '${methods.getTimeStamp()}' where item_id = '${itemId}' AND is_equip = '${isEquip}' AND owner_id = '${ownerId}' AND owner_type = '${ownerType}'`);

        methods.saveLog('log_inventory',
            ['type', 'text'],
            ['UPDATE_COUNT', `itemId:${itemId}, ownerType:${ownerType}, ownerId:${ownerId}, count:${count}`],
        );
    } catch(e) {
        methods.debug(e);
    }
};

inventory.getPlayerInvAmountMax = function(player) {
    if (user.isLogin(player) && user.get(player, 'vip_type') === 2)
        return 35001;
    return 30001;
};

inventory.updateAmount = function(player, ownerId, ownerType) { // Фикс хуйни, котороая просто поломала все, заметочка никогда не писать код когда ты очень сильно хочешь спать.

    if (!user.isLogin(player))
        return;

    ownerId = methods.parseInt(ownerId);
    let data = new Map();
    mysql.executeQuery(`SELECT * FROM items WHERE owner_id = '${ownerId}' AND owner_type = '${ownerType}' AND is_equip = 0`, function (err, rows, fields) {
        rows.forEach(row => {
            data.set(row['id'].toString(), row["item_id"]);
        });
        try {
            player.call('client:inventory:sendToPlayerItemListUpdateAmountMenu', [Array.from(data), ownerType, ownerId]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

inventory.dropItem = function(player, id, itemId, posX, posY, posZ, rotX, rotY, rotZ) {
    if (!user.isLogin(player))
        return;
    try {

        if (vehicles.exists(player.vehicle)) {
            player.notify('~r~Вы находитесь в транспорте');
            inventory.getItemList(player, inventory.types.Player, user.getId(player));
            return;
        }
        if (player.isJumping) {
            player.notify('~r~Вы не должны прыгать');
            inventory.getItemList(player, inventory.types.Player, user.getId(player));
            return;
        }
        inventory.dropItemJust(id, itemId, posX, posY, posZ, rotX, rotY, player.heading);

    } catch(e) {
        methods.debug(e);
    }
};

inventory.dropItemJust = function(id, itemId, posX, posY, posZ, rotX, rotY, rotZ) {

    try {
        if (props.has(id.toString()))
            return;

        let heading = rotZ;
        let rot = new mp.Vector3(0, 0, heading);

        switch (itemId) {
            case 1:
            case 2:
            case 8:
            case 50:
            case 154:
            case 156:
            case 158:
            case 159:
            case 160:
            case 171:
            case 172:
            case 173:
            case 176:
            case 177:
            case 178:
            case 251:
            case 252:
                rot = new mp.Vector3(-90, 0, heading);
                break;
        }

        if(itemId >= 27 && itemId <= 30)
            rot = new mp.Vector3(-90, 0, heading);
        if(itemId >= 54 && itemId <= 126)
            rot = new mp.Vector3(-90, 0, heading);
        if(itemId === 252)
            rot = new mp.Vector3(-90, -90, heading);

        //eval mp.game.invoke('0x5006D96C995A5827', -50000.0,-50000.0,-100.0); mp.game.invoke('0x5006D96C995A5827', 50000.0,50000.0,10000.0);
        //eval mp.game.invoke('0x5006D96C995A5827', -5000.0,-5000.0,-10.0); mp.game.invoke('0x5006D96C995A5827', 5000.0,5000.0,100.0);

        let obj = mp.objects.new(
            items.getItemHashById(itemId),
            new mp.Vector3(posX + (methods.getRandomInt(-100, 100) / 200), posY + (methods.getRandomInt(-100, 100) / 200), posZ - 0.98),
            {
                rotation: rot,
                alpha: 255,
                dimension: 0
            });

        obj.setVariable('isDrop', id);
        obj.setVariable('itemId', itemId);

        posX = obj.position.x;
        posY = obj.position.y;
        posZ = obj.position.z;

        rotX = rot.x;
        rotY = rot.y;
        rotZ = rot.z;

        props.set(id.toString(), obj);
        mysql.executeQuery(`UPDATE items SET owner_type = 0, owner_id = 0, is_equip = 0, pos_x = ${posX}, pos_y = ${posY}, pos_z = ${posZ}, rot_x = ${rotX}, rot_y = ${rotY}, rot_z = ${rotZ}, timestamp_update = ${methods.getTimeStamp()} where id = ${id}`);

    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteDropItem = function(id) {
    try {
        let entity = props.get(id.toString());
        if (mp.objects.exists(entity))
            entity.destroy();
    } catch(e) {
        methods.debug(e);
    }
    
    try {
        props.delete(id.toString());
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.deleteItem = function(id) {
    try {
        mysql.executeQuery(`DELETE FROM items WHERE id = ${id}`);
        inventory.deleteDropItem(id);
        inventory.deleteItemByUsers(id);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteItemByItemId = function(id, isEquip = 0, limit = -1) {
    try {
        if (limit > 0) {
            mysql.executeQuery(`SELECT * FROM items WHERE item_id = ${id} AND is_equip = ${isEquip} LIMIT ${limit}`, function (err, rows, fields) {
                rows.forEach(row => {
                    mysql.executeQuery(`DELETE FROM items WHERE id = ${row['id']}`);
                })
            });
        }
        else
            mysql.executeQuery(`DELETE FROM items WHERE item_id = ${id} AND is_equip = ${isEquip}`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteUserItemByItemId = function(ownerType, ownerId, id, isEquip = 0, limit = -1) {
    try {
        if (limit > 0) {
            mysql.executeQuery(`SELECT * FROM items WHERE owner_id = ${ownerId} AND owner_type = ${ownerType} AND item_id = ${id} AND is_equip = ${isEquip} LIMIT ${limit}`, function (err, rows, fields) {
                rows.forEach(row => {
                    mysql.executeQuery(`DELETE FROM items WHERE id = ${row['id']}`);
                })
            });
        }
        else
            mysql.executeQuery(`DELETE FROM items WHERE owner_id = ${ownerId} AND owner_type = ${ownerType} AND item_id = ${id} AND is_equip = ${isEquip}`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteItemByUsers = function(id) {
    try {
        let data = JSON.stringify({type: 'deleteItemById', id: id});
        mp.players.forEach(p => {
            if (user.isLogin(p))
                user.callCef(p, 'inventory', data);
        });
    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteItemsRange = function(player, itemIdFrom, itemIdTo) {
    try {
        if (!user.isLogin(player))
            return;
        mysql.executeQuery(`DELETE FROM items WHERE item_id >= ${itemIdFrom} AND item_id <= ${itemIdTo} AND owner_id = ${user.getId(player)} AND owner_type = 1`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteItemsByItemId = function(itemId) {
    try {
        mysql.executeQuery(`DELETE FROM items WHERE item_id = ${itemId}`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.addItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    if (items.isWeapon(itemId))
        inventory.addWeaponItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
    else if (items.isAmmo(itemId))
        inventory.addAmmoItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
    else if (itemId === 252)
        inventory.addArmourItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
    else
        inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
};

inventory.addPlayerWeaponItem = function(player, itemId, count, ownerType, ownerId, countItems, isEquip, params, text = 'Выдано оружие', timeout = 1) {
    let serial = weapons.getWeaponSerial(itemId);
    let paramsObject = JSON.parse(params);
    paramsObject.serial = serial;
    if (items.isAmmo(itemId))
        inventory.addAmmoItem(itemId, count, ownerType, ownerId, countItems, isEquip, JSON.stringify(paramsObject), timeout);
    else
        inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, JSON.stringify(paramsObject), timeout);
    user.addHistory(player, 5, `${text} ${items.getItemNameById(itemId)} (${serial})`);
};

inventory.addWeaponItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    let serial = weapons.getWeaponSerial(itemId);
    let paramsObject = JSON.parse(params);
    paramsObject.serial = serial;
    inventory.addItemSql(itemId, count, ownerType, ownerId, 100, isEquip, JSON.stringify(paramsObject), timeout);
};

inventory.addArmourItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    let paramsObject = JSON.parse(params);
    let armourNames = ['Серый', 'Чёрный', 'Зелёный', 'Камуфляжный', 'Зел. камуфляжный'];
    let armor = 12;
    let color = methods.getRandomInt(0, 5);
    if (methods.getRandomInt(0, 2) === 0) {
        armor = 28;
        color = methods.getRandomInt(0, 10);
    }

    if (paramsObject.armor)
        armor = paramsObject.armor;
    if (paramsObject.armor_color >= 0)
        color = paramsObject.armor_color;

    paramsObject.armor = armor;
    paramsObject.armor_color = color;

    if (armor === 28)
        armourNames = ['Зелёный', 'Оранжевый', 'Фиолетовый', 'Розовый', 'Красный', 'Синий', 'Серый', 'Бежевый', 'Белый', 'Чёрный'];

    paramsObject.name = `${armourNames[color]} бронежилет`;
    inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, JSON.stringify(paramsObject), timeout);
};

inventory.addAmmoItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    inventory.addItemSql(itemId, count, ownerType, ownerId, items.getAmmoCount(itemId), isEquip, params, timeout);
};

inventory.addItemSql = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {

    setTimeout(function () {
        try {
            for (let i = 0; i < count; i++) {
                mysql.executeQuery(`INSERT INTO items (item_id, owner_type, owner_id, count, is_equip, params, timestamp_update) VALUES ('${itemId}', '${ownerType}', '${ownerId}', '${countItems}', '${isEquip}', '${params}', '${methods.getTimeStamp()}')`);
            }

            methods.saveLog('log_inventory',
                ['type', 'text'],
                ['ADD_NEW', `itemId:${itemId}, count:${count}, ownerType:${ownerType}, ownerId:${ownerId}, countItems:${countItems}, params:${params}`],
            );
        } catch(e) {
            methods.debug(e);
        }
    }, timeout);
};

inventory.addWorldItem = function(itemId, count, countItems, posx, posy, posz, rotx, roty, rotz, params, timeout = 1) {

    setTimeout(function () {
        try {
            for (let i = 0; i < count; i++) {
                let timeStamp = methods.getTimeStamp();
                mysql.executeQuery(`INSERT INTO items (item_id, owner_type, owner_id, count, is_equip, params, timestamp_update) VALUES ('${itemId}', '0', '0', '${countItems}', '0', '${params}', '${timeStamp}')`);

                setTimeout(function () {
                    mysql.executeQuery(`SELECT id FROM items WHERE owner_type='0' AND owner_id='0' AND item_id='${itemId}' AND timestamp_update='${timeStamp}' ORDER BY item_id DESC`, function (err, rows, fields) {
                        rows.forEach(row => {
                            inventory.dropItemJust(row['id'], itemId, posx, posy, posz, rotx, roty, rotz);
                        });
                    });
                })
            }

            methods.saveLog('log_inventory',
                ['type', 'text'],
                ['ADD_NEW', `itemId:${itemId}, count:${count}, ownerType:${0}, ownerId:${0}, countItems:${countItems}, params:${params}`],
            );
        } catch(e) {
            methods.debug(e);
        }
    }, timeout);
};

inventory.dropWeaponItem = function(player, itemId, posx, posy, posz, rotx, roty, rotz) {

    setTimeout(function () {

        if (!user.isLogin(player))
            return;

        mysql.executeQuery(`SELECT id, item_id FROM items WHERE owner_type='1' AND owner_id='${user.getId(player)}' AND id='${itemId}' AND is_equip='1'`, function (err, rows, fields) {
            rows.forEach(row => {
                inventory.dropItem(player, row['id'], row['item_id'], posx, posy, posz, rotx, roty, rotz);
            });
        });
    })
};

inventory.getInvAmount = function(player, id, type) {
    try {
        if (!user.isLogin(player))
            return;
        if (Container.Data.Has(id, "invAmount:" + type))
            return Container.Data.Get(id, "invAmount:" + type);
        inventory.updateAmount(player, id, type);
        return Container.Data.Get(id, "invAmount:" + type);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.usePlayerItem = function(player, id, itemId) {
    if (!user.isLogin(player))
        return;

    switch (itemId) {
        case 277: {
            try {
                let target = methods.getNearestPlayerWithPlayer(player, 4);
                if (!user.isLogin(target)) {
                    player.notify("~r~Рядом с вами никого нет");
                    return;
                }

                if (!user.isEms(player)) {
                    player.notify("~y~У Вас нет навыка для использования этой приблуды");
                    return;
                }

                if (target.health > 0) {
                    player.notify("~r~Игрок должен быть в коме");
                    return;
                }

                chat.sendMeCommand(player, "использовал дефибриллятор");
                user.useAdrenaline(target);

                let targetId = user.getId(target);
                if (user.hasById(targetId, 'adrenaline')) {
                    player.notify("~r~На игрока недавно был использован дефибриллятор, поэтому премию вы не получите");
                    return;
                }
                user.setById(targetId, 'adrenaline', true);

                user.addCashMoney(player, 200, 'Использование дефибриллятора');
                player.notify("~g~Вам была выдана премия в $200");
                
                setTimeout(function () {
                    try {
                        user.resetById(targetId, 'adrenaline');
                    }
                    catch (e) {}
                }, 1000 * 60 * 10);
            }
            catch (e) {}
            break;
        }
        default:
        {
            let target = methods.getNearestPlayerWithPlayer(player, 1.5);
            if (!user.isLogin(target)) {
                player.notify("~r~Рядом с вами никого нет");
                return;
            }
            inventory.useItem(target, id, itemId, true);
        }
    }
};

inventory.useItem = function(player, id, itemId, isTargetable = false) {
    if (!user.isLogin(player))
        return;
    try {
        let user_id = user.getId(player);

        methods.saveLog('log_inventory',
            ['type', 'text'],
            ['USE', `userId:${user_id}, id:${id}, itemId:${itemId}`],
        );

        let sql = `SELECT * FROM items WHERE id = ${id} AND owner_id = ${user.getId(player)} AND owner_type = ${inventory.types.Player}`;
        if (itemId === 264 || itemId === 263 || itemId === 252 || isTargetable)
            sql = `SELECT * FROM items WHERE id = ${id}`;

        mysql.executeQuery(sql, function (err, rows, fields) {
            if (rows.length === 0) {
                player.notify('~r~Чтобы использовать предмет, он должен находится у Вас в инвентаре');
                return;
            }

            let params = {};
            try {
                params = JSON.parse(rows[0]['params']);
            }
            catch (e) {

            }

            switch (itemId)
            {
                case 0:
                {
                    let target = methods.getNearestPlayerWithPlayer(player, 1.5);
                    if (!user.isLogin(target))
                    {
                        player.notify("~r~Рядом с вами никого нет");
                        return;
                    }

                    if (user.isTie(target))
                    {
                        inventory.addItem(0, 1, inventory.types.Player, user.getId(player), 1, 0, "{}", 10);
                        //user.stopAnimation(target);
                        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
                        user.unTie(target);
                        chat.sendMeCommand(player, "снял стяжки с человека напротив");
                    }
                    else
                    {
                        if (!user.get(target, 'isKnockout'))
                        {
                            player.notify("~r~Игрок должен быть в нокауте");
                            return;
                        }

                        if (user.isCuff(target) || user.isTie(target)) {
                            player.notify("~r~Этот человек уже в связан/в наручниках");
                            return;
                        }
                        if (target.health == 0) {
                            player.notify("~r~Нельзя надевать верёвку на человека в коме");
                            return;
                        }
                        if (target.vehicle) {
                            player.notify("~r~Игрок находится в машине");
                            return;
                        }

                        user.tie(target);
                        player.notify("~y~Вы связали игрока");
                        chat.sendMeCommand(player, "связал человека рядом");
                        inventory.deleteItem(id);
                        chat.sendMeCommand(player, "использовал стяжки");
                    }
                    break;
                }
                case 253:
                {
                    chat.sendDiceCommand(player);
                    break;
                }
                case 477:
                {
                    graffiti.changeGraffiti(player);
                    break;
                }
                case 474:
                {
                    try {
                        let recipes = JSON.parse(user.get(player, 'recepts'));
                        if (recipes.includes(params.id)) {
                            player.notify('~r~У Вас уже использован этот рецепт');
                            return;
                        }
                        recipes.push(params.id);
                        user.set(player, 'recepts', JSON.stringify(recipes));
                        inventory.deleteItem(id);
                        player.notify('~g~Вы изучили рецепт');
                        user.updateClientCache(player);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                    break;
                }
                case 251:
                {
                    player.call('client:startFishing', [params.upg]);
                    /*if (user.has(player, 'useFish')) {
                        player.notify('~r~Вы уже рыбачите');
                        return;
                    }
                    user.playScenario(player, 'WORLD_HUMAN_STAND_FISHING');
                    user.set(player, 'useFish', true);
                    setTimeout(function () {
                        if (user.isLogin(player)) {
                            player.call('client:startFishing', [params.upg]);
                            user.reset(player, 'useFish');
                        }
                    }, methods.getRandomInt(10000, 20000));*/
                    break;
                }
                case 2:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять наркотики');
                        return;
                    }
                    chat.sendMeCommand(player, "употребил кокаин");
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);

                    user.addDrugLevel(player, 1, 200);
                    user.playDrugAnimation(player);

                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 10000);
                    break;
                }
                case 158:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять наркотики');
                        return;
                    }
                    chat.sendMeCommand(player, "употребил амфетамин");
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);

                    user.addDrugLevel(player, 0, 200);
                    user.playDrugAnimation(player);

                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 10000);
                    break;
                }
                case 159:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять наркотики');
                        return;
                    }
                    chat.sendMeCommand(player, "употребил DMT");
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);

                    user.addDrugLevel(player, 2, 200);
                    user.playDrugAnimation(player);

                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 10000);
                    break;
                }
                case 160:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять наркотики');
                        return;
                    }
                    chat.sendMeCommand(player, "употребил мефедрон");
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);

                    user.addDrugLevel(player, 5, 200);
                    user.playDrugAnimation(player);

                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 10000);
                    break;
                }
                case 161:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять наркотики');
                        return;
                    }
                    chat.sendMeCommand(player, "употребил кетамин");
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);

                    user.addDrugLevel(player, 3, 200);
                    user.playDrugAnimation(player);

                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 10000);
                    break;
                }
                case 162:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять наркотики');
                        return;
                    }
                    chat.sendMeCommand(player, "употребил LSD");
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);

                    user.addDrugLevel(player, 4, 200);
                    user.playDrugAnimation(player);

                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 10000);
                    break;
                }
                case 49:
                {
                    if (user.get(player,'fraction_id2') === 0) {
                        player.notify('~r~Необходимо состоять в крайм организации');
                        return;
                    }

                    /*let dateTime = new Date();
                    if (dateTime.getHours() < 18 || dateTime.getHours() > 19) {
                        player.notify('~r~Доступно только с 18 до 19 вечера ООС времени');
                        return;
                    }*/

                    try {
                        if (params.type === 2 && !user.isMafia(player)) {
                            player.notify('~r~Подготовка доступна только для мафии');
                            return;
                        }

                        let count = 2;
                        if (params.type === 2)
                            count = 3;
                        fraction.set(user.get(player,'fraction_id2'), 'grabBankFleeca', params.type);
                        fraction.set(user.get(player,'fraction_id2'), 'grabBankFleecaCar', count);
                        fraction.set(user.get(player,'fraction_id2'), 'grabBankFleecaPt', count);
                        fraction.set(user.get(player,'fraction_id2'), 'grabBankFleecaHp', count);
                        fraction.set(user.get(player,'fraction_id2'), 'grabBankFleecaOt', count);
                        fraction.set(user.get(player,'fraction_id2'), 'grabBankFleecaTimer', 60);

                        player.notify('~g~Подготовка к ограблению началась');
                        inventory.deleteItem(id);
                    }
                    catch (e) {
                        player.notify('~g~Произошла ошибка');
                    }
                    break;
                }
                case 3:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять наркотики');
                        return;
                    }
                    chat.sendMeCommand(player, "употребил марихуану");
                    user.playAnimation(player, "amb@world_human_smoking_pot@male@base", "base", 48);
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);

                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 10000);
                    break;
                }
                case 4:
                {

                    let pickId = bank.getLockPickDoorInRadius(player.position, 3);
                    if (pickId >= 0) {
                        bank.lockPickDoor(player, 3);
                        inventory.deleteItem(id);
                        return;
                    }

                    let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                    if (!vehicles.exists(veh))
                    {
                        player.notify("~r~Нужно быть рядом с машиной");
                        return;
                    }

                    let vehInfo = methods.getVehicleInfo(veh.model);
                    if (vehInfo.fuel_type == 3)
                    {
                        player.notify("~r~Данный класс автомобиля можно взломать с помощью телефона");
                        return;
                    }

                    if (vehInfo.class_name == "Super")
                    {
                        player.notify("~r~Данный класс автомобиля можно взломать с помощью телефона");
                        return;
                    }

                    if (vehInfo.class_name == "Helicopters" || vehInfo.class_name == "Planes" || vehInfo.class_name == "Emergency")
                    {
                        player.notify("~r~Вы не можете взломать это транспортное средство");
                        return;
                    }

                    if (!veh.locked)
                    {
                        player.notify("~r~Транспорт уже открыт");
                        return;
                    }
                    if (veh.getVariable('fraction_id') > 0 || veh.getVariable('isAdmin') || veh.getVariable('useless'))
                    {
                        player.notify("~r~Вы не можете взломать это транспортное средство");
                        return;
                    }

                    if(user.has(player, 'usingLockpick')) {
                        player.notify("~r~Вы уже используете отмычку");
                        return;
                    }
                    user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
                    user.set(player, 'usingLockpick', true);

                    setTimeout(function () {
                        try {

                            if (!user.isLogin(player))
                                return;

                            user.removeRep(player, 1);

                            if (!vehicles.exists(veh))
                            {
                                player.notify("~r~Не удалось взломать транспорт");
                                user.reset(player, 'usingLockpick');
                                return;
                            }

                            if (methods.getRandomInt(0, 5) == 1)
                            {
                                user.removeRep(player, 5);
                                veh.locked = false;
                                player.notify("~g~Вы открыли транспорт");
                            }
                            else
                            {
                                player.notify("~g~Вы сломали отмычку");
                                inventory.deleteItem(id);
                            }
                            user.reset(player, 'usingLockpick');
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    }, 5000);
                    break;
                }
                case 5:
                {
                    if (player.dimension > 0) {
                        player.notify('~r~Нельзя совершить ограбление');
                        return;
                    }

                    let grabId2 = bank.getBombInRadius(player.position, 30);
                    if (grabId2.idx === -1) {
                        fraction.startGrabShopGang(player, id);
                        return;
                    }

                    let grabId = bank.getGrabInRadius(player.position);
                    if (user.isGos(player)) {
                        player.notify('~r~Вы состоите в гос. организации');
                        return;
                    }

                    let frId = user.get(player, 'fraction_id2');
                    if (frId === 0) {
                        player.notify("~r~Вы не состоите в крайм организации");
                        return;
                    }

                    if (!fraction.has(frId, 'bankGrabId')) {
                        player.notify("~r~Вы не можете грабить этот банк");
                        return;
                    }

                    if (fraction.get(frId, 'bankGrabId') !== grabId2.idx) {
                        player.notify("~r~Вы не можете этот грабить банк");
                        return;
                    }

                    let dateTime = new Date();
                    if (dateTime.getHours() < 19 || dateTime.getHours() > 22) {
                        player.notify('~r~Доступно только с 19 до 22 вечера ООС времени');
                        return;
                    }

                    if (user.has(player, 'isGrab')) {
                        player.notify('~r~Это действие сейчас не доступно');
                        return;
                    }
                    let count = bank.grabPos[grabId][4];
                    if (count === 0) {
                        player.notify('~r~Все ячейки пустые');
                        return;
                    }

                    user.heading(player, bank.grabPos[grabId][3]);

                    user.set(player, 'isGrab', true);
                    user.playAnimation(player, "missheistfbisetup1", "unlock_loop_janitor", 9);
                    user.blockKeys(player, true);
                    bank.grabPos[grabId][4] = count - 1;

                    setTimeout(function () {
                        user.playAnimation(player, "anim@heists@ornate_bank@grab_cash", "grab", 9);
                        player.addAttachment('bagGrab');
                        player.addAttachment('cash');
                    }, 5000);

                    setTimeout(function () {
                        if (!user.isLogin(player))
                            return;

                        player.addAttachment('bagGrab', true);
                        player.addAttachment('cash', true);

                        if (methods.getRandomInt(0, 100) < 20) {
                            player.notify(`~y~Ячейка оказалась пуста`);
                        }
                        else {
                            inventory.addItem(141, 1, inventory.types.Player, user.getId(player), methods.parseInt(methods.getRandomInt(3000, 5000)), 0, "{}", 2);
                        }

                        dispatcher.sendPos("Код 0", "В банке сработала сигнализация", player.position);
                        player.call('client:quest:gang:14');

                        user.blockKeys(player, false);
                        player.notify(`~y~Осталось ячеек ~s~${count - 1}`);

                        user.giveWanted(player, 10, 'Ограбление банка');

                        user.reset(player, 'isGrab');
                        user.stopAnimation(player);
                        if (methods.getRandomInt(0, 2) === 0) {
                            inventory.deleteItem(id);
                            player.notify('~r~Вы сломали отмычку');
                        }
                    }, 10000);
                    break;
                }
                case 262:
                {
                    if (user.isGos(player)) {
                        player.notify('~r~Вы состоите в гос. организации');
                        return;
                    }

                    let grabId = bank.getBombInRadius(player.position);
                    if (grabId.idx === -1) {
                        player.notify('~r~Вы слишком далеко от двери');
                        return;
                    }

                    let frId = user.get(player, 'fraction_id2');
                    if (frId === 0) {
                        player.notify("~r~Вы не состоите в крайм организации");
                        return;
                    }

                    if (!fraction.has(frId, 'grabBankFleecaDone')) {
                        player.notify("~r~Вы не выполнили задание, чтобы совершить ограбление");
                        return;
                    }

                    if (grabId.type != fraction.get(frId, 'grabBankFleeca')) {
                        player.notify("~r~Вы не можете ограбить этот банк");
                        return;
                    }

                    if (fraction.has(frId, 'bankGrabId')) {
                        player.notify("~r~Вы не можете этот грабить банк");
                        return;
                    }

                    let dateTime = new Date();
                    if (dateTime.getHours() < 19 || dateTime.getHours() > 22) {
                        player.notify('~r~Доступно только с 19 до 22 вечера ООС времени');
                        return;
                    }

                    if (player.dimension !== 0) {
                        player.notify("~r~Нельзя грабить в интерьере");
                        return;
                    }

                    fraction.set(frId, 'bankGrabId', grabId.idx);

                    inventory.deleteItem(id);
                    user.playAnimation(player, "mp_arresting", "a_uncuff", 8);

                    setTimeout(function () {
                        player.notify("~y~Взрыв произойдет через ~s~10~y~ сек");

                        setTimeout(function () {
                            if (!user.isLogin(player))
                                return;
                            player.notify("~y~Взрыв произойдет через ~s~5~y~ сек");
                        }, 5000);

                        setTimeout(function () {
                            if (!user.isLogin(player))
                                return;
                            player.notify("~y~Взрыв произойдет через ~s~3~y~ сек");
                        }, 7000);

                        setTimeout(function () {
                            try {
                                dispatcher.sendPos("Код 0", "В банке сработала сигнализация", player.position);
                                methods.explodeObject(bank.doorPos[grabId.idx][1], bank.doorPos[grabId.idx][2], bank.doorPos[grabId.idx][3]);
                                methods.deleteObject(bank.doorPos[grabId.idx][1], bank.doorPos[grabId.idx][2], bank.doorPos[grabId.idx][3], bank.doorPos[grabId.idx][0]);
                            }
                            catch (e) {
                                methods.debug(e);
                            }
                        }, 10000);
                    }, 5000);

                    break;
                }
                case 6:
                {
                    if (vehicles.exists(player.vehicle))
                    {
                        player.notify("~r~Вы должны находиться около открытого капота");
                        return;
                    }
                    let veh = methods.getNearestVehicleWithCoords(player.position, 10, player.dimension);
                    if (!vehicles.exists(veh))
                    {
                        player.notify("~r~Нужно быть рядом с машиной");
                        return;
                    }

                    let vehInfo = methods.getVehicleInfo(veh.model);
                    if (vehInfo.class_name == "Helicopters" || vehInfo.class_name == "Planes" || vehInfo.class_name == "Boats" || vehInfo.class_name == "Cycles")
                    {
                        player.notify("~r~Вы не можете ремонтировать это транспортное средство");
                        return;
                    }

                    if (!vSync.getHoodState(veh) && vehInfo.class_name != "Motorcycles")
                    {
                        player.notify("~r~Необходимо открыть капот");
                        return;
                    }

                    if (veh.broke) {
                        player.notify("~g~Вы успешно починили авто, теперь можете сесть в него и отправиться в аэропорт");
                        veh.broke = false;
                        inventory.deleteItem(id);
                        user.playAnimation(player, "amb@medic@standing@kneel@enter", "enter", 8);
                        return;
                    }

                    try {
                        vehicles.set(veh.getVariable('container'), 's_eng', 100);
                    }
                    catch (e) {}
                    veh.engineHealth = 1000.0;

                    user.playAnimation(player, "amb@medic@standing@kneel@enter", "enter", 8);
                    player.notify("~g~Вы успешно починили авто");
                    inventory.deleteItem(id);
                    break;
                }
                case 8:
                {
                    if (vehicles.exists(player.vehicle))
                    {
                        player.notify("~r~Вы должны находиться около транспорта");
                        return;
                    }

                    let veh = methods.getNearestVehicleWithCoords(player.position, 10, player.dimension);
                    if (!vehicles.exists(veh))
                    {
                        player.notify("~r~Нужно быть рядом с машиной");
                        return;
                    }

                    let vehInfo = methods.getVehicleInfo(veh.model);
                    if (vehInfo.fuel_type != 4)
                    {
                        player.notify("~r~Данный вид топлива не подходит под этот транспорт");
                        return;
                    }

                    let currentFuel = vehicles.getFuel(veh);
                    if (vehInfo.fuel_full < currentFuel + 10)
                    {
                        player.notify("~r~В транспорте полный бак");
                        return;
                    }
                    vehicles.setFuel(veh, currentFuel + 10);
                    player.notify("~g~Вы заправили транспорт на 10л.");
                    inventory.deleteItem(id);
                    break;
                }
                case 9:
                {
                    if (vehicles.exists(player.vehicle))
                    {
                        player.notify("~r~Вы должны находиться около транспорта");
                        return;
                    }
                    let veh = methods.getNearestVehicleWithCoords(player.position, 10, player.dimension);
                    if (!vehicles.exists(veh))
                    {
                        player.notify("~r~Нужно быть рядом с машиной");
                        return;
                    }

                    let vehInfo = methods.getVehicleInfo(veh.model);
                    if (vehInfo.fuel_type != 1)
                    {
                        player.notify("~r~Данный вид топлива не подходит под этот транспорт");
                        return;
                    }


                    let currentFuel = vehicles.getFuel(veh);

                    if (vehInfo.fuel_full < currentFuel + 10)
                    {
                        player.notify("~r~В транспорте полный бак");
                        return;
                    }

                    if (veh.prolog)
                        vehicles.setFuel(veh, currentFuel + 40);
                    else
                        vehicles.setFuel(veh, currentFuel + 10);

                    player.notify("~g~Вы заправили транспорт на 10л.");
                    inventory.deleteItem(id);
                    break;
                }
                case 10:
                {
                    if (vehicles.exists(player.vehicle))
                    {
                        player.notify("~r~Вы должны находиться около транспорта");
                        return;
                    }
                    let veh = methods.getNearestVehicleWithCoords(player.position, 10, player.dimension);
                    if (!vehicles.exists(veh))
                    {
                        player.notify("~r~Нужно быть рядом с машиной");
                        return;
                    }

                    let vehInfo = methods.getVehicleInfo(veh.model);
                    if (vehInfo.fuel_type != 2)
                    {
                        player.notify("~r~Данный вид топлива не подходит под этот транспорт");
                        return;
                    }

                    let currentFuel = vehicles.getFuel(veh);

                    if (vehInfo.fuel_full < currentFuel + 10)
                    {
                        player.notify("~r~В транспорте полный бак");
                        return;
                    }

                    vehicles.setFuel(veh, currentFuel + 10);
                    player.notify("~g~Вы заправили транспорт на 10л.");
                    inventory.deleteItem(id);
                    break;
                }
                case 47:
                {
                    if (ctos.setRadioBlackout(player) || ctos.setRadioNetwork(player))
                        inventory.deleteItem(id);
                    break;
                }
                case 232:
                case 233:
                case 234:
                case 235:
                case 236:
                case 237:
                case 238:
                case 239:
                case 240:
                {
                    user.addEatLevel(player, 800);
                    chat.sendMeCommand(player, "съедает рыбу");
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 11:
                {
                    user.addEatLevel(player, 500);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 12:
                {
                    user.addWaterLevel(player, 300);
                    user.addEatLevel(player, 400);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 13:
                {
                    user.addEatLevel(player, 300);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 14:
                {
                    user.addEatLevel(player, 100);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 15:
                case 16:
                {
                    user.addWaterLevel(player, 150);
                    user.addEatLevel(player, 400);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 17:
                {
                    user.addEatLevel(player, 250);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 18:
                {
                    user.addEatLevel(player, 200);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 19:
                {
                    user.addWaterLevel(player, 150);
                    user.addEatLevel(player, 300);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 20:
                {
                    user.addEatLevel(player, 500);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 21:
                {
                    user.addEatLevel(player, 150);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 22:
                {
                    user.addWaterLevel(player, 50);
                    user.addEatLevel(player, 250);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 23:
                {
                    user.addWaterLevel(player, 50);
                    user.addEatLevel(player, 200);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 24:
                {
                    user.addWaterLevel(player, 100);
                    user.addEatLevel(player, 250);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 25:
                {
                    user.addWaterLevel(player, 50);
                    user.addEatLevel(player, 300);
                    chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 241:
                {
                    user.addEatLevel(player, 50);
                    user.addWaterLevel(player, 300);
                    chat.sendMeCommand(player, "выпивает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playDrinkAnimation(player);
                    break;
                }
                case 242:
                {
                    user.addWaterLevel(player, 500);
                    chat.sendMeCommand(player, "выпивает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playDrinkAnimation(player);
                    break;
                }
                case 243:
                case 244:
                case 245:
                case 246:
                case 247:
                case 248:
                case 249:
                case 250:
                {
                    user.addWaterLevel(player, 50);
                    chat.sendMeCommand(player, "выпивает " + items.getItemNameById(itemId));
                    inventory.deleteItem(id);
                    user.playDrinkAnimation(player);
                    user.addDrugLevel(player, 99, 200);
                    break;
                }
                case 32:
                {
                    user.addWaterLevel(player, 600);
                    user.addEatLevel(player, 600);
                    chat.sendMeCommand(player, "съедает сухпаёк");
                    inventory.deleteItem(id);
                    user.playEatAnimation(player);
                    break;
                }
                case 26:
                {
                    chat.sendMeCommand(player, "выкуривает сигарету");
                    user.playScenario(player, 'WORLD_HUMAN_AA_SMOKE');
                    inventory.deleteItem(id);
                    break;
                }
                case 40:
                {
                    let target = methods.getNearestPlayerWithPlayer(player, 1.2);
                    if (!user.isLogin(target))
                    {
                        player.notify("~r~Рядом с вами никого нет");
                        return;
                    }
                    if (user.isCuff(target) || user.isTie(target)) {
                        player.notify("~r~Этот человек уже в связан/в наручниках");
                        return;
                    }

                    if (!user.isGos(player)) {
                        player.notify("~y~Наручники может использовать гос. структуры");
                        return;
                    }

                    /*if (target.health == 0) {
                        player.notify("~r~Нельзя надевать наручники на человека в коме");
                        return;
                    }*/
                    if (target.vehicle) {
                        player.notify("~r~Игрок находится в машине");
                        return;
                    }

                    user.heading(target, player.heading);
                    user.cuff(target);
                    chat.sendMeCommand(player, "использовал наручники");

                    setTimeout(function () {
                        user.playAnimation(target, 'mp_arrest_paired', 'crook_p2_back_right', 8);
                        user.playAnimation(player, 'mp_arrest_paired', 'cop_p2_back_right', 8);

                        setTimeout(function () {
                            try {
                                user.cuff(target);
                                inventory.deleteItem(id);
                            }
                            catch (e) {
                                methods.debug(e);
                            }
                        }, 3800); //3760
                    }, 200);
                    break;
                }
                case 215:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять аптечки');
                        return;
                    }

                    if (player.health < 1) {
                        player.notify('~r~Нельзя использовать будучи мертвым');
                        return;
                    }

                    chat.sendMeCommand(player, "использовал аптечку");
                    if (player.health >= 40)
                        user.setHealth(player, 100);
                    else
                        user.setHealth(player, player.health + 60);
                    inventory.deleteItem(id);
                    user.playDrugAnimation(player);
                    user.set(player, 'useHeal', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 30000);
                    break;
                }
                case 216:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять аптечки');
                        return;
                    }

                    if (player.health < 1) {
                        player.notify('~r~Нельзя использовать будучи мертвым');
                        return;
                    }

                    /*if (player.health < 1 && isTargetable) {
                        user.revive(player);
                    }*/

                    chat.sendMeCommand(player, "использовал бинт");
                    if (player.health >= 80)
                        user.setHealth(player, 100);
                    else
                        user.setHealth(player, player.health + 20);
                    inventory.deleteItem(id);
                    user.playAnimation(player, 'oddjobs@bailbond_hobotwitchy', 'base', 48);

                    user.set(player, 'useHeal', true);

                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 30000);
                    break;
                }
                case 278:
                {
                    if (user.has(player, 'useHeal')) {
                        player.notify('~r~Нельзя так часто употреблять аптечки');
                        return;
                    }

                    if (player.health < 1) {
                        player.notify('~r~Нельзя использовать будучи мертвым');
                        return;
                    }

                    /*if (player.health < 1 && isTargetable) {
                        user.revive(player);
                    }*/

                    chat.sendMeCommand(player, "использовал аптечку");
                    user.setHealth(player, 100);
                    inventory.deleteItem(id);
                    user.playDrugAnimation(player);
                    user.set(player, 'useHeal', true);

                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal');
                    }, 20000);
                    break;
                }
                case 221:
                {
                    if (user.has(player, 'useHeal1')) {
                        player.notify('~r~Нельзя так часто употреблять таблетки');
                        return;
                    }

                    chat.sendMeCommand(player, "употребил таблетку");

                    user.setDrugLevel(player, 0, 0);
                    user.setDrugLevel(player, 1, 0);
                    user.setDrugLevel(player, 2, 0);
                    user.setDrugLevel(player, 3, 0);
                    user.setDrugLevel(player, 4, 0);
                    user.setDrugLevel(player, 5, 0);
                    user.setDrugLevel(player, 99, 0);

                    user.stopAllScreenEffects(player);
                    user.playDrugAnimation(player);

                    inventory.deleteItem(id);

                    user.set(player, 'useHeal1', true);
                    setTimeout(function () {
                        if (user.isLogin(player))
                            user.reset(player, 'useHeal1');
                    }, 60000);
                    break;
                }
            }
        });
    } catch(e) {
        methods.debug(e);
    }
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