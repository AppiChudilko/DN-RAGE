import methods from '../modules/methods';
import user from '../user';

let wheel = {};

let wheelPos = new mp.Vector3(1111.05, 229.81, -49.14);
let baseWheelPos = new mp.Vector3(1111.05, 229.81, -50.38);

let _wheel = null;
let _baseWheel = null;

wheel.loadAll = function() {
    try {
        methods.debug('Execute: wheel.loadAll');

        /*_baseWheel = mp.objects.new(mp.game.joaat('vw_prop_vw_luckywheel_01a'), baseWheelPos,
            {
                alpha: 255,
                dimension: -1
            });*/
        _wheel = mp.objects.new(mp.game.joaat('vw_prop_vw_luckywheel_02a'), wheelPos,
            {
                alpha: 255,
                dimension: -1
            });

    } catch (e) {
        methods.debug('Exception: wheel.loadAll');
        methods.debug(e);
    }
};

wheel.userRoll = async function() {
    try {
        methods.debug('Execute: wheel.userRoll');

        let lib = 'anim_casino_a@amb@casino@games@lucky7wheel@female';
        if (mp.players.local.isMale())
            lib = 'anim_casino_a@amb@casino@games@lucky7wheel@male';

        let anim = 'enter_right_to_baseidle';

        let _movePos = new mp.Vector3(1109.55, 228.88, -49.64);
        mp.players.local.taskGoStraightToCoord(_movePos.x,  _movePos.y,  _movePos.z,  1.0,  -1,  312.2,  0.0);

        let _isMoved = false;
        while (!_isMoved) {
            let coords = mp.players.local.position;
            if (coords.x >= (_movePos.x - 0.01) && coords.x <= (_movePos.x + 0.01) && coords.y >= (_movePos.y - 0.01) && coords.y <= (_movePos.y + 0.01))
                _isMoved = true;
            await methods.sleep(1000);
        }

        user.playAnimation(lib, anim, 8);
        await methods.sleep(200);

        await methods.sleep(mp.players.local.getAnimTotalTime(lib, anim) - 210);
        user.playAnimation(lib, 'enter_to_armraisedidle', 8);
        await methods.sleep(200);

        await methods.sleep(mp.players.local.getAnimTotalTime(lib, 'enter_to_armraisedidle') - 210);
        user.playAnimation(lib, 'armraisedidle_to_spinningidle_high', 8);

        mp.events.callRemote("server:casino:wheel:doRoll");
    } catch (e) {
        methods.debug('Exception: wheel.userRoll');
        methods.debug(e);
    }
};

mp.events.add("client:casino:wheel:start", async () => {
    wheel.userRoll();
});

mp.events.add("client:casino:wheel:doRoll", async (priceIndex, playerId) => {
    try {
        _wheel.setHeading(-30.0);
        _wheel.setRotation(0, 0, 0, 1, true);

        let speedIntCnt = 1;
        let rollspeed = 1.0;
        let _winAngle = (priceIndex - 1) * 18; //TODO -1
        let _rollAngle = _winAngle + (360 * 8);
        let _midLength = (_rollAngle / 2);
        let intCnt = 0;

        while (speedIntCnt > 0) {
            let retval = _wheel.getRotation(1);
            if (_rollAngle > _midLength)
                speedIntCnt++;
            else {
                speedIntCnt--;
                if (speedIntCnt < 0)
                    speedIntCnt  = 0;
            }

            intCnt = intCnt + 1;
            rollspeed = speedIntCnt / 10;

            try {
                let _y = retval.y - rollspeed;
                _rollAngle = _rollAngle - rollspeed;
                _wheel.setRotation(0.0, _y, 0.0, 1, true);
            }
            catch (e) {}
            await methods.sleep(1);
        }
        if (mp.players.local.remoteId === playerId)
            mp.events.callRemote('server:casino:wheel:finalRoll');
    }
    catch (e) {
        methods.debug('DO_ROLL');
        methods.debug(e);
    }
});

export default wheel;