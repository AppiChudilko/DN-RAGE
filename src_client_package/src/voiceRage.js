import user from "./user";
import methods from "./modules/methods";

const Use3d = true;
const UseAutoVolume = false;

const MaxRange = 50.0;

let voiceRage = {};

let enableVoice = true;

//0x4E
let __CONFIG__ = {
    defaultDistance: 25, // default proximity distance
    voiceVolume: 0,
};

voiceRage.listeners = [];

voiceRage.setConfig = function(key, value) {
    //__CONFIG__[key] = value;
};

voiceRage.enableMic = function() {
    if (user.isDead())
        return;
    mp.voiceChat.muted = false;
    mp.events.callRemote('voice.toggleMicrophone', true);
    //user.setVariable('voiceMic', mp.voiceChat.muted);
};

voiceRage.disableMic = function() {
    mp.voiceChat.muted = true;
    mp.events.callRemote('voice.toggleMicrophone', false);
    //user.setVariable('voiceMic', mp.voiceChat.muted);
};

voiceRage.enableRadioMic = function() {
    if (user.isDead() || methods.isBlockKeys())
        return;
    voiceRage.enableMic();
    mp.events.callRemote('voice.toggleMicrophoneRadio', true);
    user.playAnimation("random@arrests", "generic_radio_chatter", 49);
};

voiceRage.disableRadioMic = function() {
    voiceRage.disableMic();
    mp.events.callRemote('voice.toggleMicrophoneRadio', false);
    if (!methods.isBlockKeys())
        user.stopAllAnimation();
};

voiceRage.isEnable = function() {
    return !mp.voiceChat.muted;
};

voiceRage.isEnableVoice = function() {
    return enableVoice;
};

voiceRage.enableAllVoice = function() {
    enableVoice = true;
};

voiceRage.disableAllVoice = function() {
    enableVoice = false;
    //voiceRage.removeAllListeners();
};

voiceRage.removeAllListeners = function() {
    voiceRage.listeners.forEach(p => {
        voiceRage.remove(p, true);
    })
};

voiceRage.clamp = (min, max, value) => {
    return Math.min(Math.max(min, value), max);
};

voiceRage.add = (player) => {
    voiceRage.listeners.push(player);

    player.isListening = true;
    player.isWalkieTalking = false;
    mp.events.callRemote("addVoiceListener", player);

    if(UseAutoVolume)
    {
        player.voiceAutoVolume = true;
    }
    else
    {
        player.voiceVolume = 0;
    }

    if(Use3d)
    {
        player.voice3d = true;
    }
};

voiceRage.remove = (player, notify) => {
    let idx = voiceRage.listeners.indexOf(player);
    if(idx !== -1)
        voiceRage.listeners.splice(idx, 1);

    player.isListening = false;

    if(notify)
    {
        mp.events.callRemote("removeVoiceListener", player);
    }
};

voiceRage.generateVolume = (localPlayerPosition, targetPlayer, voiceDistance, distanceToPlayer) => {

    if (!user.isLogin())
        return 0;
    if (!enableVoice)
        return 0;
    if (targetPlayer.handle === 0)
        return 0;

    if (targetPlayer.getVariable('work_lvl') < user.getCache('s_mute_lvl')) {
        targetPlayer.localMute = true;
        return 0;
    }

    targetPlayer.localMute = false;

    const calcVoiceDistance = voiceDistance * voiceDistance;
    const calcDublDist = distanceToPlayer * distanceToPlayer;
    const maxVolume = methods.parseFloat(user.getCache('s_voice_vol'));
    let volume = voiceRage.clamp(0, maxVolume, -(calcDublDist - calcVoiceDistance) / (calcDublDist * calcDublDist + calcVoiceDistance));

    let localPlayer = mp.players.local;

    if (volume > 0) {
        if (!targetPlayer.iSeeYou) {
            volume = volume / 15;
        }

        if (localPlayer.vehicle && targetPlayer.vehicle) {
            const v1 = localPlayer.vehicle;
            const v2 = targetPlayer.vehicle;

            const isOpenVeh1 = (
                v1.getClass() !== 14 && // Boats
                v1.getClass() !== 13 && // Cycles
                v1.getClass() !== 8 // Motorcycles
            );

            const isOpenVeh2 = (
                v2.getClass() !== 14 &&
                v2.getClass() !== 13 &&
                v2.getClass() !== 8
            );

            let v1Doors = true;
            let v2Doors = true;

            for (let i = 0; i < 4; i++) {
                v1Doors = !v1.isDoorDamaged(i)/* && v1.isDoorClosed(i)*/;
            }

            for (let i = 0; i < 4; i++) {
                v2Doors = !v2.isDoorDamaged(i)/* && v2.isDoorClosed(i)*/;
            }

            const isAllUp1 = (
                v1.isWindowIntact(0) &&
                v1.isWindowIntact(1) &&
                v1.areAllWindowsIntact() &&
                v1.getConvertibleRoofState() === 0 &&
                v1Doors &&
                isOpenVeh1
            );

            const isAllUp2 = (
                v2.isWindowIntact(0) &&
                v2.isWindowIntact(1) &&
                v2.areAllWindowsIntact() &&
                v2.getConvertibleRoofState() === 0 &&
                v2Doors &&
                isOpenVeh2
            );

            if (v1 !== v2) {
                if (isAllUp1) {
                    volume = volume / 7;
                }

                if (isAllUp2) {
                    volume = volume / 7;
                }
            }
        } else if (localPlayer.vehicle) {
            const v1 = localPlayer.vehicle;

            const isOpenVeh1 = (
                v1.getClass() !== 14 && // Boats
                v1.getClass() !== 13 && // Cycles
                v1.getClass() !== 8 // Motorcycles
            );

            let v1Doors = true;
            for (let i = 0; i < 4; i++) {
                v1Doors = !v1.isDoorDamaged(i)/* && v1.isDoorClosed(i)*/;
            }

            const isAllUp1 = (
                v1.isWindowIntact(0) &&
                v1.isWindowIntact(1) &&
                v1.areAllWindowsIntact() &&
                v1.getConvertibleRoofState() === 0 &&
                v1Doors &&
                isOpenVeh1
            );

            if (isAllUp1) {
                volume = volume / 7;
            }
        } else if (targetPlayer.vehicle) {
            const v1 = targetPlayer.vehicle;

            const isOpenVeh1 = (
                v1.getClass() !== 14 && // Boats
                v1.getClass() !== 13 && // Cycles
                v1.getClass() !== 8 // Motorcycles
            );

            let v1Doors = true;
            for (let i = 0; i < 4; i++) {
                v1Doors = !v1.isDoorDamaged(i)/* && v1.isDoorClosed(i)*/;
            }

            const isAllUp1 = (
                v1.isWindowIntact(0) &&
                v1.isWindowIntact(1) &&
                v1.areAllWindowsIntact() &&
                v1.getConvertibleRoofState() === 0 &&
                v1Doors &&
                isOpenVeh1
            );

            if (isAllUp1) {
                volume = volume / 7;
            }
        }
    }

    return voiceRage.clamp(0, 1, volume);
};

voiceRage.vdist = (v1, v2) => {
    const diffY = v1.y - v2.y;
    const diffX = v1.x - v2.x;
    const diffZ = v1.z - v2.z;

    return Math.sqrt((diffY * diffY) + (diffX * diffX) + (diffZ * diffZ));
};

voiceRage.timer = () => {
    try {
        let localPlayer = mp.players.local;
        let localPos = localPlayer.position;

        mp.players.forEach(player =>
        {
            try {
                if(player != localPlayer)
                {
                    if(!player.isListening)
                    {
                        let walk = player.getVariable('walkie');
                        if (walk === localPlayer.getVariable('walkie') && user.getCache('walkie_buy') && player.getVariable('walkieBuy')) {
                            voiceRage.add(player);
                            return;
                        }

                        if (player.getVariable('callId') === localPlayer.remoteId) {
                            voiceRage.add(player);
                            return;
                        }

                        if (player.handle === 0)
                            return;

                        if (player.dimension === localPlayer.dimension) {
                            const playerPos = player.position;
                            //let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);
                            let dist = methods.distanceToPos(playerPos, localPos);
                            if(dist <= MaxRange)
                            {
                                voiceRage.add(player);
                            }
                        }
                    }
                }
            }
            catch (e) {
                
            }
        });

        voiceRage.listeners.forEach((player) =>
        {
            try {
                if(player.handle !== 0)
                {
                    const playerPos = player.position;
                    //let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);
                    let dist = methods.distanceToPos(playerPos, localPos);

                    if(dist > MaxRange + 30)
                    {
                        let walk = player.getVariable('walkie');
                        if (walk === localPlayer.getVariable('walkie') && user.getCache('walkie_buy') && player.getVariable('walkieBuy')) {
                            return;
                        }
                        if (player.getVariable('callId') === localPlayer.remoteId)
                            return;
                        voiceRage.remove(player, true);
                    }
                    else if(dist > MaxRange)
                    {
                        player.voiceVolume = 0;
                    }
                    else if(!UseAutoVolume)
                    {
                        const distanceToPlayer = methods.distanceToPos(localPos, playerPos);
                        const voiceDistance = voiceRage.clamp(3, 7000, player.getVariable('voice.distance') || __CONFIG__.defaultDistance);
                        //const voiceDistance = voiceRage.clamp(3, 50, __CONFIG__.defaultDistance);

                        if (player.isWalkieTalking) {
                            //player.voiceVolume = 1;
                            return;
                        }
                        if (player.getVariable('voiceMic') && player.getVariable('callId') === localPlayer.remoteId) {
                            player.voiceVolume = 1;
                            return;
                        }

                        if (distanceToPlayer >= MaxRange)
                            player.voiceVolume = 0;
                        else
                            player.voiceVolume = voiceRage.generateVolume(localPos, player, voiceDistance, distanceToPlayer);

                        //player.voiceVolume = 1 - (dist / MaxRange);
                    }
                    else {
                        player.voiceVolume = 0;
                    }
                }
                else
                {
                    try {
                        let walk = player.getVariable('walkie');
                        if (walk === localPlayer.getVariable('walkie') && user.getCache('walkie_buy') && player.getVariable('walkieBuy')) {
                            if (!player.isWalkieTalking)
                                player.voiceVolume = 0;
                            return;
                        }
                        if (player.getVariable('callId') === localPlayer.remoteId) {
                            if (!player.getVariable('voiceMic'))
                                player.voiceVolume = 0;
                            return;
                        }
                        voiceRage.remove(player, true);
                    }
                    catch (e) {
                        voiceRage.remove(player, true);
                    }
                }
            }
            catch (e) {
                
            }
        });
    }
    catch (e) {
        
    }
};

mp.events.add("playerQuit", (player) =>
{
    if(player.isListening)
    {
        voiceRage.remove(player, false);
    }
});

mp.events.add('voice.toggleMicrophone', async (playerId, isEnabled) => {
    const player = mp.players.atRemoteId(playerId);

    mp.game.streaming.requestAnimDict("mp_facial");
    while (!mp.game.streaming.hasAnimDictLoaded("mp_facial"))
        await methods.debug(10);

    mp.game.streaming.requestAnimDict("facials@gen_male@variations@normal");
    while (!mp.game.streaming.hasAnimDictLoaded("facials@gen_male@variations@normal"))
        await methods.debug(10);

    if (player && mp.players.exists(player)) {

        if (player.getVariable('callId') === mp.players.local.remoteId) {
            player.voiceVolume = isEnabled ? 1 : 0;
        }

        if (isEnabled)
            player.playFacialAnim("mic_chatter", "mp_facial");
        else
            player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
    }
});

mp.events.add('voice.toggleMicrophoneRadio', async (playerId, isEnabled) => {
    const player = mp.players.atRemoteId(playerId);

    if (player && mp.players.exists(player) && user.getCache('walkie_buy') && player.getVariable('walkieBuy')) {
        player.isWalkieTalking = isEnabled;
        if (isEnabled)
            player.voiceVolume = user.getCache('walkie_vol') / 10;
        else
            player.voiceVolume = 0;
    }
});

export default voiceRage;