import methods from "../modules/methods";
import user from "../user";

const _SET_NOTIFICATION_COLOR_NEXT = "0x39BBF623FC803EAC";
const _SET_NOTIFICATION_BACKGROUND_COLOR = "0x92F0DA1E27DB96DC";
const _END_TEXT_COMMAND_THEFEED_POST_STATS = "0x2B7E9A4EAAA93C89";
const maxStringLength = 50;

let sleep = function(ms) {
    return new Promise(res => setTimeout(res, ms));
};

mp.events.add("BN_Show", (message, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) => {

    try {
        if (!user.getCache('s_hud_notify'))
            return ;
    }
    catch (e) {

    }

    try {
        if (textColor > -1) mp.game.invoke(_SET_NOTIFICATION_COLOR_NEXT, textColor);
        if (bgColor > -1) mp.game.invoke(_SET_NOTIFICATION_BACKGROUND_COLOR, bgColor);
        if (flashing) mp.game.ui.setNotificationFlashColor(flashColor[0], flashColor[1], flashColor[2], flashColor[3]);

        mp.game.ui.setNotificationTextEntry("CELL_EMAIL_BCON");
        for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength)
            mp.game.ui.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
        mp.game.ui.drawNotification(flashing, true);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("BN_ShowWithPicture", async (title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) => {

    try {
        if (!user.getCache('s_hud_notify'))
            return ;
    }
    catch (e) {

    }

    try {
        switch (notifPic) {
            case 'WEB_SIXFIGURETEMPS':
            case 'WEB_LOSSANTOSPOLICEDEPT':
            case 'WEB_PREMIUMDELUXEMOTORSPORT':
            case 'DIA_CUSTOMER':
            case 'DIA_TANNOY':
            case 'DIA_POLICE':
            case 'DIA_MIC':
            case 'DIA_MIGRANT':
            case 'DIA_ARMY':
            case 'DIA_DRIVER':
            case 'WEB_PILLPHARM':
                if (!mp.game.graphics.hasStreamedTextureDictLoaded(notifPic)) {
                    mp.game.graphics.requestStreamedTextureDict(notifPic, true);
                    while (!mp.game.graphics.hasStreamedTextureDictLoaded(notifPic))
                        await sleep(1);
                }
                break;
        }

        if (textColor > -1) mp.game.invoke(_SET_NOTIFICATION_COLOR_NEXT, textColor);
        if (bgColor > -1) mp.game.invoke(_SET_NOTIFICATION_BACKGROUND_COLOR, bgColor);
        if (flashing) mp.game.ui.setNotificationFlashColor(flashColor[0], flashColor[1], flashColor[2], flashColor[3]);

        mp.game.ui.setNotificationTextEntry("CELL_EMAIL_BCON");
        for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength)
            mp.game.ui.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
        mp.game.ui.setNotificationMessage(notifPic, notifPic, flashing, icon, title, sender);
        mp.game.ui.drawNotification(false, true);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("BN_ShowWithStats", async (title = "PSF_STAMINA", lastProgress = 25, newProgress = 50) => {

    /*try {
        if (!user.getCache('s_hud_notify'))
            return ;
    }
    catch (e) {

    }

    try {
        let pedHeadShot = mp.players.local.registerheadshot();
        if (mp.game.ped.isPedheadshotValid(pedHeadShot)) {
            //while (!mp.game.ped.isPedheadshotReady(pedHeadShot))
            await sleep(100);
            let txd = mp.game.ped.getPedheadshotTxdString(pedHeadShot);
            mp.game.ui.setNotificationTextEntry("PS_UPDATE");
            mp.game.ui.addTextComponentInteger(newProgress);
            mp.game.invoke(_END_TEXT_COMMAND_THEFEED_POST_STATS, title, 14, true, lastProgress, false, txd, txd);
            mp.game.ui.drawNotification(false, true);
            mp.players.local.unregisterheadshot();
        }
    }
    catch (e) {
        methods.debug(e);
    }*/
});

mp.game.ui.notifications = {
    show: (message, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) => mp.events.call("BN_Show", message, flashing, textColor, bgColor, flashColor),
    showWithPicture: (title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) => mp.events.call("BN_ShowWithPicture", title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor),
    showWithStats: (title = "PSF_STAMINA", lastProgress = 25, newProgress = 50) => mp.events.call("BN_ShowWithStats", title, lastProgress, newProgress)
};