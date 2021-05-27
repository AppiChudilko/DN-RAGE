import methods from '../modules/methods';
import ui from '../modules/ui';
import user from '../user';
import UIMenu from '../modules/menu';

let itemList = [];
let markerList = [];
let entityList = new Map();

let checkpoint = {};

checkpoint.checkPosition = function() {

    try {
        if (user.isLogin()) {
            let playerPos = mp.players.local.position;
            //methods.debug('Execute: checkpoint.checkPosition');
            itemList.forEach((item, idx) => {
                try {
                    if (methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z)) <= item.scale + 0.4) {
                        if (!entityList.has(idx)) {
                            entityList.set(idx, true);
                            mp.events.callRemote('client:enterStaticCheckpoint', item.id);
                        }
                    }
                    else {
                        if (entityList.has(idx)) {
                            entityList.delete(idx);
                            UIMenu.Menu.HideMenu();
                            mp.events.callRemote('client:exitStaticCheckpoint', item.id);
                        }
                    }
                } catch (e) {
                    methods.debug('Exception: checkpoint.checkPosition.forEach IDX:' + idx);
                    methods.debug(e);
                }
            });
        }
    }
    catch (e) {
        methods.debug(e, "CP_ERROR");
    }

    if (itemList.length < 1000) { //TODO
        checkpoint.fixCheckpointList();
        setTimeout(checkpoint.checkPosition, 10000);
    }
    else
        setTimeout(checkpoint.checkPosition, 1000);
};

checkpoint.emitEnter = function(idx) {
    if (!entityList.has(idx)) {
        entityList.set(idx, true);
    }
};

checkpoint.emitExit = function(idx) {
    if (entityList.has(idx)) {
        entityList.delete(idx);
        UIMenu.Menu.HideMenu();
    }
};

checkpoint.updateCheckpointList = function(data) {
    try {
        methods.debug('Execute: checkpoint.updateCheckpointList');
        itemList = itemList.concat(data);
    } catch (e) {
        methods.debug('Exception: checkpoint.updateCheckpointList');
        methods.debug(e);
    }
};

checkpoint.addMarker = function(x, y, z, type = 1, scale = 1, height = 1, color = [33, 150, 243, 100]) {
    try {
        methods.debug('Execute: checkpoint.addMarker');
        markerList = markerList.concat({x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), type: type, color: color, scale: scale, height: height});
    } catch (e) {
        methods.debug('Exception: checkpoint.addMarker');
        methods.debug(e);
    }
};

checkpoint.fixCheckpointList = function() {
    try {
        methods.debug('Execute: checkpoint.fixCheckpointList' + itemList.length);
        itemList = [];
        mp.events.callRemote('server:fixCheckpointList');
        //mp.events.callRemote('server:updateGangZoneList');
    } catch (e) {
        methods.debug('Exception: checkpoint.fixCheckpointList');
        methods.debug(e);
    }
};

mp.events.add('render', () => {
    let playerPos = mp.players.local.position;

    if (itemList.length > 0) {
        //ui.drawText(`CP: ${itemList.length}`, 0, 0, 1, 255, 255, 255, 255, 0, 0, false, false);
        itemList.forEach(function (item, idx) {
            if (methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z)) <= 100) {
                if (item.color[3] === 0)
                    return;
                mp.game.graphics.drawMarker(
                    1,
                    item.x, item.y, item.z,
                    0, 0, 0,
                    0, 0, 0,
                    item.scale, item.scale, item.height,
                    item.color[0], item.color[1], item.color[2], item.color[3],
                    false, false, 2,
                    false, "", "",false
                );
            }
        });
    }
    if (markerList.length > 0) {
        markerList.forEach(function (item, idx) {
            if (methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z)) <= 100) {
                mp.game.graphics.drawMarker(
                    item.type,
                    item.x, item.y, item.z,
                    0, 0, 0,
                    0, 180, -46 + 90,
                    item.scale, item.scale, item.height,
                    item.color[0], item.color[1], item.color[2], item.color[3],
                    true, false, 2,
                    false, "", "",false
                );
            }
        });
    }
});

export default checkpoint;