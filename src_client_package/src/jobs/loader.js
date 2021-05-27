import methods from '../modules/methods';
import jobPoint from '../manager/jobPoint';
import quest from "../manager/quest";
import user from '../user';
import coffer from '../coffer';
import ui from "../modules/ui";

let loader = {};

let isStart = false;
let isProcess = false;
let count = 0;
let _checkpointId = -1;

let putPos = new mp.Vector3(5117.23779296875, -5190.828125, 1.389782428741455);
let takePos = new mp.Vector3(5106.8408203125, -5158.7060546875, 0.964495062828064);

loader.startOrEnd = function() {
    try {
        methods.debug('Execute: builder.startOrEnd');

        if (isStart) {

            quest.standart(false, -1, 3);

            user.addCashMoney(count * 2, 'Работа от Каспера');
            jobPoint.delete();
            user.updateCharacterCloth();

            mp.game.ui.notifications.show('~b~Вы закончили рабочий день');

            isStart = false;
            isProcess = false;
            count = 0;
            _checkpointId = -1;

            if (ui.isIslandZone())
                coffer.addMoney(9, count * 2);
        }
        else {

            mp.game.ui.notifications.show('~b~Вы начали рабочий день');

            if (user.getSex() == 1)
            {
                user.setComponentVariation(3, 55, 0);
                user.setComponentVariation(8, 36, 0);
                user.setComponentVariation(11, 0, 0);
            }
            else
            {
                user.setComponentVariation(3, 30, 0);
                user.setComponentVariation(8, 59, methods.getRandomInt(0, 2));
                user.setComponentVariation(11, 0, 0);
            }

            isStart = true;

            _checkpointId = jobPoint.create(takePos);
        }

    } catch (e) {
        methods.debug('Exception: builder.startOrEnd');
        methods.debug(e);
    }
};

loader.isProcess = function() {
    return isProcess;
};

loader.workProcess = function() {
    try {
        methods.debug('Execute: builder.findRandomPickup');

        jobPoint.delete();
        if (isProcess) {
            isProcess = false;
            count++;
            mp.attachmentMngr.removeLocal('loader');
            user.stopAllAnimation();
            _checkpointId = jobPoint.create(takePos);
            mp.game.ui.notifications.show(`~b~Вы перенесли ~s~${count}~b~ ящиков`);
            return;
        }

        isProcess = true;
        user.playAnimation("anim@heists@box_carry@", "idle", 49);
        mp.attachmentMngr.addLocal('loader');
        _checkpointId = jobPoint.create(putPos);
    } catch (e) {
        methods.debug('Exception: builder.findRandomPickup');
        methods.debug(e);
    }
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (mp.players.local.vehicle)
        return;
    if (!isStart)
        return;
    if (_checkpointId == -1 || _checkpointId == undefined)
        return;
    if (checkpoint.id == _checkpointId)
        loader.workProcess();
});

export default loader;