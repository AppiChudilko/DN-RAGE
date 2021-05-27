import Container from '../modules/data';
import methods from '../modules/methods';
import user from '../user';

let mail = {};

mail.sendMail = function(houseId) {
    try {
        methods.debug('Execute: mail.sendMail');
        if (Container.Data.HasLocally(mp.players.local.remoteId, 'mail')) {
            if (Container.Data.GetLocally(mp.players.local.remoteId, 'mail') > 0) {
                user.setById('isMail' + houseId, true);
                Container.Data.SetLocally(mp.players.local.remoteId, 'mail', Container.Data.GetLocally(mp.players.local.remoteId, 'mail') - 1);
                mp.game.ui.notifications.show(`~g~Вы отнесли почту ${Container.Data.GetLocally(mp.players.local.remoteId, 'mail')}/25`);
                user.giveJobSkill();
                user.giveJobMoney(methods.getRandomInt(18, 24) + methods.getRandomFloat());
                user.addRep(1);
                user.addWorkExp(1);
                return;
            }
        }
        mp.game.ui.notifications.show('~r~У Вас нет почты, возьмите из авто');
    } catch (e) {
        methods.debug('Exception: mail.sendMail');
        methods.debug(e);
    }
};

mail.sendMail2 = function(houseId) {
    try {
        methods.debug('Execute: mail.sendMail2');
        if (Container.Data.HasLocally(mp.players.local.remoteId, 'mail')) {
            if (Container.Data.GetLocally(mp.players.local.remoteId, 'mail') > 0) {
                user.setById('isMail2' + houseId, true);
                Container.Data.SetLocally(mp.players.local.remoteId, 'mail', Container.Data.GetLocally(mp.players.local.remoteId, 'mail') - 1);
                mp.game.ui.notifications.show(`~g~Вы отнесли почту ${Container.Data.GetLocally(mp.players.local.remoteId, 'mail')}/25`);
                user.giveJobSkill();
                user.giveJobMoney(methods.getRandomInt(9, 10) + methods.getRandomFloat());
                user.addRep(1);
                user.addWorkExp(1);
                return;
            }
        }
        mp.game.ui.notifications.show('~r~У Вас нет почты, возьмите из авто');
    } catch (e) {
        methods.debug('Exception: mail.sendMail2');
        methods.debug(e);
    }
};

mail.takeMail = function() {
    try {
        methods.debug('Execute: mail.takeMail');
        Container.Data.SetLocally(mp.players.local.remoteId, 'mail', 25);
        mp.game.ui.notifications.show("~g~Вы взяли почту из транспорта");
    } catch (e) {
        methods.debug('Exception: mail.takeMail');
        methods.debug(e);
    }
};

export default mail;